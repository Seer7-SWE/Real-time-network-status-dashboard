import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.heat";
import "leaflet.markercluster";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useEvents } from "../utils/eventBus.jsx";

// Default marker fix (React-Leaflet + Vite)
const DefaultIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Bahrain region centers
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

// Simple region polygons (demo)
const regionPolygons = {
  Manama: [[26.2305, 50.58], [26.226, 50.59], [26.22, 50.58]],
  "Al Muharraq": [[26.26, 50.605], [26.255, 50.615], [26.25, 50.605]],
  Riffa: [[26.13, 50.555], [26.125, 50.565], [26.12, 50.555]],
};

// Metrics simulation
function metricsFor(sev = "low") {
  if (sev === "high") return { latency: 300 + Math.floor(Math.random() * 80), loss: 8 + Math.random() * 4 };
  if (sev === "medium") return { latency: 150 + Math.floor(Math.random() * 50), loss: 3 + Math.random() * 2 };
  return { latency: 60 + Math.floor(Math.random() * 20), loss: 0.5 + Math.random() * 1 };
}

// Overlay logic
function MapOverlays({ events, mode }) {
  const map = useMap();

  useEffect(() => {
    if (!events || !events.length) return;
    const layers = [];

    // Region polygons (click → stats)
    const polys = Object.entries(regionPolygons).map(([region, coords]) => {
      const poly = L.polygon(coords, { color: "blue" }).addTo(map);
      poly.on("click", () => {
        const regionEvents = events.filter(e => e.region === region);
        alert(`${region}: ${regionEvents.length} incidents\nLast: ${regionEvents.at(-1)?.type || "None"}`);
      });
      return poly;
    });
    layers.push(...polys);

    if (mode === "markers") {
      events.forEach(evt => {
        if (!evt?.region) return;
        const latlng = regions[evt.region];
        if (!latlng) return;

        const sev = evt.severity || "low";
        const metrics = metricsFor(sev);

        const marker = L.marker(latlng).bindPopup(
          `<b>${evt.region}</b><br/>
           ${evt.type || "outage"} — ${evt.service || "N/A"}<br/>
           Severity: ${sev} | Status: ${evt.status || "active"}<br/>
           Latency: ${metrics.latency} ms • Loss: ${metrics.loss.toFixed(1)}%<br/>
           ${new Date(evt.time || evt.startedAt || Date.now()).toLocaleString()}`
        );
        marker.addTo(map);
        layers.push(marker);
      });
    }

    if (mode === "clustering") {
      const cluster = L.markerClusterGroup();
      events.forEach(evt => {
        if (!evt?.region) return;
        const latlng = regions[evt.region];
        if (!latlng) return;
        const marker = L.marker(latlng).bindPopup(
          `<b>${evt.region}</b><br/>
           ${evt.type || "outage"} — ${evt.service || "N/A"}<br/>
           Severity: ${evt.severity || "low"}`
        );
        cluster.addLayer(marker);
      });
      cluster.addTo(map);
      layers.push(cluster);
    }

    if (mode === "heatmap") {
      const heatPoints = events
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
  }, [map, events, mode]);

  return null;
}

// MAIN component
export default function MapView() {
  const { events } = useEvents();
  const [mode, setMode] = useState("markers");

  return (
    <div className="h-[400px] md:h-[500px] w-full rounded shadow bg-white dark:bg-gray-800 p-4 flex flex-col">
      <h2 className="font-semibold mb-2">Live Network Map</h2>

      <div className="mb-4 space-x-2">
        <button
          className={`px-3 py-1 rounded transition ${mode === "markers" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
          onClick={() => setMode("markers")}
        >
          Markers
        </button>
        <button
          className={`px-3 py-1 rounded transition ${mode === "clustering" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
          onClick={() => setMode("clustering")}
        >
          Clustering
        </button>
        <button
          className={`px-3 py-1 rounded transition ${mode === "heatmap" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
          onClick={() => setMode("heatmap")}
        >
          Heatmap
        </button>
      </div>

      <MapContainer center={[26.2285, 50.586]} zoom={11} scrollWheelZoom className="flex-1 rounded z-0">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapOverlays events={events || []} mode={mode} />
      </MapContainer>
    </div>
  );
}
