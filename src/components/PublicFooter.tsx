import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer style={{ background: '#1B2430', color: '#CBD5E1' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={18} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', letterSpacing: '-0.02em' }}>
                Pharma<span style={{ color: '#0F9D6D' }}>Inventory</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94A3B8', marginBottom: '1rem' }}>
              Smarter Inventory. Faster Procurement. The B2B platform for pharmacies and medicine suppliers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <Mail size={13} /> support@pharmainventory.in
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <Phone size={13} /> +91 1800 123 4567
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <MapPin size={13} /> Mumbai, India
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Dashboard', 'Inventory Management', 'Medicine Procurement', 'Order Tracking', 'Alerts & Monitoring'].map(item => (
                <li key={item}>
                  <Link to="/login" style={{ fontSize: '0.875rem', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#E2E8F0'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#94A3B8'}
                  >{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['About Us', 'Careers', 'Partners', 'Press', 'Blog'].map(item => (
                <li key={item}>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#E2E8F0'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#94A3B8'}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Help Center', 'Documentation', 'API Reference', 'Contact Support', 'System Status'].map(item => (
                <li key={item}>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#E2E8F0'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#94A3B8'}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #2D3748',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
            © 2026 PharmaInventory Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ fontSize: '0.8125rem', color: '#64748B', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
