// Index dérivés du contenu : notions par journée, clés d’items, helpers sur le lexique.
// Une « clé » identifie un item : "q:3" (QCM), "x:12" (lexique), "tf:0", "bl:5", "or:2".

import { BL } from "@/data/phrases-a-trous";
import { LEX } from "@/data/lexique";
import { OR } from "@/data/ordres";
import { QCM } from "@/data/qcm";
import type { Topic } from "@/data/types";
import { TOPICS } from "@/data/units";
import { TF } from "@/data/vrai-faux";

export type ItemType = "q" | "x" | "tf" | "bl" | "or";

export const TOPIC: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

export const unitTopics = (d: number): string[] => TOPICS.filter((t) => t.d === d).map((t) => t.id);

export const KEYS: Record<string, Record<ItemType, string[]>> = {};
TOPICS.forEach((t) => (KEYS[t.id] = { q: [], x: [], tf: [], bl: [], or: [] }));
QCM.forEach((o, i) => KEYS[o.t].q.push("q:" + i));
LEX.forEach((o, i) => KEYS[o.t].x.push("x:" + i));
TF.forEach((o, i) => KEYS[o.t].tf.push("tf:" + i));
BL.forEach((o, i) => KEYS[o.t].bl.push("bl:" + i));
OR.forEach((o, i) => KEYS[o.t].or.push("or:" + i));

export const topicKeys = (t: string): string[] => Object.values(KEYS[t]).flat();
export const unitKeys = (d: number): string[] => unitTopics(d).flatMap(topicKeys);
export const ALLKEYS: string[] = TOPICS.flatMap((t) => topicKeys(t.id));

/** Index numérique d’une clé « type:index ». */
export const keyIndex = (k: string): number => +k.split(":")[1];

/** Variantes acceptées d’un terme : « MOA — maîtrise d’ouvrage (client) » → 3 variantes. */
export const termAlts = (n: string): string[] => {
  const out: string[] = [];
  let base = n;
  let par: string | null = null;
  const m = n.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (m) {
    base = m[1];
    par = m[2];
  }
  base.split(/\s+—\s+/).forEach((s) => out.push(s));
  if (par) out.push(par);
  return out.map((s) => s.trim()).filter(Boolean);
};

/** Première phrase d’une définition. */
export const shortDef = (x: string): string => x.split(/(?<=\.)\s/)[0];

/** Un terme est proposé en saisie libre s’il a une variante courte. */
export const typable = (n: string): boolean => Math.min(...termAlts(n).map((a) => a.length)) <= 18;
