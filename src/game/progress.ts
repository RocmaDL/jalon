// Série, cœurs, compteurs du jour et XP.

import { dayAdd, dayDiff, today } from "@/lib/dates";
import { plural } from "@/lib/text";
import { HEART_MS } from "./constants";
import { D } from "./state";

export const boostLeft = (): number => Math.max(0, D.boostUntil - Date.now());

/** La série ne compte que si la dernière leçon date d’aujourd’hui ou d’hier. */
export const liveStreak = (): number =>
  D.last === today() || D.last === dayAdd(today(), -1) ? D.streak : 0;

/** Recharge les cœurs selon le temps écoulé. */
export function regen(): void {
  if (D.unlimited || D.hearts >= 5) {
    if (D.hearts >= 5) D.heartTs = 0;
    return;
  }
  if (!D.heartTs) D.heartTs = Date.now();
  const n = Math.floor((Date.now() - D.heartTs) / HEART_MS);
  if (n > 0) {
    D.hearts = Math.min(5, D.hearts + n);
    D.heartTs = D.hearts >= 5 ? 0 : D.heartTs + n * HEART_MS;
  }
}

/** Millisecondes avant le prochain cœur (0 si aucun en attente). */
export const nextHeartIn = (): number =>
  D.heartTs ? HEART_MS - ((Date.now() - D.heartTs) % HEART_MS) : 0;

export function loseHeart(): void {
  if (D.unlimited) return;
  if (D.hearts >= 5) D.heartTs = Date.now();
  D.hearts = Math.max(0, D.hearts - 1);
}

/** Consomme des gels si des jours ont été manqués, sinon remet la série à zéro. */
export function checkStreak(): void {
  const t = today();
  if (!D.last) return;
  const gap = dayDiff(D.last, t);
  if (gap <= 1) return;
  const missed = gap - 1;
  if (D.streak > 0 && D.freezes >= missed) {
    D.freezes -= missed;
    for (let i = 1; i <= missed; i++) D.frozen.push(dayAdd(D.last, i));
    D.last = dayAdd(t, -1);
    D.notes.push(
      missed > 1
        ? `${missed} gels de série utilisés : ta série est sauvée.`
        : "Un gel de série a protégé ta série hier.",
    );
  } else if (D.streak > 0) {
    D.lostStreak = D.streak;
    D.streak = 0;
    D.notes.push(
      `Ta série de ${plural(D.lostStreak, "jour")} s'est arrêtée. Une leçon aujourd'hui en relance une.`,
    );
  }
  if (D.wager && D.streak === 0) {
    D.notes.push("Pari de série perdu : la série s'est arrêtée.");
    D.wager = null;
  }
}

/** Ajoute aujourd’hui à la série. Renvoie false si c’était déjà fait. */
export function extendStreak(): boolean {
  const t = today();
  if (D.last === t) return false;
  D.streak = (D.last === dayAdd(t, -1) ? D.streak : 0) + 1;
  D.last = t;
  if (!D.days.includes(t)) D.days.push(t);
  D.best = Math.max(D.best, D.streak);
  if (D.wager && D.streak >= D.wager.target) {
    D.jcc += 100;
    D.notes.push("Pari de série gagné : +100 JCC.");
    D.wager = null;
  }
  return true;
}

/** Réinitialise les compteurs du jour et du mois quand la date change. */
export function ensureDaily(): void {
  const t = today();
  if (D.daily.date !== t)
    D.daily = { date: t, xp: 0, lessons: 0, correct: 0, maxCombo: 0, perfect: 0, practice: 0, flash: 0, claimed: [] };
  const mk = t.slice(0, 7);
  if (D.month.key !== mk) D.month = { key: mk, quests: 0, done: false };
}

/** Ajoute de l’XP (doublé pendant un boost) et renvoie le gain réel. */
export function addXP(n: number): number {
  const v = n * (boostLeft() > 0 ? 2 : 1);
  D.xp += v;
  D.daily.xp += v;
  D.xpLog[today()] = (D.xpLog[today()] || 0) + v;
  D.league.weekXp += v;
  return v;
}
