"""End-to-end backend API tests for Agroplaza."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://farmer-deals-hub.preview.emergentagent.com').rstrip('/')
MERCHANT_EMAIL = "merchant@test.gr"
MERCHANT_PASSWORD = "password"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def merchant_token(client):
    r = client.post(f"{BASE_URL}/api/auth/login",
                    json={"email": MERCHANT_EMAIL, "password": MERCHANT_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Merchant login failed: {r.status_code} {r.text}")
    data = r.json()
    assert "token" in data, f"No token in response: {data}"
    return data["token"]


@pytest.fixture(scope="module")
def merchant_client(client, merchant_token):
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {merchant_token}",
    })
    return s


# === Catalog (public) ===

class TestCatalog:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_categories(self, client):
        r = client.get(f"{BASE_URL}/api/categories")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        c0 = data[0]
        assert "category_id" in c0 and "name" in c0

    def test_featured_products(self, client):
        r = client.get(f"{BASE_URL}/api/products/featured")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            assert "product_id" in data[0]
            assert "name" in data[0]

    def test_deals(self, client):
        r = client.get(f"{BASE_URL}/api/products/deals")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            d = data[0]
            assert "deal_id" in d or "product_id" in d

    def test_stores(self, client):
        r = client.get(f"{BASE_URL}/api/stores")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        assert "store_id" in data[0] and "name" in data[0]

    def test_manufacturers(self, client):
        r = client.get(f"{BASE_URL}/api/manufacturers")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# === Search ===

class TestSearch:
    def test_greek_search(self, client):
        r = client.get(f"{BASE_URL}/api/search", params={"q": "σπόροι"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Should have some results
        assert len(data) > 0, "Greek search 'σπόροι' returned no results"

    def test_greeklish_search(self, client):
        r_g = client.get(f"{BASE_URL}/api/search", params={"q": "σπόροι"})
        r_l = client.get(f"{BASE_URL}/api/search", params={"q": "sporoi"})
        assert r_g.status_code == 200 and r_l.status_code == 200
        greeklish_data = r_l.json()
        # Greeklish should match
        assert isinstance(greeklish_data, list)
        assert len(greeklish_data) > 0, "Greeklish 'sporoi' returned no results"

    def test_accent_insensitive_search(self, client):
        # variant without accent / different accent
        r = client.get(f"{BASE_URL}/api/search", params={"q": "σποροι"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Accent-insensitive 'σποροι' returned no results"

    def test_autocomplete(self, client):
        r = client.get(f"{BASE_URL}/api/search/autocomplete", params={"q": "σπ"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_popular_searches(self, client):
        r = client.get(f"{BASE_URL}/api/search/popular")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# === Auth ===

class TestAuth:
    def test_login_merchant(self, client):
        r = client.post(f"{BASE_URL}/api/auth/login",
                        json={"email": MERCHANT_EMAIL, "password": MERCHANT_PASSWORD})
        assert r.status_code == 200, f"login failed: {r.text}"
        data = r.json()
        assert "token" in data
        assert "user" in data
        assert data["user"].get("role") == "merchant"
        assert data["user"].get("email") == MERCHANT_EMAIL

    def test_login_wrong_password(self, client):
        r = client.post(f"{BASE_URL}/api/auth/login",
                        json={"email": MERCHANT_EMAIL, "password": "wrong"})
        assert r.status_code in (400, 401, 403)

    def test_signup_new_user(self, client):
        email = f"TEST_user_{uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{BASE_URL}/api/auth/signup", json={
            "email": email, "password": "Test1234!",
            "name": "Test User", "role": "merchant",
        })
        assert r.status_code in (200, 201), f"signup failed: {r.status_code} {r.text}"
        data = r.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"].lower() == email.lower()

    def test_auth_me(self, client, merchant_token):
        r = client.get(f"{BASE_URL}/api/auth/me",
                       headers={"Authorization": f"Bearer {merchant_token}"})
        assert r.status_code == 200
        data = r.json()
        assert data.get("email") == MERCHANT_EMAIL
        assert data.get("role") == "merchant"

    def test_auth_me_unauthenticated(self, client):
        # Use a fresh session without any auth
        s = requests.Session()
        r = s.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code in (401, 403)


# === Merchant ===

class TestMerchant:
    def test_merchant_stats(self, merchant_client):
        r = merchant_client.get(f"{BASE_URL}/api/merchant/stats")
        assert r.status_code == 200, f"stats failed: {r.text}"
        data = r.json()
        assert isinstance(data, dict)
        # Should include some metric fields
        # Common keys: visits, clicks, revenue
        assert any(k in data for k in ["visits", "clicks", "revenue", "totals", "timeseries"]), \
            f"unexpected stats shape: {list(data.keys())}"

    def test_merchant_store(self, merchant_client):
        r = merchant_client.get(f"{BASE_URL}/api/merchant/store")
        assert r.status_code == 200, f"store failed: {r.text}"
        data = r.json()
        assert isinstance(data, dict)

    def test_merchant_products(self, merchant_client):
        r = merchant_client.get(f"{BASE_URL}/api/merchant/products")
        assert r.status_code == 200, f"products failed: {r.text}"
        assert isinstance(r.json(), list)

    def test_merchant_requires_auth(self, client):
        s = requests.Session()
        r = s.get(f"{BASE_URL}/api/merchant/stats")
        assert r.status_code in (401, 403)


# === Billing ===

class TestBilling:
    def test_plans(self, client):
        r = client.get(f"{BASE_URL}/api/billing/plans")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0

    def test_subscription(self, merchant_client):
        r = merchant_client.get(f"{BASE_URL}/api/billing/subscription")
        assert r.status_code in (200, 404), f"sub: {r.status_code} {r.text}"


# === Tracking ===

class TestTracking:
    def test_track_click(self, client):
        # Get a product+offer to track
        prods = client.get(f"{BASE_URL}/api/products/featured", params={"limit": 1}).json()
        if not prods:
            pytest.skip("no products to test tracking")
        pid = prods[0]["product_id"]
        detail = client.get(f"{BASE_URL}/api/products/{pid}").json()
        offers = detail.get("offers", [])
        if not offers:
            pytest.skip("no offers to test tracking")
        o = offers[0]
        r = client.post(f"{BASE_URL}/api/track/click", json={
            "product_id": pid, "store_id": o["store_id"], "offer_id": o["offer_id"],
        })
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert "url" in data
