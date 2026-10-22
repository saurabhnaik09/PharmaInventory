import { useState, useEffect } from 'react';
import { 
  Building2, Mail, Phone, MapPin, Shield, Bell, Lock, Save, 
  Moon, Sun, User, Laptop, AlertTriangle, Monitor, Sliders, LogOut, UserMinus
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

type Tab = 'general' | 'pharmacy' | 'notifications' | 'security' | 'appearance' | 'preferences' | 'danger';

export default function SettingsPage() {
  const { success } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- State for Forms ---
  const [general, setGeneral] = useState({
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@abcpharmacy.com',
    phone: '9876543210',
    role: 'Pharmacist'
  });

  const [pharmacy, setPharmacy] = useState({
    pharmacyName: 'ABC Pharmacy',
    ownerName: 'Dr. Rajesh Kumar',
    licenseNumber: 'MH-PH-2021-04321',
    email: 'contact@abcpharmacy.com',
    phone: '022-2634-8976',
    address: '24 Gandhi Road, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
  });

  const [notifications, setNotifications] = useState({
    lowStockAlert: true,
    outOfStockAlert: true,
    expiryAlert: true,
    procurementUpdates: true,
    supplierUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  });
  
  const [preferences, setPreferences] = useState({
    defaultInventoryView: 'Table',
    defaultProcurementSource: 'All',
    itemsPerPage: '25'
  });

  // --- Handlers ---
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    success('Profile Updated', 'Your general profile information has been saved.');
  };

  const handleSavePharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    success('Pharmacy Profile Updated', 'Pharmacy details have been saved.');
  };

  const handleSaveNotifications = () => {
    success('Preferences Saved', 'Your notification preferences have been updated.');
  };
  
  const handleSavePreferences = () => {
    success('Preferences Saved', 'Your application preferences have been updated.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    success('Password Updated', 'Your password has been successfully changed.');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      success('Logged out successfully', '');
      navigate('/login');
    }
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      success('Account deleted', 'Your account has been deleted (mock).');
      navigate('/signup');
    }
  };

  const handleSignOutOtherSessions = () => {
    success('Signed out of other sessions', 'All other active sessions have been terminated.');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <User size={16} /> },
    { id: 'pharmacy', label: 'Pharmacy Information', icon: <Building2 size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Sliders size={16} /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, pharmacy profile, and preferences.</p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: '2rem', 
        flex: 1,
        alignItems: 'flex-start'
      }}>
        {/* Sidebar Navigation */}
        <aside style={{
          width: isMobile ? '100%' : '240px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '0.25rem',
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? '1rem' : 0
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeTab === tab.id ? '#E0F2EC' : 'transparent',
                color: activeTab === tab.id ? '#0F9D6D' : '#4B5563',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ color: activeTab === tab.id ? '#0F9D6D' : '#6B7280' }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, maxWidth: '680px', width: '100%' }}>
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                <h2 className="section-title">General Settings</h2>
              </div>
              <form onSubmit={handleSaveGeneral} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    background: '#0F9D6D', color: 'white', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600
                  }}>
                    RK
                  </div>
                  <div>
                    <button type="button" className="btn-secondary" style={{ marginBottom: '0.25rem' }}>Change Photo</button>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label-base">Full Name</label>
                    <input value={general.name} onChange={e => setGeneral({...general, name: e.target.value})} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Role</label>
                    <input value={general.role} disabled className="input-base" style={{ background: '#F3F4F6' }} />
                  </div>
                  <div>
                    <label className="label-base">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input type="email" value={general.email} onChange={e => setGeneral({...general, email: e.target.value})} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label className="label-base">Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input type="tel" value={general.phone} onChange={e => setGeneral({...general, phone: e.target.value})} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary">
                    <Save size={15} /> Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Pharmacy Info */}
          {activeTab === 'pharmacy' && (
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                <h2 className="section-title">Pharmacy Information</h2>
              </div>
              <form onSubmit={handleSavePharmacy} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label-base">Pharmacy Name</label>
                    <input value={pharmacy.pharmacyName} onChange={e => setPharmacy(p => ({ ...p, pharmacyName: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Owner / Pharmacist Name</label>
                    <input value={pharmacy.ownerName} onChange={e => setPharmacy(p => ({ ...p, ownerName: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">License Number</label>
                    <input value={pharmacy.licenseNumber} onChange={e => setPharmacy(p => ({ ...p, licenseNumber: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input type="email" value={pharmacy.email} onChange={e => setPharmacy(p => ({ ...p, email: e.target.value }))} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label className="label-base">Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input type="tel" value={pharmacy.phone} onChange={e => setPharmacy(p => ({ ...p, phone: e.target.value }))} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label className="label-base">City</label>
                    <input value={pharmacy.city} onChange={e => setPharmacy(p => ({ ...p, city: e.target.value }))} className="input-base" />
                  </div>
                </div>
                <div>
                  <label className="label-base">Street Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input value={pharmacy.address} onChange={e => setPharmacy(p => ({ ...p, address: e.target.value }))} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary">
                    <Save size={15} /> Save Pharmacy Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                <h2 className="section-title">Notification Preferences</h2>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'lowStockAlert', label: 'Low Stock Alerts', desc: 'Get notified when medicines fall below minimum stock' },
                  { key: 'outOfStockAlert', label: 'Out of Stock Alerts', desc: 'Get notified immediately when stock reaches zero' },
                  { key: 'expiryAlert', label: 'Expiry Alerts', desc: 'Get notified when medicines are expiring within 90 days' },
                  { key: 'procurementUpdates', label: 'Procurement Updates', desc: 'Get notified when your requests to other pharmacies are updated' },
                  { key: 'supplierUpdates', label: 'Supplier Updates', desc: 'Get notified when your supplier orders change status' },
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive all selected alerts via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive critical alerts via SMS (charges may apply)' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      style={{
                        width: '44px', height: '24px', borderRadius: '9999px',
                        background: notifications[key as keyof typeof notifications] ? '#0F9D6D' : '#E4E7EB',
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: '2px',
                        left: notifications[key as keyof typeof notifications] ? '22px' : '2px',
                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={handleSaveNotifications} className="btn-primary">
                    <Save size={15} /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                  <h2 className="section-title">Change Password</h2>
                </div>
                <form onSubmit={handleUpdatePassword} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="label-base">Current Password</label>
                    <input type="password" required className="input-base" placeholder="••••••••" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="label-base">New Password</label>
                      <input type="password" required minLength={8} className="input-base" placeholder="Min. 8 characters" />
                    </div>
                    <div>
                      <label className="label-base">Confirm New Password</label>
                      <input type="password" required minLength={8} className="input-base" placeholder="Re-enter new password" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn-primary">
                      <Lock size={15} /> Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                  <h2 className="section-title">Active Sessions</h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Monitor size={24} color="#0F9D6D" />
                      <div>
                        <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600 }}>Windows • Chrome</p>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>Mumbai, India • Active now</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F9D6D', background: '#E0F2EC', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>Current</span>
                  </div>
                  
                  <div style={{ borderTop: '1px solid #E4E7EB', margin: '0.5rem 0' }}></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Laptop size={24} color="#6B7280" />
                      <div>
                        <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600 }}>MacBook • Safari</p>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>Delhi, India • Last active 2 days ago</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                    <button onClick={handleSignOutOtherSessions} className="btn-secondary" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>
                      Sign out of other sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                <h2 className="section-title">Appearance</h2>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Theme Preference</p>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: '#6B7280' }}>Customize how Pharma Inventory looks on your device.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '1rem' }}>
                    <button 
                      onClick={() => theme !== 'light' && toggleTheme()}
                      style={{ 
                        border: theme === 'light' ? '2px solid #0F9D6D' : '2px solid #E4E7EB',
                        borderRadius: '0.5rem', padding: '1rem', background: 'white',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <Sun size={24} color={theme === 'light' ? '#0F9D6D' : '#6B7280'} />
                      <span style={{ fontWeight: 500, color: theme === 'light' ? '#1B2430' : '#6B7280' }}>Light</span>
                    </button>
                    
                    <button 
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      style={{ 
                        border: theme === 'dark' ? '2px solid #0F9D6D' : '2px solid #E4E7EB',
                        borderRadius: '0.5rem', padding: '1rem', background: '#1B2430',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <Moon size={24} color={theme === 'dark' ? '#0F9D6D' : '#9CA3AF'} />
                      <span style={{ fontWeight: 500, color: 'white' }}>Dark</span>
                    </button>

                    <button 
                      style={{ 
                        border: '2px solid #E4E7EB',
                        borderRadius: '0.5rem', padding: '1rem', background: 'linear-gradient(135deg, #ffffff 50%, #1B2430 50%)',
                        cursor: 'not-allowed', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                        opacity: 0.7
                      }}
                    >
                      <Monitor size={24} color="#6B7280" />
                      <span style={{ fontWeight: 500, color: '#1B2430', background: 'white', padding: '0 4px', borderRadius: '2px' }}>System</span>
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E4E7EB', margin: '0.5rem 0' }}></div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: '0 0 0.125rem', fontSize: '0.875rem', fontWeight: 600 }}>Compact Mode</p>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>Reduces spacing in tables and lists to show more data.</p>
                    </div>
                    <button
                      style={{
                        width: '44px', height: '24px', borderRadius: '9999px',
                        background: '#E4E7EB', border: 'none', cursor: 'pointer', position: 'relative',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: '2px', left: '2px',
                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E4E7EB' }}>
                <h2 className="section-title">Application Preferences</h2>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="label-base">Default Inventory View</label>
                  <select 
                    value={preferences.defaultInventoryView}
                    onChange={(e) => setPreferences({...preferences, defaultInventoryView: e.target.value})}
                    className="input-base"
                  >
                    <option value="Table">Table View</option>
                    <option value="Compact Table">Compact Table</option>
                  </select>
                </div>
                
                <div>
                  <label className="label-base">Default Procurement Source</label>
                  <select 
                    value={preferences.defaultProcurementSource}
                    onChange={(e) => setPreferences({...preferences, defaultProcurementSource: e.target.value})}
                    className="input-base"
                  >
                    <option value="All">All Sources</option>
                    <option value="Pharmacies">Pharmacies Only</option>
                    <option value="Suppliers">Suppliers Only</option>
                  </select>
                </div>

                <div>
                  <label className="label-base">Items Per Page (Tables)</label>
                  <select 
                    value={preferences.itemsPerPage}
                    onChange={(e) => setPreferences({...preferences, itemsPerPage: e.target.value})}
                    className="input-base"
                  >
                    <option value="10">10 items</option>
                    <option value="25">25 items</option>
                    <option value="50">50 items</option>
                    <option value="100">100 items</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={handleSavePreferences} className="btn-primary">
                    <Save size={15} /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <div className="card" style={{ borderColor: '#FCA5A5' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #FCA5A5', background: '#FEF2F2', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>
                <h2 className="section-title" style={{ color: '#DC2626' }}>Danger Zone</h2>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#1B2430' }}>Sign Out</p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>Sign out of your account on this device.</p>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary" style={{ color: '#1B2430', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #E4E7EB' }}></div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#DC2626' }}>Delete Account</p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>Permanently delete your account, inventory data, and history. This action cannot be undone.</p>
                  </div>
                  <button onClick={handleDeleteAccount} className="btn-primary" style={{ background: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <UserMinus size={15} /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
