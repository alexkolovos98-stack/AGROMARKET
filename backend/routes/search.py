"""Search routes: full search + autocomplete suggestions, Greeklish aware."""
from fastapi import APIRouter, Query
from typing import List
from database import get_db
from models import ProductListItem, SearchSuggestion
from routes.products import _build_list_item
from utils.search_utils import (
    normalize_greek, greeklish_candidates, matches_query
)

router = APIRouter(prefix="/api/search", tags=["search"])


async def _all_products(db):
    return await db.products.find({}, {'_id': 0}).to_list(2000)


@router.get("", response_model=List[ProductListItem])
async def search(q: str = Query(..., min_length=1), limit: int = Query(50, le=200)):
    db = get_db()
    products = await _all_products(db)
    matched = []
    for p in products:
        haystacks = [p.get('search_text', ''), p.get('name', ''), p.get('description', ''),
                     p.get('category', ''), p.get('brand', '')]
        for h in haystacks:
            if matches_query(h, q):
                matched.append(p)
                break

    results = []
    for p in matched[:limit]:
        item = await _build_list_item(p, db)
        if item:
            results.append(item)
    return results


@router.get("/autocomplete", response_model=List[SearchSuggestion])
async def autocomplete(q: str = Query(..., min_length=1), limit: int = Query(8, le=20)):
    db = get_db()
    suggestions: List[SearchSuggestion] = []
    seen = set()

    # Products by name
    products = await _all_products(db)
    for p in products:
        if matches_query(p.get('name', ''), q):
            key = p['name']
            if key not in seen:
                seen.add(key)
                suggestions.append(SearchSuggestion(
                    text=p['name'], type='product', product_id=p['product_id']
                ))
        if len(suggestions) >= limit:
            break

    # Categories
    if len(suggestions) < limit:
        cats = await db.categories.find({}, {'_id': 0}).to_list(100)
        for c in cats:
            if matches_query(c['name'], q) or matches_query(c.get('name_en', ''), q):
                key = f"cat:{c['category_id']}"
                if key not in seen:
                    seen.add(key)
                    suggestions.append(SearchSuggestion(
                        text=c['name'], type='category', category_id=c['category_id']
                    ))
            if len(suggestions) >= limit:
                break

    # Brands
    if len(suggestions) < limit:
        brands_seen = set()
        for p in products:
            b = p.get('brand', '')
            if b and b not in brands_seen and matches_query(b, q):
                brands_seen.add(b)
                suggestions.append(SearchSuggestion(text=b, type='brand'))
            if len(suggestions) >= limit:
                break

    return suggestions[:limit]


@router.get("/popular", response_model=List[str])
async def popular_searches():
    db = get_db()
    doc = await db.popular_searches.find_one({}, {'_id': 0})
    if not doc:
        return []
    return doc.get('terms', [])
