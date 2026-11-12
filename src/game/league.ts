// Ligue hebdomadaire. Les 19 adversaires sont simulés de façon déterministe
// (graine = semaine + niveau) et leur XP progresse au fil de la semaine.

import { today, weekId, weekStartOf } from "@/lib/dates";
import { rng, shuffleR } from "@/lib/random";
import { AVC, BOTN } from "./constants";
import { D } from "./state";

export interface LeagueRow {
  name: string;
  xp: number;
  c: string;
  me?: boolean;
}

function bots(week: string, tier: number, frac: number): LeagueRow[] {
  const r = rng(week + "#" + tier);
  const names = shuffleR(BOTN, r).slice(0, 19);
  const base = 80 * Math.pow(1.3, tier);
  const day = Math.min(1, Math.max(0, frac)) * 7;
  return names.map((name, i) => {
    const active = r() > 0.12;
    const W = active ? Math.round(base * (0.25 + r() * 2)) : 0;
    const dw = Array.from({ length: 7 }, () => (r() < 0.2 ? 0 : r()));
    const tot = dw.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    for (let k = 0; k < 7; k++) {
      if (day >= k + 1) acc += dw[k];
      else if (day > k) acc += dw[k] * (day - k);
    }
    return { name, xp: Math.round((W * acc) / tot), c: AVC[i % AVC.length] };
  });
}

/** Classement de la semaine, joueur inclus. */
export function table(
  week: string = weekId(),
  tier: number = D.league.tier,
  frac: number | null = null,
  myXp: number = D.league.weekXp,
): LeagueRow[] {
  const f = frac ?? (Date.now() - weekStartOf(week).getTime()) / (7 * 864e5);
  return bots(week, tier, f)
    .concat([{ name: D.name || "Toi", xp: myXp, me: true, c: "var(--pri)" }])
    .sort((a, b) => b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0));
}

/** Clôt la semaine écoulée : promotion (top 7), relégation (16e et au-delà), récompense du podium. */
export function processWeek(): void {
  const w = weekId();
  if (D.league.week === w) return;
  if (D.league.week && D.league.weekXp > 0) {
    const tb = table(D.league.week, D.league.tier, 1, D.league.weekXp);
    const rank = tb.findIndex((x) => x.me) + 1;
    const old = D.league.tier;
    let nt = old;
    if (rank <= 7 && old < 9) nt = old + 1;
    else if (rank >= 16 && old > 0) nt = old - 1;
    const rw = rank === 1 ? 30 : rank === 2 ? 20 : rank === 3 ? 10 : 0;
    D.jcc += rw;
    if (nt > old) {
      D.league.promos++;
      if (D.freezes < 2) D.freezes++;
    }
    D.league.tier = nt;
    D.league.result = { rank, old, nt, rw };
  }
  D.league.week = w;
  D.league.weekXp = 0;
}

/** Millisecondes avant la fin de la semaine de ligue. */
export function weekTimeLeft(): number {
  const end = weekStartOf(today());
  end.setDate(end.getDate() + 7);
  return end.getTime() - Date.now();
}
