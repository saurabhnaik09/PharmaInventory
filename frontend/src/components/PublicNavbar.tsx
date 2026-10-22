import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E4E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1B2430', letterSpacing: '-0.02em' }}>
              Pharma<span style={{ color: '#0F9D6D' }}>Inventory</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
            {['Home', 'Features', 'How It Works', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#5B6675',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#1B2430'; (e.target as HTMLElement).style.background = '#F1F5F9'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5B6675'; (e.target as HTMLElement).style.background = 'transparent'; }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary hidden md:inline-flex"
              style={{ fontSize: '0.875rem' }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              Get Started
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="btn-ghost md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{
            borderTop: '1px solid #E4E7EB',
            paddingBottom: '1rem',
            paddingTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}>
            {['Home', 'Features', 'How It Works', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.625rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#5B6675',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  display: 'block',
                }}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => { navigate('/login'); setOpen(false); }}
              className="btn-secondary"
              style={{ marginTop: '0.5rem' }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
