import { useState } from "react";
import { useEvents } from "../utils/eventBus.jsx";
import { useFilters } from "../utils/filterContext.jsx";

export default function Alerts() {
  const { events } = useEvents();
  const alerts = [...events].reverse(); // latest first

  // --- filter state ---
  /*const [region, setRegion] = useState("");
  const [severity, setSeverity] = useState("");
  const [type, setType] = useState("");*/
  const { region, setRegion, severity, setSeverity, type, setType, resetFilters } = useFilters();

  // --- filtering logic ---
  const filteredAlerts = alerts.filter((a) => {
    return (
      (region ? a.region === region : true) &&
      (severity ? a.severity === severity : true) &&
      (type ? a.type === type : true)
    );
  });

  // --- get unique regions for dropdown ---
  const regions = [...new Set(events.map((e) => e.region))];

  return (
    <div className="bg-white rounded shadow p-3 h-full flex flex-col">
      <h2 className="font-semibold mb-2">Live Alerts</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Region filter */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Severity filter */}
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Type filter */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Types</option>
          <option value="outage">Outage</option>
          <option value="congestion">Congestion</option>
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setRegion("");
            setSeverity("");
            setType("");
          }}
           onClick={resetFilters}
          className="ml-auto bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded"
        >
          Reset
        </button>
      </div>

      {/* Alerts List */}
      <ul className="space-y-2 overflow-auto pr-1 flex-1">
        {filteredAlerts.map((a) => (
          <li key={a.id} className="border rounded p-2">
            <div className="flex justify-between">
              <span className="font-medium">{a.region}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  a.severity === "high"
                    ? "bg-red-100 text-red-700"
                    : a.severity === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {a.severity}
              </span>
            </div>
            <div className="text-sm capitalize">{a.type}</div>
            <div className="text-xs text-gray-500">
              {new Date(a.time).toLocaleString()}
            </div>
          </li>
        ))}

        {filteredAlerts.length === 0 && (
          <li className="text-sm text-gray-500">No alerts found.</li>
        )}
      </ul>
    </div>
  );
}
