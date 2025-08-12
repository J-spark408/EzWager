// src/RequireAuth.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "./auth";

const RequireAuth = ({ children }) => {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(isAuthed());
  const [ok, setOk] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const pass = isAuthed();
    setOk(pass);
    setChecked(true);

    const interval = setInterval(() => {
      if (!isAuthed()) {
        setAuthed(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [loc.pathname]);

  if (!authed) {
    return <Navigate to="/" replace />;
  }

  if (!checked) return null; // or a spinner
  return ok ? children : <Navigate to="/" replace />;
}

export default RequireAuth;