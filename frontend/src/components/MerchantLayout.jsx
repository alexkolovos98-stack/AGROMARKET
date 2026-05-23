import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Upload, CreditCard, Store as StoreIcon, Package,
  TrendingUp, MousePointerClick, Euro, Eye, BarChart3, LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/merchant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/merchant/store', label: 'Κατάστημα', icon: StoreIcon },
  { to: '/merchant/products', label: 'Προϊόντα', icon: Package },
  { to: '/merchant/xml-feed', label: 'XML Feed', icon: Upload },
  { to: '/merchant/billing', label: 'Συνδρομή', icon: CreditCard },
];

const MerchantLayout = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 px-6 py-5 border-b">
          <span className="text-xl font-bold text-[#2d7a3a]">agro</span>
          <span className="text-xl font-bold text-[#f5a623]">plaza</span>
          <span className="text-xs text-gray-400 ml-auto">Merchant</span>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = window.location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#e8f5e9] text-[#2d7a3a]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                data-testid={`merchant-nav-${item.label}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            data-testid="merchant-logout"
          >
            <LogOut className="w-4 h-4" />
            Αποσύνδεση
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default MerchantLayout;

// Re-export icons for dashboard convenience
export {
  TrendingUp, MousePointerClick, Euro, Eye, BarChart3,
};
