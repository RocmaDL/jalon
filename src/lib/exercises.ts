// Génération, ordonnancement et correction des exercices.

import { LEX } from "@/data/lexique";
import { OR } from "@/data/ordres";
import { BL } from "@/data/phrases-a-trous";
import { QCM } from "@/data/qcm";
import { TF } from "@/data/vrai-faux";
import { DIFF } from "@/game/constants";
import type { ExMode, Exercise, PairsEx } from "@/game/types";
import { KEYS, TOPIC, keyIndex, shortDef, termAlts, typable, unitTopics } from "./content";
import { shuffle } from "./random";
import { lev, norm } from "./text";

export type Answerable = Exclude<Exercise, PairsEx>;

/** Construit un exercice à partir d’une clé d’item. Pour le lexique, `mode` choisit la forme. */
export function makeEx(k: string, mode?: ExMode): Answerable {
  const [ty, s] = k.split(":");
  const i = +s;
  if (ty === "q") {
    const o = QCM[i];
    return { type: "choice", k, mode, t: o.t, tag: "Question de cours", prompt: o.q, opts: shuffle([o.ok, ...o.ko]), ok: o.ok, e: o.e, sel: null };
  }
  if (ty === "tf") {
    const o = TF[i];
    return { type: "tf", k, mode, t: o.t, tag: "Vrai ou faux ?", prompt: o.s, opts: ["Vrai", "Faux"], ok: o.v ? "Vrai" : "Faux", e: o.e, sel: null };
  }
  if (ty === "bl") {
    const o = BL[i];
    return { type: "blank", k, mode, t: o.t, tag: "Complète la phrase", a: o.a, b: o.b, tiles: shuffle([o.ok, ...o.ko]), ok: o.ok, e: o.e, slot: null };
  }
  if (ty === "or") {
    const o = OR[i];
    return {
      type: "order",
      k,
      mode,
      t: o.t,
      tag: "Remets dans l'ordre",
      prompt: o.p,
      items: o.items,
      bank: shuffle(o.items.map((_, j) => j)),
      seq: [],
      e: o.e,
    };
  }
  // Lexique : leurres pris dans la même journée.
  const x = LEX[i];
  const pool = LEX.map((_, j) => j).filter((j) => j !== i && TOPIC[LEX[j].t].d === TOPIC[x.t].d);
  const oth = shuffle(pool).slice(0, 3);
  if (mode === "new" || mode === "def")
    return {
      type: "choice",
      k,
      mode,
      t: x.t,
      tag: mode === "new" ? "Nouveau terme" : "Choisis la définition",
      isNew: mode === "new",
      prompt: `Que veut dire « ${x.n} » ?`,
      opts: shuffle([shortDef(x.x), ...oth.map((j) => shortDef(LEX[j].x))]),
      ok: shortDef(x.x),
      e: x.x,
      sel: null,
    };
  if (mode === "type" && typable(x.n))
    return {
      type: "type",
      k,
      mode,
      t: x.t,
      tag: "Écris le terme",
      prompt: "Quel terme correspond à cette définition ?",
      quote: x.x,
      alts: termAlts(x.n),
      ok: x.n,
      text: "",
      hint: 0,
    };
  return {
    type: "choice",
    k,
    mode: "term",
    t: x.t,
    tag: "Retrouve le terme",
    prompt: "Quel terme correspond à cette définition ?",
    quote: x.x,
    opts: shuffle([x.n, ...oth.map((j) => LEX[j].n)]),
    ok: x.n,
    sel: null,
  };
}

/** Quatre termes à associer à leur définition (indices dans LEX). */
export function makePairs(ids: number[]): PairsEx {
  return {
    type: "pairs",
    t: LEX[ids[0]].t,
    tag: "Associe les paires",
    ids,
    left: shuffle(ids),
    right: shuffle(ids),
    selL: null,
    selR: null,
    matched: [],
    errs: 0,
    miss: [],
    bad: null,
  };
}

interface PlanEntry {
  key?: string;
  mode?: ExMode;
  diff: number;
  pairs?: number[];
}

/** Trie par difficulté (avec du bruit) et garde un exercice facile pour la fin. */
function plan(entries: PlanEntry[]): Exercise[] {
  const arr = entries.map((e) => ({ ...e, r: e.diff + Math.random() * 1.4 })).sort((a, b) => a.r - b.r);
  const ei = arr.findIndex((e, j) => j >= 2 && e.diff <= 1);
  if (arr.length > 5 && ei >= 0 && ei < arr.length - 1) {
    const [e] = arr.splice(ei, 1);
    arr.push(e);
  }
  return arr.map((e) => (e.pairs ? makePairs(e.pairs) : makeEx(e.key as string, e.mode)));
}

const half = <T,>(a: T[], second: number | boolean): T[] => {
  const s = Math.ceil(a.length / 2);
  return second ? a.slice(s) : a.slice(0, s);
};

/** Leçon n (0 = découverte, 1 = approfondissement) d’une notion, 14 exercices au plus. */
export function topicLesson(tid: string, n: number): Exercise[] {
  const K = KEYS[tid];
  const E: PlanEntry[] = [];
  if (n === 0) half(K.x, 0).forEach((k) => E.push({ key: k, mode: "new", diff: 1 }));
  else {
    half(K.x, 1).forEach((k) => E.push({ key: k, mode: "new", diff: 1 }));
    half(K.x, 0).forEach((k, j) => E.push({ key: k, mode: j % 2 ? "term" : "type", diff: j % 2 ? 2 : 3 }));
  }
  half(K.q, n).forEach((k) => E.push({ key: k, diff: 2 }));
  half(K.tf, n).forEach((k) => E.push({ key: k, diff: 1 }));
  half(K.bl, n).forEach((k) => E.push({ key: k, diff: 2 }));
  (K.or.length === 1 ? (n ? K.or : []) : half(K.or, n)).forEach((k) => E.push({ key: k, diff: 3 }));

  // Paires : termes de la notion, complétés par ceux des notions précédentes de la journée.
  const ts = unitTopics(TOPIC[tid].d);
  const upto = ts.slice(0, ts.indexOf(tid) + 1);
  const own = K.x.map(keyIndex);
  const others = upto
    .filter((t) => t !== tid)
    .flatMap((t) => KEYS[t].x)
    .map(keyIndex);
  const pool = shuffle(own).concat(shuffle(others));
  if (pool.length >= 4) E.push({ pairs: pool.slice(0, 4), diff: 2.5 });

  while (E.length > 14) {
    const j = E.map((e, ix) => [e, ix] as const)
      .filter(([e]) => e.key && (e.key.startsWith("q:") || e.key.startsWith("tf:")))
      .pop();
    if (!j) break;
    E.splice(j[1], 1);
  }
  return plan(E);
}

/** Séance de révision à partir d’une liste de clés. */
export function keysToEx(keys: string[], { pairs = true } = {}): Exercise[] {
  const E = keys.map(
    (k): PlanEntry =>
      k.startsWith("x:")
        ? { key: k, mode: Math.random() < 0.5 ? "term" : "type", diff: 2.5 }
        : { key: k, diff: DIFF[k.split(":")[0]] || 2 },
  );
  const xs = keys.filter((k) => k.startsWith("x:")).map(keyIndex);
  if (pairs && xs.length >= 4) {
    const pick = xs.slice(0, 4);
    pick.forEach((i) => {
      const j = E.findIndex((e) => e.key === "x:" + i);
      if (j >= 0) E.splice(j, 1);
    });
    E.push({ pairs: pick, diff: 2.5 });
  }
  return plan(E);
}

export function canCheck(ex: Exercise): boolean {
  switch (ex.type) {
    case "choice":
    case "tf":
      return ex.sel !== null;
    case "blank":
      return ex.slot !== null;
    case "order":
      return ex.seq.length === ex.items.length;
    case "type":
      return norm(ex.text).length > 0;
    default:
      return false;
  }
}

/** Corrige un exercice. En saisie libre, une faute de frappe est tolérée (marquée `typo`). */
export function evalEx(ex: Answerable): boolean {
  switch (ex.type) {
    case "choice":
    case "tf":
      return ex.sel !== null && ex.opts[ex.sel] === ex.ok;
    case "blank":
      return ex.slot !== null && ex.tiles[ex.slot] === ex.ok;
    case "order":
      return ex.seq.length === ex.items.length && ex.seq.every((j, p) => j === p);
    case "type": {
      const v = norm(ex.text);
      const al = ex.alts.map(norm);
      if (al.includes(v)) return true;
      if (al.some((a) => a.length >= 5 && lev(a, v) <= 1)) {
        ex.typo = true;
        return true;
      }
      return false;
    }
  }
}
