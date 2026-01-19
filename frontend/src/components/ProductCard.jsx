import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Store, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';

const ProductCard = ({ product }) => {
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 block"
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
          {discount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">-{discount}%</Badge>
          )}
        </div>

        {/* Offer count badge */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-[#2d7a3a] text-white text-xs px-2 py-1 flex items-center gap-1">
            <Store className="w-3 h-3" />
            {product.offerCount} {product.offerCount === 1 ? 'κατάστημα' : 'καταστήματα'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2 min-h-[40px] group-hover:text-[#2d7a3a] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
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

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-400">από</span>
            <span className="text-lg font-bold text-[#2d7a3a] ml-1">
              {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
              </span>
            )}
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

export default ProductCard;
