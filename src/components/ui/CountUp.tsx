// Nombre qui défile de 0 à sa valeur en 700 ms (désactivé si mouvement réduit).

import { useEffect, useRef } from "react";
import { reduced } from "@/lib/effects";

export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !to) return;
    const t0 = performance.now();
    let raf = 0;
    const frame = (t: number): void => {
      const p = Math.min(1, (t - t0) / 700);
      el.textContent = String(Math.round(to * p * (2 - p)));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    frame(t0);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return (
    <span className="num" ref={ref}>
      {to}
    </span>
  );
}
