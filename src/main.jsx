import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Providers
import { EventProvider } from "./utils/eventBus.jsx";
import { FilterProvider } from "./utils/filterContext.jsx";
import { SettingsProvider } from "./utils/settingsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <EventProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </EventProvider>
    </SettingsProvider>
  </React.StrictMode>
);
