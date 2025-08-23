import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function Analytics() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/history')
      .then(res => setHistory(res.data))
      .catch(() => {
        // fallback demo data
        setHistory([
          { date: '2025-08-20', outages: 3, severe: 1 },
          { date: '2025-08-21', outages: 5, severe: 2 },
          { date: '2025-08-22', outages: 2, severe: 0 },
          { date: '2025-08-23', outages: 4, severe: 1 }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Network Analytics</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Outages Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="outages" stroke="#6366f1" />
              <Line type="monotone" dataKey="severe" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Daily Outages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="outages" fill="#6366f1" />
              <Bar dataKey="severe" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
