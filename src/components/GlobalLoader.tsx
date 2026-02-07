"use client";

import { useState, useLayoutEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PreLoader from "./PreLoader";
import { usePreloader } from "@/app/context/PreloaderContext";

export default function GlobalLoader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { setHasLoaded } = usePreloader();

  // useLayoutEffect runs BEFORE the browser paints the screen.
  // This ensures the old page is hidden and the loader is shown immediately
  // when the route changes, preventing any flash of the new page.
  useLayoutEffect(() => {
    // Only show loader if we actually want to mask a route transition
    // For "immediate load", we generally want to minimize this.
    // However, keeping the structure but removing the delay:
    setLoading(true);

    // Remove the artificial delay.
    // We can use requestAnimationFrame to allow one frame of "loading" if needed for transition smoothness,
    // or just set it to false immediately in a useEffect to unblock as soon as hydration happens.

    const timer = requestAnimationFrame(() => {
      setLoading(false);
      setHasLoaded(true); // Ensure app knows we are loaded
    });

    return () => cancelAnimationFrame(timer);
  }, [pathname, setHasLoaded]);

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