import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const MOCK_PROVIDERS = {
  'MH-0041': {
    id: 'MH-0041',
    name: 'Étienne Valois',
    initials: 'EV',
    role: 'Lead Valet',
    venue: 'The Monarch Hotel',
    rating: 4.97,
    reviewCount: 312,
    verified: true,
    joinedYear: 2021,
  },
  'AT-0019': {
    id: 'AT-0019',
    name: 'Sofia Laurent',
    initials: 'SL',
    role: 'Sommelier',
    venue: 'Atelier Restaurant',
    rating: 4.95,
    reviewCount: 189,
    verified: true,
    joinedYear: 2022,
  },
};

const MOCK_TRANSACTIONS = [
  { id: 't1', type: 'sent',     name: 'Étienne Valois',  role: 'Valet',      amount: 12,  date: '2025-03-24', note: 'Great service!' },
  { id: 't2', type: 'sent',     name: 'Sofia Laurent',   role: 'Sommelier',  amount: 30,  date: '2025-03-22', note: '' },
  { id: 't3', type: 'sent',     name: 'D. James',        role: 'Concierge',  amount: 20,  date: '2025-03-20', note: 'Above & beyond' },
  { id: 't4', type: 'received', name: 'Guest #4821',     role: '',           amount: 25,  date: '2025-03-24', note: 'Wonderful!' },
  { id: 't5', type: 'received', name: 'Guest #3302',     role: '',           amount: 15,  date: '2025-03-23', note: '' },
  { id: 't6', type: 'received', name: 'Guest #9910',     role: '',           amount: 40,  date: '2025-03-22', note: 'You saved the evening' },
  { id: 't7', type: 'received', name: 'Guest #1203',     role: '',           amount: 20,  date: '2025-03-21', note: '' },
  { id: 't8', type: 'received', name: 'Guest #7741',     role: '',           amount: 30,  date: '2025-03-20', note: 'Merci!' },
];

export function AppProvider({ children }) {
  const [mode, setMode] = useState('guest'); // 'guest' | 'provider'
  const [user] = useState({
    name: 'Alex Morgan',
    initials: 'AM',
    email: 'alex@example.com',
    balance: 142.50,
    pendingPayout: 35.00,
    badges: ['MH-0041'],
    paymentMethods: [
      { id: 'pm1', type: 'card',  last4: '4242', brand: 'Visa',         isDefault: true },
      { id: 'pm2', type: 'bank',  last4: '6789', brand: 'Chase Checking', isDefault: false },
    ],
  });
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [scannedProvider, setScannedProvider] = useState(null);
  const [lastTip, setLastTip] = useState(null);

  const addTransaction = (tx) => setTransactions(prev => [tx, ...prev]);

  return (
    <AppContext.Provider value={{
      mode, setMode,
      user,
      transactions, addTransaction,
      scannedProvider, setScannedProvider,
      lastTip, setLastTip,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
