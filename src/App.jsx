import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import MapView from './components/MapView.jsx';
import Alerts from './components/Alerts.jsx';
import Analytics from './components/Analytics.jsx';
import { EventProvider } from "./utils/eventBus.jsx";
import { FilterProvider } from "./utils/filterContext.jsx";

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
    <EventProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-screen bg-gray-100">
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <MapView />
        </div>
        <Alerts />
        <Analytics />
      </div>
    </EventProvider>
    <EventProvider>
      <FilterProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-screen bg-gray-100">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <MapView />
          </div>
           <Alerts />
          <Analytics />
        </div>
      </FilterProvider>
    </EventProvider>
  );
}
