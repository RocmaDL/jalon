// Types de l’état de jeu (persisté), des exercices et des séances.

/** Trace mémoire d’un item (modèle à demi-vie). */
export interface MemTrace {
  /** Demi-vie en heures. */
  h: number;
  /** Dernière révision (ms). */
  t: number;
  /** Nombre de tentatives. */
  n: number;
  /** Nombre de réussites. */
  c: number;
}

export interface Daily {
  date: string;
  xp: number;
  lessons: number;
  correct: number;
  maxCombo: number;
  perfect: number;
  practice: number;
  flash: number;
  claimed: number[];
}

export interface LeagueResult {
  rank: number;
  old: number;
  nt: number;
  rw: number;
}

/** Données sauvegardées dans localStorage (même schéma que la version mono-fichier). */
export interface GameData {
  onboard: boolean;
  playerId: string;
  name: string;
  goal: number;
  xp: number;
  jcc: number;
  hearts: number;
  heartTs: number;
  unlimited: boolean;
  sound: boolean;
  streak: number;
  best: number;
  last: string;
  days: string[];
  frozen: string[];
  freezes: number;
  milestones: number[];
  lostStreak: number;
  lessons: Record<string, number>;
  chests: Record<string, boolean>;
  rev: Record<string, boolean>;
  legend: Record<string, boolean>;
  mem: Record<string, MemTrace>;
  missed: string[];
  daily: Daily;
  xpLog: Record<string, number>;
  boostUntil: number;
  wager: { target: number; from: string } | null;
  league: { tier: number; week: string; weekXp: number; promos: number; result: LeagueResult | null };
  stats: {
    perfect: number;
    quests: number;
    lessons: number;
    practice: number;
    expressBest: number;
    examBest: number | null;
  };
  month: { key: string; quests: number; done: boolean };
  ach: Record<string, number>;
  notes: string[];
  /** Journée entièrement terminée (clé historique « unitDone1 », « unitDone2 »…). */
  [unitDone: `unitDone${number}`]: boolean | undefined;
}

/* ---------- Exercices ---------- */

export type ExMode = "new" | "def" | "term" | "type";

interface ExBase {
  /** Clé de l’item source (absente pour les paires). */
  k?: string;
  mode?: ExMode;
  t: string;
  tag: string;
  retry?: boolean;
  isNew?: boolean;
  e?: string;
}

export interface ChoiceEx extends ExBase {
  type: "choice" | "tf";
  prompt: string;
  quote?: string;
  opts: string[];
  ok: string;
  sel: number | null;
}

export interface BlankEx extends ExBase {
  type: "blank";
  a: string;
  b: string;
  tiles: string[];
  ok: string;
  slot: number | null;
}

export interface OrderEx extends ExBase {
  type: "order";
  prompt: string;
  items: string[];
  bank: number[];
  seq: number[];
}

export interface TypeEx extends ExBase {
  type: "type";
  prompt: string;
  quote: string;
  alts: string[];
  ok: string;
  text: string;
  hint: number;
  typo?: boolean;
}

export interface PairsEx extends ExBase {
  type: "pairs";
  ids: number[];
  left: number[];
  right: number[];
  selL: number | null;
  selR: number | null;
  matched: number[];
  errs: number;
  miss: number[];
  bad: [number, number] | null;
}

export type Exercise = ChoiceEx | BlankEx | OrderEx | TypeEx | PairsEx;

/* ---------- Séances ---------- */

export type SessionKind =
  | "lesson"
  | "review"
  | "unitreview"
  | "checkpoint"
  | "practice"
  | "exam"
  | "express";

export interface ErrorEntry {
  prompt: string;
  given: string;
  ok: string;
  e: string;
}

export interface Achievement {
  id: string;
  n: string;
  ic: IconName;
  c: string;
  d: (t: number) => string;
  lv: number[];
  v: () => number;
}

export type QuestKey = "xp" | "lessons" | "correct" | "maxCombo" | "perfect" | "practice" | "flash";

export interface Quest {
  k: QuestKey;
  t: string;
  n: number;
  rw: number;
  i: number;
  cur: number;
  done: boolean;
  claimed: boolean;
}

export type PostItem =
  | { type: "summary" }
  | { type: "streak" }
  | { type: "milestone"; n: number }
  | { type: "goal" }
  | { type: "quests"; got: Quest[] }
  | { type: "ach"; list: Achievement[] }
  | { type: "unit"; d: number }
  | { type: "legend"; d: number };

export interface Session {
  kind: SessionKind;
  /** hearts : cœurs globaux · lives : 3 vies · free : sans pénalité · none : épreuve blanche. */
  mode: "hearts" | "lives" | "free" | "none";
  title?: string;
  topic?: string;
  idx?: number;
  unit?: number;
  queue: Exercise[];
  total: number;
  solved: number;
  answered: number;
  wrong: number;
  combo: number;
  maxCombo: number;
  phase: "ans" | "chk";
  res: boolean | null;
  t0: number;
  lives: number;
  state: "play" | "post" | "fail" | "nohearts";
  confirm: boolean;
  errors: ErrorEntry[];
  requeue: boolean;
  exam?: boolean;
  /* Paires express */
  express?: boolean;
  newRound?: () => PairsEx;
  matches: number;
  end: number;
  pauseAt?: number;
  /* Fin de séance */
  post: PostItem[];
  pi: number;
  xpGain?: number;
  heart?: boolean;
  perfect?: boolean;
  time?: number;
  note?: number;
  newBest?: boolean;
}

/* ---------- Interface ---------- */

/** Humeur de la mascotte. */
export type Mood = "happy" | "proud" | "sad" | "wow" | "sleepy";

export type Tab = "learn" | "practice" | "league" | "quests" | "profile" | "shop";

export type ModalSpec =
  | { kind: "guide"; d: number }
  | { kind: "streak" }
  | { kind: "hearts"; blocked: boolean }
  | { kind: "chest"; jcc: number; freeze: boolean }
  | { kind: "league"; result: LeagueResult };

export interface Flashcards {
  day: string;
  queue: number[];
  flip: boolean;
  known: number;
  total: number;
  again: number;
}

export interface UiState {
  tab: Tab;
  sub: "flash" | "lex" | null;
  pop: string | null;
  fc: Flashcards | null;
  fcDay: string;
  fcDir: "td" | "dt";
  search: string;
  lexDay: string;
  resetAsk: boolean;
}

export type IconName =
  | "flame"
  | "heart"
  | "bolt"
  | "coin"
  | "star"
  | "lock"
  | "check"
  | "cross"
  | "chest"
  | "chestOpen"
  | "dumbbell"
  | "trophy"
  | "book"
  | "snow"
  | "home"
  | "target"
  | "shield"
  | "scroll"
  | "user"
  | "shop"
  | "crack"
  | "crown"
  | "flag"
  | "cards"
  | "list"
  | "clock"
  | "pen"
  | "dice"
  | "volume";
