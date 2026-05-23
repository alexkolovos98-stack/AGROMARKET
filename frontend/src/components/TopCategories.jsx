import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sprout, Droplets, Home, Wheat, FlaskConical, Bug, Shovel } from 'lucide-react';

// Static shortcut list (UI only; backend categories drive the actual content)
const topCategories = [
  { id: 0, name: 'Προσφορές', icon: 'Tag', color: '#ef4444', categoryId: null },
  { id: 1, name: 'Σπόροι', icon: 'Sprout', color: '#22c55e', categoryId: 1 },
  { id: 2, name: 'Άρδευση', icon: 'Droplets', color: '#3b82f6', categoryId: 3 },
  { id: 3, name: 'Θερμοκήπια', icon: 'Home', color: '#10b981', categoryId: 5 },
  { id: 4, name: 'Ζωοτροφές', icon: 'Wheat', color: '#f59e0b', categoryId: 4 },
  { id: 5, name: 'Λιπάσματα', icon: 'FlaskConical', color: '#8b5cf6', categoryId: 2 },
  { id: 6, name: 'Φυτοφάρμακα', icon: 'Bug', color: '#dc2626', categoryId: 6 },
  { id: 7, name: 'Εργαλεία', icon: 'Shovel', color: '#6b7280', categoryId: 7 },
];

const iconMap = { Tag, Sprout, Droplets, Home, Wheat, FlaskConical, Bug, Shovel };

const TopCategories = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
          {topCategories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const dest = cat.categoryId ? `/category/${cat.categoryId}` : '/deals';
            return (
              <Link
                key={cat.id}
                to={dest}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group min-w-[80px] hover:shadow-md"
                data-testid={`top-cat-${cat.name}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {Icon && <Icon className="w-7 h-7" style={{ color: cat.color }} />}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
