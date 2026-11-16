// Actions utilisateur : remplacent le gestionnaire de clics global du fichier d’origine.
// Chaque action modifie l’état puis appelle commit().

import { LEX } from "@/data/lexique";
import { QCM } from "@/data/qcm";
import { TOPIC, keyIndex, topicKeys, unitKeys, unitTopics } from "@/lib/content";
import { today, weekId } from "@/lib/dates";
import { confetti, snd, vib } from "@/lib/effects";
import { type Answerable, canCheck, evalEx, keysToEx, makeEx, makePairs, topicLesson } from "@/lib/exercises";
import { shuffle } from "@/lib/random";
import { ACH, achTier } from "./achievements";
import { MILESTONES, REFILL_PRICE, SHOP, type ShopId } from "./constants";
import { learn, seenKeys, weakest } from "./memory";
import { nodeState, unitNodes } from "./path";
import { addXP, boostLeft, extendStreak, liveStreak, loseHeart } from "./progress";
import { settleQuests } from "./quests";
import { D, resetD, saveD } from "./state";
import { LS, S, burst, commit, emit, modal, setLS, setModal, toast } from "./store";
import type { Exercise, ModalSpec, PairsEx, PostItem, Session, Tab } from "./types";

const top = (): void => window.scrollTo({ top: 0 });
export const EXPRESS_MS = 90e3;
let xTimer: ReturnType<typeof setInterval> | undefined;

/* ---------- Navigation et modales ---------- */

export function navigate(tab: Tab): void {
  S.tab = tab;
  S.sub = null;
  S.pop = null;
  S.resetAsk = false;
  setModal(null);
  commit();
  top();
}

export function openModal(m: ModalSpec): void {
  setModal(m);
  commit();
}

export function closeModal(): void {
  setModal(null);
  commit();
}

export function goPractice(): void {
  setModal(null);
  S.tab = "practice";
  S.sub = null;
  commit();
}

export function openSub(sub: "flash" | "lex"): void {
  S.sub = sub;
  commit();
  top();
}

export function backToPractice(): void {
  S.sub = null;
  commit();
}

/** Rafraîchit les compteurs (cœurs, boost) toutes les 15 s quand rien d’autre n’est ouvert. */
export function refreshTimers(): void {
  if (!LS && !modal && D.onboard && document.visibilityState === "visible" && (boostLeft() > 0 || (!D.unlimited && D.hearts < 5)))
    commit();
}

/* ---------- Parcours ---------- */

function openChest(id: string): void {
  if (D.chests[id]) return;
  const jcc = 15 + Math.floor(Math.random() * 21);
  const freeze = Math.random() < 0.3 && D.freezes < 2;
  D.chests[id] = true;
  D.jcc += jcc;
  if (freeze) D.freezes++;
  saveD();
  snd("chest");
  confetti();
  openModal({ kind: "chest", jcc, freeze });
}

export function clickNode(id: string): void {
  if (id.startsWith("c:")) {
    const N = unitNodes(+id.slice(2));
    const i = N.findIndex((n) => n.id === id);
    if (!nodeState(N, i).locked && !D.chests[id]) {
      S.pop = null;
      openChest(id);
      return;
    }
  }
  S.pop = S.pop === id ? null : id;
  snd("tap");
  commit();
}

/* ---------- Boutique ---------- */

function applyPurchase(id: ShopId): void {
  const it = SHOP.find((s) => s.id === id);
  if (!it || D.jcc < it.p) return;
  if (id === "freeze") {
    if (D.freezes >= 2) return;
    D.freezes++;
  } else if (id === "refill") {
    if (D.unlimited || D.hearts >= 5) return;
    D.hearts = 5;
    D.heartTs = 0;
  } else if (id === "boost") {
    if (boostLeft() > 0) return;
    D.boostUntil = Date.now() + 15 * 60e3;
  } else if (id === "wager") {
    if (D.wager) return;
    D.wager = { target: liveStreak() + 7, from: today() };
  }
  D.jcc -= it.p;
  saveD();
  snd("chest");
  toast(`${it.n} : c'est fait.`);
}

export function buy(id: ShopId): void {
  applyPurchase(id);
  setModal(null);
  commit();
}

/* ---------- Démarrage des séances ---------- */

type SessionInit = Pick<Session, "kind" | "mode"> & Partial<Session> & { items: Exercise[] };

function startLS(o: SessionInit): void {
  if (o.mode === "hearts" && !D.unlimited && D.hearts <= 0) {
    openModal({ kind: "hearts", blocked: true });
    return;
  }
  S.pop = null;
  const { items, ...rest } = o;
  setLS({
    queue: items,
    total: items.length,
    solved: 0,
    answered: 0,
    wrong: 0,
    combo: 0,
    maxCombo: 0,
    phase: "ans",
    res: null,
    t0: Date.now(),
    lives: 3,
    state: "play",
    confirm: false,
    errors: [],
    requeue: true,
    matches: 0,
    end: 0,
    post: [],
    pi: 0,
    ...rest,
  });
  commit();
  top();
}

export function startTopic(t: string): void {
  const n = Math.min(1, D.lessons[t] || 0);
  startLS({ kind: "lesson", topic: t, idx: n, mode: "hearts", items: topicLesson(t, n), title: TOPIC[t].n });
}

export function startReviewTopic(t: string): void {
  startLS({ kind: "review", topic: t, mode: "free", items: keysToEx(weakest(topicKeys(t), 10)), title: "Révision · " + TOPIC[t].n });
}

export function startUnitReview(d: number): void {
  startLS({ kind: "unitreview", unit: d, mode: "free", items: keysToEx(weakest(unitKeys(d), 12)), title: "Révision de la journée " + d });
}

export function startCheckpoint(d: number): void {
  startLS({
    kind: "checkpoint",
    unit: d,
    mode: "lives",
    requeue: false,
    items: keysToEx(shuffle(unitKeys(d)).slice(0, 15)),
    title: "Épreuve de la journée " + d,
  });
}

export function startWeak(): void {
  startLS({ kind: "practice", mode: "free", items: keysToEx(weakest(seenKeys(), 12)), title: "Points faibles" });
}

export function startMistakes(): void {
  startLS({ kind: "practice", mode: "free", items: keysToEx(shuffle(D.missed).slice(0, 10), { pairs: false }), title: "Mes erreurs" });
}

export function startExam(): void {
  startLS({
    kind: "exam",
    mode: "none",
    requeue: false,
    exam: true,
    items: shuffle(QCM.map((_, i) => "q:" + i))
      .slice(0, 20)
      .map((k) => makeEx(k)),
    title: "Épreuve blanche",
  });
}

export function startExpress(): void {
  const pick = (): PairsEx => {
    const pool = seenKeys().filter((k) => k.startsWith("x:")).map(keyIndex);
    const src = pool.length >= 8 ? pool : LEX.map((_, i) => i);
    return makePairs(shuffle(src).slice(0, 4));
  };
  startLS({ kind: "express", mode: "free", express: true, items: [pick()], newRound: pick, end: Date.now() + EXPRESS_MS });
  clearInterval(xTimer);
  xTimer = setInterval(() => {
    const ls = LS;
    if (!ls || !ls.express) {
      clearInterval(xTimer);
      return;
    }
    if (ls.confirm) return;
    if (ls.end - Date.now() <= 0 && ls.state === "play") {
      clearInterval(xTimer);
      finish();
    }
  }, 200);
}

/** Temps restant aux paires express, figé pendant la confirmation de sortie. */
export const expressLeft = (ls: Session): number => Math.max(0, ls.end - (ls.pauseAt || Date.now()));

/* ---------- Réponses ---------- */

const current = (): Exercise | undefined => LS?.queue[0];
const answering = (): boolean => !!LS && LS.phase === "ans" && !LS.confirm;

export function selectOption(i: number): void {
  const ex = current();
  if (!answering() || !ex || (ex.type !== "choice" && ex.type !== "tf")) return;
  ex.sel = i;
  snd("tap");
  commit();
}

/** Déplacement au clavier, sans son. */
export function setSelection(i: number): void {
  const ex = current();
  if (!answering() || !ex || (ex.type !== "choice" && ex.type !== "tf")) return;
  ex.sel = i;
  commit();
}

export function pickTile(i: number): void {
  const ex = current();
  if (!answering() || ex?.type !== "blank" || i >= ex.tiles.length) return;
  ex.slot = i;
  snd("tap");
  commit();
}

export function clearSlot(): void {
  const ex = current();
  if (!answering() || ex?.type !== "blank") return;
  ex.slot = null;
  commit();
}

export function pushOrder(j: number): void {
  const ex = current();
  if (!answering() || ex?.type !== "order" || ex.seq.includes(j)) return;
  ex.seq.push(j);
  snd("tap");
  commit();
}

export function removeOrder(p: number): void {
  const ex = current();
  if (!answering() || ex?.type !== "order") return;
  ex.seq.splice(p, 1);
  commit();
}

export function popOrder(): void {
  const ex = current();
  if (!answering() || ex?.type !== "order") return;
  ex.seq.pop();
  commit();
}

/** Saisie libre : on redessine sans sauvegarder à chaque frappe. */
export function setTyped(v: string): void {
  const ex = current();
  if (ex?.type !== "type") return;
  ex.text = v;
  emit();
}

export function askHint(): void {
  const ex = current();
  if (ex?.type !== "type") return;
  ex.hint = Math.min(ex.hint + 1, 4);
  commit();
}

const errorPrompt = (ex: Answerable): string => (ex.type === "blank" ? ex.a + " ___ " + ex.b : ex.prompt);

function givenAnswer(ex: Answerable): string {
  switch (ex.type) {
    case "choice":
    case "tf":
      return ex.sel === null ? "" : ex.opts[ex.sel];
    case "blank":
      return ex.slot === null ? "" : ex.tiles[ex.slot];
    case "type":
      return ex.text;
    case "order":
      return ex.seq.map((j) => ex.items[j]).join(" → ");
  }
}

export function check(skip = false): void {
  const ls = LS;
  if (!ls || ls.state !== "play" || ls.confirm || ls.phase !== "ans") return;
  const ex = ls.queue[0];
  if (!ex || ex.type === "pairs") return;
  if (!skip && !canCheck(ex)) return;
  resolve(ls, ex, !skip && evalEx(ex), skip);
}

function resolve(ls: Session, ex: Answerable, ok: boolean, skip: boolean): void {
  ls.phase = "chk";
  ls.res = ok;
  ls.answered++;
  if (ex.k) learn(ex.k, ok);
  if (ok) {
    ls.solved++;
    ls.combo++;
    ls.maxCombo = Math.max(ls.maxCombo, ls.combo);
    D.daily.correct++;
    D.daily.maxCombo = Math.max(D.daily.maxCombo, ls.combo);
    snd(ls.exam ? "tap" : "ok");
  } else {
    ls.wrong++;
    ls.combo = 0;
    ls.errors.push({
      prompt: errorPrompt(ex),
      given: skip ? "(passé)" : givenAnswer(ex),
      ok: ex.type === "order" ? ex.items.join(" → ") : ex.ok,
      e: ex.e || (ex.k && ex.k.startsWith("x:") ? LEX[keyIndex(ex.k)].x : ""),
    });
    if (ls.exam) snd("tap");
    else {
      snd("bad");
      vib(60);
    }
    if (ls.mode === "hearts") loseHeart();
    if (ls.mode === "lives") ls.lives--;
    const alive = ls.mode === "hearts" ? D.unlimited || D.hearts > 0 : ls.mode === "lives" ? ls.lives > 0 : true;
    // L’exercice raté revient en fin de file.
    if (ls.requeue && alive && ex.k) {
      const r = makeEx(ex.k, ex.mode === "new" ? "def" : ex.mode);
      r.retry = true;
      ls.queue.push(r);
      ls.total = Math.max(ls.total, ls.solved + ls.queue.length - 1);
    }
  }
  saveD();
  // Épreuve blanche : pas de correction immédiate.
  if (ls.exam) {
    cont();
    return;
  }
  commit();
}

export function cont(): void {
  const ls = LS;
  if (!ls || ls.phase !== "chk") return;
  const was = ls.res;
  ls.queue.shift();
  if (ls.mode === "hearts" && !D.unlimited && D.hearts <= 0 && !was) {
    ls.state = "nohearts";
    ls.phase = "ans";
    commit();
    return;
  }
  if (ls.mode === "lives" && ls.lives <= 0) {
    ls.state = "fail";
    snd("bad");
    commit();
    return;
  }
  if (!ls.queue.length) {
    finish();
    return;
  }
  ls.phase = "ans";
  ls.res = null;
  if (was && [5, 10, 15, 20].includes(ls.combo) && !ls.exam) {
    burst(`${ls.combo} bonnes réponses d'affilée !`);
    snd("combo");
  }
  commit();
  top();
}

export function pairPick(side: "l" | "r", i: number): void {
  const ls = LS;
  if (!ls || ls.state !== "play" || ls.confirm || ls.phase !== "ans") return;
  const ex = ls.queue[0];
  if (!ex || ex.type !== "pairs" || ex.matched.includes(i)) return;
  ex.bad = null;
  if (side === "l") ex.selL = i;
  else ex.selR = i;
  if (ex.selL !== null && ex.selR !== null) {
    if (ex.selL === ex.selR) {
      ex.matched.push(ex.selL);
      snd("tap");
      if (ls.express) {
        ls.matches++;
        learn("x:" + ex.selL, !ex.miss.includes(ex.selL));
      }
    } else {
      ex.errs++;
      ex.bad = [ex.selL, ex.selR];
      ex.miss.push(ex.selL, ex.selR);
      snd("bad");
      vib(40);
      if (ls.express) ls.end -= 3000;
    }
    ex.selL = ex.selR = null;
  }
  if (ex.matched.length === ex.ids.length) {
    if (ls.express && ls.newRound) {
      ls.queue = [ls.newRound()];
      snd("ok");
      commit();
      return;
    }
    ex.ids.forEach((id) => learn("x:" + id, !ex.miss.includes(id)));
    ls.phase = "chk";
    ls.res = true;
    ls.solved++;
    ls.answered++;
    ls.combo++;
    ls.maxCombo = Math.max(ls.maxCombo, ls.combo);
    D.daily.correct++;
    D.daily.maxCombo = Math.max(D.daily.maxCombo, ls.combo);
    snd("ok");
    saveD();
  }
  commit();
}

/* ---------- Fin de séance ---------- */

function finish(): void {
  clearInterval(xTimer);
  const ls = LS;
  if (!ls) return;
  const k = ls.kind;
  const perfect = ls.wrong === 0;
  const post: PostItem[] = [];
  const extra: PostItem[] = [];
  const beforeGoal = D.daily.xp;
  const beforeAch = Object.fromEntries(ACH.map((a) => [a.id, achTier(a)]));
  let base = 0;
  let bonus = 0;
  const comboB = Math.min(5, Math.floor(ls.maxCombo / 3));

  if (k === "lesson") {
    const topic = ls.topic as string;
    base = 15;
    bonus = comboB + (perfect ? 5 : 0);
    D.lessons[topic] = Math.max(D.lessons[topic] || 0, (ls.idx ?? 0) + 1);
    D.stats.lessons++;
    D.daily.lessons++;
    if (perfect) {
      D.stats.perfect++;
      D.daily.perfect++;
    }
    const d = TOPIC[topic].d;
    if (unitTopics(d).every((t) => (D.lessons[t] || 0) >= 2) && !D[`unitDone${d}`]) {
      D[`unitDone${d}`] = true;
      D.boostUntil = Date.now() + 15 * 60e3;
      extra.push({ type: "unit", d });
    }
  } else if (k === "checkpoint") {
    const unit = ls.unit as number;
    base = 40;
    bonus = perfect ? 5 : 0;
    unitTopics(unit).forEach((topic) => {
      D.lessons[topic] = Math.max(D.lessons[topic] || 0, 2);
    });
    D.chests["c:" + unit] = true;
    D.rev["r:" + unit] = true;
    D[`unitDone${unit}`] = true;
    const first = !D.legend["e:" + unit];
    D.legend["e:" + unit] = true;
    if (first) {
      D.jcc += 30;
      extra.push({ type: "legend", d: unit });
    }
  } else if (k === "exam") {
    base = 10;
    const note = Math.round((ls.solved / ls.total) * 20);
    ls.note = note;
    D.stats.examBest = Math.max(D.stats.examBest ?? 0, note);
    D.daily.practice++;
    D.stats.practice++;
  } else if (k === "express") {
    base = 5 + Math.floor(ls.matches / 2);
    ls.newBest = ls.matches > D.stats.expressBest;
    D.stats.expressBest = Math.max(D.stats.expressBest, ls.matches);
    D.daily.practice++;
    D.stats.practice++;
  } else {
    base = 10;
    bonus = comboB;
    D.daily.practice++;
    D.stats.practice++;
    if (k === "unitreview") D.rev["r:" + ls.unit] = true;
  }

  // Les séances d’entraînement rendent un cœur.
  let heart = false;
  if (k !== "lesson" && k !== "checkpoint" && !D.unlimited && D.hearts < 5) {
    D.hearts++;
    heart = true;
    if (D.hearts >= 5) D.heartTs = 0;
  }
  ls.xpGain = addXP(base + bonus);
  ls.heart = heart;
  ls.perfect = perfect && k !== "express";
  ls.time = Date.now() - ls.t0;

  const streakUp = extendStreak();
  post.push({ type: "summary" });
  if (streakUp) post.push({ type: "streak" });
  const st = D.streak;
  if (streakUp && MILESTONES.includes(st) && !D.milestones.includes(st)) {
    D.milestones.push(st);
    D.jcc += 20;
    if (D.freezes < 2) D.freezes++;
    post.push({ type: "milestone", n: st });
  }
  post.push(...extra);
  if (beforeGoal < D.goal && D.daily.xp >= D.goal) post.push({ type: "goal" });
  const got = settleQuests();
  if (got.length) post.push({ type: "quests", got });
  const newA = ACH.filter((a) => achTier(a) > beforeAch[a.id]);
  if (newA.length) post.push({ type: "ach", list: newA });

  ls.post = post;
  ls.pi = 0;
  ls.state = "post";
  saveD();
  snd("done");
  if (k !== "exam" || (ls.note ?? 0) >= 10) confetti();
  commit();
  top();
}

export function postNext(): void {
  const ls = LS;
  if (!ls) return;
  if (ls.pi < ls.post.length - 1) {
    ls.pi++;
    commit();
    top();
  } else leave();
}

export function leave(): void {
  clearInterval(xTimer);
  const ls = LS;
  const back: Tab = ls && (ls.kind === "practice" || ls.kind === "exam" || ls.kind === "express") ? "practice" : "learn";
  setLS(null);
  S.tab = back;
  commit();
  top();
}

export function setConfirm(on: boolean): void {
  const ls = LS;
  if (!ls) return;
  if (ls.express) {
    if (on) ls.pauseAt = Date.now();
    else if (ls.pauseAt) {
      ls.end += Date.now() - ls.pauseAt;
      ls.pauseAt = 0;
    }
  }
  ls.confirm = on;
  commit();
}

export function refillAndResume(): void {
  const ls = LS;
  if (!ls || D.jcc < REFILL_PRICE) return;
  D.jcc -= REFILL_PRICE;
  D.hearts = 5;
  D.heartTs = 0;
  ls.state = "play";
  ls.phase = "ans";
  saveD();
  if (!ls.queue.length) {
    finish();
    return;
  }
  commit();
}

export function nextLesson(): void {
  const topic = LS?.topic;
  setLS(null);
  if (topic) startTopic(topic);
  else commit();
}

export function retryCheckpoint(): void {
  const unit = LS?.unit;
  setLS(null);
  if (unit) startCheckpoint(unit);
  else commit();
}

/* ---------- Flashcards et lexique ---------- */

export function setFcDay(v: string): void {
  S.fcDay = v;
  S.fc = null;
  commit();
}

export function setLexDay(v: string): void {
  S.lexDay = v;
  commit();
}

export function fcFlip(): void {
  if (!S.fc) return;
  S.fc.flip = !S.fc.flip;
  commit();
}

export function fcToggleDir(): void {
  S.fcDir = S.fcDir === "td" ? "dt" : "td";
  if (S.fc) S.fc.flip = false;
  commit();
}

export function fcReset(): void {
  S.fc = null;
  commit();
}

export function fcAnswer(known: boolean): void {
  const f = S.fc;
  if (!f || !f.queue.length) return;
  const i = f.queue[0];
  learn("x:" + i, known);
  D.daily.flash++;
  if (known) {
    f.queue.shift();
    f.known++;
  } else {
    f.queue.push(f.queue.shift() as number);
    f.again++;
  }
  f.flip = false;
  const got = settleQuests();
  saveD();
  commit();
  got.forEach((q) => toast(`Quête réussie : ${q.t} · +${q.rw} JCC`));
}

export function setSearch(v: string): void {
  S.search = v;
  commit();
}

/* ---------- Profil et accueil ---------- */

export function setGoal(g: number): void {
  D.goal = g;
  saveD();
  commit();
}

export function toggleSound(): void {
  D.sound = !D.sound;
  saveD();
  commit();
}

export function toggleUnlimited(): void {
  D.unlimited = !D.unlimited;
  if (!D.unlimited) D.hearts = Math.min(D.hearts, 5);
  saveD();
  commit();
}

export function askReset(on: boolean): void {
  S.resetAsk = on;
  commit();
}

export function confirmReset(): void {
  resetD();
  S.resetAsk = false;
  S.tab = "learn";
  saveD();
  commit();
}

/** Le pseudo est enregistré à la frappe, sans redessiner. */
export function setName(v: string): void {
  D.name = v.trim().slice(0, 20);
  saveD();
}

export function finishOnboarding(name: string, goal: number): void {
  D.name = name.trim().slice(0, 20);
  D.goal = goal;
  D.onboard = true;
  D.league.week = weekId();
  saveD();
  commit();
  top();
}
