import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import ScanPage from './pages/ScanPage';
import TipPage from './pages/TipPage';
import SuccessPage from './pages/SuccessPage';
import WalletPage from './pages/WalletPage';
import RegisterBadgePage from './pages/RegisterBadgePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import './styles/globals.css';

function AppRoutes() {
  const { mode } = useApp();

  return (
    <div className="phone-shell">
      <Routes>
        {/* Guest-primary routes */}
        <Route path="/"        element={mode === 'guest' ? <ScanPage /> : <Navigate to="/dashboard" />} />
        <Route path="/tip"     element={<TipPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Shared routes */}
        <Route path="/wallet"  element={<WalletPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Provider routes */}
        <Route path="/dashboard"      element={<DashboardPage />} />
        <Route path="/register-badge" element={<RegisterBadgePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Keyframe injection */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulseGold {
            0%, 100% { opacity: 0.6; }
            50%        { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: none; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          select option { background: #2E2820; }
        `}</style>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
