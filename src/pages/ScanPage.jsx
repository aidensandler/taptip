import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, MOCK_PROVIDERS } from '../context/AppContext';
import { scanTag } from '../utils/nfc';

export default function ScanPage() {
  const { setScannedProvider, transactions, mode } = useApp();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [found, setFound] = useState(null);

  const recentSent = transactions.filter(t => t.type === 'sent').slice(0, 3);

  async function handleScan() {
    setScanning(true);
    setError('');
    try {
      const { id } = await scanTag({ mockId: 'MH-0041' });
      const provider = MOCK_PROVIDERS[id];
      if (!provider) {
        setError(`Badge "${id}" not found. Ask your provider to register their badge.`);
        setScanning(false);
        return;
      }
      setFound(provider);
      setScannedProvider(provider);
      setScanning(false);
    } catch (e) {
      setError(e.message);
      setScanning(false);
    }
  }

  function proceed() {
    navigate('/tip');
  }

  if (found) {
    return (
      <div className="screen fade-in" style={{ padding: '0 0 1rem' }}>
        {/* Back */}
        <div style={styles.backBar} onClick={() => setFound(null)}>
          <span style={{ color: 'var(--gold)', fontSize: 18 }}>←</span>
          <span style={{ fontSize: 13, color: 'var(--smoke)' }}>Scan</span>
        </div>

        {/* Provider hero */}
        <div style={styles.hero}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <div style={styles.goldRing} />
            <div className="avatar" style={styles.bigAvatar}>{found.initials}</div>
          </div>
          <div className="badge badge-gold" style={{ marginBottom: 8 }}>
            <span>✦</span> Verified provider
          </div>
          <h1 style={{ textAlign: 'center', marginBottom: 4 }}>{found.name}</h1>
          <p style={{ textAlign: 'center', marginBottom: 10 }}>{found.role} · {found.venue}</p>
          <div style={styles.ratingRow}>
            <span style={{ color: 'var(--gold)', fontSize: 13, letterSpacing: 1 }}>{'★'.repeat(5)}</span>
            <span style={{ fontSize: 12, color: 'var(--smoke)', marginLeft: 6 }}>{found.rating} · {found.reviewCount} tips</span>
          </div>
        </div>

        {/* NFC tag confirm */}
        <div style={styles.tagChip}>
          <span style={styles.nfcDot} />
          <span style={{ fontSize: 12, color: 'var(--smoke)' }}>Badge #{found.id} · scanned just now</span>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 1.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" onClick={proceed}>Send a tip</button>
          <button className="btn btn-ghost" onClick={() => setFound(null)}>Not the right person</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: 0 }}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.brand}>Tap<em style={{ fontStyle: 'italic', fontWeight: 300 }}>Tip</em></span>
        <span style={styles.statusDot} />
      </div>

      {/* NFC ring */}
      <div style={styles.nfcZone}>
        <div style={styles.ringWrap} onClick={handleScan}>
          {[0,1,2].map(i => <div key={i} style={{ ...styles.ring, animationDelay: `${i * 0.4}s` }} />)}
          <div style={{ ...styles.nfcCore, transform: scanning ? 'scale(0.95)' : 'scale(1)' }}>
            {scanning ? <Spinner /> : <NfcSvg />}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 24, fontWeight: 300, color: 'var(--linen)', marginBottom: 8 }}>
            {scanning ? 'Reading tag…' : 'Hold near lapel pin'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--smoke)', lineHeight: 1.6 }}>
            {scanning ? 'Keep your phone steady' : 'Tap the NFC symbol on\nyour provider\'s badge'}
          </p>
        </div>
        {error && <p style={{ fontSize: 12, color: 'var(--danger)', textAlign: 'center', padding: '0 2rem' }}>{error}</p>}
      </div>

      {/* Divider */}
      <div className="divider-label" style={{ padding: '0 1.5rem' }}>
        <span>Recent tips</span>
      </div>

      {/* Recents */}
      <div style={{ padding: '0 1.5rem' }}>
        {recentSent.map(tx => (
          <div key={tx.id} style={styles.recentRow}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
              {tx.name.split(' ').map(w => w[0]).join('').slice(0,2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--mist)' }}>{tx.name}</div>
              <div style={{ fontSize: 11, color: 'var(--smoke)' }}>{tx.role}</div>
            </div>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, color: 'var(--mist)' }}>${tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ width: 28, height: 28, border: '2px solid var(--onyx-soft)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  );
}

function NfcSvg() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 11c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2" fill="#C9A84C"/>
      <path d="M22 6l2 2-2 2M24 8h-4" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const styles = {
  header: { padding: '1.5rem 1.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontFamily: 'var(--ff-serif)', fontSize: 22, fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.04em' },
  statusDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' },
  nfcZone: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 2rem 2rem', gap: '1.75rem' },
  ringWrap: { position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  ring: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', animation: 'pulseGold 2.4s ease-out infinite' },
  nfcCore: { width: 72, height: 72, borderRadius: '50%', background: 'var(--onyx-mid)', border: '1.5px solid var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, transition: 'transform 0.15s' },
  recentRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid var(--onyx-soft)' },
  backBar: { padding: '1rem 1.5rem 0.5rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  hero: { padding: '0.75rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  bigAvatar: { width: 80, height: 80, fontSize: 28, borderWidth: 2 },
  goldRing: { position: 'absolute', width: 92, height: 92, borderRadius: '50%', border: '0.5px solid rgba(201,168,76,0.3)' },
  ratingRow: { display: 'flex', alignItems: 'center' },
  tagChip: { margin: '0 1.5rem', padding: '10px 14px', background: 'var(--gold-faint)', border: '0.5px solid var(--gold-border)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 },
  nfcDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, animation: 'pulseGold 1.5s ease-in-out infinite' },
};
