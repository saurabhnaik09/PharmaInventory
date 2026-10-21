import { useState } from 'react';
import { X, Minus, Plus, CheckCircle2, ClipboardCopy, Truck } from 'lucide-react';
import type { ProcurementResult } from '../types';
import { useAppState } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils';

interface PlaceOrderModalProps {
  result: ProcurementResult;
  onClose: () => void;
}

export function PlaceOrderModal({ result, onClose }: PlaceOrderModalProps) {
  const { createOrder } = useAppState();
  const { success } = useToast();
  const moq = result.minimumOrderQuantity ?? 1;
  const [qty, setQty] = useState(moq);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleQtyChange = (delta: number) => {
    setQty(q => Math.max(moq, Math.min(result.availableQty, q + delta)));
  };

  const handleSubmit = () => {
    const order = createOrder({
      medicineName: result.medicineName,
      genericName: result.genericName,
      strength: result.strength,
      sourceName: result.sourceName,
      sourceType: 'supplier',
      quantity: qty,
      unitPrice: result.unitPrice,
    });
    setOrderId(order.id);
    setSubmitted(true);
    success('Order Placed!', `Order ${order.id} placed with ${result.sourceName}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    success('Copied!', 'Order ID copied to clipboard');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {!submitted ? (
          <>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Place Supplier Order</h2>
              <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }} aria-label="Close"><X size={18} /></button>
            </div>

            {/* Info */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E4E7EB' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>{result.medicineName}</p>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#5B6675' }}>{result.genericName} · {result.dosageForm}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #E4E7EB', padding: '0.625rem' }}>
                  <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier</p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#1B2430' }}>{result.sourceName}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #E4E7EB', padding: '0.625rem' }}>
                  <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available</p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#15803D' }}>{result.availableQty} units</p>
                </div>
                <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #E4E7EB', padding: '0.625rem' }}>
                  <p style={{ margin: '0 0 0.125rem', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery</p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#1B2430' }}>{result.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label-base">Order Quantity</label>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Minimum order quantity: <strong style={{ color: '#1B2430' }}>{moq} units</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleQtyChange(-moq)}
                    disabled={qty <= moq}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #E4E7EB', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: qty <= moq ? '#F9FAFB' : 'white', cursor: qty <= moq ? 'not-allowed' : 'pointer',
                      color: qty <= moq ? '#D1D5DB' : '#1B2430',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1B2430', minWidth: '4rem', textAlign: 'center' }}>{qty}</span>
                  <button
                    onClick={() => handleQtyChange(moq)}
                    disabled={qty >= result.availableQty}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #E4E7EB', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: qty >= result.availableQty ? '#F9FAFB' : 'white',
                      cursor: qty >= result.availableQty ? 'not-allowed' : 'pointer',
                      color: qty >= result.availableQty ? '#D1D5DB' : '#1B2430',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>units</span>
                </div>
              </div>

              <div style={{ padding: '0.875rem 1rem', background: '#FFF7ED', borderRadius: '0.75rem', border: '1px solid #FED7AA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#9A3412' }}>{qty} units × {formatCurrency(result.unitPrice)}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9A3412' }}>{formatCurrency(qty * result.unitPrice)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Truck size={13} color="#92400E" />
                  <span style={{ fontSize: '0.8125rem', color: '#92400E' }}>Est. delivery: {result.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E4E7EB', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn-primary">Place Order</button>
            </div>
          </>
        ) : (
          /* Success */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={32} color="#16A34A" />
            </div>
            <h3 style={{ margin: '0 0 0.375rem', fontSize: '1.25rem', fontWeight: 700, color: '#1B2430' }}>Order Placed!</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#5B6675', fontSize: '0.9375rem' }}>
              Your order has been placed with <strong>{result.sourceName}</strong>.
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E4E7EB', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Order ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1B2430', fontFamily: 'monospace' }}>{orderId}</span>
                  <button onClick={handleCopy} className="btn-ghost" style={{ padding: '0.125rem' }} title="Copy"><ClipboardCopy size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Medicine</span>
                <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{result.medicineName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Quantity</span>
                <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{qty} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Est. Delivery</span>
                <span style={{ fontSize: '0.875rem', color: '#1B2430' }}>{result.estimatedDelivery}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Status</span>
                <span className="badge badge-pending">Pending</span>
              </div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
