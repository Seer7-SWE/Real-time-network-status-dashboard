import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    refreshInterval: 5000,
    showNotifications: true,
    theme: 'light'
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider. Wrap your app with <SettingsProvider> in main.jsx');
  }
  return context;
};

export default SettingsContext;
