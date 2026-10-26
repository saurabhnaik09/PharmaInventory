import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  Ban,
  Package,
  Printer,
  Copy,
  Building2,
  Sparkles,
  Phone,
  MapPin,
} from 'lucide-react';
import type { Order, SupplierMedicineAvailability, DosageForm } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { OrderStatusBadge } from '../../components/Badges';

// ─── 1. ACCEPT ORDER MODAL ───────────────────────────────────────────────────

interface AcceptOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (deliveryEta: string, note?: string) => void;
}

export function AcceptOrderModal({ order, onClose, onConfirm }: AcceptOrderModalProps) {
  const [deliveryEta, setDeliveryEta] = useState(
    new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [note, setNote] = useState('Order confirmed. Preparing for packaging and dispatch.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(deliveryEta, note);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="#16A34A" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Accept Order Request</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675' }}>Order ID: {order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', borderRadius: '0.625rem', padding: '0.875rem 1rem', border: '1px solid #E4E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 700, color: '#1B2430', fontSize: '0.9375rem' }}>{order.medicine}</span>
              <span style={{ fontWeight: 700, color: '#0F9D6D' }}>{formatCurrency(order.totalAmount ?? 0)}</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#5B6675', display: 'flex', gap: '1rem' }}>
              <span>Quantity: <strong>{order.quantity} units</strong></span>
              <span>Buyer: <strong>{order.pharmacyName ?? 'ABC Pharmacy'}</strong></span>
            </div>
          </div>

          <div>
            <label className="label-base">Promised Delivery Date</label>
            <input
              type="date"
              required
              value={deliveryEta}
              onChange={e => setDeliveryEta(e.target.value)}
              className="input-base"
              min={new Date().toISOString().split('T')[0]}
            />
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#9CA3AF' }}>Estimated date when stock reaches buyer pharmacy</p>
          </div>

          <div>
            <label className="label-base">Confirmation Message / Instructions</label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              className="input-base"
              placeholder="e.g. In stock, dispatched by Blue Dart tomorrow morning."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#16A34A' }}>
              <CheckCircle2 size={16} /> Confirm & Accept
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── 2. REJECT ORDER MODAL ───────────────────────────────────────────────────

interface RejectOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectOrderModal({ order, onClose, onConfirm }: RejectOrderModalProps) {
  const [reasonCategory, setReasonCategory] = useState('Out of Stock / Batch Exhausted');
  const [customNote, setCustomNote] = useState('');

  const reasons = [
    'Out of Stock / Batch Exhausted',
    'Order quantity below Minimum Order Quantity (MOQ)',
    'Price Revision in progress — contact sales',
    'Delivery route / pin code unserviceable currently',
    'Other reason (specify below)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reasonCategory === 'Other reason (specify below)' && customNote.trim()
      ? customNote.trim()
      : customNote.trim() ? `${reasonCategory} - ${customNote.trim()}` : reasonCategory;
    onConfirm(finalReason);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '460px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ban size={18} color="#DC2626" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Decline Order Request</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675' }}>Order ID: {order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#5B6675' }}>
            Please specify why you are declining the request for <strong style={{ color: '#1B2430' }}>{order.quantity} units of {order.medicine}</strong>. The pharmacy will be notified immediately.
          </p>

          <div>
            <label className="label-base">Reason for Rejection</label>
            <select
              value={reasonCategory}
              onChange={e => setReasonCategory(e.target.value)}
              className="input-base"
            >
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-base">Additional Explanation (Optional)</label>
            <textarea
              rows={2}
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              className="input-base"
              placeholder="e.g. Next production batch arrives next Wednesday."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Back
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#DC2626' }}>
              <Ban size={16} /> Decline Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── 3. DISPATCH ORDER MODAL ─────────────────────────────────────────────────

interface DispatchOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (details: { courierName: string; trackingNumber: string; deliveryDate: string }) => void;
}

export function DispatchOrderModal({ order, onClose, onConfirm }: DispatchOrderModalProps) {
  const [courierName, setCourierName] = useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState(`BD-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  const couriers = [
    'Blue Dart Express',
    'DTDC Supply Chain',
    'Delhivery Pharma Logistics',
    'MedSupply Dedicated Fleet',
    'FedEx Healthcare Delivery',
  ];

  const handleGenerateAwb = () => {
    const prefixes: Record<string, string> = {
      'Blue Dart Express': 'BD',
      'DTDC Supply Chain': 'DT',
      'Delhivery Pharma Logistics': 'DL',
      'MedSupply Dedicated Fleet': 'MSF',
      'FedEx Healthcare Delivery': 'FX',
    };
    const prefix = prefixes[courierName] || 'TRK';
    setTrackingNumber(`${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ courierName, trackingNumber, deliveryDate });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#7E22CE" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Ship & Dispatch Order</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675' }}>Order ID: {order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base">Courier / Logistics Partner</label>
            <select
              value={courierName}
              onChange={e => setCourierName(e.target.value)}
              className="input-base"
            >
              {couriers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="label-base" style={{ marginBottom: 0 }}>AWB / Tracking Number</label>
              <button
                type="button"
                onClick={handleGenerateAwb}
                className="btn-ghost"
                style={{ fontSize: '0.75rem', color: '#2563EB', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Sparkles size={12} /> Auto-generate AWB
              </button>
            </div>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className="input-base"
              placeholder="e.g. BD-89304910"
            />
          </div>

          <div>
            <label className="label-base">Expected Delivery Date</label>
            <input
              type="date"
              required
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              className="input-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E4E7EB', fontSize: '0.8125rem', color: '#5B6675' }}>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: '#1B2430' }}>Destination Pharmacy:</p>
            <p style={{ margin: 0 }}>{order.pharmacyName ?? 'ABC Pharmacy'} · {order.pharmacyAddress ?? 'Plot 42, Health City, Mumbai'}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#7E22CE' }}>
              <Truck size={16} /> Mark as Dispatched
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── 4. ORDER DETAILS / INVOICE MODAL ─────────────────────────────────────────

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onAccept?: (order: Order) => void;
  onReject?: (order: Order) => void;
  onDispatch?: (order: Order) => void;
  onMarkDelivered?: (order: Order) => void;
}

export function OrderDetailsModal({
  order,
  onClose,
  onAccept,
  onReject,
  onDispatch,
  onMarkDelivered,
}: OrderDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const subtotal = order.totalAmount ?? 0;
  const gst = subtotal * 0.12; // 12% GST
  const grandTotal = subtotal + gst;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.125rem', color: '#D97706' }}>
                  {order.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="btn-ghost"
                  style={{ padding: '0.2rem', color: copied ? '#16A34A' : '#9CA3AF' }}
                  title="Copy Order ID"
                >
                  <Copy size={14} />
                </button>
              </div>
              <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: '#5B6675' }}>
                Placed on {formatDate(order.date)}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <OrderStatusBadge status={order.status} />
            <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pharmacy & Delivery Address */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E4E7EB' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Purchasing Pharmacy
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: '#1B2430', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                <Building2 size={16} color="#0F9D6D" />
                {order.pharmacyName ?? 'ABC Pharmacy'}
              </div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.8125rem', color: '#5B6675', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <MapPin size={13} color="#9CA3AF" /> {order.pharmacyAddress ?? 'Plot 42, Health City, Andheri East, Mumbai'}
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#5B6675', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Phone size={13} color="#9CA3AF" /> {order.contactPhone ?? '+91 98200 12345'}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Supplier Distributor
              </p>
              <p style={{ margin: '0 0 0.25rem', fontWeight: 700, color: '#1B2430', fontSize: '0.9375rem' }}>
                MedSupply Distributors
              </p>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.8125rem', color: '#5B6675' }}>
                MIDC Industrial Area, Andheri East, Mumbai
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#5B6675' }}>
                GSTIN: 27AABCM9102K1Z9 · DL: MH-TZ4-88910
              </p>
            </div>
          </div>

          {/* Note if any */}
          {order.note && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#92400E' }}>
                <strong>Order Instructions:</strong> "{order.note}"
              </p>
            </div>
          )}

          {/* Rejection reason if any */}
          {order.status === 'rejected' && order.rejectionReason && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#991B1B' }}>
                <strong>Rejection Reason:</strong> {order.rejectionReason}
              </p>
            </div>
          )}

          {/* Tracking if dispatched */}
          {order.trackingNumber && (
            <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '0.625rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={18} color="#7E22CE" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B21A8', fontWeight: 600 }}>Logistics & Delivery</p>
                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.875rem', fontWeight: 700, color: '#1B2430' }}>
                    {order.courierName ?? 'Blue Dart'} · AWB: <span style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                  </p>
                  {order.estimatedDeliveryDate && (
                    <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#5B6675' }}>
                      Expected Delivery: <strong>{formatDate(order.estimatedDeliveryDate)}</strong>
                    </p>
                  )}
                </div>
              </div>
              <span className="badge badge-dispatched">In Transit</span>
            </div>
          )}

          {/* Items Table */}
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', fontWeight: 700, color: '#1B2430' }}>
              Ordered Items
            </h3>
            <div style={{ border: '1px solid #E4E7EB', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <table className="table-base" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1B2430', fontSize: '0.875rem' }}>{order.medicine}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{order.genericName} · {order.strength}</p>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{order.quantity}</td>
                    <td style={{ textAlign: 'right', fontSize: '0.875rem', color: '#5B6675' }}>
                      {order.totalAmount ? formatCurrency(order.totalAmount / order.quantity) : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: '#1B2430' }}>
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial summary */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderTop: '1px solid #E4E7EB', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#5B6675' }}>
                  <span>Taxable Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#5B6675' }}>
                  <span>Applicable GST (12% Pharma):</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 800, color: '#1B2430', borderTop: '1px solid #E4E7EB', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#0F9D6D' }}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons inside Modal */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #E4E7EB', paddingTop: '1rem' }}>
            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Printer size={15} /> Print Delivery Slip
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => { onClose(); onReject?.(order); }}
                    className="btn-secondary"
                    style={{ color: '#DC2626', borderColor: '#FECACA' }}
                  >
                    <Ban size={15} /> Decline
                  </button>
                  <button
                    onClick={() => { onClose(); onAccept?.(order); }}
                    className="btn-primary"
                    style={{ background: '#16A34A' }}
                  >
                    <CheckCircle2 size={15} /> Accept Order
                  </button>
                </>
              )}

              {(order.status === 'accepted' || order.status === 'processing') && (
                <button
                  onClick={() => { onClose(); onDispatch?.(order); }}
                  className="btn-primary"
                  style={{ background: '#7E22CE' }}
                >
                  <Truck size={15} /> Dispatch / Ship Order
                </button>
              )}

              {order.status === 'dispatched' && (
                <button
                  onClick={() => { onClose(); onMarkDelivered?.(order); }}
                  className="btn-primary"
                  style={{ background: '#16A34A' }}
                >
                  <CheckCircle2 size={15} /> Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 5. ADD SUPPLIER PRODUCT MODAL ───────────────────────────────────────────

interface AddSupplierProductModalProps {
  onClose: () => void;
  onAdd: (product: SupplierMedicineAvailability) => void;
}

export function AddSupplierProductModal({ onClose, onAdd }: AddSupplierProductModalProps) {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState<DosageForm>('Tablet');
  const [availableQty, setAvailableQty] = useState(500);
  const [unitPrice, setUnitPrice] = useState(15.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const product: SupplierMedicineAvailability = {
      medicineId: `sm-prod-${Date.now()}`,
      medicineName: `${name.trim()} ${strength.trim()}`.trim(),
      genericName: genericName.trim() || name.trim(),
      strength: strength.trim() || '10mg',
      dosageForm,
      availableQty: Number(availableQty),
      unitPrice: Number(unitPrice),
    };

    onAdd(product);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} color="#D97706" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Add Medicine to Catalog</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675' }}>Pharmacies will be able to order this item</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base">Brand Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-base"
              placeholder="e.g. Montelukast or Pan-D"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label-base">Generic Salt Name</label>
              <input
                type="text"
                required
                value={genericName}
                onChange={e => setGenericName(e.target.value)}
                className="input-base"
                placeholder="e.g. Montelukast Sodium"
              />
            </div>
            <div>
              <label className="label-base">Strength</label>
              <input
                type="text"
                required
                value={strength}
                onChange={e => setStrength(e.target.value)}
                className="input-base"
                placeholder="e.g. 10mg or 500mg"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label-base">Dosage Form</label>
              <select
                value={dosageForm}
                onChange={e => setDosageForm(e.target.value as DosageForm)}
                className="input-base"
              >
                {(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler'] as DosageForm[]).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Stock Qty</label>
              <input
                type="number"
                required
                min={1}
                value={availableQty}
                onChange={e => setAvailableQty(Number(e.target.value))}
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Wholesale (₹)</label>
              <input
                type="number"
                step="0.1"
                required
                min={0.1}
                value={unitPrice}
                onChange={e => setUnitPrice(Number(e.target.value))}
                className="input-base"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Package size={16} /> Add to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── 6. EDIT STOCK MODAL ─────────────────────────────────────────────────────

interface EditStockModalProps {
  item: SupplierMedicineAvailability;
  onClose: () => void;
  onSave: (medicineId: string, quantity: number, price: number) => void;
}

export function EditStockModal({ item, onClose, onSave }: EditStockModalProps) {
  const [qty, setQty] = useState(item.availableQty);
  const [price, setPrice] = useState(item.unitPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.medicineId, Number(qty), Number(price));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '420px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Update Warehouse Stock</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675' }}>{item.medicineName}</p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base">Available Units in Warehouse</label>
            <input
              type="number"
              required
              min={0}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="input-base"
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
              {[100, 500, 1000].map(add => (
                <button
                  key={add}
                  type="button"
                  onClick={() => setQty(q => q + add)}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#F1F5F9', borderRadius: '4px' }}
                >
                  +{add} units
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-base">Wholesale Unit Price (₹)</label>
            <input
              type="number"
              step="0.1"
              required
              min={0.1}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="input-base"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
