import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProductCard = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-[#2d7a3a] text-white text-xs px-2 py-1">Νέο</Badge>
          )}
          {product.discount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">-{product.discount}%</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
          } shadow-md`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button 
            onClick={() => onAddToCart && onAddToCart(product)}
            className="w-full bg-[#f5a623] hover:bg-[#e09612] text-white shadow-lg"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Προσθήκη
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2 min-h-[40px] hover:text-[#2d7a3a] cursor-pointer transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'text-[#f5a623] fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Shop */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Store className="w-3 h-3" />
          <span className="truncate">{product.shop}</span>
        </div>

        {/* Price */}
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

export default ProductCard;
