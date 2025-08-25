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
