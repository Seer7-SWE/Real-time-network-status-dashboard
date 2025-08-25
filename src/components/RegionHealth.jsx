import { useEvents } from "../utils/eventBus.jsx";
import { useFilters } from "../utils/filterContext.jsx";

const regionsList = [
  "Manama",
  "Muharraq",
  "Riffa",
  "Isa Town",
  "Sitra",
  "Saar",
];

function getStatus(events) {
  if (events.length === 0) return "healthy";

  const latest = events[events.length - 1];
  return `${latest.severity} ${latest.type}`;
}

function getUptime(events, totalEvents) {
  if (totalEvents === 0) return 100;

  const issues = events.length;
  const healthyEvents = totalEvents - issues;

  return ((healthyEvents / totalEvents) * 100).toFixed(1);
}

export default function RegionHealth() {
  const { events } = useEvents();
  const { region, setRegion, severity, type } = useFilters();

  // Apply global filters (but ignore region filter — we show all regions)
  const filteredEvents = events.filter((a) => {
    return (
      (severity ? a.severity === severity : true) &&
      (type ? a.type === type : true)
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {regionsList.map((r) => {
        const regionEvents = filteredEvents.filter((e) => e.region === r);

        const status = getStatus(regionEvents);
        const uptime = getUptime(regionEvents, filteredEvents.length);

        const lastIncident =
          regionEvents.length > 0
            ? new Date(
                regionEvents[regionEvents.length - 1].time
              ).toLocaleString()
            : "No incidents";

        return (
          <div
            key={r}
            className="bg-white rounded shadow p-4 flex flex-col"
          >
          <div
             key={r}
            onClick={() => setRegion(r)}
            className={`bg-white rounded shadow p-4 flex flex-col cursor-pointer transition 
              ${region === r ? "ring-2 ring-blue-500" : "hover:bg-gray-50"}`}
          >
           <h3 className="font-semibold text-lg mb-1">{r}</h3>
            <p className="text-sm mb-1">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`${
                  status.includes("high")
                    ? "text-red-600"
                    : status.includes("medium")
                    ? "text-yellow-600"
                    : status.includes("low")
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {status}
              </span>
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">Uptime:</span> {uptime}%
            </p>
            <p className="text-sm">
              <span className="font-medium">Last Incident:</span>{" "}
              {lastIncident}
            </p>
          </div>
        );
      })}
    </div>
          };
)

