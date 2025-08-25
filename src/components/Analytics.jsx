import { useEvents } from "../utils/eventBus.jsx";
import { useFilters } from "../utils/filterContext.jsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function Analytics() {
  const { events } = useEvents();
  const { region, severity, type } = useFilters();

  // group by date
  const history = events.reduce((acc, e) => {
    const date = new Date(e.time).toISOString().slice(0, 10);
    if (!acc[date]) acc[date] = { date, outages: 0, severe: 0 };
    acc[date].outages++;
    if (e.severity === "high") acc[date].severe++;
    return acc;
  }, {});
  const chartData = Object.values(history);

  
  const filteredEvents = events.filter((a) => {
    return (
      (region ? a.region === region : true) &&
      (severity ? a.severity === severity : true) &&
      ( type ? a.type === type : true)
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Network Analytics</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Outages Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="outages" stroke="#6366f1" />
              <Line type="monotone" dataKey="severe" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Daily Outages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="outages" fill="#6366f1" />
              <Bar dataKey="severe" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
