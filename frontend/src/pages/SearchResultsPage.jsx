import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search, Store, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchProducts } from '../api/client';

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchProducts(query, 60).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Αναζήτηση: "{query}"</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="search-results-title">
          Αποτελέσματα για "{query}"
        </h1>
        <p className="text-gray-500 mb-6" data-testid="search-results-count">
          {loading ? 'Αναζήτηση...' : `Βρέθηκαν ${products.length} προϊόντα`}
        </p>

        {!loading && products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center" data-testid="no-results">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Δεν βρέθηκαν αποτελέσματα</h2>
            <p className="text-gray-500 mb-4">Δοκίμασε διαφορετικούς όρους αναζήτησης</p>
            <p className="text-sm text-gray-400">
              Μπορείς να γράψεις στα ελληνικά ή greeklish (π.χ. "lipasma" για "λίπασμα")
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="search-products">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                data-testid={`product-result-${p.id}`}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.offerCount > 1 && (
                    <div className="absolute top-2 right-2 bg-[#2d7a3a] text-white text-xs px-2 py-1 rounded-full">
                      {p.offerCount} καταστήματα
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">από</span>
                      <p className="text-lg font-bold text-[#2d7a3a]">
                        {p.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ExternalLink className="w-3 h-3" />
                      Σύγκριση
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
