// Écrans de fin de séance : bilan, série, palier, objectif, quêtes, succès, unité terminée.

import type { CSSProperties } from "react";
import { UNITS } from "@/data/units";
import { achTier } from "@/game/achievements";
import { nextLesson, postNext } from "@/game/actions";
import { boostLeft } from "@/game/progress";
import { D } from "@/game/state";
import type { PostItem, Session } from "@/game/types";
import { fmtMin, plural } from "@/lib/text";
import { CountUp } from "../ui/CountUp";
import { Coin, Icon } from "../ui/Icon";
import { Mascot } from "../ui/Mascot";
import { WeekRow } from "../ui/WeekRow";

const tint = (c: string): CSSProperties => ({ "--c": c }) as CSSProperties;

function Summary({ ls }: { ls: Session }) {
  const k = ls.kind;
  const note = ls.note ?? 0;
  const acc = ls.answered ? Math.round((100 * ls.solved) / ls.answered) : 100;
  const title =
    k === "exam"
      ? `${note} / 20`
      : k === "express"
        ? ls.newBest
          ? "Nouveau record !"
          : "Temps écoulé !"
        : k === "checkpoint"
          ? "Épreuve réussie !"
          : ls.perfect
            ? "Leçon parfaite !"
            : k === "lesson"
              ? "Leçon terminée !"
              : "Séance terminée !";
  const sub =
    k === "exam"
      ? note >= 16
        ? "Tu es prêt pour le QCM."
        : note >= 10
          ? "La moyenne est là. Reprends les erreurs ci-dessous."
          : "Reprends les erreurs ci-dessous, puis retente."
      : k === "express"
        ? `${plural(ls.matches, "paire")} trouvée${ls.matches > 1 ? "s" : ""} en 90 secondes.`
        : ls.perfect
          ? "Aucune erreur. Ta mémoire te dit merci."
          : "Les erreurs reviendront dans ta prochaine révision.";
  const mood = k === "exam" && note < 10 ? "sad" : ls.perfect ? "proud" : "happy";
  return (
    <>
      <Mascot mood={mood} size={120} />
      <h1>{title}</h1>
      <p>{sub}</p>
      <div className="tiles">
        <div className="tile3" style={tint("var(--xp)")}>
          <span>XP gagnés</span>
          <b>
            <Icon name="bolt" />
            <CountUp to={ls.xpGain ?? 0} />
          </b>
        </div>
        {k === "express" ? (
          <>
            <div className="tile3" style={tint("var(--jcc)")}>
              <span>Paires</span>
              <b className="num">{ls.matches}</b>
            </div>
            <div className="tile3" style={tint("var(--pri)")}>
              <span>Record</span>
              <b className="num">{D.stats.expressBest}</b>
            </div>
          </>
        ) : (
          <>
            <div className="tile3" style={tint("var(--good)")}>
              <span>{k === "exam" ? "Bonnes réponses" : "Précision"}</span>
              <b className="num">{k === "exam" ? ls.solved + "/" + ls.total : acc + " %"}</b>
            </div>
            <div className="tile3" style={tint("var(--pri)")}>
              <span>Temps</span>
              <b className="num">{fmtMin(ls.time ?? 0)}</b>
            </div>
          </>
        )}
      </div>
      {ls.heart && <p style={{ color: "var(--bad)", fontWeight: 700 }}>+1 cœur regagné</p>}
      {boostLeft() > 0 && <p style={{ color: "var(--xp)", fontWeight: 700 }}>Boost actif : XP doublé</p>}
      {k === "exam" && ls.errors.length > 0 && (
        <div className="xlist">
          <h3 style={{ textAlign: "left" }}>À revoir</h3>
          {ls.errors.map((e, i) => (
            <div key={i} className="card">
              <b>{e.prompt}</b>
              <div className="ko-t">Ta réponse : {e.given}</div>
              <div className="ok-t">Bonne réponse : {e.ok}</div>
              {e.e && (
                <div className="muted" style={{ fontSize: 15 }}>
                  {e.e}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PostBody({ p, ls }: { p: PostItem; ls: Session }) {
  switch (p.type) {
    case "summary":
      return <Summary ls={ls} />;
    case "streak": {
      const st = D.streak;
      return (
        <>
          <Icon name="flame" color="var(--fire)" className="bigflame" />
          <h1 style={{ color: "var(--fire)" }}>
            <span className="num">{st}</span> {st > 1 ? "jours" : "jour"} de série
          </h1>
          <p>
            {st === 1
              ? "C'est le début d'une série. Reviens demain pour la prolonger."
              : "Ta série continue. Reviens demain pour ne pas la perdre."}
          </p>
          <WeekRow />
        </>
      );
    }
    case "milestone":
      return (
        <>
          <Mascot mood="proud" size={120} />
          <h1>Série de {p.n} jours !</h1>
          <p>Un cap. Tu gagnes 20 JCC{D.freezes <= 2 ? " et un gel de série" : ""}.</p>
        </>
      );
    case "goal":
      return (
        <>
          <Mascot mood="wow" size={120} />
          <h1>Objectif du jour atteint !</h1>
          <p>{D.goal} XP aujourd&apos;hui. Tout ce que tu fais en plus compte pour la ligue.</p>
        </>
      );
    case "quests":
      return (
        <>
          <Icon name="chestOpen" color="var(--xp)" className="bigflame" />
          <h1>{p.got.length > 1 ? "Quêtes réussies !" : "Quête réussie !"}</h1>
          <div className="xlist">
            {p.got.map((q) => (
              <div key={q.i} className="card" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <b>{q.t}</b>
                <span className="price" style={{ color: "var(--jcc)", font: "600 17px var(--f-d)" }}>
                  <Coin />+{q.rw}
                </span>
              </div>
            ))}
          </div>
        </>
      );
    case "ach":
      return (
        <>
          <Mascot mood="wow" size={110} />
          <h1>Succès débloqué{p.list.length > 1 ? "s" : ""} !</h1>
          <div className="xlist">
            {p.list.map((a) => (
              <div key={a.id} className="card" style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <span style={{ color: a.c }}>
                  <Icon name={a.ic} />
                </span>
                <b>
                  {a.n} · niveau {achTier(a)}
                </b>
              </div>
            ))}
          </div>
        </>
      );
    case "unit":
      return (
        <>
          <Mascot mood="proud" size={120} />
          <h1>Journée {p.d} terminée !</h1>
          <p>
            Toutes les notions de « {UNITS[p.d - 1].n} » sont vues. Ton XP est doublé pendant 15 minutes.
          </p>
        </>
      );
    case "legend":
      return (
        <>
          <Icon name="crown" color="var(--legend)" className="bigflame" />
          <h1 style={{ color: "var(--legend)" }}>Unité légendaire</h1>
          <p>Tu as réussi l&apos;épreuve de la journée {p.d}. +30 JCC.</p>
        </>
      );
  }
}

export function PostScreen({ ls }: { ls: Session }) {
  const p = ls.post[ls.pi];
  if (!p) return null;
  const showNext = p.type === "summary" && ls.kind === "lesson" && (D.lessons[ls.topic ?? ""] ?? 0) < 2;
  return (
    <>
      {/* La clé relance l’animation d’entrée à chaque écran. */}
      <div className="screen" key={ls.pi}>
        <PostBody p={p} ls={ls} />
      </div>
      <div className="screen-cta">
        <div>
          {showNext && (
            <button className="b3 ghost" onClick={nextLesson}>
              Leçon suivante
            </button>
          )}
          <button className="b3" onClick={postNext}>
            Continuer
          </button>
        </div>
      </div>
    </>
  );
}
