// src/RequireAuth.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "./auth";

export default function RequireAuth({ children }) {
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const pass = isAuthed();
    setOk(pass);
    setChecked(true);
  }, [loc.pathname]);

  if (!checked) return null; // or a spinner
  return ok ? children : <Navigate to="/" replace />;
}
