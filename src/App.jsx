import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import MapView from './components/MapView.jsx';
import Alerts from './components/Alerts.jsx';
import Analytics from './components/Analytics.jsx';

export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="min-h-screen">
      <Navbar setView={setView} />
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <MapView />
          <Alerts />
        </div>
      )}
      {view === 'analytics' && (
        <div className="p-4">
          <Analytics />
        </div>
      )}
    </div>
  );
}
