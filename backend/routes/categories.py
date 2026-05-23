"""Categories routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from database import get_db
from models import Category

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[Category])
async def list_categories():
    db = get_db()
    items = await db.categories.find({}, {'_id': 0}).sort('category_id', 1).to_list(200)
    return [Category(**i) for i in items]


@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int):
    db = get_db()
    item = await db.categories.find_one({'category_id': category_id}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail='Category not found')
    return Category(**item)
