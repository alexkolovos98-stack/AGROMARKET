"""Auth helpers: password hashing, JWT, session lookup, dependencies."""
import os
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import Request, HTTPException, Depends
from typing import Optional
from database import get_db
from models import UserPublic

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRE_DAYS = int(os.environ.get('JWT_EXPIRE_DAYS', '7'))


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_jwt(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'jti': uuid.uuid4().hex,
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_jwt(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        return None


def _extract_token(request: Request) -> Optional[str]:
    # 1. Cookie (Emergent Google Auth) or JWT in cookie
    token = request.cookies.get('session_token')
    if token:
        return token
    # 2. Authorization header
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        return auth[7:].strip()
    return None


async def get_current_user_optional(request: Request) -> Optional[UserPublic]:
    """Return user if authenticated, else None."""
    token = _extract_token(request)
    if not token:
        return None
    db = get_db()

    # Try as Google session token in user_sessions collection
    session = await db.user_sessions.find_one({'session_token': token}, {'_id': 0})
    if session:
        expires_at = session.get('expires_at')
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at and expires_at >= datetime.now(timezone.utc):
            user_doc = await db.users.find_one({'user_id': session['user_id']}, {'_id': 0, 'password_hash': 0})
            if user_doc:
                return UserPublic(**user_doc)

    # Try as JWT
    payload = decode_jwt(token)
    if payload:
        user_doc = await db.users.find_one({'user_id': payload['user_id']}, {'_id': 0, 'password_hash': 0})
        if user_doc:
            return UserPublic(**user_doc)

    return None


async def require_user(request: Request) -> UserPublic:
    user = await get_current_user_optional(request)
    if not user:
        raise HTTPException(status_code=401, detail='Not authenticated')
    return user


async def require_merchant(user: UserPublic = Depends(require_user)) -> UserPublic:
    if user.role != 'merchant':
        raise HTTPException(status_code=403, detail='Merchant access required')
    return user
