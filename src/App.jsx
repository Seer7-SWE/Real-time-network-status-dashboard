import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import MapView from "./components/MapView.jsx";
import Alerts from "./components/Alerts.jsx";
import Analytics from "./components/Analytics.jsx";
import RegionHealth from "./components/RegionHealth.jsx";
import { EventProvider } from "./utils/eventBus.jsx";
import { FilterProvider } from "./utils/filterContext.jsx";

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <EventProvider>
      <FilterProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
          
          <Navbar setView={setView} />

          
          {view === "dashboard" && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MapView />
                <Alerts />
              </div>

              
              <RegionHealth />
            </div>
          )}

          
          {view === "analytics" && (
            <div className="p-4">
              <Analytics />
            </div>
          )}
        </div>
      </FilterProvider>
    </EventProvider>
  );
}
