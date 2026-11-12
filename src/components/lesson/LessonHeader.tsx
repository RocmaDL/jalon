// En-tête de séance : bouton quitter, barre de progression (ou minuteur), cœurs / vies.

import { useEffect, useState } from "react";
import { EXPRESS_MS, expressLeft, setConfirm } from "@/game/actions";
import { D } from "@/game/state";
import type { Session } from "@/game/types";
import { Icon } from "../ui/Icon";

/** Redessine le composant à intervalle régulier tant que `active` est vrai. */
function useTick(active: boolean, ms: number): void {
  const [, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [active, ms]);
}

function Lives({ ls, left }: { ls: Session; left: number }) {
  if (ls.express)
    return (
      <div className="lives" style={{ color: "var(--jcc)" }}>
        <span className="num">{Math.ceil(left / 1000)} s</span>
      </div>
    );
  if (ls.mode === "hearts")
    return (
      <div className="lives">
        <Icon name="heart" color="var(--bad)" />
        <span className="num">{D.unlimited ? "∞" : D.hearts}</span>
      </div>
    );
  if (ls.mode === "lives")
    return (
      <div className="lives" aria-label={`${ls.lives} vies`}>
        {[0, 1, 2].map((i) => (
          <Icon key={i} name="heart" color={i < ls.lives ? "var(--bad)" : "var(--line)"} />
        ))}
      </div>
    );
  if (ls.exam)
    return (
      <div className="lives" style={{ color: "var(--muted)", fontSize: 16 }}>
        {ls.answered + 1} / {ls.total}
      </div>
    );
  return null;
}

export function LessonHeader({ ls }: { ls: Session }) {
  useTick(!!ls.express, 200);
  const left = ls.express ? expressLeft(ls) : 0;
  const prog = ls.express
    ? (left / EXPRESS_MS) * 100
    : Math.round(((ls.exam || ls.mode === "lives" ? ls.answered : ls.solved) / ls.total) * 100);
  return (
    <div className="lhead">
      <button className="x" onClick={() => setConfirm(true)} aria-label="Quitter">
        <Icon name="cross" />
      </button>
      <div className={`lbar ${ls.express ? "timer" : ls.combo >= 5 ? "hot" : ""}`}>
        <i style={{ width: `${prog}%` }} />
      </div>
      <Lives ls={ls} left={left} />
    </div>
  );
}
