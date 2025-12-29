import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Store, TrendingUp, ShieldCheck, Truck, Users, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SellPage = () => {
  const benefits = [
    { icon: Users, title: 'Χιλιάδες Πελάτες', desc: 'Πρόσβαση σε χιλιάδες αγρότες σε όλη την Ελλάδα' },
    { icon: TrendingUp, title: 'Αύξηση Πωλήσεων', desc: 'Αύξησε τις πωλήσεις σου με την προβολή στο agroplaza' },
    { icon: ShieldCheck, title: 'Ασφαλείς Συναλλαγές', desc: 'Εγγυημένες και ασφαλείς πληρωμές' },
    { icon: Truck, title: 'Υποστήριξη Αποστολών', desc: 'Συνεργασία με τις καλύτερες μεταφορικές' },
  ];

  const steps = [
    { num: '1', title: 'Εγγραφή', desc: 'Δημιούργησε τον λογαριασμό καταστήματός σου δωρεάν' },
    { num: '2', title: 'Ανέβασε Προϊόντα', desc: 'Πρόσθεσε τα προϊόντα σου με φωτογραφίες και τιμές' },
    { num: '3', title: 'Λάβε Παραγγελίες', desc: 'Ξεκίνα να λαμβάνεις παραγγελίες από πελάτες' },
    { num: '4', title: 'Ανάπτυξη', desc: 'Παρακολούθησε τα στατιστικά και αναπτύξου' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1e5c2a] to-[#2d7a3a] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <Store className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Πούλα στο agroplaza</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Απόκτησε πρόσβαση σε χιλιάδες αγρότες και αύξησε τις πωλήσεις σου
            </p>
            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-white px-8 py-3 text-lg">
              Ξεκίνα Δωρεάν
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Γιατί να πουλήσεις στο agroplaza;</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#e8f5e9] flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-[#2d7a3a]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Πώς λειτουργεί;</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#2d7a3a] text-white flex items-center justify-center text-xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Απλή Τιμολόγηση</h2>
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border-2 border-[#2d7a3a]">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Προμήθεια ανά πώληση</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-bold text-[#2d7a3a]">5</span>
                <span className="text-2xl text-[#2d7a3a]">%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Χωρίς πάγια ή κρυφές χρεώσεις</p>
            </div>
            <ul className="space-y-3 mb-6">
              {['Απεριόριστα προϊόντα', 'Στατιστικά πωλήσεων', 'Υποστήριξη 24/7', 'Εργαλεία προώθησης'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#2d7a3a]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#2d7a3a] hover:bg-[#1e5c2a]">
              Εγγραφή Καταστήματος
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#f5a623] py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Έτοιμος να ξεκινήσεις;</h2>
            <p className="text-white/90 mb-6">Εγγράψου δωρεάν σήμερα και ξεκίνα να πουλάς</p>
            <Link to="/login">
              <Button className="bg-white text-[#f5a623] hover:bg-gray-100 px-8">
                Δημιούργησε Λογαριασμό
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellPage;
