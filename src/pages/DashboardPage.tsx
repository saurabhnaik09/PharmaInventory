
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { StockStatusBadge, OrderStatusBadge } from '../components/Badges';
import {
  Package, AlertTriangle, Clock, ClipboardList,
  TrendingDown, ArrowRight, Sun, Search
} from 'lucide-react';
import { formatDate } from '../utils';

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

export default function DashboardPage() {
  const { medicines, orders } = useAppState();
  const navigate = useNavigate();

  const lowStock = medicines.filter(m => m.status === 'low_stock');
  const outOfStock = medicines.filter(m => m.status === 'out_of_stock');
  const expiringSoon = medicines.filter(m => m.status === 'expiring_soon');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const kpiCards = [
    { label: 'Total Medicines', value: medicines.length.toLocaleString(), icon: Package, color: '#0F9D6D', bg: '#E6F7F1', border: '#B7DFCE', onClick: () => navigate('/inventory') },
    { label: 'Low Stock', value: lowStock.length, icon: TrendingDown, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', onClick: () => navigate('/alerts') },
    { label: 'Expiring Soon', value: expiringSoon.length, icon: Clock, color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', onClick: () => navigate('/alerts') },
    { label: 'Pending Orders', value: pendingOrders.length, icon: ClipboardList, color: '#7C3AED', bg: '#F3E8FF', border: '#DDD6FE', onClick: () => navigate('/orders') },
  ];

  const recentMeds = medicines.slice(0, 7);
  const criticalAlerts = [...outOfStock, ...lowStock].slice(0, 5);
  const expiryWatch = expiringSoon.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Greeting */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Sun size={20} color="#D97706" />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1B2430', letterSpacing: '-0.02em' }}>
            {greeting}, ABC Pharmacy 👋
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: '#5B6675' }}>
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {kpiCards.map(card => (
          <button
            key={card.label}
            onClick={card.onClick}
            style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: '0.875rem', padding: '1.25rem',
              textAlign: 'left', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={18} color={card.color} strokeWidth={2} />
              </div>
              <ArrowRight size={16} color={card.color} style={{ opacity: 0.6 }} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '2rem', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: card.color, opacity: 0.8 }}>{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Inventory Overview Table */}
        <div className="card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="section-title">Inventory Overview</h2>
            <button onClick={() => navigate('/inventory')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-scroll">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Stock</th>
                  <th>Min. Stock</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentMeds.map(med => (
                  <tr key={med.id}>
                    <td>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1B2430', fontSize: '0.875rem' }}>{med.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{med.genericName}</p>
                      </div>
                    </td>
                    <td style={{ color: '#5B6675' }}>{med.category}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#5B6675' }}>{med.batchNumber}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: med.currentStock === 0 ? '#DC2626' : med.currentStock <= med.minimumStock ? '#D97706' : '#1B2430' }}>
                        {med.currentStock}
                      </span>
                    </td>
                    <td style={{ color: '#5B6675' }}>{med.minimumStock}</td>
                    <td style={{ color: '#5B6675', fontSize: '0.8125rem' }}>{formatDate(med.expiryDate)}</td>
                    <td><StockStatusBadge status={med.status} /></td>
                    <td>
                      {med.status !== 'in_stock' && (
                        <button
                          onClick={() => navigate(`/procure?q=${encodeURIComponent(med.genericName)}`)}
                          className="btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.625rem', gap: '0.25rem' }}
                        >
                          <Search size={12} /> Find
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom grid: Low Stock + Expiry */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Low Stock */}
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#D97706" />
                <h2 className="section-title">Low Stock Alerts</h2>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 600, background: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                {criticalAlerts.length} items
              </span>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {criticalAlerts.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>No low stock alerts 🎉</p>
                </div>
              ) : criticalAlerts.map(med => (
                <div key={med.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1.5rem', borderBottom: '1px solid #F8FAFC',
                }}>
                  <div>
                    <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{med.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {med.currentStock} / {med.minimumStock} min
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <StockStatusBadge status={med.status} />
                    <button
                      onClick={() => navigate(`/procure?q=${encodeURIComponent(med.genericName)}`)}
                      style={{
                        background: 'none', border: '1px solid #E4E7EB', borderRadius: '6px',
                        padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer',
                        color: '#0F9D6D', fontWeight: 600, whiteSpace: 'nowrap',
                        transition: 'background 0.15s',
                      }}
                    >
                      Find
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Monitoring */}
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#2563EB" />
                <h2 className="section-title">Expiry Monitoring</h2>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, background: '#DBEAFE', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                {expiryWatch.length} items
              </span>
            </div>
            {expiryWatch.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>No medicines expiring soon 🎉</p>
              </div>
            ) : (
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Expiry</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expiryWatch.map(med => (
                    <tr key={med.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1B2430' }}>{med.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#9CA3AF' }}>{med.batchNumber}</td>
                      <td style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 500 }}>{formatDate(med.expiryDate)}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{med.currentStock}</td>
                      <td><StockStatusBadge status={med.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="section-title">Recent Procurement Orders</h2>
              <button onClick={() => navigate('/orders')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="table-scroll">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Medicine</th>
                    <th>Source</th>
                    <th>Qty</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#0F9D6D', fontWeight: 600 }}>{order.id}</td>
                      <td style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1B2430' }}>{order.medicine}</td>
                      <td style={{ fontSize: '0.8125rem', color: '#5B6675' }}>{order.source}</td>
                      <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                      <td style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{formatDate(order.date)}</td>
                      <td><OrderStatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
