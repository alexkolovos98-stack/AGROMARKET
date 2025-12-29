import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, CreditCard, Truck, Shield } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    "Αγορά μέσω AgroMarket": [
      "Πλεονεκτήματα",
      "Ασφάλεια Αγορών",
      "Πολιτική Επιστροφών",
      "Τρόποι Πληρωμής"
    ],
    "Συνεργάτες": [
      "Πούλα στο AgroMarket",
      "Διαφήμιση",
      "Για Καταστήματα"
    ],
    "Εταιρεία": [
      "Σχετικά με εμάς",
      "Καριέρα",
      "Επικοινωνία"
    ],
    "Νομικά": [
      "Όροι Χρήσης",
      "Απορρήτου",
      "Cookies"
    ]
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-[#2d7a3a]">agro</span>
              <span className="text-2xl font-bold text-[#f5a623]">plaza</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Ο κορυφαίος προορισμός για αγροτικά προϊόντα στην Ελλάδα.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2d7a3a]" />
                <span>Αθήνα, Ελλάδα</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2d7a3a]" />
                <span>210 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2d7a3a]" />
                <span>info@agroplaza.gr</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-[#2d7a3a] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Payment */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm">Ακολούθησέ μας:</span>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2d7a3a] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2d7a3a] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#2d7a3a] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-5 h-5 text-[#f5a623]" />
                <span>Ασφαλείς Πληρωμές</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-5 h-5 text-[#f5a623]" />
                <span>Γρήγορη Αποστολή</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-[#f5a623]" />
                <span>Εγγύηση Ποιότητας</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 AgroMarket. Όλα τα δικαιώματα κατοχυρωμένα.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
