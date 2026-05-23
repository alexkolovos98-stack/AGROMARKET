import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchManufacturers } from '../api/client';

const ManufacturersSection = () => {
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    fetchManufacturers().then(setManufacturers).catch(() => setManufacturers([]));
  }, []);

  if (manufacturers.length === 0) return null;

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Δημοφιλείς Κατασκευαστές</h2>
          <Link to="/search?q=manufacturers" className="flex items-center gap-1 text-sm font-medium text-[#2d7a3a] hover:text-[#1e5c2a] transition-colors">
            Δες όλους
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4" data-testid="manufacturers-grid">
          {manufacturers.map((m) => (
            <Link
              key={m.id}
              to={`/search?q=${encodeURIComponent(m.name)}`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center justify-center aspect-square group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-[#e8f5e9] transition-colors">
                <span className="text-lg font-bold text-gray-600 group-hover:text-[#2d7a3a]">{m.logo}</span>
              </div>
              <span className="text-xs text-gray-600 text-center font-medium">{m.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturersSection;
