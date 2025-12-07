import React from 'react';
import { ChevronRight } from 'lucide-react';
import { manufacturers } from '../data/mockData';

const ManufacturersSection = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Δημοφιλείς Κατασκευαστές</h2>
          <a 
            href="#" 
            className="flex items-center gap-1 text-sm font-medium text-[#2d7a3a] hover:text-[#1e5c2a] transition-colors"
          >
            Δες όλους
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Manufacturers Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {manufacturers.map((manufacturer) => (
            <a
              key={manufacturer.id}
              href="#"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center justify-center aspect-square group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-[#e8f5e9] transition-colors">
                <span className="text-lg font-bold text-gray-600 group-hover:text-[#2d7a3a]">
                  {manufacturer.logo}
                </span>
              </div>
              <span className="text-xs text-gray-600 text-center font-medium">
                {manufacturer.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturersSection;
