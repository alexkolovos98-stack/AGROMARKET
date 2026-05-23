# AgroPlaza — Agricultural Price Comparison Platform

## Original Problem Statement
A Skroutz.gr-style price comparison/aggregator platform focused entirely on agricultural products for Greek farmers. **NOT** a marketplace — users click outbound links to merchant stores. Added merchant-side: registration (Google + Email/Password), Merchant Dashboard (stats / orders / revenue), Merchant Billing template (only merchants pay Agroplaza), and an XML upload form for product feeds. Search must support Greek, accent-insensitive matching, and Greeklish. **User language: Greek**.

## Tech Stack
- Frontend: React + Tailwind + shadcn/ui + react-router-dom + axios + recharts
- Backend: FastAPI + MongoDB (local for dev; Atlas planned for prod)
- Auth: JWT for email/password + Emergent-managed Google OAuth (session cookie)
- Search: Greek/Greeklish transliteration in `utils/search_utils.py`

## Architecture
```
/app
├── backend
│   ├── routes/        auth, categories, stores, products, search, tracking, merchant, billing, xml_feed
│   ├── utils/         search_utils.py, auth_utils.py
│   ├── tests/         test_api.py (23 pytest tests, all passing)
│   ├── models.py, database.py, seed.py, server.py
└── frontend/src
    ├── api/client.js              axios + adapters (snake_case → camelCase)
    ├── contexts/AuthContext.jsx
    ├── components/                Header, ProductCard, ProtectedRoute, MerchantLayout, ...
    ├── pages/                     Home, Category, Product, Search, Shop(s), Deals, Help, Login, Signup, AuthCallback, Merchant{Dashboard,Store,Products,XmlFeed,Billing}
    └── App.js
```

## Implementation Status

### ✅ Completed (2026-02)
- Backend REST API (auth, search, products, categories, stores, merchant, billing, xml_feed, tracking)
- MongoDB seeding (idempotent) — 7 categories, 8 stores, 8 products + offers, deals, popular searches, manufacturers
- Frontend mass-rewrite: ALL pages/components migrated from mock data to live API via `src/api/client.js`
- Auth flow: email/password + JWT, password hashing (bcrypt), brute-force lockout, Emergent-managed Google OAuth ready (frontend hookup matches playbook)
- Merchant: protected dashboard with recharts (timeseries, revenue, categories pie, geo bars), store profile, products list, XML upload form (visual), billing/plans (visual)
- Test merchant linked to a seeded store with 8 products + demo events generator for empty dashboards
- AuthContext skips `/api/auth/me` when no token/cookie exists (no noisy 401s)
- Backend pytest suite: 23/23 passing (search, Greeklish, auth, merchant, billing, tracking)
- E2E verified: login flow → dashboard, search Greek + Greeklish, category/product pages, protected routes
- Documentation: `/app/auth_testing.md`, `/app/memory/test_credentials.md` (merchant@test.gr / password)

### 🟡 P1 — Next
- (Optional) XML feed parser actual logic — currently form renders only; user explicitly skipped this in favor of demo merchant data
- (Optional) Stripe / payment integration for merchant billing — user explicitly chose VIEW LAYOUT only

### 🟢 P2 — Future / Backlog
- MongoDB Atlas migration for production
- Admin role + admin dashboard
- Price-history charts per product
- Store reviews & ratings collection (currently static)
- Email notifications (price alerts, merchant onboarding)
- Real-time impression/click ingestion improvements
- SEO: sitemap + structured data (Product, Offer)
- Code refactor: split server.py if it grows; move tests to /app/backend/tests/

## Test Credentials
See `/app/memory/test_credentials.md`. Merchant: `merchant@test.gr` / `password`.

## Notes
- Frontend env: `REACT_APP_BACKEND_URL=https://farmer-deals-hub.preview.emergentagent.com`
- Backend serves all routes under `/api/*`
- DB name: `test_database` (from `DB_NAME`)
- Greek-language UI throughout; all toasts and copy in Greek.
