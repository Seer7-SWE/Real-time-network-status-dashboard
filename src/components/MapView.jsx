// src/components/MapView.jsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.heat";
import "leaflet.markercluster";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useEvents } from "../utils/eventBus.jsx";

// Default icon fix for Vite/Leaflet
const DefaultIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const regions = {
  Manama: [26.2285, 50.586],
  "Al Muharraq": [26.2572, 50.6119],
  Riffa: [26.1278, 50.562],
  "Isa Town": [26.1736, 50.5478],
  Sitra: [26.1547, 50.6206],
  Saar: [26.197, 50.482],
  "Hamad Town": [26.1152, 50.50694],
  Jidhafs: [26.2186, 50.54778],
  "Al Hidd": [26.2455, 50.65417],
  Budaiya: [26.2241, 50.47083],
  "Al Zallaq": [26.0461, 50.5072],
};

function metricsFor(sev = "low") {
  if (sev === "high") return { latency: 300 + Math.floor(Math.random() * 80), loss: 8 + Math.random() * 4 };
  if (sev === "medium") return { latency: 150 + Math.floor(Math.random() * 50), loss: 3 + Math.random() * 2 };
  return { latency: 60 + Math.floor(Math.random() * 20), loss: 0.5 + Math.random() * 1 };
}

/* Create a small colored marker using divIcon.
   severity: 'low'|'medium'|'high' → green/yellow/red
*/
function createColoredIcon(severity = "low") {
  const color = severity === "high" ? "#ef4444" : severity === "medium" ? "#f59e0b" : "#10b981";
  const html = `
    <div style="
      width: 22px;
      height: 22px;
      background: ${color};
      border-radius: 50%;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      border: 2px solid white;
    "></div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22]
  });
}

function MapOverlays({ events, mode, readOnly }) {
  const map = useMap();

  useEffect(() => {
    if (!events) return;
    const layers = [];

    // Polygons (clickable)
    const polygons = [
      // only a few for demo; keep small
      ["Manama", [[26.2305,50.58],[26.226,50.59],[26.22,50.58]]],
      ["Al Muharraq", [[26.26,50.605],[26.255,50.615],[26.25,50.605]]]
    ];
    polygons.forEach(([region, coords]) => {
      const poly = L.polygon(coords, { color: "#2563eb", weight: 1, fillOpacity: 0.02 }).addTo(map);
      poly.on("click", () => {
        const regionEvents = (events || []).filter(e => e.region === region);
        // If not readOnly, allow toggling or show detailed panel; simple alert for now
        alert(`${region}: ${regionEvents.length} incidents\nLast: ${regionEvents.at(-1)?.type || "None"}`);
      });
      layers.push(poly);
    });

    // markers mode
    if (mode === "markers") {
      (events || []).forEach(evt => {
        if (!evt?.region) return;
        const latlng = regions[evt.region];
        if (!latlng) return;
        const sev = evt.severity || "low";
        const metrics = metricsFor(sev);
        const icon = createColoredIcon(sev);

        const marker = L.marker(latlng, { icon })
          .bindPopup(
            `<b>${evt.region}</b><br/>
             ${evt.type || "outage"} — ${evt.service || "N/A"}<br/>
             <strong>Severity:</strong> ${sev} • <strong>Status:</strong> ${evt.status || "active"}<br/>
             <strong>Latency:</strong> ${metrics.latency} ms • <strong>Loss:</strong> ${metrics.loss.toFixed(1)}%<br/>
             ${new Date(evt.time || evt.startedAt || Date.now()).toLocaleString()}`
          );
        marker.addTo(map);
        layers.push(marker);
      });
    }

    // clustering mode
    if (mode === "clustering") {
      const markerCluster = L.markerClusterGroup();
      (events || []).forEach(evt => {
        if (!evt?.region) return;
        const latlng = regions[evt.region];
        if (!latlng) return;
        const icon = createColoredIcon(evt.severity || "low");
        const m = L.marker(latlng, { icon })
          .bindPopup(`<b>${evt.region}</b><br/>${evt.type || "outage"} — ${evt.service || "N/A"}<br/>Severity: ${evt.severity || "low"}`);
        markerCluster.addLayer(m);
      });
      markerCluster.addTo(map);
      layers.push(markerCluster);
    }

    // heatmap
    if (mode === "heatmap") {
      const heatPoints = (events || [])
        .map(evt => {
          if (!evt?.region) return null;
          const latlng = regions[evt.region];
          if (!latlng) return null;
          const weight = evt.severity === "high" ? 1 : evt.severity === "medium" ? 0.6 : 0.3;
          return [latlng[0], latlng[1], weight];
        })
        .filter(Boolean);
      const heat = L.heatLayer(heatPoints, { radius: 25, blur: 15 });
      heat.addTo(map);
      layers.push(heat);
    }

    return () => {
      layers.forEach(l => map.removeLayer(l));
    };
  }, [map, events, mode, readOnly]);

  return null;
}

export default function MapView({ readOnly = false }) {
  const { events } = useEvents();
  const [mode, setMode] = useState("markers");

  // Disable mode change for Viewer role if readOnly is true
  const onSetMode = (m) => {
    if (readOnly) return;
    setMode(m);
  };

  return (
    <div className="h-[420px] md:h-[540px] w-full rounded shadow bg-white dark:bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Live Network Map</h2>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded transition ${mode === "markers" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => onSetMode("markers")}
            disabled={readOnly}
            title={readOnly ? "Viewer: mode locked" : "Show markers"}
          >
            Markers
          </button>
          <button
            className={`px-3 py-1 rounded transition ${mode === "clustering" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => onSetMode("clustering")}
            disabled={readOnly}
            title={readOnly ? "Viewer: mode locked" : "Clustering"}
          >
            Clustering
          </button>
          <button
            className={`px-3 py-1 rounded transition ${mode === "heatmap" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => onSetMode("heatmap")}
            disabled={readOnly}
            title={readOnly ? "Viewer: mode locked" : "Heatmap"}
          >
            Heatmap
          </button>
        </div>
      </div>

      <MapContainer center={[26.2285, 50.586]} zoom={11} scrollWheelZoom className="flex-1 rounded z-0">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapOverlays events={events || []} mode={mode} readOnly={readOnly} />
      </MapContainer>
    </div>
  );
}
