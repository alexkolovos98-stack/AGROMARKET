import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight, Star, ExternalLink, Store, Truck, Shield, TrendingDown, Check, Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchProductDetail, fetchProducts, trackImpression, trackClick } from '../api/client';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const pid = parseInt(productId);
    fetchProductDetail(pid)
      .then((p) => {
        setProduct(p);
        // track impression for each offer
        (p.offers || []).forEach((o) => trackImpression(p.id, o.shopId));
        // load related
        return fetchProducts({ category_id: p.categoryId, limit: 8 });
      })
      .then((rel) => setRelated(rel.filter(x => x.id !== parseInt(productId)).slice(0, 4)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleOfferClick = async (e, offer) => {
    e.preventDefault();
    const res = await trackClick(product.id, offer.shopId, offer.offerId);
    const url = res?.url || offer.url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl h-96 animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-500 mb-4">Το προϊόν δεν βρέθηκε.</p>
          <Link to="/" className="text-[#2d7a3a] underline">Επιστροφή στην αρχική</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedOffers[0]?.price || 0;
  const highestPrice = sortedOffers[sortedOffers.length - 1]?.price || 0;
  const savings = highestPrice - lowestPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#2d7a3a]">Αρχική</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.categoryId}`} className="hover:text-[#2d7a3a]">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[300px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3" data-testid="product-title">{product.name}</h1>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-[#f5a623] fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} αξιολογήσεις)</span>
                  </div>

                  <div className="bg-[#e8f5e9] rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-[#2d7a3a]" />
                      <span className="text-sm font-medium text-[#2d7a3a]">Καλύτερη τιμή</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-[#2d7a3a]">
                        {lowestPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                      </span>
                      {savings > 0 && (
                        <span className="text-sm text-gray-500 mb-1">
                          (εξοικονόμηση έως {savings.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €)
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Σύγκριση από {product.offers.length} καταστήματα</p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                  {Object.keys(product.specs).length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-900 mb-2">Χαρακτηριστικά</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(product.specs).map(([k, v]) => (
                          <div key={k} className="text-sm">
                            <span className="text-gray-500">{k}:</span>
                            <span className="text-gray-900 ml-1">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24" data-testid="price-comparison">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#2d7a3a]" />
                Σύγκριση Τιμών
                <Badge className="bg-[#2d7a3a] text-white">{product.offers.length}</Badge>
              </h2>

              <div className="space-y-3">
                {sortedOffers.map((offer, idx) => (
                  <a
                    key={offer.offerId}
                    href={offer.url}
                    onClick={(e) => handleOfferClick(e, offer)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      idx === 0 ? 'border-[#2d7a3a] bg-[#f0fdf4]' : 'border-gray-200 hover:border-[#2d7a3a]'
                    }`}
                    data-testid={`offer-card-${offer.shopId}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2d7a3a] to-[#4ade80] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{offer.shop?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{offer.shop?.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#f5a623] fill-current" />
                            <span className="text-xs text-gray-500">{offer.shop?.rating}</span>
                          </div>
                        </div>
                      </div>
                      {idx === 0 && <Badge className="bg-[#2d7a3a] text-white text-xs">Καλύτερη τιμή</Badge>}
                    </div>

                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-xl font-bold text-gray-900">
                        {offer.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                      </span>
                      {offer.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {offer.originalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })} €
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className={`flex items-center gap-1 ${offer.availability === 'Διαθέσιμο' ? 'text-green-600' : 'text-orange-500'}`}>
                        {offer.availability === 'Διαθέσιμο' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {offer.availability}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {offer.shipping}
                      </span>
                    </div>

                    <Button className="w-full bg-[#f5a623] hover:bg-[#e09612] text-white" data-testid={`go-to-shop-${offer.shopId}`}>
                      Μετάβαση στο κατάστημα
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Η αγορά πραγματοποιείται απευθείας από το κατάστημα. Το agroplaza δεν επεξεργάζεται παραγγελίες ή πληρωμές.
                </p>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Παρόμοια Προϊόντα</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
