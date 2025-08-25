// Simple in-memory user store (demo)
const USERS = [
  { username: "admin",    password: "password123", role: "Admin" },
  { username: "engineer", password: "eng12345",    role: "Engineer" },
  { username: "viewer",   password: "view12345",   role: "Viewer" }
];

const KEY = "session";

export function login(username, password) {
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return null;
  const session = { username: user.username, role: user.role };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function useSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function logout() {
  localStorage.removeItem(KEY);
}
