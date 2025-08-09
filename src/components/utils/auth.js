// src/auth.js
const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function isAuthed() {
  const isAuthenticated = localStorage.getItem("authenticated");
  const authTime = localStorage.getItem("authTime");
  const email = localStorage.getItem("email");
  if (!isAuthenticated || !authTime || !email) return false;
  const expired = Date.now() - parseInt(authTime, 10) > TIMEOUT_MS;
  if (expired) {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("authTime");
    localStorage.removeItem("email");
    return false;
  }
  return true;
}
