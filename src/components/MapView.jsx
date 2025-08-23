import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import socket from '../utils/socket';

// Fix Leaflet's default icon paths for Vite
const DefaultIcon = new L.Icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const onBootstrap = (list) => setEvents(list);
    const onOutage = (e) => setEvents((prev) => [...prev, e]);

    socket.on('bootstrap', onBootstrap);
    socket.on('outage', onOutage);
    return () => {
      socket.off('bootstrap', onBootstrap);
      socket.off('outage', onOutage);
    };
  }, []);

  return (
    <div className="bg-white rounded shadow p-3">
      <h2 className="font-semibold mb-2">Live Network Map</h2>
      <MapContainer center={[26.2285, 50.586]} zoom={10} scrollWheelZoom className="rounded">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]}>
            <Popup>
              <div className="text-sm">
                <div><strong>{e.region}</strong></div>
                <div>Type: {e.type}</div>
                <div>Severity: {e.severity}</div>
                <div>{new Date(e.time).toLocaleString()}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="text-xs text-gray-500 mt-2">
        Showing last {events.length} events.
      </div>
    </div>
  );
}
