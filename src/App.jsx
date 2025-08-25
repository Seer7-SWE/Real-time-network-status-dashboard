import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import MapView from "./components/MapView.jsx";
import Alerts from "./components/Alerts.jsx";
import Analytics from "./components/Analytics.jsx";
import RegionHealth from "./components/RegionHealth.jsx";
import { EventProvider } from "./utils/eventBus.jsx";
import { FilterProvider } from "./utils/filterContext.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEvents } from "./utils/eventBus.jsx";
import { useSession } from "./utils/auth.js";

function GlobalBanner() {
  const { incidents } = useEvents();
  const active = incidents.filter(i => i.status === "active");
  const hasHigh = active.some(i => i.severity === "high");
  const hasMedium = active.some(i => i.severity === "medium");

  const status = hasHigh ? "Major Outage" : hasMedium ? "Degraded" : "Healthy";
  const color = hasHigh ? "bg-red-600" : hasMedium ? "bg-yellow-500" : "bg-emerald-600";

  return (
    <div className={`${color} text-white rounded p-3`}>
      Overall Network: <b>{status}</b> • Active Incidents: {active.length}
    </div>
  );
}

function KpiCards() {
  const { incidents, calcMTTRMinutes, calcUptimePercent } = useEvents();
  const mttr = calcMTTRMinutes();           // all regions
  const uptime = calcUptimePercent();       // all regions
  const weekIncidents = incidents.filter(i => (Date.now() - new Date(i.startedAt)) < 7*24*3600*1000).length;

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="text-xs text-gray-500">Uptime (24h est.)</div>
        <div className="text-2xl font-bold">{uptime}%</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="text-xs text-gray-500">MTTR</div>
        <div className="text-2xl font-bold">{mttr} mins</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="text-xs text-gray-500">Incidents this week</div>
        <div className="text-2xl font-bold">{weekIncidents}</div>
      </div>
    </div>
  );
}


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
        <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover />
      </FilterProvider>
    </EventProvider>
  );
}
