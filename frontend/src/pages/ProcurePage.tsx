import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProcurementService } from '../services';
import { RequestMedicineModal } from '../components/RequestMedicineModal';
import { PlaceOrderModal } from '../components/PlaceOrderModal';
import type { ProcurementResult } from '../types';
import {
  Search, Building2, Truck, MapPin, Star, Clock,
  Package, SlidersHorizontal
} from 'lucide-react';
import { formatCurrency } from '../utils';

type SourceFilter = 'all' | 'pharmacy' | 'supplier';
type AvailFilter = 'all' | 'high' | 'low';
type DistFilter = 'all' | '5' | '10';
type SortKey = 'availability' | 'distance' | 'price';

export default function ProcurePage() {
  const [searchParams] = useSearchParams();
  const preQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(preQuery);
  const [searched, setSearched] = useState(preQuery);
  const [results, setResults] = useState<ProcurementResult[]>([]);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [availFilter, setAvailFilter] = useState<AvailFilter>('all');
  const [distFilter, setDistFilter] = useState<DistFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('availability');
  const [selectedResult, setSelectedResult] = useState<ProcurementResult | null>(null);
  const [modalType, setModalType] = useState<'request' | 'order' | null>(null);

  const doSearch = (q: string) => {
    setSearched(q);
    setResults(ProcurementService.search(q));
  };

  useEffect(() => {
    if (preQuery) doSearch(preQuery);
  }, [preQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) doSearch(query.trim());
  };

  const filtered = useMemo(() => {
    let r = results;
    if (sourceFilter !== 'all') r = r.filter(x => x.sourceType === sourceFilter);
    if (availFilter === 'high') r = r.filter(x => x.availableQty >= 50);
    if (availFilter === 'low') r = r.filter(x => x.availableQty > 0 && x.availableQty < 50);
    if (distFilter !== 'all') r = r.filter(x => x.sourceType === 'supplier' || (x.distance ?? 999) <= Number(distFilter));
    r = [...r].sort((a, b) => {
      if (sortKey === 'price') return a.unitPrice - b.unitPrice;
      if (sortKey === 'distance') return (a.distance ?? 999) - (b.distance ?? 999);
      return b.availableQty - a.availableQty;
    });
    return r;
  }, [results, sourceFilter, availFilter, distFilter, sortKey]);

  const pharmacyCount = filtered.filter(r => r.sourceType === 'pharmacy').length;
  const supplierCount = filtered.filter(r => r.sourceType === 'supplier').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Procure Medicine</h1>
        <p className="page-subtitle">Find available medicines from connected pharmacies and suppliers.</p>
      </div>

      {/* Search bar */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search medicine by name, generic name or composition..."
                className="input-base"
                style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.9375rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', height: '48px', fontSize: '0.9375rem' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Filters sidebar */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <SlidersHorizontal size={16} color="#5B6675" />
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1B2430' }}>Filters</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#5B6675', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</p>
                  {([['all', 'All Sources'], ['pharmacy', 'Pharmacies'], ['supplier', 'Suppliers']] as const).map(([val, label]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', cursor: 'pointer' }}>
                      <input type="radio" name="source" value={val} checked={sourceFilter === val} onChange={() => setSourceFilter(val)} style={{ accentColor: '#0F9D6D' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#5B6675', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</p>
                  {([['all', 'All'], ['high', 'High (50+ units)'], ['low', 'Low (<50 units)']] as const).map(([val, label]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', cursor: 'pointer' }}>
                      <input type="radio" name="avail" value={val} checked={availFilter === val} onChange={() => setAvailFilter(val)} style={{ accentColor: '#0F9D6D' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#5B6675', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distance</p>
                  {([['all', 'All'], ['5', 'Within 5 km'], ['10', 'Within 10 km']] as const).map(([val, label]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', cursor: 'pointer' }}>
                      <input type="radio" name="dist" value={val} checked={distFilter === val} onChange={() => setDistFilter(val)} style={{ accentColor: '#0F9D6D' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#5B6675', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</p>
                  {([['availability', 'Availability'], ['distance', 'Distance'], ['price', 'Price']] as const).map(([val, label]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', cursor: 'pointer' }}>
                      <input type="radio" name="sort" value={val} checked={sortKey === val} onChange={() => setSortKey(val)} style={{ accentColor: '#0F9D6D' }} />
                      <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Result header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700, color: '#1B2430' }}>
                  Results for "{searched}"
                </h2>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#5B6675' }}>
                  {pharmacyCount} {pharmacyCount === 1 ? 'pharmacy' : 'pharmacies'} · {supplierCount} {supplierCount === 1 ? 'supplier' : 'suppliers'}
                </p>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Package size={40} color="#E4E7EB" style={{ marginBottom: '1rem' }} />
                <p style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#1B2430' }}>No results found</p>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>Try a different medicine name or adjust your filters</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {filtered.map((result, idx) => (
                  result.sourceType === 'pharmacy' ? (
                    <PharmacyCard key={idx} result={result} onRequest={() => { setSelectedResult(result); setModalType('request'); }} />
                  ) : (
                    <SupplierCard key={idx} result={result} onOrder={() => { setSelectedResult(result); setModalType('order'); }} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!searched && (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#E6F7F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Search size={28} color="#0F9D6D" />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 700, color: '#1B2430' }}>Search for a Medicine</h3>
          <p style={{ margin: 0, fontSize: '0.9375rem', color: '#5B6675', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Enter a medicine name, generic name, or composition to find availability across connected pharmacies and suppliers.
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedResult && modalType === 'request' && (
        <RequestMedicineModal result={selectedResult} onClose={() => { setSelectedResult(null); setModalType(null); }} />
      )}
      {selectedResult && modalType === 'order' && (
        <PlaceOrderModal result={selectedResult} onClose={() => { setSelectedResult(null); setModalType(null); }} />
      )}
    </div>
  );
}

// ─── Pharmacy Result Card ─────────────────────────────────────────────────────
function PharmacyCard({ result, onRequest }: { result: ProcurementResult; onRequest: () => void }) {
  return (
    <div className="card card-hover" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '9999px', padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600, color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building2 size={11} /> Pharmacy
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5B6675' }}>{result.rating}</span>
            </div>
          </div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>{result.medicineName}</h3>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#5B6675' }}>{result.genericName} · {result.dosageForm} · {result.strength}</p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{result.sourceName}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#16A34A' }}>{result.availableQty} units</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{formatCurrency(result.unitPrice)}</p>
            </div>
            {result.distance !== undefined && (
              <div>
                <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distance</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={13} color="#5B6675" />
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#5B6675' }}>{result.distance} km</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <button onClick={onRequest} className="btn-primary" style={{ flexShrink: 0, padding: '0.625rem 1.25rem' }}>
          Request
        </button>
      </div>
    </div>
  );
}

// ─── Supplier Result Card ─────────────────────────────────────────────────────
function SupplierCard({ result, onOrder }: { result: ProcurementResult; onOrder: () => void }) {
  return (
    <div className="card card-hover" style={{ padding: '1.25rem 1.5rem', borderLeft: '3px solid #F59E0B' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '9999px', padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600, color: '#9A3412', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Truck size={11} /> Supplier
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5B6675' }}>{result.rating}</span>
            </div>
          </div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>{result.medicineName}</h3>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#5B6675' }}>{result.genericName} · {result.dosageForm} · {result.strength}</p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{result.sourceName}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#16A34A' }}>{result.availableQty} units</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</p>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{formatCurrency(result.unitPrice)}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Delivery</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} color="#5B6675" />
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#5B6675' }}>{result.estimatedDelivery}</p>
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min. Order</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#5B6675' }}>{result.minimumOrderQuantity} units</p>
            </div>
          </div>
        </div>
        <button onClick={onOrder} style={{
          background: '#F59E0B', color: 'white', border: 'none',
          padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
          fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          flexShrink: 0, transition: 'background 0.15s',
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#D97706'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F59E0B'}
        >
          Order
        </button>
      </div>
    </div>
  );
}
