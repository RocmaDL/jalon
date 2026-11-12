// Boutique : dépenses en JCC (gel de série, recharge, boost, pari).

import type { CSSProperties } from "react";
import { buy } from "@/game/actions";
import { SHOP, type ShopItem } from "@/game/constants";
import { boostLeft } from "@/game/progress";
import { D } from "@/game/state";
import { Coin, Icon } from "../ui/Icon";

/** Raison pour laquelle l’article ne peut pas être acheté, ou chaîne vide. */
function blockReason(it: ShopItem): string {
  if (it.id === "freeze" && D.freezes >= 2) return "Tu en as déjà deux";
  if (it.id === "refill" && (D.unlimited || D.hearts >= 5)) return D.unlimited ? "Cœurs illimités activés" : "Cœurs déjà pleins";
  if (it.id === "wager" && D.wager) return `En cours : série de ${D.wager.target} jours visée`;
  if (it.id === "boost" && boostLeft() > 0) return "Boost déjà actif";
  if (D.jcc < it.p) return "Pas assez de JCC";
  return "";
}

export function ShopPage() {
  return (
    <div className="page">
      <div className="row between">
        <h1>Boutique</h1>
        <span className="chip">
          <Coin />
          <span className="num" style={{ color: "var(--jcc)" }}>
            {D.jcc} JCC
          </span>
        </span>
      </div>
      <p className="muted" style={{ margin: "-8px 0 0" }}>
        Les jetons de confiance client (JCC) se gagnent avec les coffres, les quêtes et la ligue.
      </p>
      <div className="card" style={{ gap: 0 }}>
        {SHOP.map((it) => {
          const reason = blockReason(it);
          return (
            <div key={it.id} className="shopi" style={{ "--c": it.c } as CSSProperties}>
              <span className="bub">
                <Icon name={it.ic} />
              </span>
              <span>
                <b>
                  {it.n}
                  {it.id === "freeze" && (
                    <>
                      {" "}
                      <span className="muted" style={{ font: "600 14px var(--f-b)" }}>
                        ({D.freezes}/2)
                      </span>
                    </>
                  )}
                </b>
                <small>{it.d}</small>
                {reason && <small style={{ color: "var(--muted)", fontStyle: "italic" }}>{reason}</small>}
              </span>
              <button className="b3 sm ghost" onClick={() => buy(it.id)} disabled={!!reason}>
                <span className="price">
                  <Coin />
                  {it.p}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
