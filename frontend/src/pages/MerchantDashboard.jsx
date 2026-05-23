import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, MousePointerClick, Euro, TrendingUp, Package, Store as StoreIcon,
  ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import MerchantLayout from '../components/MerchantLayout';
import { fetchMerchantStats, fetchMerchantStore } from '../api/client';

const COLORS = ['#2d7a3a', '#4ade80', '#f5a623', '#3498db', '#9b59b6', '#e74c3c',
                '#1abc9c', '#e67e22', '#34495e', '#95a5a6'];

const StatCard = ({ icon: Icon, label, value, trend, suffix = '', color = '#2d7a3a', testid }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100" data-testid={testid}>
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend !== undefined && trend !== null && (
        <span className={`text-xs font-medium flex items-center gap-0.5 ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">
      {typeof value === 'number' ? value.toLocaleString('el-GR') : value}{suffix}
    </p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const MerchantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [store, setStore] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchMerchantStats(days), fetchMerchantStore().catch(() => null)])
      .then(([s, st]) => {
        if (!mounted) return;
        setStats(s);
        setStore(st);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [days]);

  if (loading) {
    return (
      <MerchantLayout title="Dashboard">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      </MerchantLayout>
    );
  }

  // No store yet — onboarding prompt
  if (!store) {
    return (
      <MerchantLayout title="Dashboard">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm" data-testid="onboarding-prompt">
          <StoreIcon className="w-16 h-16 text-[#2d7a3a] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Καλώς ήρθες!</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Δημιούργησε το κατάστημά σου για να ξεκινήσεις να ανεβάζεις προϊόντα και να βλέπεις στατιστικά.
          </p>
          <Link
            to="/merchant/store"
            className="inline-flex items-center gap-2 bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            data-testid="create-store-cta"
          >
            <StoreIcon className="w-4 h-4" />
            Δημιουργία καταστήματος
          </Link>
        </div>
      </MerchantLayout>
    );
  }

  const t = stats.totals;

  return (
    <MerchantLayout title={`Dashboard — ${store.name}`}>
      {/* Period filter */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Στατιστικά τελευταίων ημερών</p>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                days === d ? 'bg-[#2d7a3a] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              data-testid={`period-${d}d`}
            >
              {d} ημέρες
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Eye} label="Προβολές" value={t.impressions} color="#3498db" testid="kpi-impressions" />
        <StatCard icon={MousePointerClick} label="Κλικ" value={t.clicks} color="#2d7a3a" testid="kpi-clicks" />
        <StatCard icon={TrendingUp} label="CTR" value={t.ctr} suffix="%" color="#f5a623" testid="kpi-ctr" />
        <StatCard icon={Euro} label="Εκτιμώμενα έσοδα" value={t.estimated_revenue.toFixed(2)} suffix="€" color="#9b59b6" testid="kpi-revenue" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Προβολές & Κλικ ανά ημέρα</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impressions" name="Προβολές" stroke="#3498db" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clicks" name="Κλικ" stroke="#2d7a3a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Εκτιμώμενα έσοδα</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v} €`} />
              <Bar dataKey="estimated_revenue" name="€" fill="#9b59b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2: category + geo */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Κλικ ανά κατηγορία</h3>
          {stats.category_breakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Δεν υπάρχουν δεδομένα</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.category_breakdown}
                  dataKey="clicks"
                  nameKey="category"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={(e) => `${e.category}`}
                >
                  {stats.category_breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Γεωγραφική κατανομή</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.geo_breakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="clicks" fill="#f5a623" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Κορυφαία προϊόντα</h3>
        </div>
        {stats.top_products.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Δεν υπάρχουν δεδομένα</p>
        ) : (
          <div className="divide-y">
            {stats.top_products.map((p) => (
              <div key={p.product_id} className="px-6 py-3 flex items-center gap-4" data-testid={`top-product-${p.product_id}`}>
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.impressions.toLocaleString('el-GR')} προβολές</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2d7a3a]">{p.clicks.toLocaleString('el-GR')} κλικ</p>
                  <p className="text-xs text-gray-500">CTR {p.ctr}%</p>
                </div>
                <div className="text-right ml-4 hidden sm:block">
                  <p className="text-sm font-bold text-purple-600">{p.estimated_revenue.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">έσοδα</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantDashboard;
