// Succès à trois niveaux.

import { plural } from "@/lib/text";
import { TIERS } from "./constants";
import { mastered } from "./memory";
import { D } from "./state";
import type { Achievement } from "./types";

export const ACH: Achievement[] = [
  { id: "flamme", n: "Flamme", ic: "flame", c: "var(--fire)", d: (t) => `Atteindre une série de ${t} jours`, lv: [3, 7, 30], v: () => D.best },
  { id: "savant", n: "Savant", ic: "bolt", c: "var(--xp)", d: (t) => `Gagner ${t} XP`, lv: [200, 1000, 3000], v: () => D.xp },
  { id: "parfait", n: "Sans faute", ic: "star", c: "var(--gold)", d: (t) => `Finir ${plural(t, "leçon")} sans faute`, lv: [1, 10, 30], v: () => D.stats.perfect },
  { id: "lexique", n: "Lexicographe", ic: "book", c: "var(--pri)", d: (t) => `Maîtriser ${t} termes du lexique`, lv: [15, 35, 60], v: mastered },
  {
    id: "legende",
    n: "Légende",
    ic: "crown",
    c: "var(--legend)",
    d: (t) => `Rendre ${plural(t, "unité")} légendaire${t > 1 ? "s" : ""}`,
    lv: [1, 2, 3],
    v: () => Object.keys(D.legend).length,
  },
  { id: "ligue", n: "Grimpeur", ic: "shield", c: "var(--league)", d: (t) => `Atteindre la ligue ${TIERS[t]}`, lv: [2, 4, 6], v: () => D.league.tier },
  { id: "quetes", n: "Quêteur", ic: "scroll", c: "var(--jcc)", d: (t) => `Réussir ${t} quêtes`, lv: [5, 20, 60], v: () => D.stats.quests },
  {
    id: "examen",
    n: "Prêt pour le QCM",
    ic: "pen",
    c: "var(--good)",
    d: (t) => `Obtenir ${t}/20 à l'épreuve blanche`,
    lv: [12, 16, 20],
    v: () => D.stats.examBest || 0,
  },
];

/** Niveau atteint (0 à 3). */
export const achTier = (a: Achievement): number => a.lv.filter((x) => a.v() >= x).length;
