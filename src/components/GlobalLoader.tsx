"use client";

import { useState, useLayoutEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PreLoader from "./PreLoader";

export default function GlobalLoader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // useLayoutEffect runs BEFORE the browser paints the screen.
  // This ensures the old page is hidden and the loader is shown immediately
  // when the route changes, preventing any flash of the new page.
  useLayoutEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Enforce minimum 2 seconds

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PreLoader key="loader" />}
      </AnimatePresence>
      
      {/* We hide the content using display:none while loading 
         to ensure it is mounted but not visible (preventing flashes).
      */}
      <div style={{ display: loading ? "none" : "block" }}>
        {children}
      </div>
    </>
  );
}