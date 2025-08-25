// src/utils/eventBus.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const EventContext = createContext();

/** Region meta for coords + population (for customer impact demo) */
const REGION_META = {
  "Manama":   { lat: 26.2285, lng: 50.5860, population: "200,000" },
  "Al Muharraq": { lat: 26.2572, lng: 50.6119, population: "175,000" },
  "Riffa": { lat: 26.1278, lng: 50.5620, population: "350,000" },
  "Isa Town": { lat: 26.1736, lng: 50.5478, population: "45,000" },
  "Sitra": { lat: 26.1547, lng: 50.6206, population: "50,000" },
  "Saar": { lat: 26.1970, lng: 50.4820, population: "40,000" },
  "Hamad Town": { lat: 26.1152, lng: 50.50694, population: "100,000" },
  "Jidhafs": { lat: 26.2186, lng: 50.54778, population: "70,000" },
  "Al Hidd": { lat: 26.2455, lng: 50.65417, population: "45,000" },
  "Budaiya": { lat: 26.2241, lng: 50.47083, population: "25,000" },
  "Al Zallaq": { lat: 26.0461, lng: 50.5072, population: "15,000" }


};

const REGIONS = Object.keys(REGION_META);
const SERVICES = ["Mobile Data", "Voice Calls", "SMS"];
const TYPES = ["outage", "congestion"];
const SEVERITIES = ["low", "medium", "high"];

/** Helper: random pick */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Estimate impacted users based on region population + severity */
function estimateImpact(region, severity) {
  const pop = REGION_META[region]?.population ?? 50_000;
  const factor = severity === "high" ? 0.12 : severity === "medium" ? 0.06 : 0.02;
  // Add a little noise
  const noise = 1 + (Math.random() * 0.2 - 0.1);
  return Math.max(1, Math.round(pop * factor * noise));
}

/**
 * Incident model:
 * {
 *   id, region, lat, lng, service, type, severity,
 *   status: 'active'|'resolved',
 *   startedAt, endsAt (planned), resolvedAt (actual),
 *   escalations: [{ at, from, to }]
 *   impactEstimate: number
 * }
 *
 * We also emit “events” (lightweight snapshots for map/alerts):
 * { id, region, lat, lng, type, severity, time, service, status }
 */
export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);       // streaming updates for UI
  const [incidents, setIncidents] = useState([]); // lifecycle objects

  // Start + manage simulated incidents
  useEffect(() => {
    // Start a new incident periodically
    const startTimer = setInterval(() => {
      // 60% chance to start a new incident tick
      if (Math.random() < 0.6) {
        const region = pick(REGIONS);
        const meta = REGION_META[region];
        const service = pick(SERVICES);
        const type = pick(TYPES);
        const severity = pick(SEVERITIES);
        const now = new Date();

        // duration 10–30 minutes
        const minutes = randBetween(10, 30);
        const endsAt = new Date(now.getTime() + minutes * 60 * 1000);

        const incident = {
          id: now.getTime().toString(36) + Math.random().toString(36).slice(2),
          region,
          lat: meta.lat,
          lng: meta.lng,
          service,
          type,
          severity,
          status: "active",
          startedAt: now.toISOString(),
          endsAt: endsAt.toISOString(),
          resolvedAt: null,
          escalations: [],
          impactEstimate: estimateImpact(region, severity)
        };

        setIncidents((prev) => [...prev, incident]);
        // also push an initial event for UI
        setEvents((prev) => [
          ...prev,
          {
            id: incident.id + "-start",
            region,
            lat: meta.lat,
            lng: meta.lng,
            type,
            severity,
            service,
            status: "active",
            time: now.toISOString()
          }
        ]);
      }
    }, 7000); // attempt every 7s

    // Manage active incidents: escalate + resolve; also emit periodic heartbeat events
    const tickTimer = setInterval(() => {
      setIncidents((prev) => {
        const now = new Date();
        return prev.map((inc) => {
          if (inc.status === "resolved") return inc;

          // random chance to escalate once during its lifetime
          if (Math.random() < 0.15 && inc.severity !== "high") {
            const from = inc.severity;
            const to = from === "low" ? "medium" : "high";
            inc.severity = to;
            inc.escalations.push({ at: now.toISOString(), from, to });

            // update impact when severity changes
            inc.impactEstimate = estimateImpact(inc.region, inc.severity);

            // emit escalation event
            setEvents((prevE) => [
              ...prevE,
              {
                id: inc.id + "-esc-" + now.getTime(),
                region: inc.region,
                lat: inc.lat,
                lng: inc.lng,
                type: inc.type,
                severity: inc.severity,
                service: inc.service,
                status: "active",
                time: now.toISOString()
              }
            ]);
          }

          // resolve if time passed
          if (now >= new Date(inc.endsAt)) {
            inc.status = "resolved";
            inc.resolvedAt = now.toISOString();

            // emit resolved event
            setEvents((prevE) => [
              ...prevE,
              {
                id: inc.id + "-resolved",
                region: inc.region,
                lat: inc.lat,
                lng: inc.lng,
                type: inc.type,
                severity: inc.severity,
                service: inc.service,
                status: "resolved",
                time: now.toISOString()
              }
            ]);
          } else {
            // heartbeat event to keep map/alerts fresh
            if (Math.random() < 0.5) {
              setEvents((prevE) => [
                ...prevE,
                {
                  id: inc.id + "-hb-" + now.getTime(),
                  region: inc.region,
                  lat: inc.lat,
                  lng: inc.lng,
                  type: inc.type,
                  severity: inc.severity,
                  service: inc.service,
                  status: "active",
                  time: now.toISOString()
                }
              ]);
            }
          }

          return { ...inc };
        });
      });
    }, 5000); // tick every 5s

    return () => {
      clearInterval(startTimer);
      clearInterval(tickTimer);
    };
  }, []);

  // Derived metrics helpers (used by Analytics/RegionHealth)
  const getRegionDayBuckets = useMemo(() => {
    return (region) => {
      const byDay = new Map();
      incidents.forEach((inc) => {
        if (region && inc.region !== region) return;
        const day = inc.startedAt.slice(0, 10);
        const bucket = byDay.get(day) || { date: day, started: 0, resolved: 0, high: 0, medium: 0, low: 0 };
        bucket.started += 1;
        if (inc.status === "resolved") bucket.resolved += 1;
        bucket[inc.severity] += 1;
        byDay.set(day, bucket);
      });
      return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
    };
  }, [incidents]);

  const calcMTTRMinutes = useMemo(() => {
    return (region) => {
      const durations = incidents
        .filter((i) => (!region || i.region === region) && i.status === "resolved")
        .map((i) => (new Date(i.resolvedAt) - new Date(i.startedAt)) / 60000);
      if (durations.length === 0) return 0;
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      return Math.round(avg);
    };
  }, [incidents]);

  const calcUptimePercent = useMemo(() => {
    // Using a simple proxy: treat time covered by active incidents vs total simulated window
    return (region) => {
      const now = Date.now();
      const windowStart = now - 24 * 60 * 60 * 1000; // last 24h window proxy
      let impacted = 0;

      incidents
        .filter((i) => !region || i.region === region)
        .forEach((i) => {
          const start = Math.max(new Date(i.startedAt).getTime(), windowStart);
          const end = Math.min(new Date(i.resolvedAt || i.endsAt).getTime(), now);
          if (end > start) impacted += end - start;
        });

      const total = now - windowStart;
      const uptime = 100 - (impacted / total) * 100;
      return Math.max(0, Math.min(100, uptime)).toFixed(1);
    };
  }, [incidents]);

  return (
    <EventContext.Provider
      value={{
        events,        // streaming map/alerts updates
        incidents,     // lifecycle data
        REGION_META,
        REGIONS,
        SERVICES,
        getRegionDayBuckets,
        calcMTTRMinutes,
        calcUptimePercent
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
