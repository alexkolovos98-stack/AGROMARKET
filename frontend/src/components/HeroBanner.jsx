import React from 'react';
import { Button } from './ui/button';
import { Truck, Shield, HeadphonesIcon, CreditCard } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#1e5c2a] to-[#2d7a3a] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grain)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ο κορυφαίος προορισμός για
              <span className="text-[#f5a623]"> αγροτικά προϊόντα</span>
            </h1>
            <p className="text-lg text-white/80 mb-6 max-w-xl">
              Σύγκρινε τιμές από εκατοντάδες αγροτικά καταστήματα και βρες τις καλύτερες προσφορές σε σπόρους, μηχανήματα και εφόδια.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button className="bg-[#f5a623] hover:bg-[#e09612] text-white px-6 py-3 text-lg">
                Εξερεύνησε Προϊόντα
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-lg">
                Πούλα στο AgroMarket
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1614977645540-7abd88ba8e56?w=600"
                alt="Agricultural machinery"
                className="w-full rounded-2xl shadow-2xl"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#2d7a3a]">50K+</span>
                  <p className="text-xs text-gray-600">Προϊόντα</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#f5a623]">500+</span>
                  <p className="text-xs text-gray-600">Καταστήματα</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: 'Δωρεάν Μεταφορικά από 50€' },
              { icon: Shield, text: 'Εγγύηση Ασφάλειας' },
              { icon: HeadphonesIcon, text: 'Υποστήριξη 24/7' },
              { icon: CreditCard, text: 'Ασφαλείς Πληρωμές' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-white">
                <feature.icon className="w-5 h-5 text-[#f5a623]" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
