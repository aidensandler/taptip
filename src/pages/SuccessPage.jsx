import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SuccessPage() {
  const { lastTip } = useApp();
  const navigate = useNavigate();
  const tip = lastTip;
  if (!tip) { navigate('/'); return null; }

  const dollars = Math.floor(tip.amount / 100);
  const centsRem = tip.amount % 100;
  const timeStr = tip.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <div className="screen fade-in" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      {/* Check mark */}
      <div style={styles.glyph}>
        <div style={styles.glyphRing} />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 16l6 6 10-10" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <p style={styles.sentLabel}>Tip sent</p>

      <div style={styles.amountDisplay}>
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, color: 'var(--gold)', marginRight: 2 }}>$</span>
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 56, fontWeight: 300, color: 'var(--linen)', lineHeight: 1 }}>{dollars}</span>
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, color: 'var(--gold-dark)' }}>.{String(centsRem).padStart(2,'0')}</span>
      </div>

      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: '2rem' }}>
        to <strong style={{ color: 'var(--mist)', fontWeight: 400 }}>{tip.provider?.name}</strong>
      </p>

      {/* Receipt */}
      <div className="card" style={{ width: '100%', marginBottom: '1.5rem' }}>
        {[
          ['Provider',  tip.provider?.name],
          ['Role',      tip.provider?.role],
          ['Venue',     tip.provider?.venue],
          ['Badge',     tip.provider?.id],
          ['Note',      tip.note || '—'],
          ['Time',      timeStr],
          ['Amount',    `$${(tip.amount/100).toFixed(2)}`],
        ].map(([k, v]) => (
          <div key={k} style={styles.receiptRow}>
            <span style={{ fontSize: 12, color: 'var(--smoke)' }}>{k}</span>
            <span style={{ fontSize: 13, color: k === 'Amount' ? 'var(--gold)' : 'var(--mist)' }}>{v}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/')}>Done</button>
    </div>
  );
}

const styles = {
  glyph: { width: 88, height: 88, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative' },
  glyphRing: { position: 'absolute', width: 104, height: 104, borderRadius: '50%', border: '0.5px solid rgba(201,168,76,0.2)', animation: 'pulseGold 2s ease-out infinite' },
  sentLabel: { fontFamily: 'var(--ff-serif)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 },
  amountDisplay: { display: 'flex', alignItems: 'baseline', marginBottom: 6 },
  receiptRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--onyx-soft)' },
};
