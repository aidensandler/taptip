import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PRESETS = [
  { label: '$5',     val: 500,  sub: 'Quick' },
  { label: '$10',    val: 1000, sub: 'Nice' },
  { label: '$20',    val: 2000, sub: 'Generous' },
  { label: 'Custom', val: 0,    sub: 'Enter' },
];

export default function TipPage() {
  const { scannedProvider, addTransaction, setLastTip } = useApp();
  const navigate = useNavigate();
  const [centStr, setCentStr] = useState('1000');
  const [activePreset, setActivePreset] = useState(1);
  const [customMode, setCustomMode] = useState(false);
  const [note, setNote] = useState('');

  const cents = parseInt(centStr || '0', 10);
  const dollars = Math.floor(cents / 100);
  const centsRem = cents % 100;

  function selectPreset(idx, val) {
    setActivePreset(idx);
    if (val === 0) {
      setCustomMode(true);
      setCentStr('0');
    } else {
      setCustomMode(false);
      setCentStr(String(val));
    }
  }

  function kp(k) {
    if (k === 'del') { setCentStr(s => s.slice(0, -1) || '0'); return; }
    if (centStr === '0') { setCentStr(k); return; }
    if (centStr.length >= 5) return;
    setCentStr(s => s + k);
  }

  function send() {
    if (cents === 0) return;
    const tx = {
      id: 't' + Date.now(),
      type: 'sent',
      name: scannedProvider?.name || 'Unknown',
      role: scannedProvider?.role || '',
      amount: Math.round(cents / 100),
      date: new Date().toISOString().split('T')[0],
      note,
    };
    addTransaction(tx);
    setLastTip({ amount: cents, provider: scannedProvider, note, time: new Date() });
    navigate('/success');
  }

  const provider = scannedProvider;

  return (
    <div className="screen slide-up" style={{ padding: 0 }}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate(-1)}>←</button>
        {provider && (
          <div style={styles.miniProvider}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{provider.initials}</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--mist)' }}>{provider.name}</div>
              <div style={{ fontSize: 11, color: 'var(--smoke)' }}>{provider.role} · {provider.venue}</div>
            </div>
          </div>
        )}
      </div>

      {/* Amount display */}
      <div style={styles.amountWrap}>
        <div style={styles.amountLabel}>Tip amount</div>
        <div style={styles.amountDisplay}>
          <span style={styles.currency}>$</span>
          <span style={styles.whole}>{dollars}</span>
          <span style={styles.cents}>.{String(centsRem).padStart(2,'0')}</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div style={styles.presetGrid}>
        {PRESETS.map((p, i) => (
          <div
            key={i}
            style={{ ...styles.presetBtn, ...(activePreset === i ? styles.presetActive : {}) }}
            onClick={() => selectPreset(i, p.val)}
          >
            <span style={styles.presetAmount}>{p.label}</span>
            <span style={styles.presetSub}>{p.sub}</span>
          </div>
        ))}
      </div>

      {/* Keypad */}
      {customMode && (
        <div style={styles.keypad}>
          {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
            <button
              key={i}
              style={{ ...styles.key, ...(k === '' ? { pointerEvents: 'none', opacity: 0 } : {}) }}
              onClick={() => k && kp(k)}
            >
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
      )}

      {/* Note */}
      <div style={{ padding: '0 1.5rem 0.75rem' }}>
        <input
          className="input"
          placeholder="Add a note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ fontSize: 13 }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Payment method row */}
      <div style={styles.payRow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="14" rx="3" stroke="var(--smoke)" strokeWidth="1.5"/>
          <path d="M2 10h20" stroke="var(--smoke)" strokeWidth="1.5"/>
        </svg>
        <span style={{ fontSize: 12, color: 'var(--smoke)', flex: 1 }}>Visa ···· 4242</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', cursor: 'pointer' }}>Change</span>
      </div>

      <div style={{ padding: '0 1.5rem 1rem' }}>
        <button className="btn btn-primary" onClick={send} style={{ opacity: cents === 0 ? 0.5 : 1 }}>
          Send tip {cents > 0 ? `· $${(cents/100).toFixed(2)}` : ''}
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: { padding: '1rem 1.5rem 0.5rem', display: 'flex', alignItems: 'center', gap: 12 },
  back: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gold)', padding: '0 4px' },
  miniProvider: { display: 'flex', alignItems: 'center', gap: 10 },
  amountWrap: { padding: '1rem 1.5rem', textAlign: 'center' },
  amountLabel: { fontSize: 11, color: 'var(--smoke)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 },
  amountDisplay: { display: 'flex', alignItems: 'baseline', justifyContent: 'center' },
  currency: { fontFamily: 'var(--ff-serif)', fontSize: 28, color: 'var(--gold)', marginRight: 2 },
  whole: { fontFamily: 'var(--ff-serif)', fontSize: 60, fontWeight: 300, color: 'var(--gold-light)', lineHeight: 1 },
  cents: { fontFamily: 'var(--ff-serif)', fontSize: 30, color: 'var(--gold-dark)' },
  presetGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 1.5rem 1rem' },
  presetBtn: { background: 'var(--onyx-mid)', border: '0.5px solid var(--onyx-soft)', borderRadius: 12, padding: '10px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' },
  presetActive: { background: 'rgba(201,168,76,0.1)', borderColor: 'var(--gold)' },
  presetAmount: { display: 'block', fontFamily: 'var(--ff-serif)', fontSize: 17, color: 'var(--mist)' },
  presetSub: { display: 'block', fontFamily: 'var(--ff-sans)', fontSize: 9, color: 'var(--smoke)', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' },
  keypad: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, padding: '0 1.5rem 0.75rem' },
  key: { background: 'transparent', border: 'none', borderRadius: 10, padding: '13px', fontFamily: 'var(--ff-serif)', fontSize: 24, fontWeight: 300, color: 'var(--mist)', cursor: 'pointer', textAlign: 'center', transition: 'background 0.1s' },
  payRow: { display: 'flex', alignItems: 'center', gap: 8, margin: '0 1.5rem', padding: '10px 12px', background: 'var(--onyx-mid)', borderRadius: 10, marginBottom: '0.75rem' },
};
