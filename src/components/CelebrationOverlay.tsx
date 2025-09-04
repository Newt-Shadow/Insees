"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Masterpiece CelebrationOverlay
 *
 * - Preserves: autoStart, autoCloseAfter, confettiDuration, secret "welcome", click-to-close behavior, confetti invocation.
 * - Enhances: visuals / motion / microinteractions / audio (no logic changes).
 *
 * Usage: same props as before.
 */

type CelebrationProps = {
  autoStart?: boolean;
  autoCloseAfter?: number; // ms
  confettiDuration?: number; // ms
};

const BALLOON_COUNT = 9;
const SPARKLE_COUNT = 36;
const EMOJI_COUNT = 10;

const CelebrationOverlay: React.FC<CelebrationProps> = ({
  autoStart = true,
  autoCloseAfter = 30000,
  confettiDuration = 5000,
}) => {
  // --- state & refs (core logic kept identical where applicable) ---
  const [confettiFn, setConfettiFn] = useState<any | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [typedText, setTypedText] = useState("");
  const firstRun = useRef(true);
  const secretBuffer = useRef("");
  const allowClickClose = useRef(false);
  const prefersReduced = useReducedMotion();

  // cursor parallax
  const pointer = useRef({ x: 0, y: 0 });
  const parallaxRAF = useRef<number | null>(null);
  const parallaxTarget = useRef({ tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // audio context (celebratory chime)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioAllowedRef = useRef(false);
  useEffect(() => {
    const onFirstInteraction = () => {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        audioCtxRef.current = null;
      }
      audioAllowedRef.current = true;
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  // --- typewriter (unchanged logic) ---
  const runTypewriter = useCallback((text: string) => {
    setTypedText("");
    let i = 0;
    const step = () => {
      i++;
      setTypedText(text.slice(0, i));
      if (i < text.length) {
        setTimeout(step, 42 + Math.random() * 25);
      }
    };
    step();
  }, []);

  // dynamic import of canvas-confetti (lazy)
  useEffect(() => {
    let mounted = true;
    import("canvas-confetti").then((mod) => {
      if (mounted) {
        const fn = (mod.default || mod);
        setConfettiFn(() => fn);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // deterministic-ish rng seeded per overlay show to stabilize positions
  const sceneSeed = useRef(Math.floor(Math.random() * 1e9));
  const makeRng = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  // precompute scene elements on open
  const scene = useMemo(() => {
    const rng = makeRng(sceneSeed.current);
    const balloons = Array.from({ length: BALLOON_COUNT }).map((_, i) => {
      const left = 6 + i * (88 / (BALLOON_COUNT - 1));
      const base = rng();
      return {
        id: `balloon-${i}`,
        left,
        duration: 6.5 + i * 0.65 + base * 1.2,
        delay: i * 0.45 + base * 0.35,
        sway: 6 + base * 8,
        scale: 0.9 + rng() * 0.35,
        emoji: i % 3 === 0 ? "🎈" : i % 3 === 1 ? "🎊" : "🎈",
      };
    });
    const sparkles = Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
      const top = rng() * 100;
      const left = rng() * 100;
      return {
        id: `spark-${i}`,
        top,
        left,
        delay: i * 0.06 + rng() * 0.3,
        duration: 1.4 + rng() * 1.3,
        rot: Math.floor(rng() * 360),
      };
    });
    const emojis = Array.from({ length: EMOJI_COUNT }).map((_, i) => {
      return {
        id: `em-${i}`,
        left: i * (100 / (EMOJI_COUNT - 1)),
        delay: i * 0.48 + rng() * 0.3,
        duration: 6 + rng() * 2,
      };
    });
    // aurora ribbons params
    const auroras = [
      { hue: 265, speed: 18, opacity: 0.12, offset: -12 },
      { hue: 330, speed: 22, opacity: 0.1, offset: 6 },
      { hue: 200, speed: 26, opacity: 0.08, offset: 30 },
    ];
    return { balloons, sparkles, emojis, auroras };
    // run only once (component mounted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- confetti + sound + original timing preserved ---
  const triggerCelebration = useCallback(() => {
    if (!confettiFn) return;
    setShowOverlay(true);

    // play small chime (non-blocking) if user allowed one interaction
    if (audioAllowedRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();
        g.gain.value = 0;
        o1.type = "sine";
        o2.type = "triangle";
        o1.frequency.value = 660;
        o2.frequency.value = 880;
        o1.connect(g);
        o2.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        o1.start(now);
        o2.start(now + 0.01);
        o1.stop(now + 0.35);
        o2.stop(now + 0.35);
      } catch { }
    }

    // typewriter (unchanged)
    runTypewriter("Welcome Batch of 2025–29!");

    // confetti firing loop (unchanged)
    const end = Date.now() + confettiDuration;

    (function frame() {
      if (!confettiFn) return;
      confettiFn({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
      });
      confettiFn({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        // exact same behavior: allow click to close after confetti stops
        allowClickClose.current = true;
      }
    })();

    // unchanged auto-close
    setTimeout(() => {
      setShowOverlay(false);
    }, autoCloseAfter);
  }, [confettiFn, confettiDuration, autoCloseAfter, runTypewriter]);

  // auto-start once after hydration (unchanged)
  useEffect(() => {
    if (!autoStart || !firstRun.current) return;
    firstRun.current = false;
    const t = setTimeout(() => {
      triggerCelebration();
    }, 600);
    return () => clearTimeout(t);
  }, [autoStart, triggerCelebration]);

  // secret key listener (unchanged)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      secretBuffer.current += e.key.toLowerCase();
      if (secretBuffer.current.includes("welcome")) {
        triggerCelebration();
        secretBuffer.current = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerCelebration]);

  // click-to-close after confetti stops (unchanged)
  useEffect(() => {
    const closeOnClick = () => {
      if (allowClickClose.current) setShowOverlay(false);
    };
    window.addEventListener("click", closeOnClick);
    return () => window.removeEventListener("click", closeOnClick);
  }, []);

  // pointer -> parallax effect (pure visual)
  useEffect(() => {
    if (prefersReduced) return;
    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // normalized -0.5..0.5
      pointer.current.x = (e.clientX / w) - 0.5;
      pointer.current.y = (e.clientY / h) - 0.5;
      parallaxTarget.current.tx = pointer.current.x * 12;
      parallaxTarget.current.ty = pointer.current.y * 10;
      if (parallaxRAF.current == null) {
        parallaxRAF.current = requestAnimationFrame(() => {
          parallaxRAF.current = null;
          const tx = parallaxTarget.current.tx;
          const ty = parallaxTarget.current.ty;
          if (containerRef.current) {
            containerRef.current.style.setProperty("--tx", `${tx}px`);
            containerRef.current.style.setProperty("--ty", `${ty}px`);
          }
        });
      }
    };
    window.addEventListener("pointermove", onPointer);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      if (parallaxRAF.current) cancelAnimationFrame(parallaxRAF.current);
      parallaxRAF.current = null;
    };
  }, [prefersReduced]);

  // inside CelebrationOverlay component, after existing effects

  // --- gesture detection for "O" shape ---
  useEffect(() => {
    let points: { x: number; y: number }[] = [];
    let drawing = false;

    const start = (e: TouchEvent) => {
      drawing = true;
      points = [];
      const t = e.touches[0];
      points.push({ x: t.clientX, y: t.clientY });
    };

    const move = (e: TouchEvent) => {
      if (!drawing) return;
      const t = e.touches[0];
      points.push({ x: t.clientX, y: t.clientY });
    };

    const end = () => {
      if (!drawing) return;
      drawing = false;

      if (points.length > 8) {
        // --- crude circle detection ---
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const w = maxX - minX;
        const h = maxY - minY;

        const aspect = w / (h || 1);
        const area = w * h;

        // heuristics: roughly square, not too tiny, many points
        if (aspect > 0.7 && aspect < 1.3 && area > 5000) {
          triggerCelebration();
        }
      }
      points = [];
    };

    window.addEventListener("touchstart", start);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);

    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
    };
  }, [triggerCelebration]);


  // small helper to render a lens-shaped aurora SVG — purely decorative
  const AuroraSVG = ({ hue = 260, opacity = 0.12, speed = 18, offset = 0 }: { hue?: number; opacity?: number; speed?: number; offset?: number; }) => {
    const animId = useMemo(() => `aur-${Math.floor(Math.random() * 1e6)}`, []);
    const grad = `linear-gradient(90deg, hsla(${hue} 80% 65% / ${opacity}), hsla(${(hue + 60) % 360} 80% 72% / ${opacity}), transparent)`;
    return (
      <motion.div
        aria-hidden
        style={{
          background: grad,
          filter: "blur(40px) saturate(120%)",
          transform: `translateY(${offset}px)`,
          mixBlendMode: "screen",
        }}
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.1, x: "-8%" }}
        animate={{ x: ["-8%", "8%", "-8%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  };

  // headline shimmer trigger after typing completes
  const typedCompleteRef = useRef(false);
  useEffect(() => {
    if (typedText === "Welcome Batch of 2025–29!") {
      typedCompleteRef.current = true;
    }
  }, [typedText]);

  // small SVG starburst for sparkles
  const StarBurst = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <g fill="none" stroke="rgba(255,255,200,0.9)" strokeWidth="1">
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.2 4.2l2.8 2.8M16.9 16.9l2.8 2.8M4.2 19.8l2.8-2.8M16.9 7.1l2.8-2.8" strokeLinecap="round" />
      </g>
    </svg>
  );

  // fade wrapper helpers for animation variants
  const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  // component render
  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center selection:bg-transparent"
          {...fadeIn}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-label="Celebration overlay"
          style={{
            // CSS variables controlled by pointer parallax
            transformStyle: "preserve-3d",
            // default CSS var values
            // --tx and --ty will be updated by pointer logic for parallax
          } as React.CSSProperties}
        >
          {/* full-screen dark glass backdrop */}
          <div
            className="absolute inset-0 bg-black/82 backdrop-blur-md"
            style={{
              transform: "translateZ(0)",
            }}
            aria-hidden
          />

          {/* AURORAS / NEBULA LAYERS (cinematic) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* three aurora ribbons */}
            {scene.auroras.map((a, i) => (
              <AuroraSVG key={`aur-${i}`} hue={a.hue} opacity={a.opacity} speed={a.speed} offset={a.offset} />
            ))}

            {/* subtle drifting nebula shapes (soft blobs using radial gradient blocks) */}
            <motion.div
              aria-hidden
              className="absolute -left-[10%] top-12 w-[80%] h-[60%]"
              initial={{ scale: 0.98, opacity: 0.08 }}
              animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.07, 0.12, 0.07] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(40% 40% at 20% 40%, rgba(96,165,250,0.14), transparent 18%), radial-gradient(30% 30% at 80% 60%, rgba(236,72,153,0.10), transparent 18%)",
                filter: "blur(36px) saturate(120%)",
                mixBlendMode: "screen",
              }}
            />
          </div>

          {/* parallax starfield / constellations */}
          <div className="absolute inset-0 pointer-events-none">
            {scene.sparkles.map((s) => (
              <motion.div
                key={s.id}
                className="absolute"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  transform: "translate3d(var(--tx,0), var(--ty,0), 0)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={prefersReduced ? { opacity: 0.6 } : { opacity: [0, 1, 0.6], scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: s.duration,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: "easeInOut",
                }}
                aria-hidden
              >
                <div style={{ width: 8, height: 8, filter: "drop-shadow(0 0 6px rgba(255,255,200,0.8))" }}>
                  <StarBurst size={10} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* balloons & emojis layer */}
          <div className="absolute inset-0 pointer-events-none">
            {/* balloons */}
            {scene.balloons.map((b, idx) => (
              <motion.div
                key={b.id}
                className="absolute will-change-transform"
                style={{
                  left: `${b.left}%`,
                  top: "88vh",
                  fontSize: `${28 * b.scale}px`,
                  transform: "translate3d(0,0,0)",
                  textShadow: "0 6px 18px rgba(0,0,0,0.45)",
                }}
                initial={{ y: "100vh", opacity: 0 }}
                animate={
                  prefersReduced
                    ? { y: "-12vh", opacity: 1 }
                    : {
                      y: "-20vh",
                      x: [0, b.sway, -b.sway, 0],
                      rotate: [0, 3, -6, 3, 0],
                      opacity: [0.9, 1],
                    }
                }
                transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                {/* balloon + string */}
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div aria-hidden style={{ lineHeight: 0 }}>
                    <span style={{ display: "inline-block", transform: `translateZ(0)` }}>{b.emoji}</span>
                  </div>
                  <div
                    aria-hidden
                    style={{
                      width: 1,
                      height: 80,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                      transform: "translateZ(0)",
                      opacity: 0.8,
                      borderRadius: 2,
                      boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                    }}
                  />
                </div>
              </motion.div>
            ))}

            {/* falling emojis */}
            {scene.emojis.map((em) => (
              <motion.div
                key={em.id}
                className="absolute will-change-transform text-4xl"
                style={{
                  left: `${em.left}%`,
                  top: "-12vh",
                  textShadow: "0 6px 14px rgba(0,0,0,0.35)",
                }}
                initial={{ y: "-12vh", opacity: 0 }}
                animate={prefersReduced ? { y: "105vh", opacity: 0.9 } : { y: "110vh", opacity: [0, 1, 0] }}
                transition={{ duration: em.duration, repeat: Infinity, delay: em.delay, ease: "easeInOut" }}
                aria-hidden
              >
                🎉
              </motion.div>
            ))}
          </div>

          {/* cinematic foreground card */}
          <motion.div
            className="relative z-60 mx-4 w-[min(94vw,980px)]"
            initial={{ scale: 0.9, opacity: 0, rotateX: 8 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.8 }}
          >
            {/* soft luminous rim */}
            <motion.div
              aria-hidden
              className="absolute -inset-1 rounded-3xl"
              style={{
                background: "linear-gradient(90deg, rgba(255,223,93,0.08), rgba(236,72,153,0.06), rgba(99,102,241,0.06))",
                filter: "blur(20px)",
                zIndex: -1,
              }}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
              className="
        relative overflow-hidden rounded-3xl border border-white/10 
        p-4 sm:p-6 md:p-8 
        backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        w-full max-w-[95%] sm:max-w-[650px] md:max-w-[900px] lg:max-w-[1100px]
        mx-auto
      "
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              }}
            >
              {/* headline badge */}
              <motion.div
                className="
          mb-4 sm:mb-5 inline-flex items-center gap-2 
          rounded-full px-3 sm:px-4 py-1.5 sm:py-2 
          text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wide
        "
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,236,179,0.95), rgba(255,186,147,0.95))",
                  color: "#08112a",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
                }}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.04 }}
              >
                🎊 Celebration Unlocked
              </motion.div>

              {/* headline */}
              <motion.h1
                className="
          font-extrabold leading-tight 
          text-[clamp(1.8rem,5vw,3.8rem)] 
          sm:text-[clamp(2.2rem,5vw,4.5rem)] 
          md:text-[clamp(2.8rem,5vw,5.5rem)] 
          break-words
        "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                aria-live="polite"
              >
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,245,220,1), rgba(255,210,240,1), rgba(210,230,255,1))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 10px 30px rgba(15,23,42,0.45)",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  {/* typed text with glowing caret */}
                  <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {typedText}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 22,
                      marginLeft: 4,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))",
                      opacity: typedText ? 1 : 0,
                      transformOrigin: "center",
                      borderRadius: 2,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                      verticalAlign: "middle",
                      animation: typedCompleteRef.current
                        ? "blink 1s steps(2, start) infinite"
                        : "none",
                    }}
                  />
                </span>

                {/* shimmer sweep */}
                {typedCompleteRef.current && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, x: "-20%" }}
                    animate={{ opacity: 1, x: "120%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      right: 0,
                      pointerEvents: "none",
                      mixBlendMode: "screen",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                )}
              </motion.h1>

              {/* subline */}
              <motion.p
                className="
          mt-3 sm:mt-4 
          text-sm sm:text-base md:text-lg 
          text-center sm:text-left
        "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                National Institute of Technology, Silchar · INSEES
              </motion.p>

              {/* interactive microhint */}
              <motion.div
                className="mt-4 sm:mt-6 select-none text-xs sm:text-sm text-center sm:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: allowClickClose.current ? 1 : 0 }}
                transition={{ duration: 0.28 }}
                style={{ color: "rgba(255,255,255,0.72)" }}
                aria-hidden={!allowClickClose.current}
              >
                AdAstra per Aspera · Step Into the new world
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay; 