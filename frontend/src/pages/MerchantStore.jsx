import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon, MapPin, Link as LinkIcon, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';
import MerchantLayout from '../components/MerchantLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { fetchMerchantStore, saveMerchantStore } from '../api/client';

const MerchantStore = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', location: '', url: '', description: '', logo: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    fetchMerchantStore()
      .then((s) => {
        if (s) {
          setForm({
            name: s.name || '', location: s.location || '', url: s.url || '',
            description: s.description || '', logo: s.logo || '',
          });
          setIsNew(false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMerchantStore(form);
      toast.success(isNew ? 'Κατάστημα δημιουργήθηκε' : 'Κατάστημα ενημερώθηκε');
      navigate('/merchant/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Σφάλμα αποθήκευσης');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MerchantLayout title={isNew ? 'Δημιουργία καταστήματος' : 'Επεξεργασία καταστήματος'}>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5" data-testid="store-form">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Όνομα καταστήματος</label>
            <div className="relative">
              <StoreIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} required minLength={2}
                placeholder="π.χ. ΑγροΣυν Α.Ε." className="pl-10 h-11" data-testid="store-name-input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Τοποθεσία</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <Input value={form.location} onChange={(e) => update('location', e.target.value)} required
                placeholder="π.χ. Θεσσαλονίκη" className="pl-10 h-11" data-testid="store-location-input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">URL ιστοσελίδας</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <Input type="url" value={form.url} onChange={(e) => update('url', e.target.value)} required
                placeholder="https://yourstore.gr" className="pl-10 h-11" data-testid="store-url-input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Περιγραφή (προαιρετικό)</label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                rows={3} placeholder="Σύντομη περιγραφή της επιχείρησής σου"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2d7a3a] focus:border-transparent"
                data-testid="store-description-input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Logo URL (προαιρετικό)</label>
            <Input value={form.logo} onChange={(e) => update('logo', e.target.value)}
              placeholder="https://..." className="h-11" data-testid="store-logo-input" />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={saving || loading}
              className="bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white h-11 px-6"
              data-testid="store-save-button">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Αποθήκευση...' : (isNew ? 'Δημιουργία' : 'Αποθήκευση')}
            </Button>
          </div>
        </form>
      </div>
    </MerchantLayout>
  );
};

export default MerchantStore;
