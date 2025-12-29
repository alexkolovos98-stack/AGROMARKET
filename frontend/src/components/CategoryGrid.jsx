import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, FlaskConical, Droplets, Wheat, Home, Bug, Shovel } from 'lucide-react';
import { categories } from '../data/mockData';

const iconMap = {
  Sprout: Sprout,
  FlaskConical: FlaskConical,
  Droplets: Droplets,
  Wheat: Wheat,
  Home: Home,
  Bug: Bug,
  Shovel: Shovel
};

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Κατηγορίες Προϊόντων</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{category.name}</h3>
                      <p className="text-xs text-white/70">{category.count.toLocaleString()} προϊόντα</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
