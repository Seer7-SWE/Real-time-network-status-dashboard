import {createContext, useContext, useMemo, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [showPopup, setShowPopup] = useState(true);
  const [darkmode, setDarkMode] = useState(false);

const value = useMemo(() => ({
  showPopup,
  setShowPopup,
  darkMode,
  setDarkMode,
}), [showPopup, darkMode]);

return (
  <SettingsContext.Provider value={value}>
    {children}
  </SettingsContext.Provider>
);

export function useSettings() {
  return useContext(SettingsContext);
}
