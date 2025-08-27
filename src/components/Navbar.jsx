import { useEffect, useState } from "react";
import { useSession, logout as doLogout } from "../utils/auth.js"; // added below
import { exportIncidentsCSV, exportIncidentsPDF } from "../utils/export.js";
import { useEvents } from "../utils/eventBus.jsx";
const POPUP_KEY = "popupsEnabled";
import { useSettings } from '../utils/settingsContext';

export default function Navbar({ setView }) {
  const [dark, setDark] = useState(false);
  const session = useSession(); // { username, role } or null
  const { incidents } = useEvents();
  const [popupsEnabled, setPopupsEnabled] = useState(true);
  const canExport = session && (session.role === "Admin" || session.role === "Engineer");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    const p = localStorage.getItem(POPUP_KEY); 
    setPopupsEnabled(p === null ? true : p === "true");
    
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const togglePopups = () => {
    const next = !popupsEnabled;
    setPopupsEnabled(next);
    localStorage.setItem(POPUP_KEY, String(next));
  };


  return (
    <nav className="bg-blue-600 dark:bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">📡 Network Status</span>
        {session && (session.role === "Admin" || session.role === "Engineer") && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{session.role}</span>}
           
      
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setView?.("dashboard")} className="px-3 py-1 rounded hover:bg-white/10">Dashboard</button>
        <button onClick={() => setView?.("analytics")} className="px-3 py-1 rounded hover:bg-white/10">Analytics</button>
        {canExport && (
          <>
            <button onClick={() => exportIncidentsCSV(incidents)} className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded">Export CSV</button>
            <button onClick={() => exportIncidentsPDF(incidents)} className="ml-2 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded">Export PDF</button>
          </>
        )}
        
      
        <button onClick={toggleTheme} className="ml-2 bg-white text-blue-700 px-2 py-1 rounded">🌓</button>
        <button
          onClick={togglePopups}
          className={`ml-2 px-3 py-1 rounded ${popupsEnabled ? "bg-emerald-500" : "bg-gray-500"} text-white`}
          title="Enable/Disable outage popups"
        >
          {popupsEnabled ? "Popups: ON" : "Popups: OFF"}
        </button>
        {session && (
          <button
            onClick={() => { doLogout(); location.reload(); }}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
