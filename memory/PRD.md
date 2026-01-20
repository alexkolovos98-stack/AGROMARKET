# AgroPlaza - Agricultural Price Comparison Platform

## Project Overview
AgroPlaza is a price comparison/aggregator platform for agricultural products, similar to Skroutz.gr but specifically for farmers. The platform allows users to search for agricultural products and compare prices across multiple e-shops.

## Core Requirements

### Business Model
- **Price Aggregator** - NOT a marketplace
- Platform does NOT process sales, orders, payments, or checkout
- Revenue model: Referral fees from partner stores, advertising

### User Flow
1. Search for a product (Greek or Greeklish)
2. Compare prices across multiple stores
3. Click outbound link to the store's website to complete purchase

### Key Features
- **Search**: Greek language, accent-insensitive, Greeklish-aware, autocomplete with ~250ms debounce
- **Product Pages**: Master product with multiple store offers (price, availability, shipping, outbound link)
- **Categories**: Seeds & Plants, Fertilizers, Irrigation Systems, Animal Feed, Greenhouses, Pesticides, Garden Tools
- **No E-commerce**: No cart, login, favorites, checkout, or payment processing

## Technical Stack
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + MongoDB (not yet integrated - using mocked data)
- **Routing**: react-router-dom

## Implementation Status

### Completed ✅
1. **Frontend Architecture**
   - Homepage with hero banner, categories, featured products, deals, shops
   - Category pages with product listings
   - Product pages with multi-store price comparison
   - Search results page
   - Deals page
   - Shops listing page
   - Help page

2. **Search Functionality**
   - Greek text search with accent-insensitive matching
   - Greeklish-to-Greek transliteration (e.g., "lipasma" → "λίπασμα")
   - Autocomplete dropdown with categories, products, shops, popular searches
   - 250ms debounce for performance

3. **Price Aggregator Model**
   - Product cards show "από X €" (from X €) and store count
   - Product pages show price comparison table with multiple stores
   - Outbound links with "Μετάβαση στο κατάστημα" (Go to store) buttons
   - Disclaimer about direct store purchases

4. **UI/UX**
   - Clean, modern design aligned with aggregator concept
   - Removed all e-commerce elements (cart, login, favorites icons)
   - Updated messaging to focus on price comparison
   - Mobile-responsive header with categories dropdown

### Data Status
- **ALL DATA IS MOCKED** in `/app/frontend/src/data/mockData.js`
- 8 sample products with multiple store offers each
- 7 categories
- 8 stores with ratings and locations
- 4 deals
- Popular searches list

### Files Structure
```
/app/frontend/src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── Header.jsx (search bar, navigation)
│   ├── Footer.jsx
│   ├── HeroBanner.jsx
│   ├── ProductCard.jsx
│   ├── CategoryGrid.jsx
│   ├── DealsSection.jsx
│   ├── ... (other components)
├── data/
│   └── mockData.js (ALL mocked data)
├── pages/
│   ├── CategoryPage.jsx
│   ├── ProductPage.jsx
│   ├── SearchResultsPage.jsx
│   ├── DealsPage.jsx
│   ├── ShopPage.jsx
│   ├── ShopsListPage.jsx
│   └── HelpPage.jsx
├── utils/
│   └── searchUtils.js (Greek/Greeklish search utilities)
└── App.js
```

## Pending Tasks (Backlog)

### P1 - High Priority
1. **Backend Implementation**
   - Set up FastAPI endpoints
   - Connect to MongoDB
   - Create product, store, offer data models
   - Replace mocked data with database

### P2 - Medium Priority
2. **Enhanced Search**
   - Fuzzy matching improvements
   - Search analytics
   - Recently viewed products

3. **Store Features**
   - Store profile pages
   - Store ratings and reviews
   - Store product listings

### P3 - Future Enhancements
4. **User Features** (optional)
   - Price alerts
   - Saved searches
   - Price history charts

5. **Admin Features**
   - Store dashboard for partners
   - Product data management
   - Analytics dashboard

## Testing Results
- Frontend testing: 95%+ pass rate
- Greeklish search: Working for common agricultural terms
- Price comparison flow: Verified working
- No cart/login/favorites UI elements

## Notes
- Application language: Greek (UI and content)
- Development language: English (code and documentation)
- Preview URL: https://agrocmpre.preview.emergentagent.com
