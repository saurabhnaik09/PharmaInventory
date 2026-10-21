import { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar(_props: TopbarProps) {
  const { alerts } = useAppState();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');

  const alertCount = alerts.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/procure?q=${encodeURIComponent(searchQ.trim())}`);
    }
  };

  return (
    <header style={{
      height: '64px',
      background: 'white',
      borderBottom: '1px solid #E4E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="search"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search medicines..."
            className="input-base"
            style={{ paddingLeft: '2.25rem', height: '38px' }}
          />
        </div>
      </form>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {/* Alerts bell */}
        <button
          onClick={() => navigate('/alerts')}
          className="btn-ghost"
          style={{ position: 'relative' }}
          aria-label="View alerts"
        >
          <Bell size={20} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: '4px', right: '4px',
              width: '18px', height: '18px',
              background: '#DC2626',
              borderRadius: '50%',
              fontSize: '0.65rem', fontWeight: 700,
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white',
            }}>
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/settings')}
        className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.5rem' }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #E6F7F1, #C6EFE0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #B7DFCE',
          }}>
            <User size={15} color="#0F9D6D" />
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#1B2430' }} className="hidden sm:block">
            ABC Pharmacy
          </span>
          <ChevronDown size={14} color="#9CA3AF" className="hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
