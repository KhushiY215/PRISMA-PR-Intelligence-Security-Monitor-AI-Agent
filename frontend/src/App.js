import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Simulate from './pages/Simulate';
import Settings from './pages/Settings';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const PAGE_MAP = {
    dashboard: <Dashboard />,
    reviews: <Reviews />,
    simulate: <Simulate />,
    settings: <Settings />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={page} onNavigate={setPage} />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg-base)',
      }}>
        {PAGE_MAP[page] || PAGE_MAP.dashboard}
      </main>
    </div>
  );
}
