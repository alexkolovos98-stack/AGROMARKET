import React from 'react';
import { Tag, Sprout, Droplets, Home, Wheat, FlaskConical } from 'lucide-react';
import { topCategories } from '../data/mockData';

const iconMap = {
  Tag: Tag,
  Sprout: Sprout,
  Droplets: Droplets,
  Home: Home,
  Wheat: Wheat,
  FlaskConical: FlaskConical
};

const TopCategories = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
          {topCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon];
            return (
              <a
                key={cat.id}
                href="#"
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group min-w-[80px] hover:shadow-md"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {IconComponent && <IconComponent className="w-7 h-7" style={{ color: cat.color }} />}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
