"use client";
import React, { createContext, useContext, useState } from "react";

interface PreloaderContextType {
  hasLoaded: boolean;
  setHasLoaded: (value: boolean) => void;
  targetLabel: string;
  triggerBoot: (label?: string) => void; // Accepts a label now
}

const PreloaderContext = createContext<PreloaderContextType>({
  hasLoaded: false,
  setHasLoaded: () => {},
  targetLabel: "SYSTEM",
  triggerBoot: () => {},
});

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [targetLabel, setTargetLabel] = useState("SYSTEM");

  const triggerBoot = (label: string = "SYSTEM") => {
    setTargetLabel(label);
    setHasLoaded(false);
  };

  return (
    <PreloaderContext.Provider value={{ hasLoaded, setHasLoaded, targetLabel, triggerBoot }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);