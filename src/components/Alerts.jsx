import { useEvents } from "../utils/eventBus.js";

export default function Alerts() {
  const { events } = useEvents();
  const alerts = [...events].reverse(); // latest first

  return (
    <div className="bg-white rounded shadow p-3 h-full">
      <h2 className="font-semibold mb-2">Live Alerts</h2>
      <ul className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {alerts.map((a) => (
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
            <div className="text-xs text-gray-500">{new Date(a.time).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
