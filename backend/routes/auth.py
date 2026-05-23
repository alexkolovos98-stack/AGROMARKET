"""Auth routes: Google OAuth (Emergent) + email/password (JWT)."""
import os
import httpx
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from pydantic import BaseModel
from database import get_db
from models import SignupRequest, LoginRequest, User, UserPublic
from utils.auth_utils import (
    hash_password, verify_password, create_jwt, require_user, get_current_user_optional
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

EMERGENT_AUTH_BASE = os.environ.get('EMERGENT_AUTH_BASE', 'https://demobackend.emergentagent.com')
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


class GoogleSessionRequest(BaseModel):
    session_id: str
    role: str = "customer"  # role to set if new user


class AuthResponse(BaseModel):
    user: UserPublic
    token: str  # JWT for email/password, session_token for google


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: SignupRequest, response: Response):
    db = get_db()
    email = payload.email.lower().strip()
    existing = await db.users.find_one({'email': email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')

    user = User(
        email=email,
        name=payload.name.strip(),
        role=payload.role,
        auth_provider='password',
        password_hash=hash_password(payload.password),
    )
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)

    token = create_jwt(user.user_id)
    # also store as session for unified lookup
    await db.user_sessions.insert_one({
        'user_id': user.user_id,
        'session_token': token,
        'expires_at': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        'created_at': datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key='session_token', value=token,
        httponly=True, secure=True, samesite='none', path='/',
        max_age=7 * 24 * 3600,
    )
    return AuthResponse(
        user=UserPublic(user_id=user.user_id, email=user.email, name=user.name,
                        picture=user.picture, role=user.role, auth_provider='password'),
        token=token,
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response):
    db = get_db()
    email = payload.email.lower().strip()
    user_doc = await db.users.find_one({'email': email}, {'_id': 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail='Invalid credentials')

    # Brute-force protection
    lockout_until = user_doc.get('lockout_until')
    if lockout_until:
        if isinstance(lockout_until, str):
            lockout_until = datetime.fromisoformat(lockout_until)
        if lockout_until.tzinfo is None:
            lockout_until = lockout_until.replace(tzinfo=timezone.utc)
        if lockout_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail='Account temporarily locked. Try again later.')

    if user_doc.get('auth_provider') != 'password' or not user_doc.get('password_hash'):
        raise HTTPException(status_code=401, detail='Use Google sign-in for this account')

    if not verify_password(payload.password, user_doc['password_hash']):
        # increment failed attempts
        attempts = user_doc.get('failed_login_attempts', 0) + 1
        update = {'failed_login_attempts': attempts}
        if attempts >= MAX_FAILED_ATTEMPTS:
            update['lockout_until'] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
            update['failed_login_attempts'] = 0
        await db.users.update_one({'user_id': user_doc['user_id']}, {'$set': update})
        raise HTTPException(status_code=401, detail='Invalid credentials')

    # reset on success
    await db.users.update_one(
        {'user_id': user_doc['user_id']},
        {'$set': {'failed_login_attempts': 0, 'lockout_until': None}}
    )

    token = create_jwt(user_doc['user_id'])
    await db.user_sessions.insert_one({
        'user_id': user_doc['user_id'],
        'session_token': token,
        'expires_at': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        'created_at': datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key='session_token', value=token,
        httponly=True, secure=True, samesite='none', path='/',
        max_age=7 * 24 * 3600,
    )
    return AuthResponse(
        user=UserPublic(**{k: user_doc.get(k) for k in ['user_id', 'email', 'name', 'picture', 'role', 'auth_provider']}),
        token=token,
    )


@router.post("/google/session", response_model=AuthResponse)
async def google_session(payload: GoogleSessionRequest, response: Response):
    """Exchange Google session_id from Emergent Auth for app session.
    REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    """
    db = get_db()
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.get(
                f"{EMERGENT_AUTH_BASE}/auth/v1/env/oauth/session-data",
                headers={'X-Session-ID': payload.session_id},
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f'Auth provider unreachable: {e}')
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail='Invalid session_id')
    data = resp.json()

    email = (data.get('email') or '').lower().strip()
    name = data.get('name') or email.split('@')[0]
    picture = data.get('picture')
    session_token = data.get('session_token')
    if not email or not session_token:
        raise HTTPException(status_code=400, detail='Invalid auth response')

    existing = await db.users.find_one({'email': email}, {'_id': 0})
    if existing:
        user_id = existing['user_id']
        await db.users.update_one(
            {'user_id': user_id},
            {'$set': {'name': name, 'picture': picture, 'auth_provider': 'google'}}
        )
        role = existing.get('role', 'customer')
    else:
        new_user = User(
            email=email, name=name, picture=picture,
            role=payload.role if payload.role in ('customer', 'merchant') else 'customer',
            auth_provider='google',
        )
        doc = new_user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        user_id = new_user.user_id
        role = new_user.role

    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        'user_id': user_id,
        'session_token': session_token,
        'expires_at': expires_at.isoformat(),
        'created_at': datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key='session_token', value=session_token,
        httponly=True, secure=True, samesite='none', path='/',
        max_age=7 * 24 * 3600,
    )

    return AuthResponse(
        user=UserPublic(user_id=user_id, email=email, name=name, picture=picture,
                        role=role, auth_provider='google'),
        token=session_token,
    )


@router.get("/me", response_model=UserPublic)
async def get_me(user: UserPublic = Depends(require_user)):
    return user


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get('session_token')
    if not token:
        auth = request.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            token = auth[7:].strip()
    if token:
        db = get_db()
        await db.user_sessions.delete_one({'session_token': token})
    response.delete_cookie('session_token', path='/')
    return {'success': True}


@router.post("/role", response_model=UserPublic)
async def set_role(payload: dict, user: UserPublic = Depends(require_user)):
    """Allow user to switch role between customer and merchant."""
    role = payload.get('role')
    if role not in ('customer', 'merchant'):
        raise HTTPException(status_code=400, detail='Invalid role')
    db = get_db()
    await db.users.update_one({'user_id': user.user_id}, {'$set': {'role': role}})
    user_doc = await db.users.find_one({'user_id': user.user_id}, {'_id': 0, 'password_hash': 0})
    return UserPublic(**user_doc)
