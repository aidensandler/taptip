import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, mode, setMode } = useApp();
  const [notifs, setNotifs] = useState(true);
  const [instantPay, setInstantPay] = useState(false);

  function toggle(setter) { setter(v => !v); }

  return (
    <div className="screen" style={{ padding: '1.5rem' }}>
      {/* Profile header */}
      <div style={styles.profileHeader}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>{user.initials}</div>
        <div>
          <h2 style={{ marginBottom: 4 }}>{user.name}</h2>
          <p style={{ fontSize: 13 }}>{user.email}</p>
          <span className={`badge ${mode === 'provider' ? 'badge-gold' : 'badge-smoke'}`} style={{ marginTop: 6 }}>
            {mode === 'provider' ? '✦ Provider' : 'Guest'}
          </span>
        </div>
      </div>

      {/* Mode switch */}
      <div className="card-gold" style={{ marginBottom: '1.5rem' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>App mode</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => setMode('guest')}
            style={{ ...styles.modeBtn, ...(mode === 'guest' ? styles.modeBtnActive : {}) }}
          >
            <GuestIcon active={mode === 'guest'} />
            <span style={{ fontSize: 13, marginTop: 6, color: mode === 'guest' ? 'var(--gold)' : 'var(--smoke)' }}>Guest</span>
            <span style={{ fontSize: 10, color: 'var(--smoke)', textAlign: 'center' }}>Send tips</span>
          </button>
          <button
            onClick={() => setMode('provider')}
            style={{ ...styles.modeBtn, ...(mode === 'provider' ? styles.modeBtnActive : {}) }}
          >
            <ProviderIcon active={mode === 'provider'} />
            <span style={{ fontSize: 13, marginTop: 6, color: mode === 'provider' ? 'var(--gold)' : 'var(--smoke)' }}>Provider</span>
            <span style={{ fontSize: 10, color: 'var(--smoke)', textAlign: 'center' }}>Receive tips</span>
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
          Switch to Provider mode to access your dashboard, register badges, and manage payouts.
        </p>
      </div>

      {/* Settings */}
      <p className="section-label">Preferences</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">Push notifications</div>
            <div style={{ fontSize: 11, color: 'var(--smoke)' }}>Tip confirmations & payouts</div>
          </div>
          <div className={`toggle ${notifs ? 'on' : ''}`} onClick={() => toggle(setNotifs)} />
        </div>
        <div className="divider" style={{ margin: '0' }} />
        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">Instant payouts</div>
            <div style={{ fontSize: 11, color: 'var(--smoke)' }}>1.5% fee · available immediately</div>
          </div>
          <div className={`toggle ${instantPay ? 'on' : ''}`} onClick={() => toggle(setInstantPay)} />
        </div>
      </div>

      {/* Account links */}
      <p className="section-label">Account</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {[
          ['Edit profile', ArrowIcon],
          ['Privacy & security', ArrowIcon],
          ['Help & support', ArrowIcon],
          ['Terms of service', ArrowIcon],
        ].map(([label, Icon]) => (
          <div key={label} className="list-row">
            <span style={{ fontSize: 14, color: 'var(--mist)', flex: 1 }}>{label}</span>
            <Icon />
          </div>
        ))}
      </div>

      {/* Version / sign out */}
      <button className="btn btn-danger" style={{ marginBottom: '0.75rem' }}>Sign out</button>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--smoke)' }}>TapTip v1.0.0 · MIT License</p>
    </div>
  );
}

function GuestIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ProviderIcon({ active }) {
  const c = active ? 'var(--gold)' : 'var(--smoke)';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={c} strokeWidth="1.5"/>
      <path d="M9 3v2a3 3 0 006 0V3" stroke={c} strokeWidth="1.5"/>
      <circle cx="12" cy="13" r="2" fill={c}/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="var(--onyx-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const styles = {
  profileHeader: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: '1.5rem' },
  modeBtn: { background: 'var(--onyx-mid)', border: '0.5px solid var(--onyx-soft)', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.15s' },
  modeBtnActive: { background: 'rgba(201,168,76,0.06)', borderColor: 'var(--gold-border)' },
};
