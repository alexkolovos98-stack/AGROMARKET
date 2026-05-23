"""Product routes: list, detail, featured, deals."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from database import get_db
from models import ProductDetail, ProductListItem, OfferWithStore, Deal

router = APIRouter(prefix="/api/products", tags=["products"])


async def _build_list_item(p: dict, db) -> Optional[ProductListItem]:
    offers = await db.offers.find({'product_id': p['product_id']}, {'_id': 0}).to_list(50)
    if not offers:
        return None
    cheapest = min(offers, key=lambda o: o['price'])
    store = await db.stores.find_one({'store_id': cheapest['store_id']}, {'_id': 0})
    return ProductListItem(
        product_id=p['product_id'],
        name=p['name'],
        image=p['image'],
        category=p['category'],
        category_id=p['category_id'],
        rating=p.get('rating', 0),
        review_count=p.get('review_count', 0),
        lowest_price=cheapest['price'],
        original_price=cheapest.get('original_price'),
        offer_count=len(offers),
        lowest_price_shop=(store or {}).get('name', ''),
    )


@router.get("", response_model=List[ProductListItem])
async def list_products(
    category_id: Optional[int] = None,
    limit: int = Query(50, le=200),
    skip: int = 0,
):
    db = get_db()
    q = {}
    if category_id is not None:
        q['category_id'] = category_id
    cursor = db.products.find(q, {'_id': 0}).skip(skip).limit(limit)
    products = await cursor.to_list(limit)
    result = []
    for p in products:
        item = await _build_list_item(p, db)
        if item:
            result.append(item)
    return result


@router.get("/featured", response_model=List[ProductListItem])
async def featured_products(limit: int = Query(8, le=50)):
    db = get_db()
    products = await db.products.find({}, {'_id': 0}).sort('rating', -1).limit(limit).to_list(limit)
    result = []
    for p in products:
        item = await _build_list_item(p, db)
        if item:
            result.append(item)
    return result


@router.get("/deals", response_model=List[Deal])
async def list_deals(limit: int = Query(10, le=50)):
    db = get_db()
    deals = await db.deals.find({}, {'_id': 0}).limit(limit).to_list(limit)
    return [Deal(**d) for d in deals]


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product(product_id: int):
    db = get_db()
    p = await db.products.find_one({'product_id': product_id}, {'_id': 0})
    if not p:
        raise HTTPException(status_code=404, detail='Product not found')

    raw_offers = await db.offers.find({'product_id': product_id}, {'_id': 0}).sort('price', 1).to_list(100)
    offers_with_store = []
    for o in raw_offers:
        store = await db.stores.find_one({'store_id': o['store_id']}, {'_id': 0})
        if not store:
            continue
        offers_with_store.append(OfferWithStore(
            offer_id=o['offer_id'],
            store_id=o['store_id'],
            store_name=store['name'],
            store_rating=store.get('rating', 0),
            store_location=store.get('location', ''),
            price=o['price'],
            original_price=o.get('original_price'),
            availability=o['availability'],
            shipping=o['shipping'],
            url=o['url'],
        ))

    return ProductDetail(
        product_id=p['product_id'],
        name=p['name'],
        description=p['description'],
        image=p['image'],
        category=p['category'],
        category_id=p['category_id'],
        brand=p['brand'],
        specs=p.get('specs', {}),
        rating=p.get('rating', 0),
        review_count=p.get('review_count', 0),
        offers=offers_with_store,
    )
