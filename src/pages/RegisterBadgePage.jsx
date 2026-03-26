import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { writeTag, NFC_SUPPORTED } from '../utils/nfc';

const ROLES = ['Valet','Concierge','Sommelier','Butler','Bellhop','Housekeeping','Server','Bartender','Chef','Spa Therapist','Other'];

export default function RegisterBadgePage() {
  const { user } = useApp();
  const [step, setStep] = useState('form'); // form | writing | done
  const [form, setForm] = useState({ role: 'Valet', venue: 'The Monarch Hotel', badgeId: '' });
  const [error, setError] = useState('');
  const [registeredBadges, setRegisteredBadges] = useState([
    { id: 'MH-0041', role: 'Lead Valet', venue: 'The Monarch Hotel', registeredAt: '2024-11-15' },
  ]);

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.badgeId.trim()) { setError('Enter a badge ID'); return; }
    setError('');
    setStep('writing');
    try {
      await writeTag(form.badgeId.trim());
      setRegisteredBadges(b => [
        { id: form.badgeId.trim(), role: form.role, venue: form.venue, registeredAt: new Date().toISOString().split('T')[0] },
        ...b,
      ]);
      setStep('done');
    } catch (e) {
      setError(e.message);
      setStep('form');
    }
  }

  if (step === 'writing') {
    return (
      <div className="screen" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', animation: 'pulseGold 1.2s ease-in-out infinite' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="var(--gold)"/>
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 22, color: 'var(--linen)', textAlign: 'center', marginBottom: 8 }}>
          {NFC_SUPPORTED ? 'Hold phone to badge…' : 'Programming badge…'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--smoke)', textAlign: 'center' }}>
          {NFC_SUPPORTED ? 'Keep your phone near the NFC tag' : 'Simulating write in development mode'}
        </p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="screen fade-in" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16l6 6 10-10" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Badge registered</p>
        <h1 style={{ textAlign: 'center', marginBottom: 6 }}>{form.badgeId}</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>{form.role} · {form.venue}</p>
        <div className="card" style={{ width: '100%', marginBottom: '1.5rem' }}>
          {[['Badge ID', form.badgeId], ['Role', form.role], ['Venue', form.venue], ['Provider', user.name], ['Registered', new Date().toLocaleDateString()]].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--onyx-soft)' }}>
              <span style={{ fontSize: 12, color: 'var(--smoke)' }}>{k}</span>
              <span style={{ fontSize: 13, color: 'var(--mist)' }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setStep('form')}>Register another</button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: 6 }}>My Badge</h2>
      <p style={{ marginBottom: '1.5rem', fontSize: 13 }}>Register your NFC lapel pin so guests can tip you instantly.</p>

      {/* How it works */}
      <div className="card-gold" style={{ marginBottom: '1.5rem' }}>
        <p className="section-label" style={{ marginBottom: 10 }}>How badge registration works</p>
        {[
          ['1', 'Order an NFC lapel badge from your venue manager'],
          ['2', 'Enter your badge ID below (printed on the back)'],
          ['3', 'Hold your phone to the badge to program it'],
          ['4', 'Guests can now tap your badge to tip you instantly'],
        ].map(([n, text]) => (
          <div key={n} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--gold)', flexShrink: 0 }}>{n}</span>
            <span style={{ fontSize: 13, color: 'var(--smoke)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Registration form */}
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label className="input-label">Badge ID</label>
          <input
            className="input"
            placeholder="e.g. MH-0042"
            value={form.badgeId}
            onChange={e => setForm(f => ({...f, badgeId: e.target.value.toUpperCase()}))}
            required
          />
          <span style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 4 }}>Found on the back of your lapel badge</span>
        </div>

        <div className="input-group">
          <label className="input-label">Your role</label>
          <select
            className="input"
            value={form.role}
            onChange={e => setForm(f => ({...f, role: e.target.value}))}
            style={{ appearance: 'none', cursor: 'pointer' }}
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Venue / employer</label>
          <input
            className="input"
            placeholder="Hotel or restaurant name"
            value={form.venue}
            onChange={e => setForm(f => ({...f, venue: e.target.value}))}
            required
          />
        </div>

        {error && <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 10 }}>{error}</p>}

        <button type="submit" className="btn btn-primary">
          {NFC_SUPPORTED ? 'Program badge' : 'Register badge (demo)'}
        </button>
      </form>

      {/* Existing badges */}
      {registeredBadges.length > 0 && (
        <>
          <div className="divider" style={{ margin: '1.5rem 0' }} />
          <p className="section-label">Registered badges</p>
          {registeredBadges.map(b => (
            <div key={b.id} style={styles.badgeRow}>
              <div style={styles.badgeIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold-dark)" strokeWidth="1.5"/>
                  <path d="M9 3v2a3 3 0 006 0V3" stroke="var(--gold-dark)" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="2" fill="var(--gold-dark)"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--mist)' }}>#{b.id}</div>
                <div style={{ fontSize: 11, color: 'var(--smoke)' }}>{b.role} · {b.venue}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success" style={{ fontSize: 9 }}>Active</span>
                <div style={{ fontSize: 10, color: 'var(--smoke)', marginTop: 3 }}>{b.registeredAt}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

const styles = {
  badgeRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid var(--onyx-soft)' },
  badgeIcon: { width: 36, height: 36, background: 'var(--gold-faint)', border: '0.5px solid var(--gold-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
