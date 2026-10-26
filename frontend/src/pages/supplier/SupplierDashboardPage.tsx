import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { OrderStatusBadge } from '../../components/Badges';
import {
  Truck,
  ClipboardList,
  TrendingUp,
  Building2,
  CheckCircle2,
  Package,
  BarChart3,
  Search,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Ban,
  Clock,
  Eye,
  Edit2,
  ChevronRight,
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils';
import type { Order, SupplierMedicineAvailability } from '../../types';
import {
  AcceptOrderModal,
  RejectOrderModal,
  DispatchOrderModal,
  OrderDetailsModal,
  AddSupplierProductModal,
  EditStockModal,
} from './SupplierModals';

type Tab = 'Dashboard' | 'Orders' | 'Catalog' | 'Analytics' | 'Profile';
type OrderFilter = 'all' | 'pending' | 'active' | 'completed' | 'rejected';

export default function SupplierDashboardPage() {
  const navigate = useNavigate();
  const {
    orders,
    updateOrderStatus,
    supplierMedicines,
    updateSupplierStock,
    addSupplierProduct,
  } = useAppState();
  const { success, warning } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Modals state
  const [acceptingOrder, setAcceptingOrder] = useState<Order | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState<SupplierMedicineAvailability | null>(null);

  // Supplier orders
  const supplierOrders = useMemo(() => {
    return orders.filter(o => o.sourceType === 'supplier');
  }, [orders]);

  const pendingOrders = useMemo(
    () => supplierOrders.filter(o => o.status === 'pending'),
    [supplierOrders]
  );
  const activeOrders = useMemo(
    () => supplierOrders.filter(o => ['accepted', 'processing', 'dispatched'].includes(o.status)),
    [supplierOrders]
  );
  const completedOrders = useMemo(
    () => supplierOrders.filter(o => o.status === 'completed'),
    [supplierOrders]
  );
  const rejectedOrders = useMemo(
    () => supplierOrders.filter(o => o.status === 'rejected'),
    [supplierOrders]
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0),
    [completedOrders]
  );
  const pipelineRevenue = useMemo(
    () => [...pendingOrders, ...activeOrders].reduce((sum, o) => sum + (o.totalAmount ?? 0), 0),
    [pendingOrders, activeOrders]
  );

  // Filtered orders for table
  const filteredOrders = useMemo(() => {
    let list = supplierOrders;
    if (orderFilter === 'pending') list = pendingOrders;
    else if (orderFilter === 'active') list = activeOrders;
    else if (orderFilter === 'completed') list = completedOrders;
    else if (orderFilter === 'rejected') list = rejectedOrders;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.medicine.toLowerCase().includes(q) ||
          (o.pharmacyName ?? 'ABC Pharmacy').toLowerCase().includes(q)
      );
    }
    return list;
  }, [supplierOrders, orderFilter, pendingOrders, activeOrders, completedOrders, rejectedOrders, searchQuery]);

  // Catalog filtered
  const filteredCatalog = useMemo(() => {
    if (!catalogSearch.trim()) return supplierMedicines;
    const q = catalogSearch.toLowerCase().trim();
    return supplierMedicines.filter(
      m =>
        m.medicineName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.dosageForm.toLowerCase().includes(q)
    );
  }, [supplierMedicines, catalogSearch]);

  // Action handlers
  const handleConfirmAccept = (deliveryEta: string, note?: string) => {
    if (!acceptingOrder) return;
    updateOrderStatus(acceptingOrder.id, 'accepted', {
      estimatedDeliveryDate: deliveryEta,
      note,
    });
    success('Order Accepted!', `Order ${acceptingOrder.id} has been accepted. Delivery ETA: ${deliveryEta}`);
    setAcceptingOrder(null);
  };

  const handleConfirmReject = (reason: string) => {
    if (!rejectingOrder) return;
    updateOrderStatus(rejectingOrder.id, 'rejected', { rejectionReason: reason });
    warning('Order Declined', `Order ${rejectingOrder.id} was marked as declined.`);
    setRejectingOrder(null);
  };

  const handleConfirmDispatch = (details: { courierName: string; trackingNumber: string; deliveryDate: string }) => {
    if (!dispatchingOrder) return;
    updateOrderStatus(dispatchingOrder.id, 'dispatched', {
      courierName: details.courierName,
      trackingNumber: details.trackingNumber,
      estimatedDeliveryDate: details.deliveryDate,
    });
    success('Order Dispatched!', `Shipment assigned to ${details.courierName} (AWB: ${details.trackingNumber})`);
    setDispatchingOrder(null);
  };

  const handleMarkDelivered = (order: Order) => {
    updateOrderStatus(order.id, 'completed');
    success('Delivery Completed!', `Order ${order.id} marked as delivered. Pharmacy inventory updated.`);
  };

  const handleQuickAddStock = (medicineId: string, currentQty: number, addAmount: number) => {
    updateSupplierStock('s1', medicineId, currentQty + addAmount);
    success('Stock Added', `Added +${addAmount} units to warehouse inventory`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAFAF9' }}>
      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: '240px',
          background: 'white',
          borderRight: '1px solid #E4E7EB',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(217,119,6,0.25)',
            }}
          >
            <Truck size={17} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#1B2430', display: 'block', lineHeight: 1.2 }}>
              Supplier Portal
            </span>
            <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 500 }}>MedSupply Dist.</span>
          </div>
        </div>

        {[
          { label: 'Dashboard', icon: TrendingUp },
          { label: 'Orders', icon: ClipboardList, badge: pendingOrders.length },
          { label: 'Catalog', icon: Package, count: supplierMedicines.length },
          { label: 'Analytics', icon: BarChart3 },
          { label: 'Profile', icon: Building2 },
        ].map(({ label, icon: Icon, badge, count }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => setActiveTab(label as Tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 0.875rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                background: isActive ? '#FFF7ED' : 'transparent',
                color: isActive ? '#D97706' : '#5B6675',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span
                  style={{
                    background: '#DC2626',
                    color: 'white',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                  }}
                >
                  {badge}
                </span>
              )}
              {count !== undefined && (
                <span
                  style={{
                    background: isActive ? '#FED7AA' : '#F1F5F9',
                    color: isActive ? '#9A3412' : '#94A3B8',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              border: '1px solid #E4E7EB',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: '#F8FAFC',
              color: '#0F9D6D',
              width: '100%',
            }}
          >
            <Building2 size={14} /> Pharmacy View <ArrowUpRight size={13} style={{ marginLeft: 'auto' }} />
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'transparent',
              color: '#9CA3AF',
              width: '100%',
            }}
          >
            ← Back to Login
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: '#1B2430' }}>
                MedSupply Distributors
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#0F9D6D',
                  background: '#E6F7F1',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                }}
              >
                <ShieldCheck size={13} /> Verified Supplier
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0', color: '#5B6675', fontSize: '0.875rem' }}>
              Manage incoming pharmacy requests, fulfillment lifecycle, and warehouse catalog.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('Orders')}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}
            >
              <ClipboardList size={15} /> All Orders ({supplierOrders.length})
            </button>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', background: '#D97706' }}
            >
              <Plus size={15} /> Add Medicine
            </button>
          </div>
        </div>

        {/* ─── URGENT PENDING BANNER ────────────────────────────────────────── */}
        {pendingOrders.length > 0 && (
          <div
            style={{
              background: 'linear-gradient(90deg, #FFFBEB, #FEF3C7)',
              border: '1px solid #FCD34D',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem', color: '#92400E' }}>
                  {pendingOrders.length} New Order Request{pendingOrders.length > 1 ? 's' : ''} Awaiting Your Confirmation
                </p>
                <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#B45309' }}>
                  Pharmacies have submitted procurement orders. Accept or decline them to keep fulfillment SLA under 24 hours.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setActiveTab('Orders');
                  setOrderFilter('pending');
                }}
                className="btn-primary"
                style={{ background: '#D97706', fontSize: '0.8125rem', padding: '0.45rem 0.875rem' }}
              >
                Review Requests <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: DASHBOARD                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Dashboard' && (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                {
                  label: 'Pending Requests',
                  value: pendingOrders.length,
                  subtext: 'Needs immediate review',
                  color: '#D97706',
                  bg: '#FEF3C7',
                  icon: Clock,
                  action: () => { setActiveTab('Orders'); setOrderFilter('pending'); },
                },
                {
                  label: 'In Transit / Active',
                  value: activeOrders.length,
                  subtext: 'Being packed or shipped',
                  color: '#2563EB',
                  bg: '#DBEAFE',
                  icon: Truck,
                  action: () => { setActiveTab('Orders'); setOrderFilter('active'); },
                },
                {
                  label: 'Completed Orders',
                  value: completedOrders.length,
                  subtext: 'Delivered successfully',
                  color: '#16A34A',
                  bg: '#DCFCE7',
                  icon: CheckCircle2,
                  action: () => { setActiveTab('Orders'); setOrderFilter('completed'); },
                },
                {
                  label: 'Fulfilled Revenue',
                  value: formatCurrency(totalRevenue),
                  subtext: `+${formatCurrency(pipelineRevenue)} in pipeline`,
                  color: '#0F9D6D',
                  bg: '#E6F7F1',
                  icon: TrendingUp,
                  action: () => setActiveTab('Analytics'),
                },
              ].map(card => (
                <div
                  key={card.label}
                  onClick={card.action}
                  style={{
                    background: card.bg,
                    border: `1px solid ${card.color}33`,
                    borderRadius: '0.875rem',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <span style={{ fontSize: '0.75rem', color: card.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {card.label}
                    </span>
                    <card.icon size={16} color={card.color} />
                  </div>
                  <p style={{ margin: 0, fontSize: typeof card.value === 'string' ? '1.25rem' : '1.75rem', fontWeight: 800, color: card.color }}>
                    {card.value}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>{card.subtext}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="section-title">Recent Order Requests & Fulfillment</h2>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#5B6675' }}>
                    Click accept, dispatch, or view details for any incoming order
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab('Orders'); setOrderFilter('all'); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.875rem', color: '#0F9D6D', fontWeight: 600 }}
                >
                  View All Orders →
                </button>
              </div>

              {supplierOrders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <ClipboardList size={36} color="#9CA3AF" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ margin: 0, fontWeight: 600, color: '#1B2430' }}>No supplier orders yet</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#9CA3AF' }}>Orders placed by pharmacies will appear here</p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="table-base">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Medicine</th>
                        <th>Purchasing Pharmacy</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierOrders.slice(0, 6).map(order => (
                        <tr key={order.id}>
                          <td>
                            <button
                              onClick={() => setInspectingOrder(order)}
                              className="btn-ghost"
                              style={{ padding: 0, fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 800, color: '#D97706' }}
                            >
                              {order.id}
                            </button>
                          </td>
                          <td>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#1B2430' }}>{order.medicine}</p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{order.genericName} · {order.strength}</p>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Building2 size={14} color="#0F9D6D" /> {order.pharmacyName ?? 'ABC Pharmacy'}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{order.quantity}</td>
                          <td style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>
                            {order.totalAmount ? formatCurrency(order.totalAmount) : '—'}
                          </td>
                          <td style={{ fontSize: '0.8125rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                            {formatDate(order.date)}
                          </td>
                          <td><OrderStatusBadge status={order.status} /></td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => setAcceptingOrder(order)}
                                    className="btn-primary"
                                    style={{ background: '#16A34A', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    title="Accept Order"
                                  >
                                    <CheckCircle2 size={13} /> Accept
                                  </button>
                                  <button
                                    onClick={() => setRejectingOrder(order)}
                                    className="btn-ghost"
                                    style={{ color: '#DC2626', padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                    title="Decline Order"
                                  >
                                    <Ban size={13} />
                                  </button>
                                </>
                              )}

                              {(order.status === 'accepted' || order.status === 'processing') && (
                                <button
                                  onClick={() => setDispatchingOrder(order)}
                                  className="btn-primary"
                                  style={{ background: '#7E22CE', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                  title="Dispatch Shipment"
                                >
                                  <Truck size={13} /> Dispatch
                                </button>
                              )}

                              {order.status === 'dispatched' && (
                                <button
                                  onClick={() => handleMarkDelivered(order)}
                                  className="btn-primary"
                                  style={{ background: '#16A34A', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                  title="Mark Delivered"
                                >
                                  <CheckCircle2 size={13} /> Delivered
                                </button>
                              )}

                              <button
                                onClick={() => setInspectingOrder(order)}
                                className="btn-ghost"
                                style={{ padding: '0.25rem 0.4rem', color: '#5B6675', fontSize: '0.75rem' }}
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Warehouse Stock Snapshot */}
            <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>
                    Warehouse Stock Snapshot
                  </h3>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#5B6675' }}>
                    Active medicine inventory available for pharmacy procurement
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Catalog')}
                  className="btn-ghost"
                  style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 600 }}
                >
                  Manage Full Catalog ({supplierMedicines.length}) →
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
                {supplierMedicines.slice(0, 4).map(item => (
                  <div
                    key={item.medicineId}
                    style={{
                      border: '1px solid #E4E7EB',
                      borderRadius: '0.625rem',
                      padding: '0.875rem 1rem',
                      background: '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#1B2430' }}>{item.medicineName}</p>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          background: item.availableQty > 500 ? '#DCFCE7' : item.availableQty > 100 ? '#FEF3C7' : '#FEE2E2',
                          color: item.availableQty > 500 ? '#15803D' : item.availableQty > 100 ? '#B45309' : '#B91C1C',
                        }}
                      >
                        {item.availableQty} units
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#9CA3AF' }}>{item.genericName} · {item.dosageForm}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F9D6D' }}>
                        {formatCurrency(item.unitPrice)} / unit
                      </span>
                      <button
                        onClick={() => handleQuickAddStock(item.medicineId, item.availableQty, 200)}
                        className="btn-ghost"
                        style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', color: '#D97706', background: '#FFF7ED', borderRadius: '4px' }}
                      >
                        +200 units
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: ORDERS & FULFILLMENT                                         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Orders' && (
          <div className="card">
            {/* Filter Tabs & Search Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="section-title">Order Fulfillment Management</h2>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#5B6675' }}>
                    Process pharmacy orders, accept incoming batches, and track dispatch status
                  </p>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, medicine..."
                    className="input-base"
                    style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Orders', count: supplierOrders.length },
                  { id: 'pending', label: 'Pending Approval', count: pendingOrders.length, color: '#D97706' },
                  { id: 'active', label: 'In Transit / Active', count: activeOrders.length, color: '#2563EB' },
                  { id: 'completed', label: 'Completed', count: completedOrders.length, color: '#16A34A' },
                  { id: 'rejected', label: 'Declined', count: rejectedOrders.length, color: '#DC2626' },
                ].map(filter => {
                  const isSelected = orderFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setOrderFilter(filter.id as OrderFilter)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        border: isSelected ? '1px solid transparent' : '1px solid #E4E7EB',
                        background: isSelected ? (filter.color ? filter.color : '#1B2430') : '#FFFFFF',
                        color: isSelected ? 'white' : '#5B6675',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {filter.label}
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.05rem 0.4rem',
                          borderRadius: '9999px',
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                          color: isSelected ? 'white' : '#5B6675',
                        }}
                      >
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '3.5rem', textAlign: 'center' }}>
                <ClipboardList size={40} color="#D1D5DB" style={{ marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontWeight: 700, color: '#1B2430', fontSize: '1rem' }}>No orders found</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Try adjusting the filter or search query
                </p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Medicine</th>
                      <th>Pharmacy Buyer</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Logistics / Tracking</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="btn-ghost"
                            style={{ padding: 0, fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 800, color: '#D97706' }}
                          >
                            {order.id}
                          </button>
                          <p style={{ margin: '0.125rem 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>
                            {formatDate(order.date)}
                          </p>
                        </td>

                        <td>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#1B2430' }}>{order.medicine}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{order.genericName} · {order.strength}</p>
                          </div>
                        </td>

                        <td style={{ fontSize: '0.875rem', color: '#5B6675' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: '#1B2430' }}>
                            <Building2 size={13} color="#0F9D6D" /> {order.pharmacyName ?? 'ABC Pharmacy'}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Mumbai</span>
                        </td>

                        <td style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{order.quantity}</td>

                        <td style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1B2430' }}>
                          {order.totalAmount ? formatCurrency(order.totalAmount) : '—'}
                        </td>

                        <td style={{ fontSize: '0.8125rem' }}>
                          {order.trackingNumber ? (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B21A8', fontWeight: 600 }}>
                                <Truck size={12} /> {order.courierName?.split(' ')[0] ?? 'Carrier'}
                              </div>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                {order.trackingNumber}
                              </span>
                            </div>
                          ) : order.rejectionReason ? (
                            <span style={{ color: '#DC2626', fontSize: '0.75rem' }} title={order.rejectionReason}>
                              Declined: {order.rejectionReason.slice(0, 18)}...
                            </span>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Standard Delivery</span>
                          )}
                        </td>

                        <td><OrderStatusBadge status={order.status} /></td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setAcceptingOrder(order)}
                                  className="btn-primary"
                                  style={{ background: '#16A34A', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                >
                                  <CheckCircle2 size={13} /> Accept
                                </button>
                                <button
                                  onClick={() => setRejectingOrder(order)}
                                  className="btn-secondary"
                                  style={{ color: '#DC2626', borderColor: '#FECACA', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Ban size={13} /> Decline
                                </button>
                              </>
                            )}

                            {(order.status === 'accepted' || order.status === 'processing') && (
                              <button
                                onClick={() => setDispatchingOrder(order)}
                                className="btn-primary"
                                style={{ background: '#7E22CE', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <Truck size={13} /> Dispatch
                              </button>
                            )}

                            {order.status === 'dispatched' && (
                              <button
                                onClick={() => handleMarkDelivered(order)}
                                className="btn-primary"
                                style={{ background: '#16A34A', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <CheckCircle2 size={13} /> Delivered
                              </button>
                            )}

                            <button
                              onClick={() => setInspectingOrder(order)}
                              className="btn-ghost"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#5B6675' }}
                              title="View Details & Invoice"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: CATALOG & WAREHOUSE INVENTORY                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Catalog' && (
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 className="section-title">Supplier Product Catalog & Warehouse Stock</h2>
                <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#5B6675' }}>
                  Manage items offered to pharmacies, update wholesale unit prices, and adjust stock quantities.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    placeholder="Search catalog..."
                    className="input-base"
                    style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
                  />
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="btn-primary"
                  style={{ background: '#D97706', fontSize: '0.8125rem' }}
                >
                  <Plus size={15} /> Add New Medicine
                </button>
              </div>
            </div>

            <div className="table-scroll">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Medicine Description</th>
                    <th>Dosage Form</th>
                    <th>Strength</th>
                    <th>Warehouse Stock</th>
                    <th>Wholesale Price</th>
                    <th style={{ textAlign: 'right' }}>Stock Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map(item => (
                    <tr key={item.medicineId}>
                      <td>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#1B2430' }}>{item.medicineName}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Generic: {item.genericName}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                          {item.dosageForm}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5B6675' }}>{item.strength}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#1B2430' }}>{item.availableQty}</span>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '9999px',
                              background: item.availableQty > 500 ? '#DCFCE7' : item.availableQty > 100 ? '#FEF3C7' : '#FEE2E2',
                              color: item.availableQty > 500 ? '#15803D' : item.availableQty > 100 ? '#B45309' : '#B91C1C',
                            }}
                          >
                            {item.availableQty > 500 ? 'High' : item.availableQty > 100 ? 'Normal' : 'Low Stock'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: '#0F9D6D', fontSize: '0.9375rem' }}>
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => handleQuickAddStock(item.medicineId, item.availableQty, 100)}
                            className="btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#F8FAFC', border: '1px solid #E4E7EB' }}
                          >
                            +100
                          </button>
                          <button
                            onClick={() => handleQuickAddStock(item.medicineId, item.availableQty, 500)}
                            className="btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#F8FAFC', border: '1px solid #E4E7EB' }}
                          >
                            +500
                          </button>
                          <button
                            onClick={() => setEditingStockItem(item)}
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: PERFORMANCE & ANALYTICS                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Total Realized Revenue
                </span>
                <p style={{ margin: '0.375rem 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#0F9D6D' }}>
                  {formatCurrency(totalRevenue)}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>From completed deliveries</p>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Fulfillment Rate
                </span>
                <p style={{ margin: '0.375rem 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>
                  {supplierOrders.length > 0 ? `${Math.round((completedOrders.length / (supplierOrders.length - pendingOrders.length || 1)) * 100)}%` : '100%'}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>Accepted orders fulfilled</p>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Active Pipeline
                </span>
                <p style={{ margin: '0.375rem 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#2563EB' }}>
                  {formatCurrency(pipelineRevenue)}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>{activeOrders.length + pendingOrders.length} orders pending/dispatched</p>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Average Turnaround
                </span>
                <p style={{ margin: '0.375rem 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>
                  1.2 Days
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>Order request to dispatch</p>
              </div>
            </div>

            {/* Demand Breakdown Table */}
            <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>Top Demanded Medicines by Pharmacies</h2>
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Total Units Ordered</th>
                    <th>Order Frequency</th>
                    <th>Generated Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Paracetamol 500mg', units: 500, count: 1, rev: 500 },
                    { name: 'Azithromycin 500mg', units: 40, count: 1, rev: 1680 },
                    { name: 'Vitamin D3 60000 IU', units: 200, count: 1, rev: 4000 },
                    { name: 'Metformin 500mg', units: 300, count: 1, rev: 1140 },
                  ].map(row => (
                    <tr key={row.name}>
                      <td style={{ fontWeight: 700, color: '#1B2430' }}>{row.name}</td>
                      <td style={{ fontWeight: 600 }}>{row.units} units</td>
                      <td style={{ color: '#5B6675' }}>{row.count} order{row.count > 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 800, color: '#0F9D6D' }}>{formatCurrency(row.rev)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: SUPPLIER PROFILE                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Profile' && (
          <div className="card" style={{ padding: '1.75rem', maxWidth: '720px' }}>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Supplier Business Profile</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#5B6675' }}>
              Details displayed to hospital pharmacies in the procurement directory
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-base">Company Name</label>
                  <input type="text" readOnly value="MedSupply Distributors Pvt Ltd" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
                <div>
                  <label className="label-base">Drug License Number</label>
                  <input type="text" readOnly value="DL-MH-TZ4-88910" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-base">GSTIN</label>
                  <input type="text" readOnly value="27AABCM9102K1Z9" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
                <div>
                  <label className="label-base">Quality Rating</label>
                  <input type="text" readOnly value="4.8 / 5.0 (Verified Distributor)" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
              </div>

              <div>
                <label className="label-base">Central Warehouse Address</label>
                <input type="text" readOnly value="Plot 18, MIDC Industrial Area, Andheri East, Mumbai - 400093" className="input-base" style={{ background: '#F8FAFC' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-base">Standard Delivery SLA</label>
                  <input type="text" readOnly value="1-2 Days" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
                <div>
                  <label className="label-base">Minimum Order Qty (MOQ)</label>
                  <input type="text" readOnly value="20 Units" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
                <div>
                  <label className="label-base">Support Hotline</label>
                  <input type="text" readOnly value="+91 22 2839 4000" className="input-base" style={{ background: '#F8FAFC' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODALS ───────────────────────────────────────────────────────── */}
      {acceptingOrder && (
        <AcceptOrderModal
          order={acceptingOrder}
          onClose={() => setAcceptingOrder(null)}
          onConfirm={handleConfirmAccept}
        />
      )}

      {rejectingOrder && (
        <RejectOrderModal
          order={rejectingOrder}
          onClose={() => setRejectingOrder(null)}
          onConfirm={handleConfirmReject}
        />
      )}

      {dispatchingOrder && (
        <DispatchOrderModal
          order={dispatchingOrder}
          onClose={() => setDispatchingOrder(null)}
          onConfirm={handleConfirmDispatch}
        />
      )}

      {inspectingOrder && (
        <OrderDetailsModal
          order={inspectingOrder}
          onClose={() => setInspectingOrder(null)}
          onAccept={order => setAcceptingOrder(order)}
          onReject={order => setRejectingOrder(order)}
          onDispatch={order => setDispatchingOrder(order)}
          onMarkDelivered={order => handleMarkDelivered(order)}
        />
      )}

      {isAddProductOpen && (
        <AddSupplierProductModal
          onClose={() => setIsAddProductOpen(false)}
          onAdd={product => {
            addSupplierProduct('s1', product);
            success('Added to Catalog', `${product.medicineName} is now live in your supply catalog.`);
            setIsAddProductOpen(false);
          }}
        />
      )}

      {editingStockItem && (
        <EditStockModal
          item={editingStockItem}
          onClose={() => setEditingStockItem(null)}
          onSave={(id, qty, price) => {
            updateSupplierStock('s1', id, qty, price);
            success('Stock Updated', 'Warehouse inventory and pricing updated successfully.');
            setEditingStockItem(null);
          }}
        />
      )}
    </div>
  );
}
