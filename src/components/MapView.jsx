import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import L from "leaflet";
import { useEvents } from "../utils/eventBus.jsx";

const DefaultIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const { events } = useEvents();

  const markers = L.markerClusterGroup();

 events.forEach(evt => {
  const latlng = regions[evt.region];
  if (latlng) {
    const marker = L.marker(latlng).bindPopup(
      `<b>${evt.region}</b><br>Status: ${evt.type}<br>Severity: ${evt.severity}`
    );
    markers.addLayer(marker);
  }
});

map.addLayer(markers);

const regionPolygons = {
  "Manama": [
    [26.2305, 50.5800],
    [26.2260, 50.5900],
    [26.2200, 50.5800]
  ],
  "Al Muharraq": [
    [26.2600, 50.6050],
    [26.2550, 50.6150],
    [26.2500, 50.6050]
  ],
  "Riffa": [
    [26.1300, 50.5550],
    [26.1250, 50.5650],
    [26.1200, 50.5550]
  ],
  "Isa Town": [
    [26.1750, 50.5420],
    [26.1700, 50.5520],
    [26.1650, 50.5420]
  ],
  "Sitra": [
    [26.1570, 50.6150],
    [26.1520, 50.6250],
    [26.1470, 50.6150]
  ],
  "Saar": [
    [26.1990, 50.4760],
    [26.1940, 50.4860],
    [26.1890, 50.4760]
  ],
  "Hamad Town": [
    [26.1180, 50.5010],
    [26.1130, 50.5110],
    [26.1080, 50.5010]
  ],
  "Jidhafs": [
    [26.2210, 50.5430],
    [26.2160, 50.5530],
    [26.2110, 50.5430]
  ],
  "Al Hidd": [
    [26.2480, 50.6490],
    [26.2430, 50.6590],
    [26.2380, 50.6490]
  ],
  "Budaiya": [
    [26.2260, 50.4650],
    [26.2210, 50.4750],
    [26.2160, 50.4650]
  ],
  "Al Zallaq": [
    [26.0490, 50.5020],
    [26.0440, 50.5120],
    [26.0390, 50.5020]
  ]
};

Object.entries(regionPolygons).forEach(([region, coords]) => {
  const polygon = L.polygon(coords, { color: "blue" }).addTo(map);

  polygon.on("click", () => {
    const regionEvents = events.filter(e => e.region === region);
    alert(`${region}: ${regionEvents.length} incidents\nLast: ${regionEvents.at(-1)?.type || "None"}`);
  });
});

  return (
    <div id="map" className="h-[400px] md:h-[500px] w-full rounded shadow bg-white dark:bg-gray-800 p-4">
      <h2 className="font-semibold mb-2">Live Network Map</h2>
      <MapContainer
        center={[26.2285, 50.586]}
        zoom={10}
        scrollWheelZoom
        className="h-full rounded z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{e.region}</strong><br />
                {e.type} ({e.severity})<br />
                {new Date(e.time).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
