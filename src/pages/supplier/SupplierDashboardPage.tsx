import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService } from '../../services';
import { OrderStatusBadge } from '../../components/Badges';
import { Truck, ClipboardList, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils';

export default function SupplierDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Orders'>('Dashboard');

  const orders = OrderService.getAll().filter(o => o.sourceType === 'supplier');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => ['accepted', 'processing', 'dispatched'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAFAF9' }}>
      {/* Simple supplier sidebar */}
      <aside style={{ width: '220px', background: 'white', borderRight: '1px solid #E4E7EB', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1B2430' }}>Supplier Portal</span>
        </div>
        {[
          { label: 'Dashboard', icon: TrendingUp },
          { label: 'Orders', icon: ClipboardList },
        ].map(({ label, icon: Icon }) => {
          const isActive = activeTab === label;
          return (
            <button 
              key={label} 
              onClick={() => setActiveTab(label as 'Dashboard' | 'Orders')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.5625rem 0.875rem', border: 'none', borderRadius: '0.5rem',
                cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '0.875rem', fontWeight: 500,
                background: isActive ? '#FFF7ED' : 'transparent',
                color: isActive ? '#D97706' : '#5B6675',
                transition: 'background 0.15s',
              }}
            >
              <Icon size={18} strokeWidth={1.75} /> {label}
            </button>
          );
        })}
        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => navigate('/login')} style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.5625rem 0.875rem', border: 'none', borderRadius: '0.5rem',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            background: 'transparent', color: '#9CA3AF', width: '100%',
          }}>
            ← Back to Login
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.375rem', fontWeight: 800, color: '#1B2430' }}>
            Good morning, MedSupply Distributors 👋
          </h1>
          <p style={{ margin: 0, color: '#5B6675' }}>Here's your supplier dashboard overview.</p>
        </div>

        {/* Dynamic Main Content */}
        {activeTab === 'Dashboard' ? (
          <>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Pending Orders', value: pendingOrders.length, color: '#D97706', bg: '#FEF3C7', icon: ClipboardList },
                { label: 'Active Orders', value: processingOrders.length, color: '#2563EB', bg: '#DBEAFE', icon: Truck },
                { label: 'Completed', value: completedOrders.length, color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle2 },
                { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#0F9D6D', bg: '#E6F7F1', icon: TrendingUp },
              ].map(card => (
                <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.color}33`, borderRadius: '0.875rem', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <card.icon size={16} color={card.color} />
                    <span style={{ fontSize: '0.75rem', color: card.color, fontWeight: 600 }}>{card.label}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: typeof card.value === 'string' ? '1.125rem' : '1.75rem', fontWeight: 800, color: card.color }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Dashboard Orders Table */}
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title">Recent Supplier Orders</h2>
                <button onClick={() => setActiveTab('Orders')} className="btn-ghost" style={{ fontSize: '0.875rem', color: '#0F9D6D' }}>View All</button>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#9CA3AF' }}>No orders yet</p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="table-base">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Medicine</th>
                        <th>Pharmacy</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 700, color: '#D97706' }}>{order.id}</td>
                          <td style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1B2430' }}>{order.medicine}</td>
                          <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Building2 size={13} color="#0F9D6D" /> ABC Pharmacy
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{order.quantity}</td>
                          <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>{order.totalAmount ? formatCurrency(order.totalAmount) : '—'}</td>
                          <td style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{formatDate(order.date)}</td>
                          <td><OrderStatusBadge status={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
              <h2 className="section-title">All Orders</h2>
            </div>
            {orders.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#9CA3AF' }}>No orders found.</p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Medicine</th>
                      <th>Pharmacy</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 700, color: '#D97706' }}>{order.id}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1B2430' }}>{order.medicine}</td>
                        <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Building2 size={13} color="#0F9D6D" /> ABC Pharmacy
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{order.quantity}</td>
                        <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>{order.totalAmount ? formatCurrency(order.totalAmount) : '—'}</td>
                        <td style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{formatDate(order.date)}</td>
                        <td><OrderStatusBadge status={order.status} /></td>
                        <td>
                          <button className="btn-ghost" style={{ color: '#0F9D6D', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}>Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
