
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import {
  Package, Bell, Clock, Search, Building2, Truck,
  ArrowRight, CheckCircle2, Shield, Zap,
  ChevronRight, Star
} from 'lucide-react';

const features = [
  { icon: Package, title: 'Inventory Management', desc: 'Digitally manage your entire medicine inventory with batch tracking, stock levels, and real-time updates.' },
  { icon: Bell, title: 'Low Stock Alerts', desc: 'Get automatic alerts when medicines fall below minimum stock thresholds. Never run out unexpectedly.' },
  { icon: Clock, title: 'Expiry Monitoring', desc: 'Track expiry dates across all batches. Flag medicines expiring within 90 days for timely action.' },
  { icon: Search, title: 'Medicine Availability Search', desc: 'Search medicine availability across connected pharmacies and trusted suppliers instantly.' },
  { icon: Building2, title: 'Pharmacy-to-Pharmacy Procurement', desc: 'Request medicines directly from nearby pharmacies for same-day or next-day availability.' },
  { icon: Truck, title: 'Supplier Ordering', desc: 'Place orders with verified suppliers with transparent pricing, MOQ, and estimated delivery timelines.' },
];

const steps = [
  { num: '01', title: 'Manage', desc: 'Add and organize your pharmacy inventory with detailed medicine profiles, batches, and stock levels.' },
  { num: '02', title: 'Monitor', desc: 'Track stock levels and expiry dates in real-time. Receive automatic low-stock and expiry alerts.' },
  { num: '03', title: 'Search', desc: 'Find medicine availability across connected pharmacies and trusted suppliers in your network.' },
  { num: '04', title: 'Procure', desc: 'Request medicines from another pharmacy or place a supplier order — all from one platform.' },
];

const stats = [
  { value: '2,400+', label: 'Pharmacies Connected' },
  { value: '180+', label: 'Verified Suppliers' },
  { value: '48,000+', label: 'Medicines Tracked' },
  { value: '99.2%', label: 'Uptime SLA' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9' }}>
      <PublicNavbar />

      {/* ── HERO ── */}
      <section id="home" style={{
        background: 'linear-gradient(135deg, #0F9D6D08 0%, #FAFAF9 60%)',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #0F9D6D10, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#E6F7F1', border: '1px solid #B7DFCE',
              borderRadius: '9999px', padding: '0.375rem 0.875rem',
              marginBottom: '1.5rem',
            }}>
              <Star size={13} color="#0F9D6D" fill="#0F9D6D" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0B7A54' }}>B2B Pharmacy Platform — v1.0</span>
            </div>
            <h1 style={{
              margin: '0 0 1rem', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800, color: '#1B2430', lineHeight: 1.15, letterSpacing: '-0.03em',
            }}>
              Smarter Inventory.<br />
              <span style={{ color: '#0F9D6D' }}>Faster Procurement.</span>
            </h1>
            <p style={{ margin: '0 0 2rem', fontSize: '1.0625rem', color: '#5B6675', lineHeight: 1.7, maxWidth: '500px' }}>
              Manage your pharmacy inventory digitally, monitor stock and expiry,
              and quickly source medicines from connected pharmacies and trusted suppliers.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} className="btn-primary" style={{ fontSize: '0.9375rem', padding: '0.7rem 1.5rem' }}>
                Get Started <ArrowRight size={16} />
              </button>
              <a href="#features" className="btn-secondary" style={{ fontSize: '0.9375rem', padding: '0.7rem 1.5rem', textDecoration: 'none' }}>
                Explore Features
              </a>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[{ icon: Shield, text: 'CDSCO Compliant' }, { icon: Zap, text: 'Real-time Updates' }, { icon: CheckCircle2, text: 'Verified Suppliers' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Icon size={14} color="#0F9D6D" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#5B6675' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '540px' }}>
            <div style={{
              background: 'white', borderRadius: '1.25rem',
              border: '1px solid #E4E7EB',
              boxShadow: '0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              {/* Mock topbar */}
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFBFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FC5F5A' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBD2E' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C840' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Pharma-Inventory Dashboard</span>
                <div style={{ width: '40px' }} />
              </div>

              {/* KPI Cards */}
              <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Total Medicines', value: '1,248', color: '#0F9D6D', bg: '#E6F7F1' },
                  { label: 'Low Stock', value: '18', color: '#D97706', bg: '#FEF3C7' },
                  { label: 'Expiring Soon', value: '24', color: '#2563EB', bg: '#DBEAFE' },
                  { label: 'Pending Orders', value: '7', color: '#7C3AED', bg: '#F3E8FF' },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: kpi.bg, borderRadius: '0.75rem', padding: '0.875rem', border: `1px solid ${kpi.color}22` }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: kpi.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Mini table */}
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', fontWeight: 600, color: '#1B2430' }}>Recent Inventory</p>
                {[
                  { name: 'Azithromycin 500mg', status: 'out_of_stock', stock: 0 },
                  { name: 'Metformin 500mg', status: 'low_stock', stock: 25 },
                  { name: 'Paracetamol 500mg', status: 'in_stock', stock: 450 },
                ].map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#1B2430' }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{item.stock} units</span>
                      <span className={`badge badge-${item.status.replace('_', '-')}`} style={{ fontSize: '0.7rem' }}>
                        {item.status === 'out_of_stock' ? 'Out of Stock' : item.status === 'low_stock' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#0F9D6D', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#A7F3D0', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1B2430', letterSpacing: '-0.02em' }}>
              When a Medicine Is Out of Stock,<br />Every Hour Matters.
            </h2>
            <p style={{ margin: 0, fontSize: '1.0625rem', color: '#5B6675', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Traditional procurement delays cost pharmacies—and patients—critical time.
              Here's what typically happens without Pharma-Inventory.
            </p>
          </div>

          {/* Flow steps */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
            {[
              { label: 'Patient needs medicine', color: '#1B2430', bg: '#F8FAFC' },
              { label: 'Pharmacy checks inventory', color: '#1B2430', bg: '#F8FAFC' },
              { label: 'Medicine unavailable', color: '#DC2626', bg: '#FEE2E2' },
              { label: 'Supplier takes days', color: '#DC2626', bg: '#FEE2E2' },
              { label: 'Patient waits...', color: '#DC2626', bg: '#FEE2E2' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: step.bg, border: `1px solid ${step.color}22`,
                  borderRadius: '0.75rem', padding: '1rem 1.25rem',
                  textAlign: 'center', minWidth: '140px',
                }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: step.color }}>{step.label}</p>
                </div>
                {i < 4 && <ChevronRight size={20} color="#CBD5E1" style={{ margin: '0 0.25rem', flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* Solution CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #E6F7F1, #F0FDF4)',
            border: '1px solid #B7DFCE', borderRadius: '1.25rem',
            padding: '2.5rem', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(15, 157, 109, 0.08)',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#0F9D6D', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Search size={24} color="white" />
            </div>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.375rem', fontWeight: 700, color: '#1B2430' }}>
              Find Available Medicines Instantly
            </h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '1rem', color: '#374151', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Pharma-Inventory connects you to the nearest pharmacies and verified suppliers
              who have the medicine in stock — so you can procure it within hours, not days.
            </p>
            <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '0.7rem 1.75rem', fontSize: '0.9375rem' }}>
              Start Procuring Faster <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: '#FAFAF9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1B2430', letterSpacing: '-0.02em' }}>
              Everything Your Pharmacy Needs
            </h2>
            <p style={{ margin: 0, fontSize: '1.0625rem', color: '#5B6675', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              A complete platform for pharmacy inventory management and medicine procurement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-hover" style={{ padding: '1.75rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: '#E6F7F1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={22} color="#0F9D6D" strokeWidth={1.75} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#1B2430' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#5B6675', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1B2430', letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
            <p style={{ margin: 0, fontSize: '1.0625rem', color: '#5B6675' }}>
              Four simple steps to smarter pharmacy operations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '28px', left: 'calc(50% + 28px)',
                    width: 'calc(100% - 56px)', height: '2px',
                    background: 'linear-gradient(to right, #0F9D6D40, #0F9D6D10)',
                    display: 'none',
                  }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: '0 4px 16px rgba(15, 157, 109, 0.3)',
                  }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white' }}>{step.num}</span>
                  </div>
                  <h3 style={{ margin: '0 0 0.625rem', fontSize: '1.125rem', fontWeight: 700, color: '#1B2430' }}>{step.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#5B6675', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            Ready to Modernize Your Pharmacy?
          </h2>
          <p style={{ margin: '0 0 2rem', fontSize: '1.0625rem', color: '#A7F3D0', lineHeight: 1.7 }}>
            Join thousands of pharmacies using Pharma-Inventory to manage stock smarter and procure faster.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup')} style={{
              background: 'white', color: '#0F9D6D', border: 'none',
              padding: '0.75rem 1.75rem', borderRadius: '0.5rem',
              fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              transition: 'transform 0.1s',
            }}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.5)',
              padding: '0.75rem 1.75rem', borderRadius: '0.5rem',
              fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
            }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
