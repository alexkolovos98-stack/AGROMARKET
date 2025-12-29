import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts, categories } from '../data/mockData';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  // Filter products based on search query
  const results = featuredProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Also find matching categories
  const matchingCategories = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Αποτελέσματα για "{query}"</h1>
        <p className="text-gray-500 mb-6">Βρέθηκαν {results.length} προϊόντα</p>

        {/* Matching Categories */}
        {matchingCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Κατηγορίες</h2>
            <div className="flex flex-wrap gap-2">
              {matchingCategories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="px-4 py-2 bg-white rounded-lg border hover:border-[#2d7a3a] hover:bg-[#e8f5e9] transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Δεν βρέθηκαν αποτελέσματα</h2>
            <p className="text-gray-500 mb-6">Δοκίμασε διαφορετικούς όρους αναζήτησης</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-lg font-bold text-[#2d7a3a]">{product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</p>
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
