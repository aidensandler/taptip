import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransactionRow from '../components/TransactionRow';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const EARNINGS_DATA = [12, 35, 20, 45, 30, 80, 40]; // mock weekly earnings

export default function DashboardPage() {
  const { user, transactions } = useApp();
  const [period, setPeriod] = useState('week');

  const received = transactions.filter(t => t.type === 'received');
  const totalThisWeek = received.reduce((s, t) => s + t.amount, 0);
  const totalThisMonth = totalThisWeek * 4.2; // mock
  const avgTip = received.length ? Math.round(totalThisWeek / received.length) : 0;
  const maxBar = Math.max(...EARNINGS_DATA);

  return (
    <div className="screen" style={{ padding: '1.5rem 1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--smoke)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Good evening</p>
          <h2>{user.name.split(' ')[0]}</h2>
        </div>
        <div className="avatar" style={{ width: 42, height: 42, fontSize: 16 }}>{user.initials}</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <span className="stat-label">Available balance</span>
          <span className="stat-value" style={{ fontSize: 36 }}>${user.balance.toFixed(2)}</span>
          <span className="stat-sub">${user.pendingPayout.toFixed(2)} pending · withdrawable now</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">This week</span>
          <span className="stat-value">${totalThisWeek}</span>
          <span className="stat-sub">{received.length} tips</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average tip</span>
          <span className="stat-value">${avgTip}</span>
          <span className="stat-sub">All time</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">This month</span>
          <span className="stat-value">${Math.round(totalThisMonth)}</span>
          <span className="stat-sub">↑ 12% vs last</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rating</span>
          <span className="stat-value">4.97</span>
          <span className="stat-sub">★ 312 reviews</span>
        </div>
      </div>

      {/* Withdraw CTA */}
      {user.balance > 0 && (
        <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
          Withdraw ${user.balance.toFixed(2)} to Chase ···· 6789
        </button>
      )}

      {/* Bar chart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p className="section-label" style={{ marginBottom: 0 }}>Earnings</p>
        <div style={{ display: 'flex', gap: 4 }}>
          {['week','month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              background: period === p ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: `0.5px solid ${period === p ? 'var(--gold-border)' : 'var(--onyx-soft)'}`,
              borderRadius: 6, padding: '3px 10px',
              fontSize: 11, color: period === p ? 'var(--gold)' : 'var(--smoke)',
              cursor: 'pointer', fontFamily: 'var(--ff-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.chartWrap}>
        {EARNINGS_DATA.map((v, i) => (
          <div key={i} style={styles.barCol}>
            <div style={styles.barTrack}>
              <div style={{ ...styles.bar, height: `${(v/maxBar)*100}%`, animationDelay: `${i*0.07}s` }} />
            </div>
            <span style={styles.barLabel}>{DAYS[i]}</span>
          </div>
        ))}
      </div>

      {/* Recent tips */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p className="section-label" style={{ marginBottom: 0 }}>Recent tips</p>
        <span style={{ fontSize: 11, color: 'var(--gold)', cursor: 'pointer' }}>See all</span>
      </div>

      {received.slice(0, 5).map(tx => <TransactionRow key={tx.id} tx={tx} />)}

      {/* Badge status */}
      <div style={{ marginTop: '1.5rem' }}>
        <p className="section-label">Active badge</p>
        <div className="card-gold" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold)" strokeWidth="1.5"/>
              <path d="M9 3v2a3 3 0 006 0V3" stroke="var(--gold)" strokeWidth="1.5"/>
              <circle cx="12" cy="13" r="2" fill="var(--gold)"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--mist)', fontWeight: 400 }}>Badge #MH-0041</div>
            <div style={{ fontSize: 11, color: 'var(--smoke)' }}>Lead Valet · The Monarch Hotel</div>
          </div>
          <span className="badge badge-success">Active</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chartWrap: { display: 'flex', gap: 6, alignItems: 'flex-end', height: 120, padding: '4px 0 0' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' },
  barTrack: { flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' },
  bar: { width: '100%', background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)', borderRadius: '3px 3px 0 0', minHeight: 4, animation: 'slideUp 0.4s ease forwards', transformOrigin: 'bottom' },
  barLabel: { fontSize: 10, color: 'var(--smoke)', marginTop: 5, letterSpacing: '0.04em' },
};
