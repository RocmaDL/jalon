// État de jeu persistant. `D` est un objet mutable exporté en liaison vivante (live binding) :
// les modules le lisent directement, et seul ce fichier le réassigne (chargement, remise à zéro).

import type { GameData } from "./types";

const STORE = "jalon-v1";

export const fresh = (): GameData => ({
  onboard: false,
  name: "",
  goal: 20,
  xp: 0,
  jcc: 100,
  hearts: 5,
  heartTs: 0,
  unlimited: false,
  sound: true,
  streak: 0,
  best: 0,
  last: "",
  days: [],
  frozen: [],
  freezes: 1,
  milestones: [],
  lostStreak: 0,
  lessons: {},
  chests: {},
  rev: {},
  legend: {},
  mem: {},
  missed: [],
  daily: { date: "", xp: 0, lessons: 0, correct: 0, maxCombo: 0, perfect: 0, practice: 0, flash: 0, claimed: [] },
  xpLog: {},
  boostUntil: 0,
  wager: null,
  league: { tier: 0, week: "", weekXp: 0, promos: 0, result: null },
  stats: { perfect: 0, quests: 0, lessons: 0, practice: 0, expressBest: 0, examBest: null },
  month: { key: "", quests: 0, done: false },
  ach: {},
  notes: [],
});

export let D: GameData = fresh();

/** Relit la sauvegarde ; les sous-objets sont fusionnés pour tolérer les champs ajoutés. */
export function loadD(): void {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (s && typeof s === "object") {
      const merged = Object.assign(fresh(), s) as GameData;
      merged.daily = Object.assign(fresh().daily, s.daily || {});
      merged.league = Object.assign(fresh().league, s.league || {});
      merged.stats = Object.assign(fresh().stats, s.stats || {});
      merged.month = Object.assign(fresh().month, s.month || {});
      D = merged;
    }
  } catch {
    /* sauvegarde illisible : on garde l’état neuf */
  }
}

export function saveD(): void {
  try {
    localStorage.setItem(STORE, JSON.stringify(D));
  } catch {
    /* stockage indisponible (navigation privée) */
  }
}

export function resetD(): void {
  D = fresh();
}
