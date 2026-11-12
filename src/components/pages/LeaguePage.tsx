// Ligue hebdomadaire : niveaux, classement, zones de promotion et de relégation.

import { Fragment } from "react";
import { TIERS } from "@/game/constants";
import { table, weekTimeLeft } from "@/game/league";
import { D } from "@/game/state";
import { Shield } from "../ui/Shield";

export function LeaguePage() {
  const tb = table();
  const t = D.league.tier;
  const left = weekTimeLeft();
  const dd = Math.floor(left / 864e5);
  const hh = Math.floor((left % 864e5) / 36e5);
  return (
    <div className="page">
      <div className="card" style={{ alignItems: "center", textAlign: "center" }}>
        <div className="tiers" style={{ maxWidth: "100%" }}>
          {TIERS.map((n, i) => (
            <div key={n} className={`tier ${i === t ? "on" : i < t ? "past" : ""}`}>
              <Shield tier={i} />
              <span>{n}</span>
            </div>
          ))}
        </div>
        <h1 style={{ fontSize: 26 }}>Ligue {TIERS[t]}</h1>
        <p className="muted" style={{ margin: 0 }}>
          Les 7 premiers montent, les 5 derniers descendent. Fin dans {dd} j {hh} h.
        </p>
        {D.league.weekXp === 0 && <p style={{ margin: 0 }}>Termine une leçon pour rejoindre le classement de la semaine.</p>}
      </div>
      <div className="card" style={{ gap: 2, padding: 10 }}>
        {tb.map((r, i) => {
          const rk = i + 1;
          return (
            <Fragment key={r.name + i}>
              {rk === 8 && t < 9 && <div className="zone up">Zone de promotion</div>}
              {rk === 16 && t > 0 && <div className="zone down">Zone de relégation</div>}
              <div className={`lrow ${r.me ? "me" : ""}`}>
                <span className={`rk ${rk <= 3 ? "podium" : ""}`}>{rk}</span>
                <span className="av" style={{ background: r.c }}>
                  {r.name[0]}
                </span>
                <span className="nm">
                  {r.name}
                  {r.me ? " (toi)" : ""}
                </span>
                <span className="xp">{r.xp} XP</span>
              </div>
            </Fragment>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: 0, textAlign: "center" }}>
        Tes adversaires sont simulés : leur XP progresse au fil de la semaine.
      </p>
    </div>
  );
}
