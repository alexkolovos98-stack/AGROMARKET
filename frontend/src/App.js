import React, { useState } from 'react';
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
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import ShopsListPage from './pages/ShopsListPage';
import DealsPage from './pages/DealsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import HelpPage from './pages/HelpPage';
import SellPage from './pages/SellPage';
import { toast } from 'sonner';

const HomePage = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    toast.success(`Προστέθηκε στο καλάθι: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      <main>
        <HeroBanner />
        <TopCategories />
        <CategoryGrid />
        <FeaturedProducts onAddToCart={handleAddToCart} />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
