import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Star, MapPin, Package, Clock, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchStoreByName, fetchFeaturedProducts } from '../api/client';

const ShopPage = () => {
  const { shopName } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStoreByName(decodeURIComponent(shopName)).catch(() => null),
      fetchFeaturedProducts(8).catch(() => []),
    ]).then(([s, p]) => {
      setShop(s);
      setProducts(p);
    }).finally(() => setLoading(false));
  }, [shopName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl h-48 animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-500">Το κατάστημα δεν βρέθηκε.</p>
          <Link to="/shops" className="text-[#2d7a3a] underline">Όλα τα καταστήματα</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shops" className="hover:text-[#2d7a3a]">Καταστήματα</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{shop.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6" data-testid="shop-header">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center">
              <span className="text-white font-bold text-3xl">{shop.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#f5a623] fill-current" />
                  <span className="font-medium">{shop.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{shop.products.toLocaleString()} προϊόντα</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.location}</span>
                </div>
              </div>
            </div>
            <a href={shop.url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#2d7a3a] hover:bg-[#1e5c2a]">Επίσκεψη Καταστήματος</Button>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
              <p className="text-sm font-medium">Επιβεβαιωμένο</p>
              <p className="text-xs text-gray-500">Κατάστημα</p>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
              <p className="text-sm font-medium">24ώρες</p>
              <p className="text-xs text-gray-500">Χρόνος απόκρισης</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
              <p className="text-sm font-medium">2-3 ημέρες</p>
              <p className="text-xs text-gray-500">Παράδοση</p>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 mx-auto text-[#f5a623] mb-1" />
              <p className="text-sm font-medium">98%</p>
              <p className="text-xs text-gray-500">Θετικές αξιολογήσεις</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Δημοφιλή προϊόντα</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{p.name}</h3>
                <p className="text-lg font-bold text-[#2d7a3a]">{p.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
