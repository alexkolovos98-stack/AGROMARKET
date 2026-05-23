import React, { useEffect, useState } from 'react';
import { Package, ExternalLink } from 'lucide-react';
import MerchantLayout from '../components/MerchantLayout';
import { fetchMerchantProducts } from '../api/client';

const MerchantProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchantProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  return (
    <MerchantLayout title="Προϊόντα">
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Φόρτωση...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Δεν έχεις ακόμη προϊόντα.</p>
          <p className="text-sm text-gray-400 mt-1">Ανέβασε ένα XML feed για να ξεκινήσεις.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full" data-testid="merchant-products-table">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Προϊόν</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Κατηγορία</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Τιμή</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Διαθεσιμότητα</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.offer_id} data-testid={`product-row-${p.product_id}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.category}</td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-sm font-bold text-[#2d7a3a]">{p.price.toFixed(2)} €</span>
                    {p.original_price && (
                      <span className="text-xs text-gray-400 line-through ml-2">{p.original_price.toFixed(2)} €</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.availability}</td>
                  <td className="px-6 py-3 text-right">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[#2d7a3a] hover:text-[#1e5c2a]">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MerchantLayout>
  );
};

export default MerchantProducts;
