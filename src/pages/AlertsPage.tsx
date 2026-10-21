import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { AlertTypeBadge } from '../components/Badges';
import { Bell, AlertTriangle, XCircle, Clock, Search } from 'lucide-react';
import { formatDate, daysUntilExpiry } from '../utils';
import type { AlertType } from '../types';

type Tab = 'all' | AlertType;

export default function AlertsPage() {
  const { alerts } = useAppState();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');

  const filtered = tab === 'all' ? alerts : alerts.filter(a => a.type === tab);

  const counts = {
    all: alerts.length,
    out_of_stock: alerts.filter(a => a.type === 'out_of_stock').length,
    low_stock: alerts.filter(a => a.type === 'low_stock').length,
    expiring_soon: alerts.filter(a => a.type === 'expiring_soon').length,
  };

  const getIcon = (type: AlertType) => {
    if (type === 'out_of_stock') return <XCircle size={20} color="#DC2626" />;
    if (type === 'low_stock') return <AlertTriangle size={20} color="#D97706" />;
    return <Clock size={20} color="#2563EB" />;
  };

  const getAlertMessage = (type: AlertType, name: string, stock: number, minStock?: number, expiryDate?: string) => {
    if (type === 'out_of_stock') return `${name} is out of stock.`;
    if (type === 'low_stock') return `${name} is running low — only ${stock} units left (minimum: ${minStock}).`;
    if (type === 'expiring_soon' && expiryDate) {
      const days = daysUntilExpiry(expiryDate);
      return `${name} expires in ${days} days (${formatDate(expiryDate)}).`;
    }
    return `${name} needs attention.`;
  };

  const getBg = (type: AlertType) => {
    if (type === 'out_of_stock') return '#FFF5F5';
    if (type === 'low_stock') return '#FFFBEB';
    return '#EFF6FF';
  };

  const getBorder = (type: AlertType) => {
    if (type === 'out_of_stock') return '#FEE2E2';
    if (type === 'low_stock') return '#FEF3C7';
    return '#DBEAFE';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Inventory Alerts</h1>
        <p className="page-subtitle">Monitor critical stock levels and upcoming expiry dates.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
        {[
          { key: 'out_of_stock', label: 'Out of Stock', icon: XCircle, color: '#DC2626', bg: '#FEE2E2', count: counts.out_of_stock },
          { key: 'low_stock', label: 'Low Stock', icon: AlertTriangle, color: '#D97706', bg: '#FEF3C7', count: counts.low_stock },
          { key: 'expiring_soon', label: 'Expiring Soon', icon: Clock, color: '#2563EB', bg: '#DBEAFE', count: counts.expiring_soon },
        ].map(({ key, label, icon: Icon, color, bg, count }) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            style={{
              background: tab === key ? bg : 'white',
              border: `1.5px solid ${tab === key ? color + '55' : '#E4E7EB'}`,
              borderRadius: '0.875rem', padding: '1.25rem',
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.125rem', fontSize: '1.5rem', fontWeight: 800, color }}>{count}</p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#5B6675', fontWeight: 500 }}>{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="card">
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E4E7EB', padding: '0 1.25rem' }}>
          {([
            ['all', 'All Alerts', counts.all],
            ['out_of_stock', 'Out of Stock', counts.out_of_stock],
            ['low_stock', 'Low Stock', counts.low_stock],
            ['expiring_soon', 'Expiring Soon', counts.expiring_soon],
          ] as const).map(([t, label, count]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.875rem 0.875rem', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 600,
              color: tab === t ? '#0F9D6D' : '#5B6675',
              borderBottom: tab === t ? '2px solid #0F9D6D' : '2px solid transparent',
              marginBottom: '-1px', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}>
              {label}
              <span style={{
                fontSize: '0.7rem', fontWeight: 700,
                background: tab === t ? '#E6F7F1' : '#F1F5F9',
                color: tab === t ? '#0F9D6D' : '#5B6675',
                padding: '0.1rem 0.4rem', borderRadius: '9999px',
              }}>{count}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Bell size={40} color="#E4E7EB" style={{ marginBottom: '1rem' }} />
            <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600, color: '#1B2430' }}>No alerts</p>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>Your inventory is looking healthy! 🎉</p>
          </div>
        ) : (
          <div style={{ padding: '0.75rem' }}>
            {filtered.map(alert => (
              <div key={alert.id} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: getBg(alert.type),
                border: `1px solid ${getBorder(alert.type)}`,
                borderRadius: '0.75rem',
                marginBottom: '0.625rem',
                gap: '1rem',
                flexWrap: 'wrap',
                animation: 'fadeIn 0.25s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flex: 1 }}>
                  <div style={{ marginTop: '0.125rem', flexShrink: 0 }}>
                    {getIcon(alert.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1B2430' }}>{alert.medicineName}</p>
                      <AlertTypeBadge type={alert.type} />
                    </div>
                    <p style={{ margin: '0 0 0.375rem', fontSize: '0.875rem', color: '#5B6675', lineHeight: 1.5 }}>
                      {getAlertMessage(alert.type, alert.medicineName, alert.currentStock, alert.minimumStock, alert.expiryDate)}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9CA3AF', flexWrap: 'wrap' }}>
                      <span>{alert.genericName} · {alert.strength}</span>
                      <span>Current stock: <strong style={{ color: '#1B2430' }}>{alert.currentStock} units</strong></span>
                      {alert.type === 'expiring_soon' && alert.expiryDate && (
                        <span>Expires: <strong style={{ color: '#1B2430' }}>{formatDate(alert.expiryDate)}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/procure?q=${encodeURIComponent(alert.genericName)}`)}
                  className="btn-primary"
                  style={{ flexShrink: 0, fontSize: '0.8125rem', padding: '0.4rem 0.875rem' }}
                >
                  <Search size={13} /> Find Medicine
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
