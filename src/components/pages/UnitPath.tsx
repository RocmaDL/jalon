// Parcours d’une journée : en-tête, étapes en zigzag et bulle de l’étape ouverte.

import { type CSSProperties, Fragment } from "react";
import type { Unit } from "@/data/types";
import {
  clickNode,
  openModal,
  startCheckpoint,
  startReviewTopic,
  startTopic,
  startUnitReview,
} from "@/game/actions";
import { type NodeState, type PathNode, nodeLabel, nodeState, unitNodes, unitUnlocked } from "@/game/path";
import { D } from "@/game/state";
import { S } from "@/game/store";
import type { IconName } from "@/game/types";
import { TOPIC } from "@/lib/content";
import { Icon } from "../ui/Icon";
import { Mascot } from "../ui/Mascot";

/** Décalage horizontal des étapes, en boucle. */
const OFFS = [0, 52, 74, 52, 0, -52, -74, -52];

function NodeButton({ node: n, st }: { node: PathNode; st: NodeState }) {
  let cls = "";
  let icon: IconName;
  if (st.locked) {
    cls = "locked";
    icon = n.type === "chest" ? "chest" : n.type === "exam" ? "trophy" : "lock";
  } else if (n.type === "chest") {
    icon = st.done ? "chestOpen" : "chest";
    if (st.done) cls = "done";
  } else if (n.type === "review") {
    icon = "dumbbell";
    if (st.done) cls = "done";
  } else if (n.type === "exam") {
    icon = st.done ? "crown" : "trophy";
    if (st.done) cls = "legend";
  } else {
    icon = st.done ? "check" : "star";
    if (st.done) cls = st.cracked ? "done cracked" : "done";
  }
  const label = `${nodeLabel(n)}${st.locked ? ", verrouillé" : st.done ? ", terminé" : ""}`;
  const showRing = n.type === "topic" && !st.done && !st.locked && st.prog > 0;
  return (
    <div className="nwrap">
      {showRing && (
        <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--sunk)" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="289"
            strokeDashoffset={289 * (1 - st.prog)}
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      <button className={`node ${cls}`} onClick={() => clickNode(n.id)} aria-label={label}>
        <Icon name={icon} />
        {st.cracked && (
          <span className="crack">
            <Icon name="crack" color="var(--bad)" />
          </span>
        )}
      </button>
    </div>
  );
}

function NodePopover({ node: n, st }: { node: PathNode; st: NodeState }) {
  if (st.locked)
    return (
      <div className="pop locked">
        <h3>{nodeLabel(n)}</h3>
        <p>Valide l&apos;épreuve de la journée précédente pour débloquer cette journée.</p>
        <button className="b3 wide" disabled>
          Verrouillé
        </button>
      </div>
    );
  if (n.type === "topic") {
    const done = D.lessons[n.t] || 0;
    const t = TOPIC[n.t];
    if (!st.done)
      return (
        <div className="pop">
          <h3>{t.n}</h3>
          <p>
            Leçon {done + 1} sur 2 · {done ? "approfondissement" : "découverte des notions"}
          </p>
          <button className="b3 wide" onClick={() => startTopic(n.t)}>
            Commencer · +15 XP
          </button>
        </div>
      );
    const s = Math.round((st.strength ?? 1) * 100);
    return (
      <div className="pop">
        <h3>{t.n}</h3>
        <p>
          {st.cracked
            ? `Ce niveau s'efface de ta mémoire (${s} %). Une révision le répare.`
            : `Niveau terminé. Mémoire estimée : ${s} %.`}
        </p>
        <button className="b3 wide" onClick={() => startReviewTopic(n.t)}>
          {st.cracked ? "Réparer" : "Réviser"} · +10 XP
        </button>
      </div>
    );
  }
  if (n.type === "review")
    return (
      <div className="pop">
        <h3>Révision de la journée {n.d}</h3>
        <p>12 exercices choisis parmi ce que tu oublies le plus.</p>
        <button className="b3 wide" onClick={() => startUnitReview(n.d)}>
          {st.done ? "Refaire" : "Commencer"} · +10 XP
        </button>
      </div>
    );
  if (n.type === "exam")
    return (
      <div className="pop">
        <h3>Épreuve de la journée {n.d}</h3>
        <p>
          15 exercices sur toute la journée, 3 vies, aucune deuxième chance. Réussis-la pour rendre l&apos;unité
          légendaire ou passer directement à la journée suivante.
        </p>
        <button className="b3 wide" onClick={() => startCheckpoint(n.d)}>
          {st.done ? "Refaire" : "Tenter l'épreuve"} · +40 XP
        </button>
      </div>
    );
  return null;
}

export function UnitPath({ unit, current }: { unit: Unit; current: string | null }) {
  const N = unitNodes(unit.d);
  const legend = D.legend["e:" + unit.d];
  const unlocked = unitUnlocked(unit.d);
  const style = {
    "--u": `var(--u${unit.d})`,
    "--u-deep": `var(--u${unit.d}d)`,
    "--u-ink": `var(--u${unit.d}i)`,
  } as CSSProperties;
  return (
    <section className="unit" style={style}>
      <div className={`uhead ${legend ? "legend" : ""}`}>
        <div>
          <small>
            Journée {unit.d}
            {legend ? " · Légendaire" : ""}
          </small>
          <h2>{unit.n}</h2>
        </div>
        <button
          className="guide"
          onClick={() => openModal({ kind: "guide", d: unit.d })}
          aria-label={`Guide de la journée ${unit.d}`}
          disabled={!unlocked}
        >
          <Icon name="book" />
          <span>Guide</span>
        </button>
      </div>
      {unlocked && !legend && (
        <p className="muted" style={{ margin: "8px 0 0", textAlign: "center" }}>
          Tu peux faire les étapes dans l&apos;ordre ou passer cette journée en réussissant directement son épreuve finale.
        </p>
      )}
      <div className="path">
        {N.map((n, i) => {
          const st = nodeState(N, i);
          const off = OFFS[i % 8];
          const isCur = current === n.id;
          return (
            <Fragment key={n.id}>
              <div className="pnode" style={{ transform: `translateX(${off}px)` }}>
                {isCur && (
                  <div className="startbub">{n.type === "topic" && (D.lessons[n.t] || 0) > 0 ? "Continuer" : "Commencer"}</div>
                )}
                <NodeButton node={n} st={st} />
                {isCur && (
                  <div className={`pmascot ${off > 0 ? "l" : "r"}`}>
                    <Mascot mood="happy" size={62} />
                  </div>
                )}
                <div className="nlabel">{nodeLabel(n)}</div>
              </div>
              {S.pop === n.id && <NodePopover node={n} st={st} />}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
