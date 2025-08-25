import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [region, setRegion] = useState("");
  const [severity, setSeverity] = useState("");
  const [type, setType] = useState("");

  const resetFilters = () => {
    setRegion("");
    setSeverity("");
    setType("");
  };

  return (
    <FilterContext.Provider
      value={{
        region,
        setRegion,
        severity,
        setSeverity,
        type,
        setType,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
