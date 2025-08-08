import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const splash = document.getElementById("splash");
if (splash) splash.style.opacity = "0";
setTimeout(() => splash?.remove(), 200);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
