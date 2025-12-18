import { useSettings } from '../utils/settingsContext';

export default function Home({ onLoginClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4"> Real-Time Network Status Dashboard</h1>
      <p className="text-lg max-w-2xl mb-6">
        Monitor outages, congestion, and service performance across Bahrain in real-time.
        Featuring heatmaps, clustering, incident timelines, and telecom-specific analytics.
      </p>
      <button
        onClick={onLoginClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-lg transition"
      >
         Admin Login
      </button>
    </div>
    

  );
}
