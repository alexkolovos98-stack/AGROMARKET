"""Agroplaza FastAPI backend."""
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from database import get_db, close_db

# Import routers AFTER load_dotenv so env vars are available
from routes import auth as auth_routes
from routes import categories as categories_routes
from routes import stores as stores_routes
from routes import products as products_routes
from routes import search as search_routes
from routes import tracking as tracking_routes
from routes import merchant as merchant_routes
from routes import billing as billing_routes
from routes import xml_feed as xml_feed_routes

app = FastAPI(title="Agroplaza API", version="0.2.0")


@app.get("/api/")
async def root():
    return {"service": "agroplaza", "status": "ok"}


@app.get("/api/manufacturers")
async def list_manufacturers():
    db = get_db()
    items = await db.manufacturers.find({}, {'_id': 0}).to_list(100)
    return items


# Register routers
app.include_router(auth_routes.router)
app.include_router(categories_routes.router)
app.include_router(stores_routes.router)
app.include_router(products_routes.router)
app.include_router(search_routes.router)
app.include_router(tracking_routes.router)
app.include_router(merchant_routes.router)
app.include_router(billing_routes.router)
app.include_router(xml_feed_routes.router)


# CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    origins = ["*"]
else:
    origins = [o.strip() for o in cors_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    close_db()
