import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package, ChevronRight } from 'lucide-react';
import { fetchStores } from '../api/client';

const ShopsSection = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchStores().then((s) => setShops(s.slice(0, 6))).catch(() => setShops([]));
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Κορυφαία Αγροτικά Καταστήματα</h2>
          <Link to="/shops" className="flex items-center gap-1 text-sm font-medium text-[#2d7a3a] hover:text-[#1e5c2a] transition-colors">
            Δες όλα
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="shops-grid">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              to={`/shop/${encodeURIComponent(shop.name)}`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
              data-testid={`shop-card-${shop.id}`}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">{shop.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm text-center truncate mb-1">{shop.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-4 h-4 text-[#f5a623] fill-current" />
                <span className="text-sm font-medium text-gray-700">{shop.rating}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <Package className="w-3 h-3" />
                  <span>{shop.products.toLocaleString()} προϊόντα</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{shop.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsSection;
