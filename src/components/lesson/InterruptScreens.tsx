// Interruptions de séance : confirmation de sortie, plus de cœurs, épreuve ratée.

import type { CSSProperties } from "react";
import { leave, refillAndResume, retryCheckpoint, setConfirm } from "@/game/actions";
import { REFILL_PRICE } from "@/game/constants";
import { D } from "@/game/state";
import type { Session } from "@/game/types";
import { Coin } from "../ui/Icon";
import { Mascot } from "../ui/Mascot";

const compact: CSSProperties = { minHeight: "auto", paddingBlock: 30 };

export function ConfirmQuit({ ls }: { ls: Session }) {
  return (
    <>
      <div className="screen" style={compact}>
        <Mascot mood="sad" size={110} />
        <h1 style={{ animation: "none" }}>Attends, tu pars déjà ?</h1>
        <p>Si tu quittes maintenant, tu perds ta progression dans cette {ls.kind === "lesson" ? "leçon" : "séance"}.</p>
      </div>
      <div className="screen-cta">
        <div>
          <button className="b3" onClick={() => setConfirm(false)}>
            Continuer
          </button>
          <button className="b3 ghost" onClick={leave} style={{ "--t": "var(--bad)" } as CSSProperties}>
            Quitter
          </button>
        </div>
      </div>
    </>
  );
}

export function NoHearts() {
  return (
    <>
      <div className="screen" style={compact}>
        <Mascot mood="sad" size={110} />
        <h1 style={{ animation: "none" }}>Plus de cœurs</h1>
        <p>
          Recharge-les pour finir la leçon, ou fais une séance d&apos;entraînement pour en regagner un. Un cœur revient
          aussi toutes les 30 minutes.
        </p>
      </div>
      <div className="screen-cta">
        <div>
          <button className="b3" onClick={refillAndResume} disabled={D.jcc < REFILL_PRICE}>
            <span className="price">
              <Coin />
              {REFILL_PRICE}
            </span>{" "}
            Recharger
          </button>
          <button className="b3 ghost" onClick={leave}>
            Quitter la leçon
          </button>
        </div>
      </div>
    </>
  );
}

export function FailScreen() {
  return (
    <>
      <div className="screen">
        <Mascot mood="sad" size={120} />
        <h1>Épreuve ratée</h1>
        <p>Trois erreurs, c&apos;est la limite. Révise les points faibles de la journée, puis retente.</p>
      </div>
      <div className="screen-cta">
        <div>
          <button className="b3" onClick={retryCheckpoint}>
            Réessayer
          </button>
          <button className="b3 ghost" onClick={leave}>
            Retour au parcours
          </button>
        </div>
      </div>
    </>
  );
}
