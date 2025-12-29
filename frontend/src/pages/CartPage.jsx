import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts } from '../data/mockData';
import { toast } from 'sonner';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { ...featuredProducts[0], quantity: 2 },
    { ...featuredProducts[3], quantity: 1 }
  ]);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success('Το προϊόν αφαιρέθηκε από το καλάθι');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Το Καλάθι μου</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Το καλάθι σου είναι άδειο</h2>
            <p className="text-gray-500 mb-6">Πρόσθεσε προϊόντα για να ξεκινήσεις τις αγορές σου</p>
            <Link to="/">
              <Button className="bg-[#2d7a3a] hover:bg-[#1e5c2a]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Συνέχισε τις αγορές
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                  <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-[#2d7a3a]">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{item.shop}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-[#2d7a3a]">{(item.price * item.quantity).toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="font-bold text-lg mb-4">Σύνοψη Παραγγελίας</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Υποσύνολο</span>
                  <span>{subtotal.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Μεταφορικά</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Δωρεάν' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <Truck className="w-4 h-4" />
                    <span>Δωρεάν μεταφορικά για αγορές άνω των 50€</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t mb-6">
                <span>Σύνολο</span>
                <span className="text-[#2d7a3a]">{total.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <Button className="w-full bg-[#f5a623] hover:bg-[#e09612] text-white py-3 mb-3">
                Ολοκλήρωση Παραγγελίας
              </Button>
              <Link to="/" className="block text-center text-sm text-[#2d7a3a] hover:underline">
                Συνέχισε τις αγορές
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
