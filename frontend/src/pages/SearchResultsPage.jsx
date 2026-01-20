import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search, Store, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts, categories, shops } from '../data/mockData';
import { matchesQuery, searchAndRank } from '../utils/searchUtils';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  // Search results using the enhanced search utilities (supports Greek + Greeklish)
  const results = useMemo(() => {
    if (!query) return { products: [], categories: [], shops: [] };

    // Search products using enhanced matching
    const matchedProducts = featuredProducts.filter(p => 
      matchesQuery(p.name, query) || matchesQuery(p.category, query)
    );

    // Search categories
    const matchedCategories = categories.filter(c =>
      matchesQuery(c.name, query)
    );

    // Search shops
    const matchedShops = shops.filter(s =>
      matchesQuery(s.name, query) || matchesQuery(s.location, query)
    );

    return {
      products: matchedProducts,
      categories: matchedCategories,
      shops: matchedShops
    };
  }, [query]);

  const totalResults = results.products.length + results.categories.length + results.shops.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Αναζήτηση: "{query}"</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="search-results-title">
          Αποτελέσματα για "{query}"
        </h1>
        <p className="text-gray-500 mb-6" data-testid="search-results-count">
          Βρέθηκαν {totalResults} αποτελέσματα ({results.products.length} προϊόντα, {results.categories.length} κατηγορίες, {results.shops.length} καταστήματα)
        </p>

        {/* No Results */}
        {totalResults === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center" data-testid="no-results">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Δεν βρέθηκαν αποτελέσματα</h2>
            <p className="text-gray-500 mb-4">Δοκίμασε διαφορετικούς όρους αναζήτησης</p>
            <p className="text-sm text-gray-400">
              Μπορείς να γράψεις στα ελληνικά ή greeklish (π.χ. "lipasma" για "λίπασμα")
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Matching Categories */}
            {results.categories.length > 0 && (
              <div data-testid="category-results">
                <h2 className="text-lg font-semibold mb-3">Κατηγορίες</h2>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="px-4 py-2 bg-white rounded-lg border hover:border-[#2d7a3a] hover:bg-[#e8f5e9] transition-all flex items-center gap-2"
                      data-testid={`category-result-${cat.id}`}
                    >
                      {cat.name}
                      <span className="text-xs text-gray-500">({cat.count?.toLocaleString()} προϊόντα)</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Shops */}
            {results.shops.length > 0 && (
              <div data-testid="shop-results">
                <h2 className="text-lg font-semibold mb-3">Καταστήματα</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.shops.map(shop => (
                    <Link
                      key={shop.id}
                      to={`/shop/${encodeURIComponent(shop.name)}`}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                      data-testid={`shop-result-${shop.id}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center flex-shrink-0">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{shop.name}</h3>
                        <p className="text-sm text-gray-500">{shop.location} • {shop.products} προϊόντα</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{shop.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results */}
            {results.products.length > 0 && (
              <div data-testid="product-results">
                <h2 className="text-lg font-semibold mb-3">Προϊόντα</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.products.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                      data-testid={`product-result-${product.id}`}
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {product.offerCount > 1 && (
                          <div className="absolute top-2 right-2 bg-[#2d7a3a] text-white text-xs px-2 py-1 rounded-full">
                            {product.offerCount} καταστήματα
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-500">από</span>
                            <p className="text-lg font-bold text-[#2d7a3a]">
                              {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
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
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
