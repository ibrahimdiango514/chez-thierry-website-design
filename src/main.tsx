import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initAnalytics } from "./analytics/ga4";

// Mesure d'audience : consentement par défaut « refusé » avant tout rendu.
// Rien n'est chargé tant que l'internaute n'a pas accepté (voir src/analytics).
initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
