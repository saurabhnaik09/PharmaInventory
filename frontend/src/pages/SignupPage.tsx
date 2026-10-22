import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Building2, Truck } from 'lucide-react';
import { validateEmail, validatePhone, validatePincode } from '../utils';

type Role = 'pharmacy' | 'supplier';

interface FormErrors {
  [key: string]: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('pharmacy');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    orgName: '', personName: '', licenseNumber: '', email: '', phone: '',
    address: '', city: '', pincode: '', password: '', confirmPassword: '',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e: FormErrors = {};
    if (!form.orgName.trim()) e.orgName = 'Required';
    if (!form.personName.trim()) e.personName = 'Required';
    if (!form.licenseNumber.trim()) e.licenseNumber = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!validateEmail(form.email)) e.email = 'Invalid email address';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.pincode.trim()) e.pincode = 'Required';
    else if (!validatePincode(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Required';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    navigate(role === 'pharmacy' ? '/dashboard' : '/supplier/dashboard');
  };

  const Field = ({ label, name, children, half }: { label: string; name: string; children: React.ReactNode; half?: boolean }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="label-base">{label} <span style={{ color: '#DC2626' }}>*</span></label>
      {children}
      {errors[name] && <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#DC2626' }}>{errors[name]}</p>}
    </div>
  );

  const pharmacyLabel = role === 'pharmacy' ? 'Pharmacy Name' : 'Supplier / Company Name';
  const personLabel = role === 'pharmacy' ? 'Pharmacist / Owner Name' : 'Contact Person';

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={19} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#1B2430', letterSpacing: '-0.02em' }}>
              Pharma<span style={{ color: '#0F9D6D' }}>Inventory</span>
            </span>
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ margin: '0 0 0.375rem', fontSize: '1.25rem', fontWeight: 800, color: '#1B2430', textAlign: 'center' }}>Create Your Account</h1>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#5B6675', textAlign: 'center' }}>Join the Pharma-Inventory network</p>

          {/* Role selector */}
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#1B2430' }}>I am a:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {([
              { id: 'pharmacy', label: 'Pharmacy', sub: 'Manage inventory & procure medicines', icon: Building2 },
              { id: 'supplier', label: 'Supplier', sub: 'Supply medicines to pharmacies', icon: Truck },
            ] as const).map(({ id, label, sub, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setRole(id)} style={{
                padding: '1rem', border: `2px solid ${role === id ? '#0F9D6D' : '#E4E7EB'}`,
                borderRadius: '0.75rem', background: role === id ? '#E6F7F1' : 'white',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}>
                <Icon size={20} color={role === id ? '#0F9D6D' : '#5B6675'} strokeWidth={1.75} style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 700, color: role === id ? '#0F9D6D' : '#1B2430' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6675', lineHeight: 1.4 }}>{sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label={pharmacyLabel} name="orgName">
                <input value={form.orgName} onChange={e => set('orgName', e.target.value)} className="input-base" placeholder={role === 'pharmacy' ? 'e.g. City Pharmacy' : 'e.g. MedSupply Ltd'} />
              </Field>
              <Field label={personLabel} name="personName">
                <input value={form.personName} onChange={e => set('personName', e.target.value)} className="input-base" placeholder="Full name" />
              </Field>
              <Field label="Registration / License Number" name="licenseNumber">
                <input value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} className="input-base" placeholder="e.g. MH-PH-2024-12345" />
              </Field>
              <Field label="Email Address" name="email" half>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-base" placeholder="you@example.com" />
              </Field>
              <Field label="Phone Number" name="phone" half>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-base" placeholder="10-digit mobile" />
              </Field>
              <Field label="Address" name="address">
                <input value={form.address} onChange={e => set('address', e.target.value)} className="input-base" placeholder="Street address" />
              </Field>
              <Field label="City" name="city" half>
                <input value={form.city} onChange={e => set('city', e.target.value)} className="input-base" placeholder="City" />
              </Field>
              <Field label="Pincode" name="pincode" half>
                <input value={form.pincode} onChange={e => set('pincode', e.target.value)} className="input-base" placeholder="6-digit pincode" maxLength={6} />
              </Field>
              <Field label="Password" name="password" half>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className="input-base"
                    placeholder="Min. 8 characters"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" name="confirmPassword" half>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  className="input-base"
                  placeholder="Re-enter password"
                />
              </Field>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem', marginTop: '1.5rem' }}>
              Create Account
            </button>
          </form>

          <p style={{ margin: '1.25rem 0 0', textAlign: 'center', fontSize: '0.875rem', color: '#5B6675' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0F9D6D', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
