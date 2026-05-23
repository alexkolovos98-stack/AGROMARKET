"""Tracking routes: outbound click & impression tracking for merchant analytics."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from database import get_db

router = APIRouter(prefix="/api/track", tags=["tracking"])


class ImpressionPayload(BaseModel):
    product_id: int
    store_id: int | None = None


class ClickPayload(BaseModel):
    product_id: int
    store_id: int
    offer_id: str | None = None


@router.post("/impression")
async def track_impression(payload: ImpressionPayload):
    db = get_db()
    await db.impressions.insert_one({
        'product_id': payload.product_id,
        'store_id': payload.store_id,
        'ts': datetime.now(timezone.utc).isoformat(),
    })
    return {'ok': True}


@router.post("/click")
async def track_click(payload: ClickPayload):
    """Records the outbound click. Returns the destination URL for the offer."""
    db = get_db()
    offer = None
    if payload.offer_id:
        offer = await db.offers.find_one({'offer_id': payload.offer_id}, {'_id': 0})
    if not offer:
        offer = await db.offers.find_one(
            {'product_id': payload.product_id, 'store_id': payload.store_id},
            {'_id': 0}
        )
    if not offer:
        raise HTTPException(status_code=404, detail='Offer not found')

    await db.clicks.insert_one({
        'product_id': payload.product_id,
        'store_id': payload.store_id,
        'offer_id': offer['offer_id'],
        'ts': datetime.now(timezone.utc).isoformat(),
    })
    return {'ok': True, 'url': offer['url']}
