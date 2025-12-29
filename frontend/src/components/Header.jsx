import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const navCategories = [
  { name: 'Προσφορές', path: '/deals', isSpecial: true },
  { name: 'Σπόροι', path: '/category/1' },
  { name: 'Άρδευση', path: '/category/3' },
  { name: 'Λιπάσματα', path: '/category/2' },
  { name: 'Θερμοκήπια', path: '/category/5' },
  { name: 'Ζωοτροφές', path: '/category/4' },
  { name: 'Εργαλεία', path: '/category/7' }
];

const Header = ({ cartCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#2d7a3a] text-white text-sm py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Αποστολή σε όλη την Ελλάδα
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:underline">Βοήθεια</Link>
            <Link to="/sell" className="hover:underline">Πούλα στο agroplaza</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#2d7a3a]">agro</span>
                <span className="text-2xl font-bold text-[#f5a623]">plaza</span>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">για αγρότες</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Αναζήτησε σπόρους, ζωοτροφές, λιπάσματα..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border-2 border-[#2d7a3a] rounded-full focus:ring-2 focus:ring-[#2d7a3a] focus:border-transparent"
                />
                <Button 
                  type="submit"
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f5a623] hover:bg-[#e09612] rounded-full p-2"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#2d7a3a] transition-colors">
                <User className="w-6 h-6" />
                <span className="text-xs">Σύνδεση</span>
              </Link>
              <Link to="/favorites" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#2d7a3a] transition-colors">
                <Heart className="w-6 h-6" />
                <span className="text-xs">Αγαπημένα</span>
              </Link>
              <Link to="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-[#2d7a3a] transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs">Καλάθι</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f5a623] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button 
                className="md:hidden text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Nav */}
      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1 py-2 overflow-x-auto">
            <li>
              <Link to="/shops" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a] rounded-lg transition-colors">
                <Menu className="w-4 h-4" />
                Κατηγορίες
                <ChevronDown className="w-3 h-3" />
              </Link>
            </li>
            {navCategories.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors block ${
                    item.isSpecial 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a]'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-[#e8f5e9] rounded-lg">Σύνδεση</Link>
            <Link to="/favorites" className="block px-3 py-2 text-gray-700 hover:bg-[#e8f5e9] rounded-lg">Αγαπημένα</Link>
            <Link to="/cart" className="block px-3 py-2 text-gray-700 hover:bg-[#e8f5e9] rounded-lg">Καλάθι</Link>
            {navCategories.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`block px-3 py-2 rounded-lg ${
                  item.isSpecial ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#e8f5e9]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
