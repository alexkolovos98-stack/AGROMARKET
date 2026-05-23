"""Seed initial categories, stores, products, offers from the original mock dataset.

Run with: cd /app/backend && python seed.py
"""
import asyncio
import os
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

from motor.motor_asyncio import AsyncIOMotorClient
from utils.search_utils import build_search_text


CATEGORIES = [
    {"category_id": 1, "name": "Σπόροι & Φυτά", "name_en": "Seeds & Plants",
     "icon": "Sprout",
     "image": "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
     "count": 12450},
    {"category_id": 2, "name": "Λιπάσματα", "name_en": "Fertilizers",
     "icon": "FlaskConical",
     "image": "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
     "count": 8320},
    {"category_id": 3, "name": "Συστήματα Άρδευσης", "name_en": "Irrigation Systems",
     "icon": "Droplets",
     "image": "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
     "count": 4230},
    {"category_id": 4, "name": "Ζωοτροφές", "name_en": "Animal Feed",
     "icon": "Wheat",
     "image": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
     "count": 6780},
    {"category_id": 5, "name": "Θερμοκήπια", "name_en": "Greenhouses",
     "icon": "Home",
     "image": "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
     "count": 2340},
    {"category_id": 6, "name": "Φυτοφάρμακα", "name_en": "Pesticides",
     "icon": "Bug",
     "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
     "count": 3560},
    {"category_id": 7, "name": "Εργαλεία Κήπου", "name_en": "Garden Tools",
     "icon": "Shovel",
     "image": "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400",
     "count": 9120},
]

STORES = [
    {"store_id": 1, "name": "ΑγροΤεχνική ΕΠΕ", "rating": 4.9, "products_count": 1250, "location": "Θεσσαλονίκη", "url": "https://agrotechniki.example.com"},
    {"store_id": 2, "name": "Hydro Systems", "rating": 4.8, "products_count": 890, "location": "Λάρισα", "url": "https://hydrosystems.example.com"},
    {"store_id": 3, "name": "GreenHouse Pro", "rating": 4.7, "products_count": 560, "location": "Αθήνα", "url": "https://greenhousepro.example.com"},
    {"store_id": 4, "name": "AgroFert ΑΕ", "rating": 4.9, "products_count": 2340, "location": "Πάτρα", "url": "https://agrofert.example.com"},
    {"store_id": 5, "name": "SeedMaster", "rating": 4.6, "products_count": 3450, "location": "Ηράκλειο", "url": "https://seedmaster.example.com"},
    {"store_id": 6, "name": "SprayTech", "rating": 4.5, "products_count": 780, "location": "Καβάλα", "url": "https://spraytech.example.com"},
    {"store_id": 7, "name": "FarmSupply", "rating": 4.7, "products_count": 1890, "location": "Βόλος", "url": "https://farmsupply.example.com"},
    {"store_id": 8, "name": "AgroCenter", "rating": 4.8, "products_count": 2100, "location": "Ιωάννινα", "url": "https://agrocenter.example.com"},
]

PRODUCTS = [
    {
        "product_id": 1, "name": "Σπόροι Ντομάτας Belladonna F1",
        "description": "Υβριδική ποικιλία ντομάτας υψηλής απόδοσης. Ανθεκτική σε ασθένειες, κατάλληλη για θερμοκήπιο και υπαίθρια καλλιέργεια. Συσκευασία 1000 σπόρων.",
        "image": "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
        "category": "Σπόροι & Φυτά", "category_id": 1, "brand": "SeedCorp",
        "specs": {"Τύπος": "Υβρίδιο F1", "Ποσότητα": "1000 σπόροι", "Βλαστικότητα": "95%+", "Κατάλληλο για": "Θερμοκήπιο/Υπαίθρια"},
        "rating": 4.5, "review_count": 178,
        "offers": [
            {"store_id": 5, "price": 12.50, "original_price": 15.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://seedmaster.example.com/product/123"},
            {"store_id": 1, "price": 13.20, "original_price": 15.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrotechniki.example.com/product/456"},
            {"store_id": 4, "price": 14.00, "original_price": None, "availability": "Διαθέσιμο", "shipping": "3-4 ημέρες", "url": "https://agrofert.example.com/product/789"},
            {"store_id": 7, "price": 14.50, "original_price": 16.00, "availability": "Τελευταία τεμάχια", "shipping": "2-3 ημέρες", "url": "https://farmsupply.example.com/product/101"},
        ],
    },
    {
        "product_id": 2, "name": "Σύστημα Στάγδην Άρδευσης 1000m²",
        "description": "Ολοκληρωμένο σύστημα στάγδην άρδευσης για κήπο ή αγρό έως 1000τμ. Περιλαμβάνει σωλήνες, σταλάκτες, συνδέσμους και φίλτρο.",
        "image": "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
        "category": "Συστήματα Άρδευσης", "category_id": 3, "brand": "IrriTech",
        "specs": {"Κάλυψη": "1000 m²", "Μήκος σωλήνα": "500m", "Σταλάκτες": "200 τεμ.", "Πίεση λειτουργίας": "1-3 bar"},
        "rating": 4.6, "review_count": 89,
        "offers": [
            {"store_id": 2, "price": 450.00, "original_price": 520.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://hydrosystems.example.com/product/234"},
            {"store_id": 1, "price": 465.00, "original_price": 520.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrotechniki.example.com/product/567"},
            {"store_id": 8, "price": 480.00, "original_price": None, "availability": "Διαθέσιμο", "shipping": "3-5 ημέρες", "url": "https://agrocenter.example.com/product/890"},
        ],
    },
    {
        "product_id": 3, "name": "Θερμοκήπιο Tunnel 6x30m",
        "description": "Επαγγελματικό θερμοκήπιο τύπου tunnel με γαλβανισμένο σκελετό. Κάλυψη με διπλό πολυαιθυλένιο UV σταθεροποιημένο.",
        "image": "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
        "category": "Θερμοκήπια", "category_id": 5, "brand": "GreenStruct",
        "specs": {"Διαστάσεις": "6m x 30m", "Ύψος κορυφής": "3.5m", "Σκελετός": "Γαλβανισμένος χάλυβας", "Κάλυψη": "Διπλό PE UV"},
        "rating": 4.9, "review_count": 56,
        "offers": [
            {"store_id": 3, "price": 2800.00, "original_price": 3200.00, "availability": "Διαθέσιμο", "shipping": "5-7 ημέρες", "url": "https://greenhousepro.example.com/product/345"},
            {"store_id": 1, "price": 2950.00, "original_price": 3200.00, "availability": "Κατόπιν παραγγελίας", "shipping": "10-15 ημέρες", "url": "https://agrotechniki.example.com/product/678"},
            {"store_id": 8, "price": 3100.00, "original_price": None, "availability": "Διαθέσιμο", "shipping": "7-10 ημέρες", "url": "https://agrocenter.example.com/product/901"},
        ],
    },
    {
        "product_id": 4, "name": "Λίπασμα NPK 20-20-20 25kg",
        "description": "Ισορροπημένο κοκκώδες λίπασμα γενικής χρήσης. Κατάλληλο για όλες τις καλλιέργειες. Υψηλή περιεκτικότητα σε θρεπτικά στοιχεία.",
        "image": "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
        "category": "Λιπάσματα", "category_id": 2, "brand": "NutriGrow",
        "specs": {"Σύνθεση": "N-P-K 20-20-20", "Βάρος": "25 kg", "Μορφή": "Κοκκώδες", "Εφαρμογή": "Βασική/Επιφανειακή"},
        "rating": 4.7, "review_count": 234,
        "offers": [
            {"store_id": 4, "price": 38.00, "original_price": 45.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrofert.example.com/product/456"},
            {"store_id": 1, "price": 39.50, "original_price": 45.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrotechniki.example.com/product/789"},
            {"store_id": 7, "price": 40.00, "original_price": None, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://farmsupply.example.com/product/012"},
            {"store_id": 8, "price": 41.00, "original_price": 45.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://agrocenter.example.com/product/345"},
        ],
    },
    {
        "product_id": 5, "name": "Ψεκαστήρας Πλάτης 16L Μπαταρίας",
        "description": "Επαναφορτιζόμενος ψεκαστήρας πλάτης με δοχείο 16 λίτρων. Μπαταρία λιθίου μεγάλης διάρκειας. Ιδανικός για φυτοφάρμακα και λιπάσματα.",
        "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        "category": "Φυτοφάρμακα", "category_id": 6, "brand": "SprayMaster",
        "specs": {"Χωρητικότητα": "16 L", "Μπαταρία": "12V Lithium", "Αυτονομία": "4-5 ώρες", "Πίεση": "2-4 bar"},
        "rating": 4.4, "review_count": 312,
        "offers": [
            {"store_id": 6, "price": 65.00, "original_price": 75.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://spraytech.example.com/product/567"},
            {"store_id": 1, "price": 68.00, "original_price": 75.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrotechniki.example.com/product/890"},
            {"store_id": 7, "price": 69.90, "original_price": None, "availability": "Τελευταία τεμάχια", "shipping": "2-3 ημέρες", "url": "https://farmsupply.example.com/product/123"},
        ],
    },
    {
        "product_id": 6, "name": "Ζωοτροφή Αγελάδων Premium 50kg",
        "description": "Πλήρης σύνθετη ζωοτροφή για γαλακτοπαραγωγές αγελάδες. Υψηλή περιεκτικότητα σε πρωτεΐνες και ενέργεια για μέγιστη απόδοση.",
        "image": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
        "category": "Ζωοτροφές", "category_id": 4, "brand": "FeedPro",
        "specs": {"Βάρος": "50 kg", "Πρωτεΐνη": "18%", "Ενέργεια": "2800 kcal/kg", "Τύπος": "Pellet"},
        "rating": 4.6, "review_count": 98,
        "offers": [
            {"store_id": 7, "price": 28.00, "original_price": 32.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://farmsupply.example.com/product/234"},
            {"store_id": 1, "price": 29.50, "original_price": 32.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://agrotechniki.example.com/product/567"},
            {"store_id": 8, "price": 30.00, "original_price": None, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://agrocenter.example.com/product/890"},
        ],
    },
    {
        "product_id": 7, "name": "Σετ Εργαλείων Κήπου 12 τεμ.",
        "description": "Πλήρες σετ εργαλείων κήπου από ανοξείδωτο ατσάλι. Περιλαμβάνει φτυάρι, τσουγκράνα, ψαλίδι κλαδέματος και άλλα απαραίτητα εργαλεία.",
        "image": "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400",
        "category": "Εργαλεία Κήπου", "category_id": 7, "brand": "GardenPro",
        "specs": {"Τεμάχια": "12", "Υλικό": "Ανοξείδωτο ατσάλι", "Λαβές": "Εργονομικές", "Θήκη": "Ναι"},
        "rating": 4.7, "review_count": 156,
        "offers": [
            {"store_id": 7, "price": 45.00, "original_price": 55.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://farmsupply.example.com/product/345"},
            {"store_id": 1, "price": 47.90, "original_price": 55.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://agrotechniki.example.com/product/678"},
            {"store_id": 8, "price": 49.00, "original_price": None, "availability": "Τελευταία τεμάχια", "shipping": "3-4 ημέρες", "url": "https://agrocenter.example.com/product/901"},
        ],
    },
    {
        "product_id": 8, "name": "Αντλία Νερού Υποβρύχια 1HP",
        "description": "Υποβρύχια αντλία νερού 1HP για γεωτρήσεις και πηγάδια. Ανοξείδωτη κατασκευή, υψηλή απόδοση και χαμηλή κατανάλωση ενέργειας.",
        "image": "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
        "category": "Συστήματα Άρδευσης", "category_id": 3, "brand": "AquaPump",
        "specs": {"Ισχύς": "1 HP (750W)", "Παροχή": "5000 L/h", "Μανομετρικό": "45m", "Υλικό": "Inox 304"},
        "rating": 4.8, "review_count": 89,
        "offers": [
            {"store_id": 2, "price": 185.00, "original_price": 220.00, "availability": "Διαθέσιμο", "shipping": "2-3 ημέρες", "url": "https://hydrosystems.example.com/product/456"},
            {"store_id": 1, "price": 195.00, "original_price": 220.00, "availability": "Διαθέσιμο", "shipping": "1-2 ημέρες", "url": "https://agrotechniki.example.com/product/789"},
            {"store_id": 8, "price": 199.00, "original_price": None, "availability": "Κατόπιν παραγγελίας", "shipping": "5-7 ημέρες", "url": "https://agrocenter.example.com/product/012"},
        ],
    },
]

DEALS = [
    {"deal_id": 101, "product_id": 1, "name": "Σπόροι Ντομάτας Belladonna F1",
     "image": "https://images.unsplash.com/photo-1563760836797-bf5d5f9d2243?w=400",
     "price": 12.50, "original_price": 15.00, "discount": 17, "ends_in": "2 ημέρες"},
    {"deal_id": 102, "product_id": 2, "name": "Σύστημα Στάγδην Άρδευσης 1000m²",
     "image": "https://images.unsplash.com/photo-1692369584496-3216a88f94c1?w=400",
     "price": 450.00, "original_price": 520.00, "discount": 13, "ends_in": "5 ημέρες"},
    {"deal_id": 103, "product_id": 3, "name": "Θερμοκήπιο Tunnel 6x30m",
     "image": "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?w=400",
     "price": 2800.00, "original_price": 3200.00, "discount": 12, "ends_in": "3 ημέρες"},
    {"deal_id": 104, "product_id": 4, "name": "Λίπασμα NPK 20-20-20 25kg",
     "image": "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400",
     "price": 38.00, "original_price": 45.00, "discount": 16, "ends_in": "1 ημέρα"},
]

POPULAR_SEARCHES = [
    "σπόροι ντομάτας", "λίπασμα βιολογικό", "σύστημα στάγδην", "θερμοκήπιο tunnel",
    "ψεκαστήρας ηλεκτρικός", "ζωοτροφές κοτόπουλα", "φρέζα κήπου", "αντλία νερού",
    "βαμβάκι σπόροι", "γεωργικά εφόδια", "άρδευση σταγόνας", "λαχανικά σπόροι",
    "ζιζανιοκτόνο", "εντομοκτόνο", "μυκητοκτόνο",
]

MANUFACTURERS = [
    {"id": 1, "name": "John Deere", "logo": "JD"},
    {"id": 2, "name": "Kubota", "logo": "KB"},
    {"id": 3, "name": "New Holland", "logo": "NH"},
    {"id": 4, "name": "Massey Ferguson", "logo": "MF"},
    {"id": 5, "name": "STIHL", "logo": "ST"},
    {"id": 6, "name": "Husqvarna", "logo": "HQ"},
    {"id": 7, "name": "Gardena", "logo": "GD"},
    {"id": 8, "name": "Honda", "logo": "HD"},
]


async def seed():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]

    print("[seed] Wiping catalog collections...")
    await db.categories.delete_many({})
    await db.stores.delete_many({})
    await db.products.delete_many({})
    await db.offers.delete_many({})
    await db.deals.delete_many({})
    await db.popular_searches.delete_many({})
    await db.manufacturers.delete_many({})

    print("[seed] Inserting categories...")
    await db.categories.insert_many([dict(c) for c in CATEGORIES])

    print("[seed] Inserting stores...")
    await db.stores.insert_many([dict(s) for s in STORES])

    print("[seed] Inserting products + offers...")
    for p in PRODUCTS:
        offers = p.pop('offers')
        p['search_text'] = build_search_text(p['name'], p['description'], p['category'], p['brand'])
        await db.products.insert_one(dict(p))
        for o in offers:
            o = dict(o)
            o['offer_id'] = f"offer_{uuid.uuid4().hex[:12]}"
            o['product_id'] = p['product_id']
            o['updated_at'] = datetime.now(timezone.utc).isoformat()
            await db.offers.insert_one(o)

    print("[seed] Inserting deals...")
    await db.deals.insert_many([dict(d) for d in DEALS])

    print("[seed] Popular searches...")
    await db.popular_searches.insert_one({'terms': POPULAR_SEARCHES})

    print("[seed] Manufacturers...")
    await db.manufacturers.insert_many([dict(m) for m in MANUFACTURERS])

    # Indexes
    print("[seed] Creating indexes...")
    await db.users.create_index('email', unique=True)
    await db.users.create_index('user_id', unique=True)
    await db.user_sessions.create_index('session_token', unique=True)
    await db.user_sessions.create_index('expires_at')
    await db.products.create_index('product_id', unique=True)
    await db.products.create_index('category_id')
    await db.products.create_index('search_text')
    await db.offers.create_index([('product_id', 1), ('store_id', 1)])
    await db.offers.create_index('store_id')
    await db.stores.create_index('store_id', unique=True)
    await db.stores.create_index('owner_user_id')
    await db.categories.create_index('category_id', unique=True)
    await db.clicks.create_index([('store_id', 1), ('ts', -1)])
    await db.impressions.create_index([('store_id', 1), ('ts', -1)])

    print("[seed] Done.")
    client.close()


if __name__ == '__main__':
    asyncio.run(seed())
