import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import MapView from "./components/MapView.jsx";
import Alerts from "./components/Alerts.jsx";
import Analytics from "./components/Analytics.jsx";
import RegionHealth from "./components/RegionHealth.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEvents } from "./utils/eventBus.jsx";
import { useSession } from "./utils/auth.js";
import "./index.css";


// Global network status banner
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

// KPI Cards section
function KpiCards() {
  const { incidents, calcMTTRMinutes, calcUptimePercent } = useEvents();
  const mttr = calcMTTRMinutes();
  const uptime = calcUptimePercent();
  const weekIncidents = incidents.filter(i => (Date.now() - new Date(i.startedAt)) < 7 * 24 * 3600 * 1000).length;

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

// Main App Component
export default function App() {
  const [view, setView] = useState("dashboard");
  const [page, setPage] = useState("home");
  const session = useSession();
  const readOnly = session?.role === "Viewer";

  if (page === "home") return <Home onLoginClick={() => setPage("login")} />;
  if (page === "login") return <Login onLoginSuccess={() => setPage("dashboard")} />;
  if (!session) return <Home onLoginClick={() => setPage("login")} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Navbar setView={setView} />

      {view === "dashboard" && (
        <>
          
          <div className="p-4">
            <GlobalBanner />
          </div>

          <MapView readOnly={readOnly} />
          <RegionHealth readOnly={readOnly} />
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/40">
            <KpiCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="relative z-10 overflow-hidden">
              <MapView />
            </div>
            <Alerts />
          </div>

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

      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover />
    </div>
  );
}