import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, Phone, Mail, MessageCircle, FileText, Truck, RotateCcw, CreditCard, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HelpPage = () => {
  const helpTopics = [
    { icon: Truck, title: 'Παραγγελίες & Αποστολή', desc: 'Πληροφορίες για την παρακολούθηση και παράδοση' },
    { icon: RotateCcw, title: 'Επιστροφές & Ακυρώσεις', desc: 'Πώς να επιστρέψεις ή ακυρώσεις παραγγελία' },
    { icon: CreditCard, title: 'Πληρωμές', desc: 'Τρόποι πληρωμής και τιμολόγηση' },
    { icon: Shield, title: 'Ασφάλεια & Εγγύηση', desc: 'Προστασία αγοραστή και εγγυήσεις' },
  ];

  const faqs = [
    { q: 'Πώς μπορώ να παρακολουθήσω την παραγγελία μου;', a: 'Μπορείς να παρακολουθήσεις την παραγγελία σου από τον λογαριασμό σου στην ενότητα "Οι παραγγελίες μου".' },
    { q: 'Πόσο κοστίζουν τα μεταφορικά;', a: 'Τα μεταφορικά είναι δωρεάν για αγορές άνω των 50€. Για μικρότερες παραγγελίες το κόστος είναι 5.90€.' },
    { q: 'Πώς μπορώ να επιστρέψω ένα προϊόν;', a: 'Έχεις 14 ημέρες από την παραλαβή για να επιστρέψεις οποιοδήποτε προϊόν χωρίς αιτιολογία.' },
    { q: 'Ποιους τρόπους πληρωμής δέχεστε;', a: 'Δεχόμαστε πιστωτικές/χρεωστικές κάρτες, PayPal, τραπεζική κατάθεση και αντικαταβολή.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Βοήθεια</span>
        </nav>

        {/* Header */}
        <div className="bg-[#2d7a3a] rounded-2xl p-8 mb-8 text-white text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Πώς μπορούμε να σε βοηθήσουμε;</h1>
          <p className="text-white/80">Βρες απαντήσεις στις πιο συχνές ερωτήσεις</p>
        </div>

        {/* Help Topics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {helpTopics.map((topic, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <topic.icon className="w-8 h-8 text-[#2d7a3a] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
              <p className="text-sm text-gray-500">{topic.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Συχνές Ερωτήσεις</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Επικοινωνία</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-6 h-6 text-[#2d7a3a]" />
              <div>
                <p className="font-medium">210 123 4567</p>
                <p className="text-sm text-gray-500">Δευ-Παρ 9:00-18:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-6 h-6 text-[#2d7a3a]" />
              <div>
                <p className="font-medium">support@agroplaza.gr</p>
                <p className="text-sm text-gray-500">Απάντηση σε 24ώρες</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <MessageCircle className="w-6 h-6 text-[#2d7a3a]" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-gray-500">Άμεση υποστήριξη</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
