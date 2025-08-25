import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';


// Simple in-memory store
const events = []; // raw events list

function aggregateHistory() {
  const map = new Map();
  for (const e of events) {
    const date = new Date(e.time).toISOString().slice(0, 10);
    const prev = map.get(date) || { date, outages: 0, severe: 0 };
    prev.outages += 1;
    if (e.severity === 'high') prev.severe += 1;
    map.set(date, prev);
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function randomEvent() {
  const regions = [
    { name: 'Manama', lat: 26.2285, lng: 50.5860 },
    { name: 'Muharraq', lat: 26.2572, lng: 50.6119 },
    { name: 'Riffa', lat: 26.1278, lng: 50.5620 },
    { name: 'Isa Town', lat: 26.1736, lng: 50.5478 },
    { name: 'Sitra', lat: 26.1547, lng: 50.6206 },
    { name: 'Saar', lat: 26.1970, lng: 50.4820 }
  ];
  const types = ['outage', 'congestion'];
  const severities = ['low', 'medium', 'high'];

  const r = regions[Math.floor(Math.random() * regions.length)];
  const e = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    region: r.name,
    lat: r.lat,
    lng: r.lng,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    time: new Date().toISOString()
  };
  return e;
}

const backendPlugin = () => ({
  name: 'embedded-backend',
  configureServer(server) {
    // Express as middleware on the SAME origin/port
    const app = express();
    app.use(express.json());

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', time: new Date().toISOString() });
    });

    app.get('/api/history', (req, res) => {
      res.json(aggregateHistory());
    });

    server.middlewares.use(app);

    // Socket.io attached to Vite's HTTP server (same origin)
    const io = new SocketIOServer(server.httpServer, {
      cors: false,
      path: '/socket.io'
    });

    io.on('connection', (socket) => {
      // Send recent events on connect
      socket.emit('bootstrap', events.slice(-25));
    });

    // Emit fake events periodically (demo)
    const interval = setInterval(() => {
      const e = randomEvent();
      events.push(e);
      io.emit('outage', e);
    }, 5000);

    server.httpServer.on('close', () => clearInterval(interval));
  }
});

export default defineConfig({
  plugins: [react(), backendPlugin()],
  server: { port: 5173 }
});
