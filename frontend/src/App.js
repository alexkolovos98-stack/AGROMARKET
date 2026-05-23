import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import TopCategories from './components/TopCategories';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryGrid from './components/CategoryGrid';
import DealsSection from './components/DealsSection';
import PopularSearches from './components/PopularSearches';
import ShopsSection from './components/ShopsSection';
import ManufacturersSection from './components/ManufacturersSection';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import ShopPage from './pages/ShopPage';
import ShopsListPage from './pages/ShopsListPage';
import DealsPage from './pages/DealsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCallback from './pages/AuthCallback';
import MerchantDashboard from './pages/MerchantDashboard';
import MerchantStore from './pages/MerchantStore';
import MerchantProducts from './pages/MerchantProducts';
import MerchantXmlFeed from './pages/MerchantXmlFeed';
import MerchantBilling from './pages/MerchantBilling';

const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main>
      <HeroBanner />
      <TopCategories />
      <CategoryGrid />
      <FeaturedProducts />
      <DealsSection />
      <PopularSearches />
      <ShopsSection />
      <ManufacturersSection />
    </main>
    <Footer />
  </div>
);

const Merchant = ({ children }) => <ProtectedRoute role="merchant">{children}</ProtectedRoute>;

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/shop/:shopName" element={<ShopPage />} />
            <Route path="/shops" element={<ShopsListPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Merchant (protected) */}
            <Route path="/merchant/dashboard" element={<Merchant><MerchantDashboard /></Merchant>} />
            <Route path="/merchant/store" element={<Merchant><MerchantStore /></Merchant>} />
            <Route path="/merchant/onboarding" element={<Merchant><MerchantStore /></Merchant>} />
            <Route path="/merchant/products" element={<Merchant><MerchantProducts /></Merchant>} />
            <Route path="/merchant/xml-feed" element={<Merchant><MerchantXmlFeed /></Merchant>} />
            <Route path="/merchant/billing" element={<Merchant><MerchantBilling /></Merchant>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
