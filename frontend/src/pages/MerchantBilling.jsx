import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Star, X, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import MerchantLayout from '../components/MerchantLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { fetchPlans, fetchMySubscription, checkoutPlan, cancelSubscription } from '../api/client';

const MerchantBilling = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchPlans(), fetchMySubscription().catch(() => null)])
      .then(([p, s]) => { setPlans(p); setSubscription(s); })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // Simulate processing delay for nicer UX
      await new Promise(r => setTimeout(r, 1200));
      await checkoutPlan(selectedPlan.plan_id, card.name);
      toast.success(`Ενεργοποιήθηκε το πλάνο ${selectedPlan.name}!`);
      setSelectedPlan(null);
      setCard({ number: '', expiry: '', cvv: '', name: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Σφάλμα πληρωμής');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Σίγουρα θέλεις να ακυρώσεις τη συνδρομή σου;')) return;
    try {
      await cancelSubscription();
      toast.success('Η συνδρομή σου ακυρώθηκε');
      loadData();
    } catch {
      toast.error('Σφάλμα');
    }
  };

  if (loading) {
    return <MerchantLayout title="Συνδρομή"><div className="bg-white rounded-2xl p-10 text-center text-gray-400">Φόρτωση...</div></MerchantLayout>;
  }

  return (
    <MerchantLayout title="Συνδρομή & Χρέωση">
      {/* Current subscription */}
      {subscription && subscription.status === 'active' && (
        <div className="bg-gradient-to-r from-[#2d7a3a] to-[#4ade80] rounded-2xl p-6 text-white mb-6" data-testid="active-subscription">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ενεργό πλάνο</p>
              <p className="text-2xl font-bold capitalize">{subscription.plan_id}</p>
              <p className="text-sm opacity-90 mt-1">
                Λήγει: {new Date(subscription.expires_at).toLocaleDateString('el-GR')}
              </p>
            </div>
            <Button onClick={handleCancel} variant="outline" className="border-white text-white hover:bg-white/10" data-testid="cancel-subscription-button">
              Ακύρωση
            </Button>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {plans.map((plan) => {
          const isActive = subscription?.plan_id === plan.plan_id && subscription?.status === 'active';
          const isPro = plan.plan_id === 'pro';
          return (
            <div
              key={plan.plan_id}
              className={`bg-white rounded-2xl shadow-sm p-6 border-2 relative ${
                isPro ? 'border-[#2d7a3a] shadow-lg' : 'border-gray-100'
              }`}
              data-testid={`plan-card-${plan.plan_id}`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5a623] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Δημοφιλές
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price_monthly}€</span>
                <span className="text-sm text-gray-500">/μήνα</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2d7a3a] mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setSelectedPlan(plan)}
                disabled={isActive}
                className={`w-full ${isPro ? 'bg-[#2d7a3a] hover:bg-[#1e5c2a]' : 'bg-gray-900 hover:bg-gray-700'} text-white h-11`}
                data-testid={`select-plan-${plan.plan_id}`}
              >
                {isActive ? 'Ενεργό' : 'Επιλογή'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Checkout modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="checkout-modal">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Ολοκλήρωση συνδρομής</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-gray-600" data-testid="close-modal-button">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="p-6 space-y-4">
              <div className="bg-[#f0fdf4] border border-[#2d7a3a]/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Επιλεγμένο πλάνο</p>
                    <p className="font-bold text-gray-900">{selectedPlan.name}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#2d7a3a]">{selectedPlan.price_monthly}€<span className="text-xs text-gray-500">/μήνα</span></p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Όνομα κατόχου</label>
                <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="ONOMA EPΩNYMO" required className="h-11" data-testid="card-name-input" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Αριθμός κάρτας</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <Input value={card.number}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = v.match(/.{1,4}/g)?.join(' ') || '';
                      setCard({ ...card, number: formatted });
                    }}
                    placeholder="4242 4242 4242 4242" required maxLength={19}
                    className="pl-10 h-11" data-testid="card-number-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Λήξη</label>
                  <Input value={card.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCard({ ...card, expiry: v });
                    }}
                    placeholder="MM/YY" required maxLength={5} className="h-11" data-testid="card-expiry-input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                  <Input value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123" required maxLength={4} className="h-11" data-testid="card-cvv-input" />
                </div>
              </div>

              <div className="text-xs text-gray-500 flex items-start gap-2 pt-2">
                <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Demo template πληρωμής. Δεν χρεώνεται πραγματικά καμία κάρτα.</span>
              </div>

              <Button type="submit" disabled={processing}
                className="w-full bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white h-11"
                data-testid="pay-button">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Επεξεργασία...</> : `Πληρωμή ${selectedPlan.price_monthly}€`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
};

export default MerchantBilling;
