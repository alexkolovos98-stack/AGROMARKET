import React, { useState } from 'react';
import { Upload, FileCode, Link as LinkIcon, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import MerchantLayout from '../components/MerchantLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { uploadXmlFeed, uploadXmlFromUrl } from '../api/client';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<store>
  <created_at>2025-12-15T10:00:00+02:00</created_at>
  <products>
    <product>
      <id>SKU-001</id>
      <name>Σπόροι Ντομάτας Belladonna F1</name>
      <link>https://yourstore.gr/products/sku-001</link>
      <image>https://yourstore.gr/img/sku-001.jpg</image>
      <category>Σπόροι &amp; Φυτά</category>
      <price_with_vat>12.50</price_with_vat>
      <manufacturer>SeedCorp</manufacturer>
      <mpn>SC-TOM-001</mpn>
      <availability>Άμεσα διαθέσιμο</availability>
      <instock>Y</instock>
      <ean>5201234567890</ean>
      <weight>0.05</weight>
    </product>
  </products>
</store>`;

const MerchantXmlFeed = () => {
  const [tab, setTab] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const submitFile = async () => {
    if (!file) return toast.error('Επίλεξε ένα XML αρχείο');
    setSubmitting(true);
    setResult(null);
    try {
      const r = await uploadXmlFeed(file);
      setResult(r);
      toast.success(`Επεξεργάστηκαν ${r.products_created + r.products_updated} προϊόντα`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Σφάλμα αποστολής');
    } finally {
      setSubmitting(false);
    }
  };

  const submitUrl = async () => {
    if (!url.trim()) return toast.error('Δώσε ένα URL');
    setSubmitting(true);
    setResult(null);
    try {
      const r = await uploadXmlFromUrl(url.trim());
      setResult(r);
      toast.success(`Επεξεργάστηκαν ${r.products_created + r.products_updated} προϊόντα`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Σφάλμα αποστολής');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_XML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-feed.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MerchantLayout title="XML Product Feed">
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <FileCode className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Συμβατό με το skroutz XML format</p>
              <p className="text-blue-800">
                Υποστηριζόμενα πεδία: <code className="bg-blue-100 px-1 rounded">id, name, link, image, category, price_with_vat, manufacturer, mpn, availability, instock, ean, weight, color, size</code>.
                Δες την{' '}
                <a href="https://developer.skroutz.gr/el/products/xml_feed/" target="_blank" rel="noopener noreferrer" className="underline">
                  τεκμηρίωση
                </a>.
              </p>
              <button onClick={downloadSample} className="mt-2 inline-flex items-center gap-1 text-blue-700 hover:underline text-xs">
                <Download className="w-3 h-3" />
                Κατέβασε δείγμα XML
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setTab('file')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === 'file' ? 'border-[#2d7a3a] text-[#2d7a3a]' : 'border-transparent text-gray-500'
              }`}
              data-testid="xml-tab-file"
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Από αρχείο
            </button>
            <button
              onClick={() => setTab('url')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === 'url' ? 'border-[#2d7a3a] text-[#2d7a3a]' : 'border-transparent text-gray-500'
              }`}
              data-testid="xml-tab-url"
            >
              <LinkIcon className="w-4 h-4 inline mr-1" />
              Από URL
            </button>
          </div>

          {tab === 'file' ? (
            <div>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#2d7a3a] transition-colors">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {file ? file.name : 'Κάνε κλικ για επιλογή XML αρχείου'}
                </p>
                <p className="text-xs text-gray-400">Μέγιστο μέγεθος: 50MB</p>
                <input
                  type="file"
                  accept=".xml,application/xml,text/xml"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  data-testid="xml-file-input"
                />
              </label>
              <Button
                onClick={submitFile}
                disabled={!file || submitting}
                className="w-full mt-4 bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white h-11"
                data-testid="xml-upload-button"
              >
                {submitting ? 'Επεξεργασία...' : 'Αποστολή & Συγχρονισμός'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourstore.gr/feeds/products.xml"
                className="h-11"
                data-testid="xml-url-input"
              />
              <Button
                onClick={submitUrl}
                disabled={!url.trim() || submitting}
                className="w-full bg-[#2d7a3a] hover:bg-[#1e5c2a] text-white h-11"
                data-testid="xml-url-submit-button"
              >
                {submitting ? 'Λήψη & επεξεργασία...' : 'Λήψη από URL'}
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm p-6" data-testid="xml-result">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Αποτέλεσμα
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Stat label="Νέα προϊόντα" value={result.products_created} color="#2d7a3a" />
              <Stat label="Ενημερωμένα" value={result.products_updated} color="#3498db" />
              <Stat label="Νέες προσφορές" value={result.offers_created} color="#f5a623" />
              <Stat label="Ενημερωμένες" value={result.offers_updated} color="#9b59b6" />
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-sm font-medium text-red-900 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Προειδοποιήσεις ({result.errors.length})
                </p>
                <ul className="text-xs text-red-700 space-y-0.5 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

export default MerchantXmlFeed;
