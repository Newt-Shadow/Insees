"use client";
import { createContext, useContext, useState } from "react";

type PreloaderState = {
  show: boolean;
  messages: string[];
  start: (messages: string[]) => void;
  stop: () => void;
};

const PreloaderContext = createContext<PreloaderState | null>(null);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const start = (msgs: string[]) => {
    setMessages(msgs);
    setShow(true);
  };

  const stop = () => setShow(false);

  return (
    <PreloaderContext.Provider value={{ show, messages, start, stop }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const ctx = useContext(PreloaderContext);
  if (!ctx) throw new Error("usePreloader must be used inside provider");
  return ctx;
}
