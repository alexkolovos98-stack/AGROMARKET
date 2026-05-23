"""XML feed upload — supports skroutz-style XML.
Reference: https://developer.skroutz.gr/el/products/xml_feed/
"""
import xml.etree.ElementTree as ET
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from datetime import datetime, timezone
from typing import Optional
from database import get_db
from models import UserPublic, XmlFeedResult
from utils.auth_utils import require_merchant
from utils.search_utils import build_search_text

router = APIRouter(prefix="/api/merchant/xml-feed", tags=["xml-feed"])


# skroutz canonical tag set
TAG_MAP = {
    'id': 'external_id',
    'name': 'name',
    'link': 'url',
    'image': 'image',
    'category': 'category',
    'price_with_vat': 'price',
    'manufacturer': 'manufacturer',
    'mpn': 'mpn',
    'availability': 'availability',
    'instock': 'instock',
    'ean': 'ean',
    'isbn': 'isbn',
    'weight': 'weight',
    'color': 'color',
    'size': 'size',
}


def _parse_product(el: ET.Element) -> dict:
    result = {}
    for child in el:
        tag = child.tag.strip().lower()
        key = TAG_MAP.get(tag, tag)
        text = (child.text or '').strip()
        if not text:
            continue
        result[key] = text
    return result


async def _next_product_id(db) -> int:
    last = await db.products.find_one({}, {'_id': 0}, sort=[('product_id', -1)])
    return (last['product_id'] + 1) if last else 10000


async def _next_category_id(db) -> int:
    last = await db.categories.find_one({}, {'_id': 0}, sort=[('category_id', -1)])
    return (last['category_id'] + 1) if last else 100


async def _ensure_category(db, name: str) -> int:
    if not name:
        return 0
    cat = await db.categories.find_one({'name': name}, {'_id': 0})
    if cat:
        return cat['category_id']
    cid = await _next_category_id(db)
    await db.categories.insert_one({
        'category_id': cid,
        'name': name,
        'name_en': name,
        'icon': 'Tag',
        'image': '',
        'count': 0,
    })
    return cid


async def _process_xml(content: bytes, store_id: int) -> XmlFeedResult:
    db = get_db()
    errors = []
    p_created = p_updated = o_created = o_updated = 0

    try:
        root = ET.fromstring(content)
    except ET.ParseError as e:
        return XmlFeedResult(success=False, products_created=0, products_updated=0,
                             offers_created=0, offers_updated=0, errors=[f'XML parse error: {e}'])

    # skroutz wraps products under <products><product>...
    items = root.findall('.//product')
    if not items:
        items = root.findall('.//item')

    for el in items:
        try:
            data = _parse_product(el)
            if not data.get('name') or not data.get('url') or not data.get('price'):
                errors.append(f"Skipped product missing name/url/price: {data.get('external_id', '?')}")
                continue

            try:
                price = float(str(data['price']).replace(',', '.'))
            except ValueError:
                errors.append(f"Invalid price for {data['name']}")
                continue

            category_name = data.get('category', 'Άλλα')
            category_id = await _ensure_category(db, category_name)

            # match by external_id+store, then by name
            existing = await db.products.find_one({
                'external_id': data.get('external_id'), 'source_store_id': store_id
            }, {'_id': 0}) if data.get('external_id') else None
            if not existing:
                existing = await db.products.find_one({'name': data['name']}, {'_id': 0})

            if existing:
                p_updated += 1
                product_id = existing['product_id']
            else:
                product_id = await _next_product_id(db)
                p_created += 1
                product_doc = {
                    'product_id': product_id,
                    'name': data['name'],
                    'description': data.get('description', ''),
                    'image': data.get('image', ''),
                    'category': category_name,
                    'category_id': category_id,
                    'brand': data.get('manufacturer', ''),
                    'specs': {k: v for k, v in data.items() if k in ('mpn', 'ean', 'weight', 'color', 'size')},
                    'rating': 0.0,
                    'review_count': 0,
                    'search_text': build_search_text(data['name'], category_name, data.get('manufacturer', '')),
                    'external_id': data.get('external_id'),
                    'source_store_id': store_id,
                }
                await db.products.insert_one(product_doc.copy())

            availability = data.get('availability') or ('Διαθέσιμο' if (data.get('instock', 'Y').upper() in ('Y', 'YES', 'TRUE', '1')) else 'Μη Διαθέσιμο')

            existing_offer = await db.offers.find_one(
                {'product_id': product_id, 'store_id': store_id}, {'_id': 0}
            )
            offer_doc = {
                'product_id': product_id,
                'store_id': store_id,
                'price': price,
                'availability': availability,
                'shipping': '1-3 ημέρες',
                'url': data['url'],
                'updated_at': datetime.now(timezone.utc).isoformat(),
            }
            if existing_offer:
                await db.offers.update_one(
                    {'offer_id': existing_offer['offer_id']},
                    {'$set': offer_doc}
                )
                o_updated += 1
            else:
                import uuid
                offer_doc['offer_id'] = f"offer_{uuid.uuid4().hex[:12]}"
                await db.offers.insert_one(offer_doc.copy())
                o_created += 1

        except Exception as e:
            errors.append(f"Error processing item: {e}")

    return XmlFeedResult(
        success=True,
        products_created=p_created,
        products_updated=p_updated,
        offers_created=o_created,
        offers_updated=o_updated,
        errors=errors[:20],
    )


@router.post("/upload", response_model=XmlFeedResult)
async def upload_xml(
    file: UploadFile = File(...),
    user: UserPublic = Depends(require_merchant),
):
    db = get_db()
    store = await db.stores.find_one({'owner_user_id': user.user_id}, {'_id': 0})
    if not store:
        raise HTTPException(status_code=400, detail='Δημιουργήστε πρώτα κατάστημα')
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail='Empty file')
    if len(content) > 50 * 1024 * 1024:  # 50MB
        raise HTTPException(status_code=413, detail='File too large (max 50MB)')
    return await _process_xml(content, store['store_id'])


class XmlUrlPayload(__import__('pydantic').BaseModel):
    url: str


@router.post("/from-url", response_model=XmlFeedResult)
async def upload_xml_from_url(
    payload: XmlUrlPayload,
    user: UserPublic = Depends(require_merchant),
):
    import httpx
    db = get_db()
    store = await db.stores.find_one({'owner_user_id': user.user_id}, {'_id': 0})
    if not store:
        raise HTTPException(status_code=400, detail='Δημιουργήστε πρώτα κατάστημα')
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        try:
            r = await client.get(payload.url)
        except httpx.RequestError as e:
            raise HTTPException(status_code=400, detail=f'Failed to fetch URL: {e}')
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail=f'URL returned {r.status_code}')
    return await _process_xml(r.content, store['store_id'])
