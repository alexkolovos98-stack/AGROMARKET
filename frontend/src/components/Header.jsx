import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Menu, ChevronDown, MapPin, Tag, Package, TrendingUp, Store,
  LogIn, UserCircle2, LogOut, LayoutDashboard,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { searchAutocomplete } from '../api/client';
import { normalizeGreek, debounce } from '../utils/searchUtils';
import { useAuth } from '../contexts/AuthContext';

const navCategories = [
  { name: 'Προσφορές', path: '/deals', isSpecial: true },
  { name: 'Σπόροι', path: '/category/1' },
  { name: 'Άρδευση', path: '/category/3' },
  { name: 'Λιπάσματα', path: '/category/2' },
  { name: 'Θερμοκήπια', path: '/category/5' },
  { name: 'Ζωοτροφές', path: '/category/4' },
  { name: 'Φυτοφάρμακα', path: '/category/6' },
  { name: 'Εργαλεία', path: '/category/7' },
];

const Header = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const debouncedSetQuery = useCallback(debounce((v) => setDebouncedQuery(v), 250), []);
  useEffect(() => { debouncedSetQuery(searchQuery); }, [searchQuery, debouncedSetQuery]);

  // Fetch autocomplete from backend
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    searchAutocomplete(debouncedQuery, 8)
      .then((s) => { if (!cancelled) setSuggestions(s || []); })
      .catch(() => !cancelled && setSuggestions([]));
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p < suggestions.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p > 0 ? p - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const s = suggestions[selectedIndex];
      navigateSuggestion(s);
    }
  };

  const navigateSuggestion = (s) => {
    setShowSuggestions(false);
    setSearchQuery('');
    if (s.type === 'product' && s.product_id) navigate(`/product/${s.product_id}`);
    else if (s.type === 'category' && s.category_id) navigate(`/category/${s.category_id}`);
    else navigate(`/search?q=${encodeURIComponent(s.text)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || query.length < 2) return text;
    const nt = normalizeGreek(text);
    const nq = normalizeGreek(query);
    const idx = nt.indexOf(nq);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold text-[#2d7a3a]">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const iconForType = (t) => {
    if (t === 'product') return Package;
    if (t === 'category') return Tag;
    if (t === 'brand') return Store;
    return TrendingUp;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#2d7a3a] text-white text-sm py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Αποστολή σε όλη την Ελλάδα
          </span>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:underline">Βοήθεια</Link>
            <Link to="/shops" className="hover:underline">Καταστήματα</Link>
            <Link to="/signup" className="hover:underline hidden sm:inline" data-testid="topbar-signup-link">
              Έγινε έμπορος
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#2d7a3a]">agro</span>
                <span className="text-2xl font-bold text-[#f5a623]">plaza</span>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">για τον αγρότη</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4" ref={searchRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Αναζήτησε σπόρους, ζωοτροφές, λιπάσματα..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setSelectedIndex(-1); }}
                  onFocus={() => debouncedQuery.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-4 pr-12 py-2.5 border-2 border-[#2d7a3a] rounded-full focus:ring-2 focus:ring-[#2d7a3a] focus:border-transparent"
                  autoComplete="off"
                  data-testid="search-input"
                />
                <Button
                  type="submit" size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f5a623] hover:bg-[#e09612] rounded-full p-2"
                  data-testid="search-button"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto" data-testid="search-suggestions">
                    <div className="p-2">
                      {suggestions.map((s, idx) => {
                        const Icon = iconForType(s.type);
                        return (
                          <button
                            key={`${s.type}-${idx}`}
                            type="button"
                            onClick={() => navigateSuggestion(s)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                              selectedIndex === idx ? 'bg-[#e8f5e9]' : 'hover:bg-gray-50'
                            }`}
                            data-testid={`suggestion-${idx}`}
                          >
                            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm">{highlightMatch(s.text, debouncedQuery)}</span>
                            <span className="text-xs text-gray-400 ml-auto">{s.type}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowSuggestions(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }}
                      className="w-full px-4 py-3 bg-gray-50 text-center text-sm font-medium text-[#2d7a3a] hover:bg-[#e8f5e9] transition-colors"
                      data-testid="view-all-results"
                    >
                      Δες όλα τα αποτελέσματα για "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Auth area */}
            <div className="hidden md:flex items-center gap-2" ref={userMenuRef}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
                    data-testid="user-menu-toggle"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] text-white flex items-center justify-center font-bold text-xs">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate max-w-[120px]">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50" data-testid="user-menu">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-[#2d7a3a] mt-1 capitalize">{user.role}</p>
                      </div>
                      {user.role === 'merchant' && (
                        <Link to="/merchant/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" data-testid="user-menu-dashboard">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <UserCircle2 className="w-4 h-4" />
                        Προφίλ
                      </Link>
                      <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-left text-red-600" data-testid="user-menu-logout">
                        <LogOut className="w-4 h-4" />
                        Αποσύνδεση
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-gray-700" data-testid="header-login-button">
                      <LogIn className="w-4 h-4 mr-1.5" />
                      Σύνδεση
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white" data-testid="header-signup-button">
                      Εγγραφή
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="mobile-menu-toggle">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center py-2">
            <li className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a] rounded-lg transition-colors">
                <Menu className="w-4 h-4" />
                Κατηγορίες
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {navCategories.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        item.isSpecial ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2d7a3a]'
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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-2 space-y-2">
            {!user && (
              <div className="flex gap-2 mb-2">
                <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Σύνδεση</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#2d7a3a] text-white">Εγγραφή</Button>
                </Link>
              </div>
            )}
            {user?.role === 'merchant' && (
              <Link to="/merchant/dashboard" className="block px-3 py-2 text-[#2d7a3a] font-medium hover:bg-[#e8f5e9] rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            {navCategories.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-lg ${item.isSpecial ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#e8f5e9]'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/shops" className="block px-3 py-2 text-gray-700 hover:bg-[#e8f5e9] rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              Καταστήματα
            </Link>
            {user && (
              <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Αποσύνδεση
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
