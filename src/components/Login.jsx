import { useState } from "react";
import { login } from "../utils/auth.js";
import { useSettings } from '../utils/settingsContext';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const session = login(username, password);
    if (session) {
      onLoginSuccess(session);
    } else {
      alert("Invalid Credentials (try admin/password123, engineer/eng12345, viewer/view12345)");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded p-8 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Username"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full mb-4 p-2 border rounded" placeholder="Password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
// (try admin/password123, engineer/eng12345, viewer/view12345)
