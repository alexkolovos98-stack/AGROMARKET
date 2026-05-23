import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchDeals } from '../api/client';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetchDeals(50).then(setDeals).catch(() => setDeals([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Προσφορές</span>
        </nav>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Προσφορές & Εκπτώσεις</h1>
          <p className="text-white/80">Βρες τις καλύτερες τιμές σε αγροτικά προϊόντα</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="all-deals-grid">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/product/${deal.productId}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={deal.image} alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold text-sm px-3 py-1">
                  -{deal.discount}%
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 min-h-[40px]">{deal.name}</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-lg font-bold text-red-500">
                    {deal.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {deal.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{deal.endsIn}</span>
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

export default DealsPage;
