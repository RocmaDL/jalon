// Store client. L’état reste mutable comme dans la version d’origine ;
// `commit()` remplace l’ancien `render()` : il met à jour l’état dérivé, sauvegarde,
// puis prévient React via useSyncExternalStore.

import { useSyncExternalStore } from "react";
import { LEX } from "@/data/lexique";
import { TOPIC } from "@/lib/content";
import { shuffle } from "@/lib/random";
import { processWeek } from "./league";
import { checkStreak, ensureDaily, regen } from "./progress";
import { D, loadD, saveD } from "./state";
import type { ModalSpec, Mood, Session, UiState } from "./types";

/* ---------- État d’interface ---------- */

export const S: UiState = {
  tab: "learn",
  sub: null,
  pop: null,
  fc: null,
  fcDay: "all",
  fcDir: "td",
  search: "",
  lexDay: "all",
  resetAsk: false,
};

/** Séance en cours (leçon, révision, épreuve…), ou null sur les pages. */
export let LS: Session | null = null;
export function setLS(s: Session | null): void {
  LS = s;
}

export let modal: ModalSpec | null = null;
export function setModal(m: ModalSpec | null): void {
  modal = m;
}

/* ---------- Notifications éphémères ---------- */

export interface Notice {
  id: number;
  kind: "toast" | "burst";
  msg: string;
  mood?: Mood;
}

export let notices: Notice[] = [];
let nextId = 0;

function pushNotice(n: Omit<Notice, "id">, ms: number): void {
  const id = ++nextId;
  notices = [...notices, { ...n, id }];
  emit();
  setTimeout(() => {
    notices = notices.filter((x) => x.id !== id);
    emit();
  }, ms);
}

export const toast = (msg: string): void => pushNotice({ kind: "toast", msg }, 3300);
export const burst = (msg: string, mood: Mood = "wow"): void => pushNotice({ kind: "burst", msg, mood }, 1900);

/* ---------- Abonnement React ---------- */

let version = 0;
const listeners = new Set<() => void>();
const getVersion = (): number => version;

export function emit(): void {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Redessine le composant à chaque `emit()`. */
export function useStore(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

/* ---------- Mise à jour ---------- */

function ensureFlashDeck(): void {
  if (S.fc && S.fc.day === S.fcDay) return;
  const deck = LEX.map((_, i) => i).filter((i) => S.fcDay === "all" || TOPIC[LEX[i].t].d === +S.fcDay);
  S.fc = { day: S.fcDay, queue: shuffle(deck), flip: false, known: 0, total: deck.length, again: 0 };
}

function flushNotes(): void {
  if (!D.notes.length) return;
  const n = D.notes.splice(0);
  saveD();
  n.forEach((m, i) => setTimeout(() => toast(m), i * 1200));
}

function housekeeping(): void {
  regen();
  ensureDaily();
  checkStreak();
  processWeek();
  saveD();
  if (!D.onboard || LS) return;
  if (S.tab === "practice" && S.sub === "flash") ensureFlashDeck();
  if (D.league.result && !modal) {
    modal = { kind: "league", result: D.league.result };
    D.league.result = null;
    saveD();
  }
  flushNotes();
}

/** Équivalent de l’ancien render() : état dérivé, sauvegarde, rafraîchissement. */
export function commit(): void {
  housekeeping();
  emit();
}

/** Chargement initial, appelé une seule fois côté navigateur. */
export function boot(): void {
  loadD();
  housekeeping();
}
