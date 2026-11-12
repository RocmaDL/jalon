// Quêtes du jour : une quête d’XP fixe et deux quêtes tirées au sort (même tirage toute la journée).

import { today } from "@/lib/dates";
import { rng, shuffleR } from "@/lib/random";
import { QPOOL } from "./constants";
import { D } from "./state";
import type { Quest } from "./types";

export function quests(): Quest[] {
  const r = rng("q" + today() + D.goal);
  const pool = shuffleR(QPOOL, r).slice(0, 2);
  const list: Pick<Quest, "k" | "t" | "n" | "rw">[] = [
    { k: "xp", t: `Gagne ${D.goal} XP`, n: D.goal, rw: 10 },
    ...pool.map((p, i) => {
      const n = p.v[Math.floor(r() * p.v.length)];
      return { k: p.k, t: p.t(n), n, rw: i ? 20 : 15 };
    }),
  ];
  return list.map((q, i) => {
    const v = D.daily[q.k] || 0;
    return { ...q, i, cur: Math.min(v, q.n), done: v >= q.n, claimed: D.daily.claimed.includes(i) };
  });
}

/** Verse les récompenses des quêtes terminées et renvoie celles qui viennent d’être validées. */
export function settleQuests(): Quest[] {
  const got: Quest[] = [];
  quests().forEach((q) => {
    if (q.done && !q.claimed) {
      D.daily.claimed.push(q.i);
      D.jcc += q.rw;
      D.stats.quests++;
      D.month.quests++;
      got.push(q);
    }
  });
  if (D.month.quests >= 20 && !D.month.done) {
    D.month.done = true;
    D.jcc += 50;
    D.notes.push("Défi du mois réussi : +50 JCC.");
  }
  return got;
}
