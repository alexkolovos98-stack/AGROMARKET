import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, Grid, List, Star, Store, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categories, featuredProducts } from '../data/mockData';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  // Find category by ID
  const category = useMemo(() => {
    return categories.find(cat => cat.id === parseInt(categoryId)) || categories[0];
  }, [categoryId]);

  // Filter products by category
  const products = useMemo(() => {
    const filtered = featuredProducts.filter(p => 
      p.categoryId === category?.id || !categoryId
    );
    
    // Sort products
    switch(sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'stores':
        return [...filtered].sort((a, b) => b.offerCount - a.offerCount);
      default:
        return filtered;
    }
  }, [category, categoryId, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{category?.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm" data-testid="category-header">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{category?.name}</h1>
          <p className="text-gray-500">Σύγκριση τιμών σε {category?.count?.toLocaleString()} προϊόντα από πολλαπλά καταστήματα</p>
        </div>

        {/* Filters & Sorting */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Φίλτρα
            </Button>
            <span className="text-sm text-gray-500">{products.length} προϊόντα</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]" data-testid="sort-select">
                <SelectValue placeholder="Ταξινόμηση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Δημοφιλέστερα</SelectItem>
                <SelectItem value="price-low">Τιμή: Χαμηλή → Υψηλή</SelectItem>
                <SelectItem value="price-high">Τιμή: Υψηλή → Χαμηλή</SelectItem>
                <SelectItem value="rating">Αξιολόγηση</SelectItem>
                <SelectItem value="stores">Περισσότερα καταστήματα</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#2d7a3a] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                data-testid="grid-view-btn"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#2d7a3a] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                data-testid="list-view-btn"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`} data-testid="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* No products message */}
        {products.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${product.id}`}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-4 flex gap-4"
        data-testid={`product-card-${product.id}`}
      >
        <div className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-[#2d7a3a] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <Store className="w-4 h-4" />
            <span>{product.offerCount} καταστήματα</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <span className="text-xs text-gray-400">από</span>
              <span className="text-xl font-bold text-[#2d7a3a]">
                {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-[#2d7a3a] text-sm font-medium">
              Σύγκριση τιμών
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 block"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Store count badge */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-[#2d7a3a] text-white text-xs px-2 py-1 flex items-center gap-1">
            <Store className="w-3 h-3" />
            {product.offerCount} καταστήματα
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2 min-h-[40px] group-hover:text-[#2d7a3a] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-400">από</span>
            <span className="text-lg font-bold text-[#2d7a3a] ml-1">
              {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
            </span>
          </div>
          <span className="text-xs text-[#2d7a3a] flex items-center gap-1">
            Σύγκριση
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryPage;
