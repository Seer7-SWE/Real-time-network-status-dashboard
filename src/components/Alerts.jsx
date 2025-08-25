import { useEvents } from "../utils/eventBus.jsx";
import { useFilters } from "../utils/filterContext.jsx";

export default function Alerts() {
  const { events } = useEvents();
  const alerts = [...events].reverse(); // latest first
  const { region, setRegion, severity, setSeverity, type, setType, resetFilters } = useFilters();

  const filteredAlerts = alerts.filter((a) => {
    return (
      (region ? a.region === region : true) &&
      (severity ? a.severity === severity : true) &&
      (type ? a.type === type : true)
    );
  });

  const regions = [...new Set(events.map((e) => e.region))];

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-2">Live Alerts</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
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

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
