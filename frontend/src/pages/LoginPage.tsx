import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'pharmacy' | 'supplier'>('pharmacy');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (role === 'pharmacy') navigate('/dashboard');
    else navigate('/supplier/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1B2430', letterSpacing: '-0.02em' }}>
              Pharma<span style={{ color: '#0F9D6D' }}>Inventory</span>
            </span>
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ margin: '0 0 0.375rem', fontSize: '1.375rem', fontWeight: 800, color: '#1B2430', textAlign: 'center' }}>Welcome back</h1>
          <p style={{ margin: '0 0 1.75rem', fontSize: '0.9rem', color: '#5B6675', textAlign: 'center' }}>Sign in to your account</p>

          {/* Role selector */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '0.625rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
            {(['pharmacy', 'supplier'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.15s',
                background: role === r ? 'white' : 'transparent',
                color: role === r ? '#0F9D6D' : '#5B6675',
                boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
                {r === 'pharmacy' ? '🏥 Pharmacy' : '🏭 Supplier'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label-base">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base" placeholder="you@pharmacy.com" autoComplete="email" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="label-base" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8125rem', color: '#0F9D6D', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: '#FEE2E2', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>
                <AlertCircle size={15} color="#DC2626" />
                <span style={{ fontSize: '0.8125rem', color: '#B91C1C' }}>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Sign In
            </button>
          </form>

          <p style={{ margin: '1.25rem 0 0', textAlign: 'center', fontSize: '0.875rem', color: '#5B6675' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#0F9D6D', fontWeight: 600, textDecoration: 'none' }}>Get Started</Link>
          </p>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: '1rem', padding: '0.875rem 1rem', background: '#E6F7F1', borderRadius: '0.75rem', border: '1px solid #B7DFCE', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#0B7A54' }}>
            <strong>Demo:</strong> Enter any email & password and click Sign In
          </p>
        </div>
      </div>
    </div>
  );
}
