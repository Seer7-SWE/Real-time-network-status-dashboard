import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.heat";
import "leaflet.markercluster";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useEvents } from "../utils/eventBus.jsx";

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

const regions = {
  "Manama": [26.2285, 50.5860],
  "Al Muharraq": [26.2572, 50.6119],
  "Riffa": [26.1278, 50.5620],
  "Isa Town": [26.1736, 50.5478],
  "Sitra": [26.1547, 50.6206],
  "Saar": [26.1970, 50.4820],
  "Hamad Town": [26.1152, 50.50694],
  "Jidhafs": [26.2186, 50.54778],
  "Al Hidd": [26.2455, 50.65417],
  "Budaiya": [26.2241, 50.47083],
  "Al Zallaq": [26.0461, 50.5072],
};

const regionPolygons = {
  "Manama": [[26.2305, 50.5800], [26.2260, 50.5900], [26.2200, 50.5800]],
  "Al Muharraq": [[26.2600, 50.6050], [26.2550, 50.6150], [26.2500, 50.6050]],
  "Riffa": [[26.1300, 50.5550], [26.1250, 50.5650], [26.1200, 50.5550]],
  "Isa Town": [[26.1750, 50.5420], [26.1700, 50.5520], [26.1650, 50.5420]],
  "Sitra": [[26.1570, 50.6150], [26.1520, 50.6250], [26.1470, 50.6150]],
  "Saar": [[26.1990, 50.4760], [26.1940, 50.4860], [26.1890, 50.4760]],
  "Hamad Town": [[26.1180, 50.5010], [26.1130, 50.5110], [26.1080, 50.5010]],
  "Jidhafs": [[26.2210, 50.5430], [26.2160, 50.5530], [26.2110, 50.5430]],
  "Al Hidd": [[26.2480, 50.6490], [26.2430, 50.6590], [26.2380, 50.6490]],
  "Budaiya": [[26.2260, 50.4650], [26.2210, 50.4750], [26.2160, 50.4650]],
  "Al Zallaq": [[26.0490, 50.5020], [26.0440, 50.5120], [26.0390, 50.5020]],
};

function MapOverlays({ events, mode }) {
  const map = useMap();

  useEffect(() => {
    // Add region polygons once
    const polygons = Object.entries(regionPolygons).map(([region, coords]) => {
      const polygon = L.polygon(coords, { color: "blue" }).addTo(map);
      polygon.on("click", () => {
        const regionEvents = events.filter(e => e.region === region);
        alert(`${region}: ${regionEvents.length} incidents\nLast: ${regionEvents.at(-1)?.type || "None"}`);
      });
      return polygon;
    });

    return () => {
      polygons.forEach(p => map.removeLayer(p));
    };
  }, [map, events]);

  useEffect(() => {
    if (!events.length) return;

    // Clear existing layers before adding new ones
    const existingLayers = [];

    // MARKERS mode: render markers individually
    if (mode === "markers") {
      events.forEach(evt => {
        const latlng = regions[evt.region];
        if (!latlng) return;

        const marker = L.marker(latlng)
          .bindPopup(`<b>${evt.region}</b><br>Status: ${evt.type}<br>Severity: ${evt.severity}`)
          .addTo(map);
        existingLayers.push(marker);
      });
    }

    // CLUSTERING mode
    if (mode === "clustering") {
      const markerCluster = L.markerClusterGroup();
      events.forEach(evt => {
        const latlng = regions[evt.region];
        if (!latlng) return;
        const marker = L.marker(latlng).bindPopup(
          `<b>${evt.region}</b><br>Status: ${evt.type}<br>Severity: ${evt.severity}`
        );
        markerCluster.addLayer(marker);
      });
      markerCluster.addTo(map);
      existingLayers.push(markerCluster);
    }

    // HEATMAP mode
    if (mode === "heatmap") {
      const heatPoints = events.map(evt => {
        const latlng = regions[evt.region];
        if (!latlng) return null;
        const intensity = evt.severity === "high" ? 1 : evt.severity === "medium" ? 0.6 : 0.3;
        return [latlng[0], latlng[1], intensity];
      }).filter(Boolean);

      const heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15 });
      heatLayer.addTo(map);
      existingLayers.push(heatLayer);
    }

    // Cleanup layers on unmount or mode change
    return () => {
      existingLayers.forEach(layer => map.removeLayer(layer));
    };
  }, [map, events, mode]);

  return null;
}

export default function MapView() {
  const { events } = useEvents();
  const [mode, setMode] = useState("markers"); // Default mode

  return (
    <div className="h-[400px] md:h-[500px] w-full rounded shadow bg-white dark:bg-gray-800 p-4 flex flex-col">
      <h2 className="font-semibold mb-2">Live Network Map</h2>

      {/* Mode toggle buttons */}
      <div className="mb-4 space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            mode === "markers" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("markers")}
        >
          Markers
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "clustering" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("clustering")}
        >
          Clustering
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "heatmap" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("heatmap")}
        >
          Heatmap
        </button>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[26.2285, 50.586]}
        zoom={10}
        scrollWheelZoom
        className="flex-1 rounded z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapOverlays events={events} mode={mode} />
      </MapContainer>
    </div>
  );
}
