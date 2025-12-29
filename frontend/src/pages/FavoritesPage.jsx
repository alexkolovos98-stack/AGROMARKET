import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts } from '../data/mockData';
import { toast } from 'sonner';

const FavoritesPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState(featuredProducts.slice(0, 4));

  const removeFavorite = (id) => {
    setFavorites(favs => favs.filter(f => f.id !== id));
    toast.success('Αφαιρέθηκε από τα αγαπημένα');
  };

  const addToCart = (product) => {
    setCartCount(prev => prev + 1);
    toast.success(`Προστέθηκε στο καλάθι: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-gray-900">Τα Αγαπημένα μου</h1>
          <span className="text-gray-500">({favorites.length} προϊόντα)</span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Δεν έχεις αγαπημένα ακόμα</h2>
            <p className="text-gray-500 mb-6">Πρόσθεσε προϊόντα στα αγαπημένα για να τα βρίσκεις εύκολα</p>
            <Link to="/">
              <Button className="bg-[#2d7a3a] hover:bg-[#1e5c2a]">Εξερεύνησε προϊόντα</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  {product.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">-{product.discount}%</Badge>
                  )}
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-[#2d7a3a] mb-2 block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Store className="w-3 h-3" />
                    <span>{product.shop}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#2d7a3a]">{product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => addToCart(product)} className="w-full mt-3 bg-[#f5a623] hover:bg-[#e09612] text-white" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Προσθήκη
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
