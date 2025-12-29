import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ShoppingCart, Store, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts } from '../data/mockData';
import { toast } from 'sonner';

const ProductPage = () => {
  const { productId } = useParams();
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = useMemo(() => {
    return featuredProducts.find(p => p.id === parseInt(productId)) || featuredProducts[0];
  }, [productId]);

  const handleAddToCart = () => {
    setCartCount(prev => prev + quantity);
    toast.success(`Προστέθηκαν ${quantity} τεμ. στο καλάθι: ${product.name}`);
  };

  const relatedProducts = featuredProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/1`} className="hover:text-[#2d7a3a]">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-[#2d7a3a] text-white">Νέο</Badge>}
                {product.discount > 0 && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Info */}
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews} αξιολογήσεις)</span>
              </div>

              {/* Shop */}
              <Link to={`/shop/${product.shop}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2d7a3a] mb-6">
                <Store className="w-4 h-4" />
                <span>{product.shop}</span>
              </Link>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#2d7a3a]">{product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                  )}
                </div>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Διαθέσιμο
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Ποσότητα:</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <Button onClick={handleAddToCart} className="flex-1 bg-[#f5a623] hover:bg-[#e09612] text-white py-3">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Προσθήκη στο καλάθι
                </Button>
                <Button variant="outline" className="border-[#2d7a3a] text-[#2d7a3a] hover:bg-[#e8f5e9] py-3">
                  Αγορά τώρα
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
                  <p className="text-xs text-gray-600">Δωρεάν αποστολή</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
                  <p className="text-xs text-gray-600">Εγγύηση ποιότητας</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-[#2d7a3a] mb-1" />
                  <p className="text-xs text-gray-600">Εύκολες επιστροφές</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Σχετικά Προϊόντα</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-4">
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{p.name}</h3>
                <p className="text-lg font-bold text-[#2d7a3a]">{p.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
