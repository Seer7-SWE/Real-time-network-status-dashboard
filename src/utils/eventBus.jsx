import { createContext, useContext, useEffect, useState } from "react";

const EventContext = createContext();

const regions = [
  { name: 'Manama', lat: 26.2285, lng: 50.5860 },
  { name: 'Al Muharraq', lat: 26.2572, lng: 50.6119 },
  { name: 'Riffa', lat: 26.1278, lng: 50.5620 },
  { name: 'Isa Town', lat: 26.1736, lng: 50.5478 },
  { name: 'Sitra', lat: 26.1547, lng: 50.6206 },
  { name: 'Saar', lat: 26.1970, lng: 50.4820 },
  { name: 'Hamad Town', lat: 26.1152, lng: 50.50694 },
  { name: 'Jidhafs', lat: 26.2186, lng: 50.54778 },
  { name: 'Al Hidd', lat: 26.2455, lng: 50.65417 },
  { name: 'Budaiya', lat: 26.2241, lng: 50.47083 },
  { name: 'Al Zallaq', lat: 26.0461, lng: 50.5072 }
];
const types = ["outage", "congestion"];
const severities = ["low", "medium", "high"];

function randomEvent() {
  const r = regions[Math.floor(Math.random() * regions.length)];
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    region: r.name,
    lat: r.lat,
    lng: r.lng,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    time: new Date().toISOString()
  };
}

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const e = randomEvent();
      setEvents(prev => [...prev, e]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <EventContext.Provider value={{ events }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
