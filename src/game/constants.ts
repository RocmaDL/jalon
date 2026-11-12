// Constantes de jeu : cœurs, objectifs, ligues, boutique, quêtes.

import type { IconName, QuestKey, Tab } from "./types";

/** Un cœur revient toutes les 30 minutes. */
export const HEART_MS = 30 * 60e3;

export const GOALS: [number, string][] = [
  [10, "Tranquille"],
  [20, "Régulier"],
  [30, "Sérieux"],
  [50, "Intense"],
];

export const MILESTONES = [3, 7, 14, 30, 50, 100];

export const TIERS = ["Post-it", "Brief", "Cadrage", "Kanban", "Gantt", "Sprint", "Jalon", "COPIL", "PMO", "CODIR"];
export const TIERC = [
  "#c9a227",
  "#8a94a6",
  "#e08a2e",
  "#2f9fd3",
  "#2e8f6a",
  "#d4508a",
  "#5b6bd8",
  "#9152d6",
  "#d23b3b",
  "#1d2a4a",
];

/** Noms des adversaires simulés de la ligue. */
export const BOTN = [
  "Inès B.", "Hugo M.", "Léa R.", "Yanis K.", "Camille D.", "Nathan P.", "Chloé V.", "Lucas F.", "Sarah T.", "Mehdi A.",
  "Manon L.", "Théo G.", "Emma C.", "Rayan S.", "Jade N.", "Louis H.", "Zoé W.", "Adam E.", "Lina O.", "Noah J.",
  "Clara Z.", "Sacha Y.", "Maël Q.", "Anaïs X.", "Enzo U.", "Rose I.", "Gabriel V.", "Nour B.",
];
export const AVC = ["#2f5bd3", "#0e8b7b", "#c03f78", "#e08a2e", "#7c4ddb", "#1e8a4b", "#d23b3b", "#2f9fd3"];

export type ShopId = "freeze" | "refill" | "boost" | "wager";
export interface ShopItem {
  id: ShopId;
  n: string;
  d: string;
  p: number;
  ic: IconName;
  c: string;
}

export const SHOP: ShopItem[] = [
  { id: "freeze", n: "Gel de série", d: "Protège ta série si tu rates un jour. Tu peux en garder deux.", p: 100, ic: "snow", c: "var(--pri)" },
  { id: "refill", n: "Recharge de cœurs", d: "Remet tes cœurs à 5.", p: 150, ic: "heart", c: "var(--bad)" },
  { id: "boost", n: "Boost d'XP", d: "Double l'XP gagné pendant 15 minutes.", p: 80, ic: "bolt", c: "var(--xp)" },
  { id: "wager", n: "Pari de série", d: "Mise 50 JCC : garde ta série 7 jours de plus et récupère 100 JCC.", p: 50, ic: "dice", c: "var(--league)" },
];

export const REFILL_PRICE = 150;

export interface QuestTemplate {
  k: QuestKey;
  t: (n: number) => string;
  v: number[];
}

export const QPOOL: QuestTemplate[] = [
  { k: "lessons", t: (n) => `Termine ${n} leçons`, v: [2, 3] },
  { k: "correct", t: (n) => `Réponds juste à ${n} exercices`, v: [15, 25] },
  { k: "maxCombo", t: (n) => `Enchaîne ${n} bonnes réponses d'affilée`, v: [5, 8] },
  { k: "perfect", t: () => "Termine une leçon sans faute", v: [1] },
  { k: "practice", t: () => "Fais une séance d'entraînement", v: [1] },
  { k: "flash", t: (n) => `Révise ${n} flashcards`, v: [10, 15] },
];

/** Difficulté de base par type d’item, pour ordonner une séance. */
export const DIFF: Record<string, number> = { tf: 1, new: 1, q: 2, def: 2, term: 2, bl: 2, pairs: 2.5, or: 3, type: 3 };

export const NAVS: [Tab, string, IconName][] = [
  ["learn", "Apprendre", "home"],
  ["practice", "S'entraîner", "target"],
  ["league", "Ligue", "shield"],
  ["quests", "Quêtes", "scroll"],
  ["profile", "Profil", "user"],
  ["shop", "Boutique", "shop"],
];

export const DAY_FILTERS: [string, string][] = [
  ["all", "Tout"],
  ["1", "J1"],
  ["2", "J2"],
  ["3", "J3"],
];
