import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Polyfill for global (needed by some Node packages in browser)
if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <App />
  // </StrictMode>
);