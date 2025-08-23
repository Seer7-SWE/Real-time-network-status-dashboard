import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

  return (
    <div className="bg-white rounded shadow p-3">
      <h2 className="font-semibold mb-2">Live Network Map</h2>
      <MapContainer center={[26.2285, 50.586]} zoom={10} scrollWheelZoom className="rounded">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map(e => (
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
