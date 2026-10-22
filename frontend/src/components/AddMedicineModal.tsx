import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AddMedicineForm, DosageForm, MedicineCategory } from '../types';
import { useAppState } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES: MedicineCategory[] = [
  'Antibiotic', 'Analgesic', 'Antihistamine', 'Antacid', 'Antidiabetic',
  'Antihypertensive', 'Antipyretic', 'Antiviral', 'Vitamin', 'Cardiovascular', 'Other',
];

const DOSAGE_FORMS: DosageForm[] = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Patch',
];

interface AddMedicineModalProps {
  onClose: () => void;
}

const EMPTY: AddMedicineForm = {
  name: '', genericName: '', category: 'Antibiotic', strength: '',
  dosageForm: 'Tablet', batchNumber: '', currentStock: 0, minimumStock: 0,
  unitPrice: 0, expiryDate: '', supplier: '',
};

export function AddMedicineModal({ onClose }: AddMedicineModalProps) {
  const { addMedicine } = useAppState();
  const { success } = useToast();
  const [form, setForm] = useState<AddMedicineForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof AddMedicineForm, string>>>({});

  const set = (field: keyof AddMedicineForm, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Medicine name is required';
    if (!form.genericName.trim()) e.genericName = 'Generic name is required';
    if (!form.strength.trim()) e.strength = 'Strength is required';
    if (!form.batchNumber.trim()) e.batchNumber = 'Batch number is required';
    if (form.currentStock < 0) e.currentStock = 'Cannot be negative';
    if (form.minimumStock < 0) e.minimumStock = 'Cannot be negative';
    if (form.unitPrice <= 0) e.unitPrice = 'Must be greater than 0';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required';
    else if (new Date(form.expiryDate) <= new Date()) e.expiryDate = 'Expiry date must be in the future';
    if (!form.supplier.trim()) e.supplier = 'Supplier is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addMedicine(form);
    success('Medicine Added', `${form.name} has been added to your inventory`);
    onClose();
  };

  const Field = ({ label, name, required, children }: {
    label: string; name: keyof AddMedicineForm; required?: boolean; children: React.ReactNode;
  }) => (
    <div>
      <label className="label-base">{label}{required && <span style={{ color: '#DC2626' }}> *</span>}</label>
      {children}
      {errors[name] && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#DC2626' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '36rem' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1B2430' }}>Add Medicine</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '65vh', overflowY: 'auto' }}>
            {/* Two-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Medicine Name" name="name" required>
                <input value={form.name} onChange={e => set('name', e.target.value)} className="input-base" placeholder="e.g. Paracetamol 500mg" />
              </Field>
              <Field label="Generic Name" name="genericName" required>
                <input value={form.genericName} onChange={e => set('genericName', e.target.value)} className="input-base" placeholder="e.g. Paracetamol" />
              </Field>
              <Field label="Category" name="category" required>
                <select value={form.category} onChange={e => set('category', e.target.value as MedicineCategory)} className="input-base">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Strength" name="strength" required>
                <input value={form.strength} onChange={e => set('strength', e.target.value)} className="input-base" placeholder="e.g. 500mg" />
              </Field>
              <Field label="Dosage Form" name="dosageForm" required>
                <select value={form.dosageForm} onChange={e => set('dosageForm', e.target.value as DosageForm)} className="input-base">
                  {DOSAGE_FORMS.map(f => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Batch Number" name="batchNumber" required>
                <input value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} className="input-base" placeholder="e.g. PCM-2024-001" />
              </Field>
              <Field label="Current Stock" name="currentStock" required>
                <input type="number" min={0} value={form.currentStock} onChange={e => set('currentStock', Number(e.target.value))} className="input-base" />
              </Field>
              <Field label="Minimum Stock" name="minimumStock" required>
                <input type="number" min={0} value={form.minimumStock} onChange={e => set('minimumStock', Number(e.target.value))} className="input-base" />
              </Field>
              <Field label="Unit Price (₹)" name="unitPrice" required>
                <input type="number" min={0} step="0.01" value={form.unitPrice} onChange={e => set('unitPrice', Number(e.target.value))} className="input-base" />
              </Field>
              <Field label="Expiry Date" name="expiryDate" required>
                <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} className="input-base" />
              </Field>
            </div>
            <Field label="Supplier" name="supplier" required>
              <input value={form.supplier} onChange={e => set('supplier', e.target.value)} className="input-base" placeholder="e.g. MedSupply Distributors" />
            </Field>
          </div>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E4E7EB', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Medicine</button>
          </div>
        </form>
      </div>
    </div>
  );
}
