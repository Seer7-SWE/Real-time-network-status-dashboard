// src/components/Analytics.jsx
import { useMemo } from "react";
import { useEvents } from "../utils/eventBus.jsx";
import { useFilters } from "../utils/filterContext.jsx";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Analytics() {
  const { incidents, REGIONS, getRegionDayBuckets, calcMTTRMinutes, calcUptimePercent } = useEvents();
  const { region, severity, type } = useFilters();

  // Filter incidents (global filters)
  const data = useMemo(() => {
    return incidents.filter((i) =>
      (region ? i.region === region : true) &&
      (severity ? i.severity === severity : true) &&
      (type ? i.type === type : true)
    );
  }, [incidents, region, severity, type]);

  // Region-wise trends: counts per region (active+resolved)
  const regionCounts = useMemo(() => {
    const map = new Map();
    REGIONS.forEach((r) => map.set(r, { region: r, incidents: 0, high: 0, medium: 0, low: 0 }));
    data.forEach((i) => {
      const row = map.get(i.region);
      row.incidents += 1;
      row[i.severity] += 1;
    });
    return Array.from(map.values());
  }, [data, REGIONS]);

  // Comparative MTTR + Uptime per region
  const regionPerf = useMemo(() => {
    return REGIONS.map((r) => ({
      region: r,
      mttr: calcMTTRMinutes(r),
      uptime: Number(calcUptimePercent(r))
    }));
  }, [REGIONS, calcMTTRMinutes, calcUptimePercent]);

  // Day buckets for current region (if selected) or all
  const dayBuckets = useMemo(() => getRegionDayBuckets(region || ""), [getRegionDayBuckets, region]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Analytics & Insights</h2>

      {/* Region-wise Trend (Grouped Bars by severity) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Region-wise Trend (Incidents by Severity)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={regionCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="low" fill="#22c55e" />
            <Bar dataKey="medium" fill="#f59e0b" />
            <Bar dataKey="high" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MTTR & Uptime cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionPerf.map((r) => (
          <div key={r.region} className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <div className="font-semibold">{r.region}</div>
            <div className="text-sm">MTTR: <span className="font-medium">{r.mttr} min</span></div>
            <div className="text-sm">Uptime (24h est.): <span className="font-medium">{r.uptime}%</span></div>
          </div>
        ))}
      </div>

      {/* Daily buckets for selected region (or all) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">
          Daily Buckets {region ? `— ${region}` : "(All Regions)"}
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={dayBuckets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="started" fill="#6366f1" name="Incidents Started" />
            <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="p-4 space-y-4">
      <GlobalBanner />
     <KpiCards />
   </div>

  );
}
