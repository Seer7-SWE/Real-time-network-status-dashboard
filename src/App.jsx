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
  const [page, setPage] = useState("home"); // "home" | "login" | "dashboard"

  if (page === "home") return <Home onLoginClick={() => setPage("login")} />;
  if (page === "login") return <Login onLoginSuccess={() => setPage("dashboard")} />;

  
  return (
    <EventProvider>
      <FilterProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
          <Navbar setView={setView} />

          {view === "dashboard" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                {/* Map container with overflow hidden */}
                <div className="relative z-10 overflow-hidden">
                  <MapView />
                </div>

                {/* Alerts panel */}
                <Alerts />
              </div>

              {/* Region cards with higher stacking */}
              <div className="p-4 relative z-20">
                <RegionHealth />
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
