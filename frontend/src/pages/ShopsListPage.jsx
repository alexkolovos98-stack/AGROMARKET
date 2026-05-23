import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package, ChevronRight, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchStores } from '../api/client';

const ShopsListPage = () => {
  const [shops, setShops] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchStores().then(setShops).catch(() => setShops([]));
  }, []);

  const ql = q.toLowerCase();
  const filtered = ql
    ? shops.filter(s => s.name.toLowerCase().includes(ql) || s.location.toLowerCase().includes(ql))
    : shops;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Καταστήματα</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Όλα τα Καταστήματα</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="Αναζήτηση καταστήματος..." className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="shops-list">
          {filtered.map((shop) => (
            <Link
              key={shop.id}
              to={`/shop/${encodeURIComponent(shop.name)}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">{shop.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium text-gray-900 text-center mb-2">{shop.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="w-4 h-4 text-[#f5a623] fill-current" />
                <span className="text-sm font-medium">{shop.rating}</span>
              </div>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>{shop.products.toLocaleString()} προϊόντα</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopsListPage;
