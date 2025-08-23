export default function Navbar({ setView }) {
  return (
    <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
      <h1 className="font-bold text-xl">Network Status Dashboard</h1>
      <div className="space-x-2">
        <button
          className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-400"
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-400"
          onClick={() => setView('analytics')}
        >
          Analytics
        </button>
      </div>
    </nav>
  );
}
