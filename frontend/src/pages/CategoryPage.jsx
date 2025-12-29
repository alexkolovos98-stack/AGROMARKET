import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, Grid, List, Star, Heart, ShoppingCart, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categories, featuredProducts } from '../data/mockData';
import { toast } from 'sonner';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  // Find category by ID or slug
  const category = useMemo(() => {
    return categories.find(cat => cat.id === parseInt(categoryId)) || categories[0];
  }, [categoryId]);

  // Filter products by category (for demo, we'll show all products)
  const products = useMemo(() => {
    // In a real app, you'd filter by category
    const filtered = featuredProducts.filter(p => 
      p.category === category?.name || true // Show all for demo
    );
    
    // Sort products
    switch(sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [category, sortBy]);

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    toast.success(`Προστέθηκε στο καλάθι: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{category?.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{category?.name}</h1>
          <p className="text-gray-500">{category?.count?.toLocaleString()} προϊόντα διαθέσιμα</p>
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ταξινόμηση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Δημοφιλέστερα</SelectItem>
                <SelectItem value="price-low">Τιμή: Χαμηλή → Υψηλή</SelectItem>
                <SelectItem value="price-high">Τιμή: Υψηλή → Χαμηλή</SelectItem>
                <SelectItem value="rating">Αξιολόγηση</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#2d7a3a] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#2d7a3a] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, viewMode, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-4 flex gap-4">
        <div className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">-{product.discount}%</Badge>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-[#2d7a3a] cursor-pointer">
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
            <span>{product.shop}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <span className="text-xs text-gray-400">από</span>
              <span className="text-xl font-bold text-[#2d7a3a]">
                {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <Button 
                onClick={() => onAddToCart(product)}
                className="bg-[#f5a623] hover:bg-[#e09612] text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Προσθήκη
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-[#2d7a3a] text-white text-xs px-2 py-1">Νέο</Badge>
          )}
          {product.discount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">-{product.discount}%</Badge>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
          } shadow-md`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#f5a623] hover:bg-[#e09612] text-white shadow-lg"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Προσθήκη
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2 min-h-[40px] hover:text-[#2d7a3a] cursor-pointer transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Store className="w-3 h-3" />
          <span className="truncate">{product.shop}</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-xs text-gray-400">από</span>
          <span className="text-lg font-bold text-[#2d7a3a]">
            {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
