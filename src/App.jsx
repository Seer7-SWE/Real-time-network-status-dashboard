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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
          <Navbar setView={setView} />

          {view === "dashboard" && (
            <>
              {/* Wrap map and alerts in their own container */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <div className="relative flex items-stretch">
                  <MapView className="flex-1" />
                </div>
                <Alerts className="flex-1" />
              </div>

              {/* Region health cards */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <RegionHealth />
                <RegionHealth />
                {/* Add more RegionHealth as needed */}
              </div>
            </>
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
