import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { StockStatusBadge } from '../components/Badges';
import { AddMedicineModal } from '../components/AddMedicineModal';
import {
  Plus, Search, SlidersHorizontal, Package, MoreHorizontal
} from 'lucide-react';
import { formatDate, formatCurrency } from '../utils';
import type { StockStatus, MedicineCategory } from '../types';

const ALL_CATEGORIES: MedicineCategory[] = [
  'Antibiotic', 'Analgesic', 'Antihistamine', 'Antacid', 'Antidiabetic',
  'Antihypertensive', 'Antipyretic', 'Antiviral', 'Vitamin', 'Cardiovascular', 'Other',
];

export default function InventoryPage() {
  const { medicines } = useAppState();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MedicineCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'All'>('All');

  const filtered = useMemo(() => {
    return medicines.filter(med => {
      const q = searchQ.toLowerCase();
      const matchSearch = !q ||
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.batchNumber.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || med.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || med.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [medicines, searchQ, categoryFilter, statusFilter]);

  const statCounts = useMemo(() => ({
    total: medicines.length,
    inStock: medicines.filter(m => m.status === 'in_stock').length,
    lowStock: medicines.filter(m => m.status === 'low_stock').length,
    outOfStock: medicines.filter(m => m.status === 'out_of_stock').length,
    expiringSoon: medicines.filter(m => m.status === 'expiring_soon').length,
  }), [medicines]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage medicines, stock levels, batches and expiry dates.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
          <Plus size={17} /> Add Medicine
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Total', value: statCounts.total, color: '#0F9D6D' },
          { label: 'In Stock', value: statCounts.inStock, color: '#16A34A' },
          { label: 'Low Stock', value: statCounts.lowStock, color: '#D97706' },
          { label: 'Out of Stock', value: statCounts.outOfStock, color: '#DC2626' },
          { label: 'Expiring Soon', value: statCounts.expiringSoon, color: '#2563EB' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.125rem', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="search"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search medicine by name, generic name or batch..."
              className="input-base"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: '160px' }}>
            <SlidersHorizontal size={15} color="#5B6675" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as MedicineCategory | 'All')}
              className="input-base"
              style={{ flex: 1 }}
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StockStatus | 'All')}
            className="input-base"
            style={{ minWidth: '140px' }}
          >
            <option value="All">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Package size={40} color="#E4E7EB" style={{ marginBottom: '1rem' }} />
            <p style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#1B2430' }}>No medicines found</p>
            <p style={{ margin: '0 0 1.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus size={16} /> Add Medicine
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Generic Name</th>
                  <th>Strength</th>
                  <th>Form</th>
                  <th>Batch</th>
                  <th>Current Stock</th>
                  <th>Min. Stock</th>
                  <th>Unit Price</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(med => (
                  <tr key={med.id}>
                    <td>
                      <p style={{ margin: 0, fontWeight: 600, color: '#1B2430', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{med.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{med.category}</p>
                    </td>
                    <td style={{ color: '#5B6675', fontSize: '0.875rem' }}>{med.genericName}</td>
                    <td style={{ color: '#5B6675', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{med.strength}</td>
                    <td style={{ color: '#5B6675', fontSize: '0.875rem' }}>{med.dosageForm}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#9CA3AF' }}>{med.batchNumber}</td>
                    <td>
                      <span style={{
                        fontWeight: 700, fontSize: '0.9375rem',
                        color: med.currentStock === 0 ? '#DC2626' : med.currentStock <= med.minimumStock ? '#D97706' : '#1B2430',
                      }}>{med.currentStock}</span>
                    </td>
                    <td style={{ color: '#5B6675' }}>{med.minimumStock}</td>
                    <td style={{ color: '#5B6675', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{formatCurrency(med.unitPrice)}</td>
                    <td style={{ color: '#5B6675', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{formatDate(med.expiryDate)}</td>
                    <td><StockStatusBadge status={med.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                        {med.status !== 'in_stock' && (
                          <button
                            onClick={() => navigate(`/procure?q=${encodeURIComponent(med.genericName)}`)}
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.625rem', whiteSpace: 'nowrap' }}
                          >
                            Find Medicine
                          </button>
                        )}
                        <button className="btn-ghost" style={{ padding: '0.375rem' }} title="More actions">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #F1F5F9', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              Showing {filtered.length} of {medicines.length} medicines
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddMedicineModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
