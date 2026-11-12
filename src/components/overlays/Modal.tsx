// Modales : guide de journée, série, cœurs, coffre, résultat de ligue.

import { LEX } from "@/data/lexique";
import { UNITS } from "@/data/units";
import { buy, closeModal, goPractice } from "@/game/actions";
import { REFILL_PRICE, TIERS } from "@/game/constants";
import { liveStreak, nextHeartIn } from "@/game/progress";
import { D } from "@/game/state";
import { modal } from "@/game/store";
import type { LeagueResult, ModalSpec } from "@/game/types";
import { KEYS, keyIndex, unitTopics } from "@/lib/content";
import { today } from "@/lib/dates";
import { fmtMin, ordinal, plural } from "@/lib/text";
import { Coin, Icon } from "../ui/Icon";
import { Mascot } from "../ui/Mascot";
import { Shield } from "../ui/Shield";
import { WeekRow } from "../ui/WeekRow";

function GuideBody({ d }: { d: number }) {
  const u = UNITS[d - 1];
  const terms = unitTopics(d)
    .flatMap((t) => KEYS[t].x)
    .map((k) => LEX[keyIndex(k)].n)
    .join(" · ");
  return (
    <>
      <div>
        <span className="eyebrow">Guide · Journée {d}</span>
        <h2>{u.n}</h2>
      </div>
      <h3 style={{ fontSize: 18 }}>La journée en sept idées</h3>
      <ol className="guide-list">
        {u.ideas.map((idea, i) => (
          <li key={i}>{idea}</li>
        ))}
      </ol>
      <h3 style={{ fontSize: 18 }}>Les termes à connaître</h3>
      <p style={{ margin: 0 }}>{terms}</p>
      <button className="b3 wide" onClick={closeModal}>
        Fermer
      </button>
    </>
  );
}

function StreakBody() {
  const st = liveStreak();
  const done = D.last === today();
  return (
    <>
      <div className="center">
        <Icon name="flame" color={done ? "var(--fire)" : "var(--line)"} className="bigflame" />
        <h2>{plural(st, "jour")} de série</h2>
        <p className="muted" style={{ margin: 0 }}>
          {done ? "Leçon du jour faite. Reviens demain." : `Fais une leçon aujourd'hui pour ${st ? "prolonger" : "lancer"} ta série.`}
        </p>
        <WeekRow />
      </div>
      <div className="stats4">
        <div className="stat">
          <Icon name="snow" color="var(--pri)" />
          <div>
            <b>{D.freezes} / 2</b>
            <small>Gels de série</small>
          </div>
        </div>
        <div className="stat">
          <Icon name="trophy" color="var(--xp)" />
          <div>
            <b>{D.best}</b>
            <small>Record</small>
          </div>
        </div>
      </div>
      {D.wager && (
        <p className="muted" style={{ margin: 0 }}>
          Pari en cours : atteins {D.wager.target} jours pour gagner 100 JCC.
        </p>
      )}
      <button className="b3 wide" onClick={closeModal}>
        Compris
      </button>
    </>
  );
}

function HeartsBody({ blocked }: { blocked: boolean }) {
  const full = D.unlimited || D.hearts >= 5;
  const title = D.unlimited ? "Cœurs illimités" : blocked ? "Plus de cœurs" : `${D.hearts} cœur${D.hearts > 1 ? "s" : ""} sur 5`;
  const text = D.unlimited
    ? "Les erreurs ne coûtent rien. Tu peux désactiver ce réglage dans ton profil."
    : D.hearts >= 5
      ? "Chaque erreur dans une leçon coûte un cœur."
      : `Prochain cœur dans ${fmtMin(nextHeartIn())}. Une séance d'entraînement en rend un aussi.`;
  return (
    <>
      <div className="center">
        <Mascot mood={blocked ? "sad" : "happy"} size={90} />
        <h2>{title}</h2>
        <div className="row" style={{ justifyContent: "center" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="heart" color={D.unlimited || i < D.hearts ? "var(--bad)" : "var(--line)"} />
          ))}
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {text}
        </p>
      </div>
      {!full && (
        <>
          <button className="b3 wide" onClick={() => buy("refill")} disabled={D.jcc < REFILL_PRICE}>
            <span className="price">
              <Coin />
              {REFILL_PRICE}
            </span>{" "}
            Recharger
          </button>
          <button className="b3 wide ghost" onClick={goPractice}>
            S&apos;entraîner pour en regagner
          </button>
        </>
      )}
      <button className="b3 wide ghost" onClick={closeModal}>
        Fermer
      </button>
    </>
  );
}

function ChestBody({ jcc, freeze }: { jcc: number; freeze: boolean }) {
  return (
    <>
      <div className="center">
        <Icon name="chestOpen" color="var(--xp)" className="bigflame" />
        <h2>Coffre ouvert !</h2>
        <p style={{ margin: 0, font: "600 22px var(--f-d)", color: "var(--jcc)" }} className="price">
          <Coin /> +{jcc} JCC
        </p>
        {freeze && (
          <p className="muted" style={{ margin: 0 }}>
            Et un gel de série en bonus.
          </p>
        )}
      </div>
      <button className="b3 wide" onClick={closeModal}>
        Super
      </button>
    </>
  );
}

function LeagueBody({ r }: { r: LeagueResult }) {
  const up = r.nt > r.old;
  const down = r.nt < r.old;
  const outcome = up
    ? `Tu montes en ligue ${TIERS[r.nt]}.`
    : down
      ? `Tu redescends en ligue ${TIERS[r.nt]}.`
      : `Tu restes en ligue ${TIERS[r.nt]}.`;
  return (
    <>
      <div className="center">
        <Shield tier={r.nt} size={80} />
        <h2>{up ? "Promotion !" : down ? "Relégation" : "Semaine terminée"}</h2>
        <p className="muted" style={{ margin: 0 }}>
          Tu as fini {ordinal(r.rank)} en ligue {TIERS[r.old]}. {outcome}
        </p>
        {r.rw > 0 && (
          <p className="price" style={{ margin: 0, color: "var(--jcc)", font: "600 20px var(--f-d)" }}>
            <Coin /> +{r.rw} JCC
          </p>
        )}
      </div>
      <button className="b3 wide" onClick={closeModal}>
        Continuer
      </button>
    </>
  );
}

function ModalBody({ m }: { m: ModalSpec }) {
  switch (m.kind) {
    case "guide":
      return <GuideBody d={m.d} />;
    case "streak":
      return <StreakBody />;
    case "hearts":
      return <HeartsBody blocked={m.blocked} />;
    case "chest":
      return <ChestBody jcc={m.jcc} freeze={m.freeze} />;
    case "league":
      return <LeagueBody r={m.result} />;
  }
}

export function Modal() {
  if (!modal) return null;
  return (
    <div
      className="scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <ModalBody m={modal} />
      </div>
    </div>
  );
}
