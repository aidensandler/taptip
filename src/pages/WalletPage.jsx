import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransactionRow from '../components/TransactionRow';

export default function WalletPage() {
  const { user, transactions, mode } = useApp();
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [bankForm, setBankForm] = useState({ routing: '', account: '', name: '' });
  const [methods, setMethods] = useState(user.paymentMethods);
  const [saved, setSaved] = useState('');

  const relevantTx = mode === 'provider'
    ? transactions.filter(t => t.type === 'received')
    : transactions.filter(t => t.type === 'sent');

  function saveCard(e) {
    e.preventDefault();
    const last4 = cardForm.number.replace(/\s/g,'').slice(-4);
    setMethods(m => [...m, { id: 'pm' + Date.now(), type: 'card', last4, brand: 'Visa', isDefault: false }]);
    setCardForm({ number: '', expiry: '', cvc: '', name: '' });
    setShowAddCard(false);
    setSaved('Card added successfully');
    setTimeout(() => setSaved(''), 3000);
  }

  function saveBank(e) {
    e.preventDefault();
    const last4 = bankForm.account.slice(-4);
    setMethods(m => [...m, { id: 'bk' + Date.now(), type: 'bank', last4, brand: bankForm.name || 'Bank Account', isDefault: false }]);
    setBankForm({ routing: '', account: '', name: '' });
    setShowAddBank(false);
    setSaved('Bank account linked');
    setTimeout(() => setSaved(''), 3000);
  }

  function setDefault(id) {
    setMethods(m => m.map(pm => ({ ...pm, isDefault: pm.id === id })));
  }

  function removeMethod(id) {
    setMethods(m => m.filter(pm => pm.id !== id));
  }

  const balance = mode === 'provider' ? user.balance : 0;
  const pending = mode === 'provider' ? user.pendingPayout : 0;

  return (
    <div className="screen" style={{ padding: '1.5rem 1.5rem 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Wallet</h2>

      {/* Balance cards — provider only */}
      {mode === 'provider' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <span className="stat-label">Available</span>
            <span className="stat-value">${balance.toFixed(2)}</span>
            <span className="stat-sub">Ready to withdraw</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value">${pending.toFixed(2)}</span>
            <span className="stat-sub">Processing</span>
          </div>
        </div>
      )}

      {mode === 'provider' && balance > 0 && (
        <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
          Withdraw ${balance.toFixed(2)}
        </button>
      )}

      {/* Success toast */}
      {saved && (
        <div style={{ background: 'rgba(46,204,113,0.1)', border: '0.5px solid rgba(46,204,113,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: 'var(--success)' }}>
          ✓ {saved}
        </div>
      )}

      {/* Payment methods */}
      <p className="section-label">Payment methods</p>
      <div className="card" style={{ marginBottom: '1rem' }}>
        {methods.map(pm => (
          <div key={pm.id} style={styles.methodRow}>
            <div style={styles.methodIcon}>
              {pm.type === 'card' ? <CardIcon /> : <BankIcon />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--mist)' }}>
                {pm.brand} ···· {pm.last4}
              </div>
              {pm.isDefault && <span className="badge badge-gold" style={{ fontSize: 9, padding: '2px 7px' }}>Default</span>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {!pm.isDefault && (
                <button style={styles.textBtn} onClick={() => setDefault(pm.id)}>Set default</button>
              )}
              <button style={{ ...styles.textBtn, color: 'var(--danger)' }} onClick={() => removeMethod(pm.id)}>Remove</button>
            </div>
          </div>
        ))}
        {methods.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--smoke)', textAlign: 'center', padding: '1rem 0' }}>No payment methods yet</p>
        )}
      </div>

      {/* Add buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => { setShowAddCard(v => !v); setShowAddBank(false); }}>
          + Add card
        </button>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => { setShowAddBank(v => !v); setShowAddCard(false); }}>
          + Link bank
        </button>
      </div>

      {/* Add card form */}
      {showAddCard && (
        <div className="card" style={{ marginBottom: '1.5rem', animation: 'slideUp 0.25s ease' }}>
          <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, color: 'var(--mist)', marginBottom: '1rem' }}>Add a card</p>
          <form onSubmit={saveCard}>
            <div className="input-group">
              <label className="input-label">Cardholder name</label>
              <input className="input" placeholder="Name on card" value={cardForm.name} onChange={e => setCardForm(f => ({...f, name: e.target.value}))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Card number</label>
              <input className="input" placeholder="1234 5678 9012 3456" maxLength={19} value={cardForm.number}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g,'').slice(0,16);
                  v = v.replace(/(.{4})/g,'$1 ').trim();
                  setCardForm(f => ({...f, number: v}));
                }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="input-group">
                <label className="input-label">Expiry</label>
                <input className="input" placeholder="MM/YY" maxLength={5} value={cardForm.expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g,'').slice(0,4);
                    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
                    setCardForm(f => ({...f, expiry: v}));
                  }} required />
              </div>
              <div className="input-group">
                <label className="input-label">CVC</label>
                <input className="input" placeholder="123" maxLength={3} type="password" value={cardForm.cvc}
                  onChange={e => setCardForm(f => ({...f, cvc: e.target.value.replace(/\D/g,'').slice(0,3)}))} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: 14 }}>Save card</button>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 14 }} onClick={() => setShowAddCard(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Add bank form */}
      {showAddBank && (
        <div className="card" style={{ marginBottom: '1.5rem', animation: 'slideUp 0.25s ease' }}>
          <p style={{ fontFamily: 'var(--ff-serif)', fontSize: 16, color: 'var(--mist)', marginBottom: '1rem' }}>Link bank account</p>
          <form onSubmit={saveBank}>
            <div className="input-group">
              <label className="input-label">Bank name</label>
              <input className="input" placeholder="e.g. Chase, Bank of America" value={bankForm.name}
                onChange={e => setBankForm(f => ({...f, name: e.target.value}))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Routing number</label>
              <input className="input" placeholder="9-digit routing number" maxLength={9} value={bankForm.routing}
                onChange={e => setBankForm(f => ({...f, routing: e.target.value.replace(/\D/g,'').slice(0,9)}))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Account number</label>
              <input className="input" placeholder="Account number" value={bankForm.account}
                onChange={e => setBankForm(f => ({...f, account: e.target.value.replace(/\D/g,'')}))} required />
            </div>
            <p style={{ fontSize: 11, color: 'var(--smoke)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              Your information is encrypted and securely transmitted via Stripe Connect.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: 14 }}>Link account</button>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 14 }} onClick={() => setShowAddBank(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction history */}
      <p className="section-label">{mode === 'provider' ? 'Tips received' : 'Tips sent'}</p>
      <div>
        {relevantTx.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--smoke)', textAlign: 'center', padding: '2rem 0' }}>No transactions yet</p>
          : relevantTx.map(tx => <TransactionRow key={tx.id} tx={tx} />)
        }
      </div>
    </div>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="3" stroke="var(--smoke)" strokeWidth="1.5"/>
      <path d="M2 10h20" stroke="var(--smoke)" strokeWidth="1.5"/>
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M3 10h18M12 3L3 10h18L12 3z" stroke="var(--smoke)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10v8M12 10v8M17 10v8" stroke="var(--smoke)" strokeWidth="1.5"/>
    </svg>
  );
}

const styles = {
  methodRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid var(--onyx-soft)' },
  methodIcon: { width: 36, height: 36, background: 'var(--onyx-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  textBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--gold)', fontFamily: 'var(--ff-sans)', padding: 0 },
};
