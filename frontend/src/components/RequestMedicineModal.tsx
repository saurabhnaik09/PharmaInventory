import { useState } from 'react';
import { X, Minus, Plus, CheckCircle2, ClipboardCopy, Building2 } from 'lucide-react';
import type { ProcurementResult } from '../types';
import { useAppState } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils';

interface RequestMedicineModalProps {
  result: ProcurementResult;
  onClose: () => void;
}

export function RequestMedicineModal({ result, onClose }: RequestMedicineModalProps) {
  const { createOrder } = useAppState();
  const { success } = useToast();
  const [qty, setQty] = useState(10);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const minQty = 1;
  const maxQty = result.availableQty;

  const handleSubmit = () => {
    const order = createOrder({
      medicineName: result.medicineName,
      genericName: result.genericName,
      strength: result.strength,
      sourceName: result.sourceName,
      sourceType: 'pharmacy',
      quantity: qty,
      note: note || undefined,
      unitPrice: result.unitPrice,
    });
    setOrderId(order.id);
    setSubmitted(true);
    success('Request Sent!', `Your request ${order.id} has been sent to ${result.sourceName}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    success('Copied!', 'Request ID copied to clipboard');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {!submitted ? (
          <>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Request Medicine</h2>
              <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }} aria-label="Close"><X size={18} /></button>
            </div>

            {/* Medicine info */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E4E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>{result.medicineName}</p>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', color: '#5B6675' }}>{result.genericName} · {result.dosageForm}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Building2 size={14} color="#0F9D6D" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0F9D6D' }}>{result.sourceName}</span>
                    {result.distance !== undefined && (
                      <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>· {result.distance} km</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: '0 0 0.125rem', fontSize: '0.75rem', color: '#9CA3AF' }}>Available</p>
                  <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#15803D' }}>{result.availableQty} units</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Quantity */}
              <div>
                <label className="label-base">Requested Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem' }}>
                  <button
                    onClick={() => setQty(q => Math.max(minQty, q - 1))}
                    disabled={qty <= minQty}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #E4E7EB', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: qty <= minQty ? '#F9FAFB' : 'white', cursor: qty <= minQty ? 'not-allowed' : 'pointer',
                      color: qty <= minQty ? '#D1D5DB' : '#1B2430',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1B2430', minWidth: '3rem', textAlign: 'center' }}>{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                    disabled={qty >= maxQty}
                    style={{
                      width: '36px', height: '36px', border: '1px solid #E4E7EB', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: qty >= maxQty ? '#F9FAFB' : 'white', cursor: qty >= maxQty ? 'not-allowed' : 'pointer',
                      color: qty >= maxQty ? '#D1D5DB' : '#1B2430',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>units</span>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.875rem', background: '#F0FDF4', borderRadius: '0.5rem', border: '1px solid #BBF7D0' }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#15803D' }}>
                    Estimated amount: <strong>{formatCurrency(qty * result.unitPrice)}</strong>
                    <span style={{ fontWeight: 400, marginLeft: '0.25rem' }}>({formatCurrency(result.unitPrice)}/unit)</span>
                  </p>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="label-base">Note <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note for the pharmacy..."
                  rows={3}
                  className="input-base"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E4E7EB', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn-primary">Send Request</button>
            </div>
          </>
        ) : (
          /* Success State */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={32} color="#16A34A" />
            </div>
            <h3 style={{ margin: '0 0 0.375rem', fontSize: '1.25rem', fontWeight: 700, color: '#1B2430' }}>Request Sent!</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#5B6675', fontSize: '0.9375rem' }}>
              Your request has been sent to <strong>{result.sourceName}</strong>.
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E4E7EB', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Request ID</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Status</span>
                <span className="badge badge-pending">Pending</span>
              </div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
