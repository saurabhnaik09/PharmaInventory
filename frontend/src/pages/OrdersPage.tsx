import { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { OrderStatusBadge, SourceTypeBadge } from '../components/Badges';
import { ClipboardList, Building2, Truck } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils';
import type { OrderStatus } from '../types';

type Tab = 'all' | 'pharmacy' | 'supplier';

export default function OrdersPage() {
  const { orders } = useAppState();
  const [tab, setTab] = useState<Tab>('all');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = useMemo(() => {
    let o = orders;
    if (tab === 'pharmacy') o = o.filter(x => x.sourceType === 'pharmacy');
    if (tab === 'supplier') o = o.filter(x => x.sourceType === 'supplier');
    if (statusFilter !== 'all') o = o.filter(x => x.status === statusFilter);
    return o;
  }, [orders, tab, statusFilter]);

  const tabCounts = {
    all: orders.length,
    pharmacy: orders.filter(o => o.sourceType === 'pharmacy').length,
    supplier: orders.filter(o => o.sourceType === 'supplier').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Procurement Orders</h1>
        <p className="page-subtitle">Track all medicine requests and supplier orders.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {([
          ['pending', 'Pending', '#F1F5F9', '#475569'],
          ['accepted', 'Accepted', '#DBEAFE', '#1D4ED8'],
          ['processing', 'Processing', '#FEF3C7', '#B45309'],
          ['dispatched', 'Dispatched', '#F3E8FF', '#7E22CE'],
          ['completed', 'Completed', '#DCFCE7', '#15803D'],
          ['rejected', 'Rejected', '#FEE2E2', '#B91C1C'],
        ] as const).map(([status, label, bg, color]) => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <button key={status} onClick={() => setStatusFilter(s => s === status ? 'all' : status)}
              style={{ background: statusFilter === status ? bg : 'white', border: `1px solid ${statusFilter === status ? color + '44' : '#E4E7EB'}`, borderRadius: '0.75rem', padding: '0.875rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
              <p style={{ margin: '0 0 0.125rem', fontSize: '1.375rem', fontWeight: 800, color }}>{count}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#5B6675' }}>{label}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0 }}>
        {/* Tab header */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E4E7EB', padding: '0 1.25rem', gap: '0' }}>
          {([
            ['all', 'All Orders', tabCounts.all],
            ['pharmacy', 'Pharmacy Requests', tabCounts.pharmacy],
            ['supplier', 'Supplier Orders', tabCounts.supplier],
          ] as const).map(([t, label, count]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.875rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              color: tab === t ? '#0F9D6D' : '#5B6675',
              borderBottom: tab === t ? '2px solid #0F9D6D' : '2px solid transparent',
              marginBottom: '-1px',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              transition: 'color 0.15s',
            }}>
              {label}
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                background: tab === t ? '#E6F7F1' : '#F1F5F9',
                color: tab === t ? '#0F9D6D' : '#5B6675',
                padding: '0.1rem 0.5rem', borderRadius: '9999px',
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <ClipboardList size={40} color="#E4E7EB" style={{ marginBottom: '1rem' }} />
            <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600, color: '#1B2430' }}>No orders found</p>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>Procurement orders will appear here</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Medicine</th>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 700, color: '#0F9D6D' }}>
                        {order.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1B2430', fontSize: '0.875rem' }}>{order.medicine}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{order.genericName} · {order.strength}</p>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        {order.sourceType === 'pharmacy' ? <Building2 size={14} color="#0F9D6D" /> : <Truck size={14} color="#D97706" />}
                        {order.source}
                      </div>
                    </td>
                    <td><SourceTypeBadge type={order.sourceType} /></td>
                    <td style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1B2430' }}>{order.quantity}</td>
                    <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                      {order.totalAmount ? formatCurrency(order.totalAmount) : '—'}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{formatDate(order.date)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #F1F5F9', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
