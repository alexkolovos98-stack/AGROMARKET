"""Merchant routes: store mgmt, stats, products."""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import random
from database import get_db
from models import UserPublic, Store
from utils.auth_utils import require_merchant

router = APIRouter(prefix="/api/merchant", tags=["merchant"])


class StoreCreatePayload(BaseModel):
    name: str
    location: str
    url: str
    description: Optional[str] = None
    logo: Optional[str] = None


class StatsPoint(BaseModel):
    date: str
    impressions: int
    clicks: int
    estimated_revenue: float


class TopProduct(BaseModel):
    product_id: int
    name: str
    image: str
    impressions: int
    clicks: int
    ctr: float
    estimated_revenue: float


class MerchantStats(BaseModel):
    store_id: Optional[int]
    store_name: Optional[str]
    totals: Dict[str, Any]
    timeseries: List[StatsPoint]
    top_products: List[TopProduct]
    category_breakdown: List[Dict[str, Any]]
    geo_breakdown: List[Dict[str, Any]]


# --- store helpers ---
async def _get_or_404_store_for_user(db, user_id: str) -> Optional[dict]:
    return await db.stores.find_one({'owner_user_id': user_id}, {'_id': 0})


@router.get("/store", response_model=Optional[Store])
async def get_my_store(user: UserPublic = Depends(require_merchant)):
    db = get_db()
    store = await _get_or_404_store_for_user(db, user.user_id)
    return Store(**store) if store else None


@router.post("/store", response_model=Store)
async def create_or_update_store(payload: StoreCreatePayload,
                                 user: UserPublic = Depends(require_merchant)):
    db = get_db()
    existing = await _get_or_404_store_for_user(db, user.user_id)
    if existing:
        await db.stores.update_one(
            {'store_id': existing['store_id']},
            {'$set': {
                'name': payload.name,
                'location': payload.location,
                'url': payload.url,
                'description': payload.description,
                'logo': payload.logo,
            }}
        )
        store = await db.stores.find_one({'store_id': existing['store_id']}, {'_id': 0})
        return Store(**store)
    # generate new store_id
    last = await db.stores.find_one({}, {'_id': 0}, sort=[('store_id', -1)])
    next_id = (last['store_id'] + 1) if last else 1000
    new_store = {
        'store_id': next_id,
        'name': payload.name,
        'rating': 0.0,
        'products_count': 0,
        'location': payload.location,
        'url': payload.url,
        'description': payload.description,
        'logo': payload.logo,
        'owner_user_id': user.user_id,
    }
    await db.stores.insert_one(new_store.copy())
    return Store(**new_store)


# --- stats with revenue (option C) ---
@router.get("/stats", response_model=MerchantStats)
async def merchant_stats(days: int = 30, user: UserPublic = Depends(require_merchant)):
    db = get_db()
    store = await _get_or_404_store_for_user(db, user.user_id)
    if not store:
        # Return empty demo stats so dashboard renders
        return MerchantStats(
            store_id=None, store_name=None,
            totals={'impressions': 0, 'clicks': 0, 'ctr': 0, 'estimated_revenue': 0.0,
                    'products': 0, 'active_offers': 0},
            timeseries=[], top_products=[], category_breakdown=[], geo_breakdown=[],
        )

    store_id = store['store_id']

    # Pull recent clicks & impressions
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    clicks = await db.clicks.find({'store_id': store_id, 'ts': {'$gte': since}}, {'_id': 0}).to_list(10000)
    impressions = await db.impressions.find({'store_id': store_id, 'ts': {'$gte': since}}, {'_id': 0}).to_list(10000)

    # Generate demo data if no real events yet (for demo dashboard)
    if not impressions and not clicks:
        clicks, impressions = _generate_demo_events(store_id, days)

    # Build timeseries grouped by date
    by_date: Dict[str, Dict[str, int]] = {}
    for ev in impressions:
        d = ev['ts'][:10] if isinstance(ev['ts'], str) else ev['ts'].isoformat()[:10]
        by_date.setdefault(d, {'imp': 0, 'clk': 0})['imp'] += 1
    for ev in clicks:
        d = ev['ts'][:10] if isinstance(ev['ts'], str) else ev['ts'].isoformat()[:10]
        by_date.setdefault(d, {'imp': 0, 'clk': 0})['clk'] += 1

    # Estimated revenue: avg commission per click ~ €1.20-2.80
    timeseries = []
    total_imp = total_clk = 0
    total_rev = 0.0
    for d in sorted(by_date.keys()):
        v = by_date[d]
        rev = round(v['clk'] * random.uniform(1.2, 2.8), 2)
        timeseries.append(StatsPoint(date=d, impressions=v['imp'], clicks=v['clk'], estimated_revenue=rev))
        total_imp += v['imp']
        total_clk += v['clk']
        total_rev += rev

    # Top products
    product_counts: Dict[int, Dict[str, int]] = {}
    for ev in impressions:
        pid = ev['product_id']
        product_counts.setdefault(pid, {'imp': 0, 'clk': 0})['imp'] += 1
    for ev in clicks:
        pid = ev['product_id']
        product_counts.setdefault(pid, {'imp': 0, 'clk': 0})['clk'] += 1

    top_products = []
    for pid, counts in sorted(product_counts.items(), key=lambda kv: -kv[1]['clk'])[:10]:
        p = await db.products.find_one({'product_id': pid}, {'_id': 0})
        if not p:
            continue
        ctr = (counts['clk'] / counts['imp'] * 100) if counts['imp'] else 0
        top_products.append(TopProduct(
            product_id=pid, name=p['name'], image=p['image'],
            impressions=counts['imp'], clicks=counts['clk'],
            ctr=round(ctr, 2),
            estimated_revenue=round(counts['clk'] * random.uniform(1.2, 2.8), 2),
        ))

    # Category breakdown
    cat_counts: Dict[str, int] = {}
    for pid, counts in product_counts.items():
        p = await db.products.find_one({'product_id': pid}, {'_id': 0})
        if p:
            cat_counts[p['category']] = cat_counts.get(p['category'], 0) + counts['clk']
    category_breakdown = [
        {'category': c, 'clicks': v}
        for c, v in sorted(cat_counts.items(), key=lambda kv: -kv[1])
    ]

    # Geo breakdown (mocked - random Greek cities)
    geo_breakdown = _mock_geo_breakdown(total_clk)

    # Active offers count
    active_offers = await db.offers.count_documents({'store_id': store_id})

    return MerchantStats(
        store_id=store_id,
        store_name=store['name'],
        totals={
            'impressions': total_imp,
            'clicks': total_clk,
            'ctr': round((total_clk / total_imp * 100) if total_imp else 0, 2),
            'estimated_revenue': round(total_rev, 2),
            'products': active_offers,
            'active_offers': active_offers,
        },
        timeseries=timeseries,
        top_products=top_products,
        category_breakdown=category_breakdown,
        geo_breakdown=geo_breakdown,
    )


def _generate_demo_events(store_id: int, days: int):
    """Create demo impressions/clicks for new merchants so dashboard isn't empty."""
    random.seed(store_id)
    impressions, clicks = [], []
    now = datetime.now(timezone.utc)
    # use a stable sample of products (1..8 from seeded data)
    product_ids = list(range(1, 9))
    for day in range(days):
        ts_base = now - timedelta(days=days - day - 1)
        daily_imp = random.randint(120, 480)
        daily_clk = int(daily_imp * random.uniform(0.04, 0.12))
        for _ in range(daily_imp):
            pid = random.choice(product_ids)
            ts = ts_base + timedelta(hours=random.randint(0, 23))
            impressions.append({'product_id': pid, 'store_id': store_id, 'ts': ts.isoformat()})
        for _ in range(daily_clk):
            pid = random.choice(product_ids)
            ts = ts_base + timedelta(hours=random.randint(0, 23))
            clicks.append({'product_id': pid, 'store_id': store_id, 'ts': ts.isoformat()})
    return clicks, impressions


def _mock_geo_breakdown(total_clicks: int) -> List[Dict[str, Any]]:
    cities = [
        ('Αθήνα', 0.32), ('Θεσσαλονίκη', 0.18), ('Πάτρα', 0.09),
        ('Ηράκλειο', 0.07), ('Λάρισα', 0.06), ('Βόλος', 0.05),
        ('Ιωάννινα', 0.05), ('Καβάλα', 0.04), ('Καλαμάτα', 0.04),
        ('Άλλες περιοχές', 0.10),
    ]
    return [{'city': c, 'clicks': int(total_clicks * w)} for c, w in cities]


# --- merchant products ---
@router.get("/products")
async def my_products(user: UserPublic = Depends(require_merchant)):
    db = get_db()
    store = await _get_or_404_store_for_user(db, user.user_id)
    if not store:
        return []
    offers = await db.offers.find({'store_id': store['store_id']}, {'_id': 0}).to_list(1000)
    result = []
    for o in offers:
        p = await db.products.find_one({'product_id': o['product_id']}, {'_id': 0})
        if not p:
            continue
        result.append({
            'product_id': p['product_id'],
            'name': p['name'],
            'image': p['image'],
            'category': p['category'],
            'price': o['price'],
            'original_price': o.get('original_price'),
            'availability': o['availability'],
            'url': o['url'],
            'offer_id': o['offer_id'],
        })
    return result
