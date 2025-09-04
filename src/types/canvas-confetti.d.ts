declare module "canvas-confetti" {
  export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x: number; y: number };
    colors?: string[];
    shapes?: ("square" | "circle" | string)[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  export interface CreateConfettiOptions {
    resize?: boolean;
    useWorker?: boolean;
  }

  export type ConfettiFn = (options?: ConfettiOptions) => Promise<null>;

  export default function confetti(
    options?: ConfettiOptions
  ): Promise<null>;

  export function create(
    canvas: HTMLCanvasElement,
    options?: CreateConfettiOptions
  ): ConfettiFn;
}
