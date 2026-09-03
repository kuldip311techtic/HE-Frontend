import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { bootstrapValidationAuth } from "@/lib/auth/validation-bootstrap";
import "@/theme/globals.css";

bootstrapValidationAuth();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
