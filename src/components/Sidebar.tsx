import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity, LayoutDashboard, Package, ShoppingCart,
  ClipboardList, Bell, Settings, User, LogOut,
  Menu, X, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  pharmacyName?: string;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory',  icon: Package,         label: 'Inventory' },
  { to: '/procure',    icon: ShoppingCart,    label: 'Procure Medicine' },
  { to: '/orders',     icon: ClipboardList,   label: 'Orders' },
  { to: '/alerts',     icon: Bell,            label: 'Alerts' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ pharmacyName = 'ABC Pharmacy' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarWidth = collapsed ? '64px' : '240px';

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
      borderRight: '1px solid #E4E7EB',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #E4E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '64px',
      }}>
        {(!collapsed || isMobile) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Activity size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1B2430', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Pharma<span style={{ color: '#0F9D6D' }}>Inv</span>
            </span>
          </div>
        )}
        {collapsed && !isMobile && (
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #0F9D6D, #0B7A54)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={16} color="white" strokeWidth={2.5} />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-ghost"
            style={{ padding: '0.25rem', color: '#9CA3AF' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </button>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ padding: '0.75rem 0.5rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={{ justifyContent: collapsed && !isMobile ? 'center' : undefined }}
              title={collapsed && !isMobile ? label : undefined}
            >
              <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#E4E7EB', margin: '0.75rem 0.375rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {bottomItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={{ justifyContent: collapsed && !isMobile ? 'center' : undefined }}
              title={collapsed && !isMobile ? label : undefined}
            >
              <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Profile */}
      <div style={{
        padding: '0.75rem 0.5rem',
        borderTop: '1px solid #E4E7EB',
      }}>
        {(!collapsed || isMobile) ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.5rem 0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F1F5F9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F9D6D22, #0F9D6D44)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, border: '2px solid #E4E7EB',
            }}>
              <User size={15} color="#0F9D6D" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#1B2430', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pharmacyName}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>Pharmacy</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost"
              style={{ padding: '0.25rem', color: '#94A3B8', flexShrink: 0 }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', color: '#94A3B8' }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: sidebarWidth,
        flexShrink: 0,
        transition: 'width 0.25s ease',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }} className="hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-ghost md:hidden"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', boxShadow: 'var(--shadow-card)' }}
        aria-label="Open Settings"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
            onClick={() => setMobileOpen(false)}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: '260px', zIndex: 50,
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          }}>
            <SidebarContent isMobile />
          </aside>
        </>
      )}
    </>
  );
}
