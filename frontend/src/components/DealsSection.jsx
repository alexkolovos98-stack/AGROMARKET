import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { fetchDeals } from '../api/client';

const DealsSection = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetchDeals(4).then(setDeals).catch(() => setDeals([]));
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="py-8" id="deals">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Προσφορές Περιορισμένου Χρόνου</h2>
              <p className="text-sm text-gray-500">Μη χάσεις τις καλύτερες τιμές!</p>
            </div>
          </div>
          <Link to="/deals" className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
            Δες όλες
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="deals-grid">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/product/${deal.productId}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              data-testid={`deal-card-${deal.id}`}
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
                  <span>Λήγει σε {deal.endsIn}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
