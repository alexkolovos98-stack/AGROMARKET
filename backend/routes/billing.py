"""Subscription/billing routes (UI template — no real payments)."""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from database import get_db
from models import UserPublic, Subscription, SubscriptionPlan
from utils.auth_utils import require_merchant

router = APIRouter(prefix="/api/billing", tags=["billing"])

PLANS = [
    SubscriptionPlan(
        plan_id="basic", name="Basic",
        price_monthly=19.0,
        features=["Έως 100 προϊόντα", "Βασικά στατιστικά", "XML feed", "Email υποστήριξη"],
        max_products=100,
    ),
    SubscriptionPlan(
        plan_id="pro", name="Pro",
        price_monthly=49.0,
        features=["Έως 1.000 προϊόντα", "Προηγμένα στατιστικά",
                  "Προτεραιότητα κατάταξης", "Geo analytics", "Priority support"],
        max_products=1000,
    ),
    SubscriptionPlan(
        plan_id="premium", name="Premium",
        price_monthly=99.0,
        features=["Απεριόριστα προϊόντα", "Όλα τα analytics",
                  "Top placement", "Αναλυτής δεδομένων", "Dedicated manager"],
        max_products=999999,
    ),
]


class CheckoutPayload(BaseModel):
    plan_id: str
    card_holder: Optional[str] = None
    # PAN/CVV intentionally NOT stored — template only.


@router.get("/plans", response_model=List[SubscriptionPlan])
async def list_plans():
    return PLANS


@router.get("/subscription", response_model=Optional[Subscription])
async def get_my_subscription(user: UserPublic = Depends(require_merchant)):
    db = get_db()
    sub = await db.subscriptions.find_one({'user_id': user.user_id}, {'_id': 0})
    if not sub:
        return None
    # ensure datetime objects
    for k in ('started_at', 'expires_at'):
        if isinstance(sub.get(k), str):
            sub[k] = datetime.fromisoformat(sub[k])
    return Subscription(**sub)


@router.post("/checkout", response_model=Subscription)
async def checkout(payload: CheckoutPayload, user: UserPublic = Depends(require_merchant)):
    if not any(p.plan_id == payload.plan_id for p in PLANS):
        raise HTTPException(status_code=400, detail='Unknown plan')

    db = get_db()
    now = datetime.now(timezone.utc)
    sub_doc = {
        'subscription_id': f"sub_{user.user_id}_{int(now.timestamp())}",
        'user_id': user.user_id,
        'plan_id': payload.plan_id,
        'status': 'active',
        'started_at': now.isoformat(),
        'expires_at': (now + timedelta(days=30)).isoformat(),
    }
    await db.subscriptions.update_one(
        {'user_id': user.user_id},
        {'$set': sub_doc},
        upsert=True,
    )
    return Subscription(
        subscription_id=sub_doc['subscription_id'],
        user_id=user.user_id,
        plan_id=payload.plan_id,
        status='active',
        started_at=now,
        expires_at=now + timedelta(days=30),
    )


@router.post("/cancel")
async def cancel_subscription(user: UserPublic = Depends(require_merchant)):
    db = get_db()
    await db.subscriptions.update_one(
        {'user_id': user.user_id},
        {'$set': {'status': 'cancelled'}}
    )
    return {'ok': True}
