// Effets : sons synthétisés (Web Audio), vibration, confettis sur le canvas #fx.

import { D } from "@/game/state";

export type Sound = "ok" | "bad" | "tap" | "done" | "chest" | "combo";

/** Notes : [fréquence Hz, départ s, durée s]. */
const SEQ: Record<Sound, [number, number, number][]> = {
  ok: [
    [660, 0, 0.09],
    [990, 0.08, 0.18],
  ],
  bad: [
    [220, 0, 0.13],
    [165, 0.12, 0.22],
  ],
  tap: [[520, 0, 0.05]],
  done: [
    [523, 0, 0.12],
    [659, 0.12, 0.12],
    [784, 0.24, 0.12],
    [1047, 0.36, 0.35],
  ],
  chest: [
    [880, 0, 0.08],
    [1175, 0.08, 0.08],
    [1568, 0.16, 0.25],
  ],
  combo: [
    [784, 0, 0.07],
    [988, 0.07, 0.07],
    [1319, 0.14, 0.16],
  ],
};

let ac: AudioContext | null = null;

export function snd(kind: Sound): void {
  if (!D.sound) return;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = ac || new Ctor();
    const ctx = ac;
    const t = ctx.currentTime;
    SEQ[kind].forEach(([f, s, d]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = kind === "bad" ? "square" : "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + s);
      g.gain.exponentialRampToValueAtTime(kind === "bad" ? 0.04 : 0.11, t + s + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + s + d);
      o.connect(g).connect(ctx.destination);
      o.start(t + s);
      o.stop(t + s + d + 0.03);
    });
  } catch {
    /* audio indisponible */
  }
}

export function vib(pattern: number): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* vibration indisponible */
  }
}

export const reduced = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function confetti(): void {
  if (reduced()) return;
  const c = document.getElementById("fx") as HTMLCanvasElement | null;
  const ctx = c?.getContext("2d");
  if (!c || !ctx) return;
  const W = (c.width = innerWidth);
  const H = (c.height = innerHeight);
  const cs = getComputedStyle(document.documentElement);
  const cols = ["--pri", "--good", "--fire", "--xp", "--legend", "--jcc", "--u3"].map((v) => cs.getPropertyValue(v).trim());
  const P = Array.from({ length: 140 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.4,
    y: H * 0.32,
    vx: (Math.random() - 0.5) * 13,
    vy: -Math.random() * 14 - 4,
    r: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.3,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    c: cols[Math.floor(Math.random() * cols.length)],
  }));
  const t0 = performance.now();
  const frame = (t: number): void => {
    ctx.clearRect(0, 0, W, H);
    P.forEach((p) => {
      p.vy += 0.36;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (t - t0 < 2700) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  };
  frame(t0);
}
