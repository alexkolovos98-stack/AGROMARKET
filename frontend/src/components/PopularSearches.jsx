import React from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { popularSearches } from '../data/mockData';

const PopularSearches = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-[#2d7a3a]" />
          <h2 className="text-lg font-bold text-gray-900">Δημοφιλείς Αναζητήσεις</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[#2d7a3a] hover:bg-[#e8f5e9] transition-all text-sm text-gray-700 hover:text-[#2d7a3a] group"
            >
              <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2d7a3a]" />
              {search}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
