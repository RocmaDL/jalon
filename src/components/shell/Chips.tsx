// Compteurs : série, JCC, cœurs et boost d’XP en cours.

import { navigate, openModal } from "@/game/actions";
import { boostLeft, liveStreak } from "@/game/progress";
import { D } from "@/game/state";
import { today } from "@/lib/dates";
import { fmtMin } from "@/lib/text";
import { Coin, Icon } from "../ui/Icon";

export function Chips() {
  const st = liveStreak();
  const active = D.last === today();
  const boost = boostLeft();
  return (
    <>
      <button className="chip" onClick={() => openModal({ kind: "streak" })} aria-label={`Série de ${st} jours`}>
        <Icon name="flame" color={active ? "var(--fire)" : "var(--line)"} />
        <span className="num" style={{ color: active ? "var(--fire)" : "var(--muted)" }}>
          {st}
        </span>
      </button>
      <button className="chip" onClick={() => navigate("shop")} aria-label={`${D.jcc} jetons de confiance client`}>
        <Coin />
        <span className="num" style={{ color: "var(--jcc)" }}>
          {D.jcc}
        </span>
      </button>
      <button className="chip" onClick={() => openModal({ kind: "hearts", blocked: false })} aria-label="Cœurs">
        <Icon name="heart" color="var(--bad)" />
        <span className="num" style={{ color: "var(--bad)" }}>
          {D.unlimited ? "∞" : D.hearts}
        </span>
      </button>
      {boost > 0 && (
        <span className="chip boost">
          <Icon name="bolt" color="var(--xp)" />
          ×2 · {fmtMin(boost)}
        </span>
      )}
    </>
  );
}
