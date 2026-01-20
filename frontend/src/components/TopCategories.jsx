import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sprout, Droplets, Home, Wheat, FlaskConical, Bug } from 'lucide-react';
import { topCategories, categories } from '../data/mockData';

const iconMap = {
  Tag: Tag,
  Sprout: Sprout,
  Droplets: Droplets,
  Home: Home,
  Wheat: Wheat,
  FlaskConical: FlaskConical,
  Bug: Bug
};

// Map top category names to category IDs
const categoryIdMap = {
  'Προσφορές': null, // Special case - no category page
  'Σπόροι': 1,
  'Άρδευση': 3,
  'Θερμοκήπια': 5,
  'Ζωοτροφές': 4,
  'Λιπάσματα': 2,
  'Φυτοφάρμακα': 6
};

const TopCategories = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
          {topCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon];
            const categoryId = categoryIdMap[cat.name];
            const isLink = categoryId !== null;
            
            const content = (
              <>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {IconComponent && <IconComponent className="w-7 h-7" style={{ color: cat.color }} />}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </>
            );
            
            if (isLink) {
              return (
                <Link
                  key={cat.id}
                  to={`/category/${categoryId}`}
                  className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group min-w-[80px] hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }
            
            return (
              <a
                key={cat.id}
                href="#deals"
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group min-w-[80px] hover:shadow-md"
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
