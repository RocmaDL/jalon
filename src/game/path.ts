// Parcours d’une journée : notions, coffre, révision, épreuve.

import { UNITS } from "@/data/units";
import { TOPIC, topicKeys, unitTopics } from "@/lib/content";
import { strengthOf } from "./memory";
import { D } from "./state";

export type PathNode =
  | { id: string; type: "topic"; t: string }
  | { id: string; type: "chest" }
  | { id: string; type: "review"; d: number }
  | { id: string; type: "exam"; d: number };

export interface NodeState {
  locked: boolean;
  done: boolean;
  /** Avancement d’une notion (0, 0.5 ou 1). */
  prog: number;
  /** Notion terminée mais en partie oubliée. */
  cracked: boolean;
  strength: number | null;
}

export function unitNodes(d: number): PathNode[] {
  const N: PathNode[] = [];
  unitTopics(d).forEach((t, i) => {
    N.push({ id: "t:" + t, type: "topic", t });
    if (i === 1) N.push({ id: "c:" + d, type: "chest" });
  });
  N.push({ id: "r:" + d, type: "review", d });
  N.push({ id: "e:" + d, type: "exam", d });
  return N;
}

/** Une journée devient disponible après la validation de l'épreuve précédente. */
export function unitUnlocked(d: number): boolean {
  return d === UNITS[0]?.d || !!D.legend["e:" + (d - 1)];
}

const nodeDone = (n: PathNode): boolean => {
  switch (n.type) {
    case "topic":
      return (D.lessons[n.t] || 0) >= 2;
    case "chest":
      return !!D.chests[n.id];
    case "review":
      return !!D.rev[n.id];
    default:
      return !!D.legend[n.id];
  }
};

/** Une étape est verrouillée tant que la précédente (hors coffre) n’est pas faite. */
export function nodeState(N: PathNode[], i: number): NodeState {
  const n = N[i];
  const unit = n.type === "topic" ? TOPIC[n.t].d : n.type === "review" || n.type === "exam" ? n.d : 0;
  if (unit && !unitUnlocked(unit)) {
    const prog = n.type === "topic" ? (D.lessons[n.t] || 0) / 2 : 0;
    const st = n.type === "topic" && nodeDone(n) ? strengthOf(topicKeys(n.t)) : null;
    return { locked: true, done: nodeDone(n), prog, cracked: st !== null && st < 0.5, strength: st };
  }
  // L'épreuve est aussi le point de passage : elle peut être tentée pour
  // valider ou sauter la journée sans terminer toutes ses leçons.
  if (n.type === "exam") {
    return { locked: false, done: nodeDone(n), prog: 0, cracked: false, strength: null };
  }
  let pi = i - 1;
  while (pi >= 0 && N[pi].type === "chest" && n.type !== "chest") pi--;
  const locked = pi >= 0 && !nodeDone(N[pi]) && !nodeDone(n);
  const done = nodeDone(n);
  const prog = n.type === "topic" ? (D.lessons[n.t] || 0) / 2 : 0;
  const st = n.type === "topic" && done ? strengthOf(topicKeys(n.t)) : null;
  return { locked, done, prog, cracked: st !== null && st < 0.5, strength: st };
}

/** Première étape disponible et non terminée, toutes journées confondues. */
export function globalCurrent(): string | null {
  for (const u of UNITS) {
    const N = unitNodes(u.d);
    for (let i = 0; i < N.length; i++) {
      if (N[i].type === "chest") continue;
      const s = nodeState(N, i);
      if (!s.locked && !s.done) return N[i].id;
    }
  }
  return null;
}

export const nodeLabel = (n: PathNode): string =>
  n.type === "topic" ? TOPIC[n.t].n : n.type === "chest" ? "Coffre" : n.type === "review" ? "Révision" : "Épreuve";
