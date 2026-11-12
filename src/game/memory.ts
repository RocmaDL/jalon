// Mémoire des items, inspirée de la half-life regression :
// probabilité de rappel = 2^(-temps écoulé / demi-vie).

import { LEX } from "@/data/lexique";
import { ALLKEYS } from "@/lib/content";
import { shuffle } from "@/lib/random";
import { D } from "./state";

export function recall(k: string): number | null {
  const m = D.mem[k];
  if (!m) return null;
  const dh = (Date.now() - m.t) / 36e5;
  return Math.pow(2, -dh / m.h);
}

/** Enregistre une réponse : la demi-vie s’allonge si juste, se raccourcit sinon. */
export function learn(k: string | undefined, ok: boolean): void {
  if (!k) return;
  const m = D.mem[k] || { h: 0, t: 0, n: 0, c: 0 };
  m.n++;
  if (ok) m.c++;
  m.h = m.h === 0 ? (ok ? 12 : 3) : ok ? Math.min(m.h * 2.2, 24 * 120) : Math.max(1, m.h / 2.5);
  m.t = Date.now();
  D.mem[k] = m;
  if (ok) D.missed = D.missed.filter((x) => x !== k);
  else if (!D.missed.includes(k)) D.missed.push(k);
}

/** Rappel moyen des items déjà vus, ou null si aucun. */
export function strengthOf(keys: string[]): number | null {
  const ks = keys.filter((k) => D.mem[k]);
  if (!ks.length) return null;
  return ks.reduce((s, k) => s + (recall(k) ?? 0), 0) / ks.length;
}

/** Termes du lexique réussis au moins deux fois et encore bien retenus. */
export const mastered = (): number =>
  LEX.filter((_, i) => {
    const m = D.mem["x:" + i];
    return m && m.c >= 2 && (recall("x:" + i) ?? 0) > 0.5;
  }).length;

export const seenKeys = (): string[] => Object.keys(D.mem).filter((k) => ALLKEYS.includes(k));

/** Les n items les moins bien retenus, complétés au hasard par des items jamais vus. */
export function weakest(keys: string[], n: number): string[] {
  const seen = keys.filter((k) => D.mem[k]).sort((a, b) => (recall(a) ?? 0) - (recall(b) ?? 0));
  let out = seen.slice(0, n);
  if (out.length < n) out = out.concat(shuffle(keys.filter((k) => !out.includes(k))).slice(0, n - out.length));
  return out;
}
