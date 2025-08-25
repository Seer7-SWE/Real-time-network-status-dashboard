export default function Navbar({ setView }) {
  return (
    <nav className="bg-blue-600 dark:bg-blue-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Network Status Dashboard</h1>
      <div className="space-x-4 flex items-center">
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("analytics")}>Analytics</button>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
           }}
          className="ml-4 bg-white text-blue-600 px-2 py-1 rounded text-sm"
         >
          🌓
        </button>
      </div>
    </nav>
  );
}
