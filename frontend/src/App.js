import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
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

const HomePage = () => {
  return (
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
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/shop/:shopName" element={<ShopPage />} />
          <Route path="/shops" element={<ShopsListPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
