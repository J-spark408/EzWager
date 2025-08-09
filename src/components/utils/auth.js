// src/auth.js
const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function isAuthed() {
  const a = localStorage.getItem("authenticated");
  const t = localStorage.getItem("authTime");
  const e = localStorage.getItem("email");
  if (!a || !t || !e) return false;
  const expired = Date.now() - parseInt(t, 10) > TIMEOUT_MS;
  if (expired) {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("authTime");
    localStorage.removeItem("email");
    return false;
  }
  return true;
}
