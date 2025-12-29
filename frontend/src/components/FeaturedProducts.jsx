import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { featuredProducts } from '../data/mockData';

const FeaturedProducts = ({ onAddToCart }) => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Δημοφιλή Προϊόντα</h2>
          <Link 
            to="/category/1" 
            className="flex items-center gap-1 text-sm font-medium text-[#2d7a3a] hover:text-[#1e5c2a] transition-colors"
          >
            Δες όλα
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
