import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <ComparisonProvider>
          <App />
        </ComparisonProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
);
