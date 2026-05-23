"""Stores routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from database import get_db
from models import Store

router = APIRouter(prefix="/api/stores", tags=["stores"])


@router.get("", response_model=List[Store])
async def list_stores():
    db = get_db()
    items = await db.stores.find({}, {'_id': 0}).sort('store_id', 1).to_list(500)
    return [Store(**i) for i in items]


@router.get("/{store_id}", response_model=Store)
async def get_store(store_id: int):
    db = get_db()
    item = await db.stores.find_one({'store_id': store_id}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail='Store not found')
    return Store(**item)


@router.get("/by-name/{name}", response_model=Store)
async def get_store_by_name(name: str):
    db = get_db()
    item = await db.stores.find_one({'name': name}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail='Store not found')
    return Store(**item)
