import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const guestTabs = [
  { path: '/',        label: 'Scan',    icon: NfcIcon },
  { path: '/wallet',  label: 'Wallet',  icon: WalletIcon },
  { path: '/profile', label: 'Profile', icon: PersonIcon },
];

const providerTabs = [
  { path: '/dashboard',      label: 'Dashboard', icon: ChartIcon },
  { path: '/register-badge', label: 'My Badge',  icon: BadgeIcon },
  { path: '/wallet',         label: 'Wallet',    icon: WalletIcon },
  { path: '/profile',        label: 'Profile',   icon: PersonIcon },
];

export default function BottomNav() {
  const { mode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = mode === 'provider' ? providerTabs : guestTabs;

  // Hide nav on tip flow pages
  const hidden = ['/tip', '/success'].some(p => location.pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav style={styles.nav}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{ ...styles.tab, color: active ? 'var(--gold)' : 'var(--smoke)' }}
          >
            <Icon active={active} />
            <span style={{ ...styles.tabLabel, color: active ? 'var(--gold)' : 'var(--smoke)' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 390,
    background: 'rgba(26,22,18,0.96)',
    backdropFilter: 'blur(12px)',
    borderTop: '0.5px solid var(--onyx-soft)',
    display: 'flex',
    padding: '8px 0 18px',
    zIndex: 100,
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '4px 0',
    transition: 'all 0.15s',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'var(--ff-sans)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};

// SVG Icons
function NfcIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill={c} />
      <path d="M12 5C8.13 5 5 8.13 5 12s3.13 7 7 7 7-3.13 7-7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8.5C9.79 8.5 8 10.29 8 12.5s1.79 4 4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="3" stroke={c} strokeWidth="1.5" />
      <path d="M2 10h20" stroke={c} strokeWidth="1.5" />
      <circle cx="17" cy="15" r="1.5" fill={c} />
    </svg>
  );
}

function PersonIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="9" rx="1" stroke={c} strokeWidth="1.5" />
      <rect x="10" y="7"  width="4" height="14" rx="1" stroke={c} strokeWidth="1.5" />
      <rect x="17" y="3"  width="4" height="18" rx="1" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}

function BadgeIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={c} strokeWidth="1.5" />
      <path d="M9 3v2a3 3 0 006 0V3" stroke={c} strokeWidth="1.5" />
      <path d="M8 12h8M8 16h5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
