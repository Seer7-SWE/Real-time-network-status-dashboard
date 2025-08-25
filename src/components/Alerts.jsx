// src/components/Alerts.jsx
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useFilters } from "../utils/filterContext.jsx";
import { useEvents } from "../utils/eventBus.jsx";

export default function Alerts() {
  const { incidents } = useEvents();
  const { region, severity, type } = useFilters();
  const seen = useRef(new Set());


  const filtered = incidents
    .filter((i) =>
      (region ? i.region === region : true) &&
      (severity ? i.severity === severity : true) &&
      (type ? i.type === type : true)
    )
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  useEffect(() => {
    // toast on first sight of a high-severity active incident
    incidents.forEach((i) => {
      if (i.severity === "high" && i.status === "active" && !seen.current.has(i.id)) {
        seen.current.add(i.id);
        toast.error(`High ${i.type} in ${i.region} — ${i.service}`, { icon: "🚨" });
      }
    });
  }, [incidents]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-3 h-full">
      <h2 className="font-semibold mb-2">Live Alerts</h2>
      <ul className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {filtered.map((a) => {
          const durationMin = Math.max(
            1,
            Math.round(
              ((new Date(a.resolvedAt || a.endsAt)) - new Date(a.startedAt)) / 60000
            )
          );
          return (
            <li key={a.id} className="border rounded p-2 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">{a.region}</div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  a.severity === "high" ? "bg-red-100 text-red-700"
                  : a.severity === "medium" ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                }`}>
                  {a.severity}
                </span>
              </div>
              <div className="text-sm capitalize">{a.type} — {a.service}</div>
              <div className="text-xs text-gray-500">
                Started: {new Date(a.startedAt).toLocaleString()}
                {a.resolvedAt ? ` • Resolved: ${new Date(a.resolvedAt).toLocaleString()}` : ""}
                {` • Duration: ~${durationMin}m`}
              </div>
              <div className="text-xs">
                Estimated impacted users: <span className="font-semibold">{a.impactEstimate.toLocaleString()}</span>
              </div>
              <div className="mt-1">
                <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                  a.status === "resolved" ? "bg-gray-200 text-gray-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {a.status}
                </span>
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500">No alerts found.</li>
        )}
      </ul>
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover />
    </div>
    <div className="p-4 space-y-4">
      <GlobalBanner />
      <KpiCards />
  
   </div>

  );
}
