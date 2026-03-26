import React from 'react';

export default function TransactionRow({ tx, showBadge = false }) {
  const isSent = tx.type === 'sent';
  return (
    <div style={styles.row}>
      <div
        className="avatar"
        style={{ width: 38, height: 38, fontSize: 14, background: isSent ? 'var(--onyx-mid)' : 'rgba(201,168,76,0.08)', borderColor: isSent ? 'var(--onyx-soft)' : 'var(--gold-dark)' }}
      >
        {tx.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
      </div>
      <div style={styles.info}>
        <div style={styles.name}>{tx.name}</div>
        <div style={styles.meta}>
          {tx.role ? tx.role + ' · ' : ''}{tx.date}
        </div>
        {tx.note ? <div style={styles.note}>"{tx.note}"</div> : null}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...styles.amount, color: isSent ? 'var(--mist)' : 'var(--gold)' }}>
          {isSent ? '-' : '+'}${tx.amount}
        </div>
        {showBadge && (
          <span className="badge" style={{ fontSize: 9, padding: '2px 7px', ...(isSent ? { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--onyx-soft)', color: 'var(--smoke)' } : { background: 'rgba(201,168,76,0.08)', borderColor: 'var(--gold-border)', color: 'var(--gold)' }) }}>
            {isSent ? 'sent' : 'received'}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 0',
    borderBottom: '0.5px solid var(--onyx-soft)',
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, color: 'var(--mist)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  meta: { fontSize: 11, color: 'var(--smoke)', marginTop: 2 },
  note: { fontSize: 11, color: 'var(--smoke)', fontStyle: 'italic', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  amount: { fontFamily: 'var(--ff-serif)', fontSize: 18, fontWeight: 400 },
};
