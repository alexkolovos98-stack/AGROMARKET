import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, MapPin, Tag, Package, TrendingUp, Store } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { featuredProducts, categories, popularSearches, shops } from '../data/mockData';

const navCategories = [
  { name: 'Προσφορές', path: '/deals', isSpecial: true },
  { name: 'Σπόροι', path: '/category/1' },
  { name: 'Άρδευση', path: '/category/3' },
  { name: 'Λιπάσματα', path: '/category/2' },
  { name: 'Θερμοκήπια', path: '/category/5' },
  { name: 'Ζωοτροφές', path: '/category/4' },
  { name: 'Εργαλεία', path: '/category/7' }
];

// Greek diacritics normalization - removes tonos (accent marks) for insensitive matching
const normalizeGreek = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    // Replace accented Greek vowels with their non-accented versions
    .replace(/ά/g, 'α')
    .replace(/έ/g, 'ε')
    .replace(/ή/g, 'η')
    .replace(/ί/g, 'ι')
    .replace(/ό/g, 'ο')
    .replace(/ύ/g, 'υ')
    .replace(/ώ/g, 'ω')
    // Also handle capital accented letters (in case)
    .replace(/Ά/g, 'α')
    .replace(/Έ/g, 'ε')
    .replace(/Ή/g, 'η')
    .replace(/Ί/g, 'ι')
    .replace(/Ό/g, 'ο')
    .replace(/Ύ/g, 'υ')
    .replace(/Ώ/g, 'ω')
    // Handle dialytika combinations
    .replace(/ϊ/g, 'ι')
    .replace(/ϋ/g, 'υ')
    .replace(/ΐ/g, 'ι')
    .replace(/ΰ/g, 'υ');
};

// Check if normalized query matches normalized text
const matchesQuery = (text, query) => {
  if (!query || !text) return false;
  const normalizedText = normalizeGreek(text);
  const normalizedQuery = normalizeGreek(query);
  return normalizedText.includes(normalizedQuery);
};

const Header = ({ cartCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Compute search suggestions based on query
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return { products: [], categories: [], searches: [], shops: [] };

    const matchedProducts = featuredProducts
      .filter(p => matchesQuery(p.name, searchQuery) || matchesQuery(p.category, searchQuery))
      .slice(0, 4);

    const matchedCategories = categories
      .filter(c => matchesQuery(c.name, searchQuery))
      .slice(0, 3);

    const matchedSearches = popularSearches
      .filter(s => matchesQuery(s, searchQuery))
      .slice(0, 3);

    const matchedShops = shops
      .filter(s => matchesQuery(s.name, searchQuery) || matchesQuery(s.location, searchQuery))
      .slice(0, 2);

    return {
      products: matchedProducts,
      categories: matchedCategories,
      searches: matchedSearches,
      shops: matchedShops
    };
  }, [searchQuery]);

  const totalSuggestions = suggestions.products.length + suggestions.categories.length + 
                           suggestions.searches.length + suggestions.shops.length;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || totalSuggestions === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalSuggestions - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalSuggestions - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (path) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || query.length < 2) return text;
    
    const normalizedText = normalizeGreek(text);
    const normalizedQuery = normalizeGreek(query);
    const index = normalizedText.indexOf(normalizedQuery);
    
    if (index === -1) return text;
    
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    
    return (
      <>
        {before}
        <span className="font-semibold text-[#2d7a3a]">{match}</span>
        {after}
      </>
    );
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

            {/* Search Bar with Autocomplete */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl" ref={searchRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Αναζήτησε σπόρους, ζωοτροφές, λιπάσματα..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-4 pr-12 py-2 border-2 border-[#2d7a3a] rounded-full focus:ring-2 focus:ring-[#2d7a3a] focus:border-transparent"
                  autoComplete="off"
                />
                <Button 
                  type="submit"
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f5a623] hover:bg-[#e09612] rounded-full p-2"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>

                {/* Autocomplete Dropdown */}
                {showSuggestions && totalSuggestions > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {/* Popular Searches */}
                    {suggestions.searches.length > 0 && (
                      <div className="p-2 border-b">
                        <p className="text-xs font-medium text-gray-400 px-2 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Δημοφιλείς αναζητήσεις
                        </p>
                        {suggestions.searches.map((search, idx) => (
                          <button
                            key={`search-${idx}`}
                            type="button"
                            onClick={() => handleSuggestionClick(`/search?q=${encodeURIComponent(search)}`)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                              selectedIndex === idx ? 'bg-[#e8f5e9]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{highlightMatch(search, searchQuery)}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Categories */}
                    {suggestions.categories.length > 0 && (
                      <div className="p-2 border-b">
                        <p className="text-xs font-medium text-gray-400 px-2 mb-1 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Κατηγορίες
                        </p>
                        {suggestions.categories.map((cat, idx) => {
                          const globalIdx = suggestions.searches.length + idx;
                          return (
                            <button
                              key={`cat-${cat.id}`}
                              type="button"
                              onClick={() => handleSuggestionClick(`/category/${cat.id}`)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                selectedIndex === globalIdx ? 'bg-[#e8f5e9]' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center">
                                <Tag className="w-4 h-4 text-[#2d7a3a]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{highlightMatch(cat.name, searchQuery)}</p>
                                <p className="text-xs text-gray-500">{cat.count?.toLocaleString()} προϊόντα</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Products */}
                    {suggestions.products.length > 0 && (
                      <div className="p-2 border-b">
                        <p className="text-xs font-medium text-gray-400 px-2 mb-1 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Προϊόντα
                        </p>
                        {suggestions.products.map((product, idx) => {
                          const globalIdx = suggestions.searches.length + suggestions.categories.length + idx;
                          return (
                            <button
                              key={`prod-${product.id}`}
                              type="button"
                              onClick={() => handleSuggestionClick(`/product/${product.id}`)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                selectedIndex === globalIdx ? 'bg-[#e8f5e9]' : 'hover:bg-gray-50'
                              }`}
                            >
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{highlightMatch(product.name, searchQuery)}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                              </div>
                              <span className="text-sm font-bold text-[#2d7a3a] whitespace-nowrap">
                                {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Shops */}
                    {suggestions.shops.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-400 px-2 mb-1 flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          Καταστήματα
                        </p>
                        {suggestions.shops.map((shop, idx) => {
                          const globalIdx = suggestions.searches.length + suggestions.categories.length + 
                                           suggestions.products.length + idx;
                          return (
                            <button
                              key={`shop-${shop.id}`}
                              type="button"
                              onClick={() => handleSuggestionClick(`/shop/${encodeURIComponent(shop.name)}`)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                selectedIndex === globalIdx ? 'bg-[#e8f5e9]' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center">
                                <span className="text-white font-bold">{shop.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{highlightMatch(shop.name, searchQuery)}</p>
                                <p className="text-xs text-gray-500">{shop.location} • {shop.products} προϊόντα</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* View All Results */}
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(`/search?q=${encodeURIComponent(searchQuery)}`)}
                      className="w-full px-4 py-3 bg-gray-50 text-center text-sm font-medium text-[#2d7a3a] hover:bg-[#e8f5e9] transition-colors"
                    >
                      Δες όλα τα αποτελέσματα για "{searchQuery}"
                    </button>
                  </div>
                )}
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
