import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiLayer({
  registerConfetti,
}: {
  registerConfetti: (fn: () => void) => void;
}) {
  useEffect(() => {
    const fire = () => {
      const end = Date.now() + 1500;
      const frame = () => {
        if (Date.now() > end) return;
        confetti({ particleCount: 6, spread: 360, origin: { x: 0, y: Math.random() - 0.2 } });
        confetti({ particleCount: 6, spread: 360, origin: { x: 1, y: Math.random() - 0.2 } });
        requestAnimationFrame(frame);
      };
      frame();
    };
    registerConfetti(fire);
  }, [registerConfetti]);

  return null;
}
