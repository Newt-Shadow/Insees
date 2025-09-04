import { useEffect } from "react";

export default function AudioCue({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
    o.stop(ctx.currentTime + 1);
  }, [active]);

  return null;
}
