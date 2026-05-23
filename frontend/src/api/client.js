import axios from 'axios';

const BASE = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Attach Bearer from localStorage if present (fallback to cookie session)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Adapters: backend snake_case -> frontend camelCase ===
export const adaptCategory = (c) => ({
  id: c.category_id,
  name: c.name,
  nameEn: c.name_en,
  icon: c.icon,
  image: c.image,
  count: c.count,
});

export const adaptStore = (s) => ({
  id: s.store_id,
  name: s.name,
  rating: s.rating,
  products: s.products_count,
  location: s.location,
  url: s.url,
  description: s.description,
  logo: s.logo,
});

export const adaptListItem = (p) => ({
  id: p.product_id,
  name: p.name,
  image: p.image,
  category: p.category,
  categoryId: p.category_id,
  rating: p.rating,
  reviews: p.review_count,
  price: p.lowest_price,
  originalPrice: p.original_price,
  offerCount: p.offer_count,
  lowestPriceShop: p.lowest_price_shop,
});

export const adaptProductDetail = (p) => ({
  id: p.product_id,
  name: p.name,
  description: p.description,
  image: p.image,
  category: p.category,
  categoryId: p.category_id,
  brand: p.brand,
  specs: p.specs || {},
  rating: p.rating,
  reviewCount: p.review_count,
  offers: (p.offers || []).map((o) => ({
    offerId: o.offer_id,
    shopId: o.store_id,
    price: o.price,
    originalPrice: o.original_price,
    availability: o.availability,
    shipping: o.shipping,
    url: o.url,
    shop: {
      id: o.store_id,
      name: o.store_name,
      rating: o.store_rating,
      location: o.store_location,
    },
  })),
});

export const adaptDeal = (d) => ({
  id: d.deal_id,
  productId: d.product_id,
  name: d.name,
  image: d.image,
  price: d.price,
  originalPrice: d.original_price,
  discount: d.discount,
  endsIn: d.ends_in,
});

// === Endpoint functions ===
export const fetchCategories = async () => {
  const { data } = await api.get('/api/categories');
  return data.map(adaptCategory);
};

export const fetchCategory = async (id) => {
  const { data } = await api.get(`/api/categories/${id}`);
  return adaptCategory(data);
};

export const fetchStores = async () => {
  const { data } = await api.get('/api/stores');
  return data.map(adaptStore);
};

export const fetchStoreByName = async (name) => {
  const { data } = await api.get(`/api/stores/by-name/${encodeURIComponent(name)}`);
  return adaptStore(data);
};

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/api/products', { params });
  return data.map(adaptListItem);
};

export const fetchFeaturedProducts = async (limit = 8) => {
  const { data } = await api.get('/api/products/featured', { params: { limit } });
  return data.map(adaptListItem);
};

export const fetchProductDetail = async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return adaptProductDetail(data);
};

export const fetchDeals = async (limit = 10) => {
  const { data } = await api.get('/api/products/deals', { params: { limit } });
  return data.map(adaptDeal);
};

export const fetchManufacturers = async () => {
  const { data } = await api.get('/api/manufacturers');
  return data;
};

export const fetchPopularSearches = async () => {
  const { data } = await api.get('/api/search/popular');
  return data;
};

export const searchProducts = async (q, limit = 50) => {
  const { data } = await api.get('/api/search', { params: { q, limit } });
  return data.map(adaptListItem);
};

export const searchAutocomplete = async (q, limit = 8) => {
  const { data } = await api.get('/api/search/autocomplete', { params: { q, limit } });
  return data; // [{text, type, product_id, category_id}]
};

// Track
export const trackImpression = (productId, storeId) =>
  api.post('/api/track/impression', { product_id: productId, store_id: storeId }).catch(() => null);

export const trackClick = async (productId, storeId, offerId) => {
  try {
    const { data } = await api.post('/api/track/click', {
      product_id: productId, store_id: storeId, offer_id: offerId,
    });
    return data; // {ok, url}
  } catch (e) {
    return null;
  }
};

// Auth
export const authSignup = async (payload) => {
  const { data } = await api.post('/api/auth/signup', payload);
  if (data.token) localStorage.setItem('session_token', data.token);
  return data;
};

export const authLogin = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data.token) localStorage.setItem('session_token', data.token);
  return data;
};

export const authGoogleSession = async (sessionId, role = 'customer') => {
  const { data } = await api.post('/api/auth/google/session', { session_id: sessionId, role });
  if (data.token) localStorage.setItem('session_token', data.token);
  return data;
};

export const authMe = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};

export const authLogout = async () => {
  try { await api.post('/api/auth/logout'); } catch (e) { /* ignore */ }
  localStorage.removeItem('session_token');
};

export const authSetRole = async (role) => {
  const { data } = await api.post('/api/auth/role', { role });
  return data;
};

// Merchant
export const fetchMerchantStore = async () => {
  const { data } = await api.get('/api/merchant/store');
  return data;
};

export const saveMerchantStore = async (payload) => {
  const { data } = await api.post('/api/merchant/store', payload);
  return data;
};

export const fetchMerchantStats = async (days = 30) => {
  const { data } = await api.get('/api/merchant/stats', { params: { days } });
  return data;
};

export const fetchMerchantProducts = async () => {
  const { data } = await api.get('/api/merchant/products');
  return data;
};

export const uploadXmlFeed = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/api/merchant/xml-feed/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadXmlFromUrl = async (url) => {
  const { data } = await api.post('/api/merchant/xml-feed/from-url', { url });
  return data;
};

// Billing
export const fetchPlans = async () => {
  const { data } = await api.get('/api/billing/plans');
  return data;
};

export const fetchMySubscription = async () => {
  const { data } = await api.get('/api/billing/subscription');
  return data;
};

export const checkoutPlan = async (planId, cardHolder) => {
  const { data } = await api.post('/api/billing/checkout', {
    plan_id: planId, card_holder: cardHolder,
  });
  return data;
};

export const cancelSubscription = async () => {
  const { data } = await api.post('/api/billing/cancel');
  return data;
};
