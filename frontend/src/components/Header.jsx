import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, ChevronDown, MapPin, Tag, Package, TrendingUp, Store } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { featuredProducts, categories, popularSearches, shops } from '../data/mockData';
import { normalizeGreek, matchesQuery, debounce } from '../utils/searchUtils';

const navCategories = [
  { name: 'Προσφορές', path: '/deals', isSpecial: true },
  { name: 'Σπόροι', path: '/category/1' },
  { name: 'Άρδευση', path: '/category/3' },
  { name: 'Λιπάσματα', path: '/category/2' },
  { name: 'Θερμοκήπια', path: '/category/5' },
  { name: 'Ζωοτροφές', path: '/category/4' },
  { name: 'Φυτοφάρμακα', path: '/category/6' },
  { name: 'Εργαλεία', path: '/category/7' }
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search update
  const debouncedSetQuery = useCallback(
    debounce((value) => {
      setDebouncedQuery(value);
    }, 250),
    []
  );

  // Update debounced query when search query changes
  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  // Compute search suggestions based on debounced query
  // Supports Greek, accent-insensitive, and Greeklish search
  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return { products: [], categories: [], searches: [], shops: [] };
    }

    const matchedProducts = featuredProducts
      .filter(p => matchesQuery(p.name, debouncedQuery) || matchesQuery(p.category, debouncedQuery))
      .slice(0, 4);

    const matchedCategories = categories
      .filter(c => matchesQuery(c.name, debouncedQuery))
      .slice(0, 3);

    const matchedSearches = popularSearches
      .filter(s => matchesQuery(s, debouncedQuery))
      .slice(0, 3);

    const matchedShops = shops
      .filter(s => matchesQuery(s.name, debouncedQuery) || matchesQuery(s.location, debouncedQuery))
      .slice(0, 2);

    return {
      products: matchedProducts,
      categories: matchedCategories,
      searches: matchedSearches,
      shops: matchedShops
    };
  }, [debouncedQuery]);

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

  // Highlight matching text (works with both Greek and Greeklish)
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
            <Link to="/shops" className="hover:underline">Καταστήματα</Link>
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
              <span className="text-xs text-gray-500 hidden sm:block">για τον αγρότη</span>
            </Link>

            {/* Search Bar with Autocomplete */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4" ref={searchRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Αναζήτησε σπόρους, ζωοτροφές, λιπάσματα..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => debouncedQuery.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-4 pr-12 py-2.5 border-2 border-[#2d7a3a] rounded-full focus:ring-2 focus:ring-[#2d7a3a] focus:border-transparent"
                  autoComplete="off"
                  data-testid="search-input"
                />
                <Button 
                  type="submit"
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f5a623] hover:bg-[#e09612] rounded-full p-2"
                  data-testid="search-button"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>

                {/* Autocomplete Dropdown */}
                {showSuggestions && totalSuggestions > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                    data-testid="search-suggestions"
                  >
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
                            data-testid={`suggestion-search-${idx}`}
                          >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{highlightMatch(search, debouncedQuery)}</span>
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
                              data-testid={`suggestion-category-${cat.id}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center">
                                <Tag className="w-4 h-4 text-[#2d7a3a]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{highlightMatch(cat.name, debouncedQuery)}</p>
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
                              data-testid={`suggestion-product-${product.id}`}
                            >
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{highlightMatch(product.name, debouncedQuery)}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-[#2d7a3a] whitespace-nowrap">
                                  από {product.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                                </span>
                                <p className="text-xs text-gray-500">{product.offerCount} καταστήματα</p>
                              </div>
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
                              data-testid={`suggestion-shop-${shop.id}`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center">
                                <span className="text-white font-bold">{shop.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{highlightMatch(shop.name, debouncedQuery)}</p>
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
                      data-testid="view-all-results"
                    >
                      Δες όλα τα αποτελέσματα για "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Nav */}
      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center py-2">
            {/* Categories Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a] rounded-lg transition-colors">
                <Menu className="w-4 h-4" />
                Κατηγορίες
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {navCategories.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        item.isSpecial 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a]'
                      }`}
                    >
                      {item.isSpecial && <Tag className="w-4 h-4" />}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            {navCategories.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`block px-3 py-2 rounded-lg ${
                  item.isSpecial ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#e8f5e9]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/shops" 
              className="block px-3 py-2 text-gray-700 hover:bg-[#e8f5e9] rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Καταστήματα
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
