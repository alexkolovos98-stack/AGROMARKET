import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchCategory, fetchProducts } from '../api/client';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cid = parseInt(categoryId);
    if (!cid) return;
    setLoading(true);
    Promise.all([
      fetchCategory(cid).catch(() => null),
      fetchProducts({ category_id: cid, limit: 50 }).catch(() => []),
    ]).then(([c, p]) => {
      setCategory(c);
      setProducts(p);
    }).finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{category?.name || '...'}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6" data-testid="category-header">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{category?.name || 'Κατηγορία'}</h1>
          <p className="text-gray-500">
            {category ? `${category.count?.toLocaleString('el-GR')} προϊόντα στην κατηγορία` : 'Φόρτωση...'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="category-products">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
