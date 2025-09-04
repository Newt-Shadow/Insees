// components/CelebrationWrapper.tsx
"use client";

import CelebrationOverlay from "@/components/CelebrationOverlay";

export default function CelebrationWrapper() {
  return <CelebrationOverlay autoStart={true} autoCloseAfter={12000} />;
  }
  