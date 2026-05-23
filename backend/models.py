"""Pydantic models for Agroplaza."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, timezone
import uuid


def _uuid(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ============= USER =============
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(default_factory=lambda: _uuid("user"))
    email: str
    name: str
    picture: Optional[str] = None
    role: Literal["customer", "merchant"] = "customer"
    auth_provider: Literal["google", "password"] = "password"
    password_hash: Optional[str] = None  # only for password users
    failed_login_attempts: int = 0
    lockout_until: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)


class UserPublic(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str
    auth_provider: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=2, max_length=80)
    role: Literal["customer", "merchant"] = "customer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=_now)


# ============= CATEGORY =============
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category_id: int
    name: str
    name_en: str
    icon: str
    image: str
    count: int = 0


# ============= STORE =============
class Store(BaseModel):
    model_config = ConfigDict(extra="ignore")
    store_id: int
    name: str
    rating: float = 0.0
    products_count: int = 0
    location: str
    url: str
    description: Optional[str] = None
    logo: Optional[str] = None
    owner_user_id: Optional[str] = None  # link to merchant user


# ============= PRODUCT =============
class Offer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    offer_id: str = Field(default_factory=lambda: _uuid("offer"))
    product_id: int
    store_id: int
    price: float
    original_price: Optional[float] = None
    availability: str
    shipping: str
    url: str
    updated_at: datetime = Field(default_factory=_now)


class OfferWithStore(BaseModel):
    offer_id: str
    store_id: int
    store_name: str
    store_rating: float
    store_location: str
    price: float
    original_price: Optional[float] = None
    availability: str
    shipping: str
    url: str


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: int
    name: str
    description: str
    image: str
    category: str
    category_id: int
    brand: str
    specs: Dict[str, str] = {}
    rating: float = 0.0
    review_count: int = 0
    search_text: str = ""  # normalized greek for search


class ProductDetail(BaseModel):
    product_id: int
    name: str
    description: str
    image: str
    category: str
    category_id: int
    brand: str
    specs: Dict[str, str]
    rating: float
    review_count: int
    offers: List[OfferWithStore]


class ProductListItem(BaseModel):
    product_id: int
    name: str
    image: str
    category: str
    category_id: int
    rating: float
    review_count: int
    lowest_price: float
    original_price: Optional[float] = None
    offer_count: int
    lowest_price_shop: str


# ============= DEAL =============
class Deal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    deal_id: int
    product_id: int
    name: str
    image: str
    price: float
    original_price: float
    discount: int
    ends_in: str


# ============= MERCHANT / SUBSCRIPTION =============
class SubscriptionPlan(BaseModel):
    plan_id: str  # basic / pro / premium
    name: str
    price_monthly: float
    features: List[str]
    max_products: int


class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    subscription_id: str = Field(default_factory=lambda: _uuid("sub"))
    user_id: str
    store_id: Optional[int] = None
    plan_id: str = "basic"
    status: Literal["active", "trial", "cancelled", "past_due"] = "trial"
    started_at: datetime = Field(default_factory=_now)
    expires_at: datetime = Field(default_factory=lambda: _now())


# ============= TRACKING =============
class ClickEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: _uuid("click"))
    product_id: int
    store_id: int
    offer_id: Optional[str] = None
    ts: datetime = Field(default_factory=_now)


class ImpressionEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: _uuid("imp"))
    product_id: int
    store_id: Optional[int] = None
    ts: datetime = Field(default_factory=_now)


# ============= SEARCH =============
class SearchSuggestion(BaseModel):
    text: str
    type: Literal["product", "category", "brand", "popular"] = "product"
    product_id: Optional[int] = None
    category_id: Optional[int] = None


# ============= XML FEED =============
class XmlFeedUpload(BaseModel):
    store_id: int
    xml_content: str  # raw XML string


class XmlFeedResult(BaseModel):
    success: bool
    products_created: int
    products_updated: int
    offers_created: int
    offers_updated: int
    errors: List[str] = []
