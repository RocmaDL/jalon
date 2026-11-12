// Colonne de droite (bureau) : ligue, objectif du jour, quêtes.

import { navigate } from "@/game/actions";
import { TIERS } from "@/game/constants";
import { table } from "@/game/league";
import { quests } from "@/game/quests";
import { D } from "@/game/state";
import { ordinal } from "@/lib/text";
import { QuestRow } from "../pages/QuestsPage";
import { Shield } from "../ui/Shield";

export function Rail() {
  const rank = table().findIndex((x) => x.me) + 1;
  const p = Math.min(100, Math.round((D.daily.xp / D.goal) * 100));
  return (
    <>
      <div className="card">
        <div className="row between">
          <h3>Ligue {TIERS[D.league.tier]}</h3>
          <Shield tier={D.league.tier} size={30} />
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {D.league.weekXp > 0
            ? `Tu es ${ordinal(rank)} cette semaine avec ${D.league.weekXp} XP.`
            : "Gagne de l'XP pour entrer dans le classement de la semaine."}
        </p>
        <button className="link" onClick={() => navigate("league")} style={{ alignSelf: "flex-start", padding: 0 }}>
          Voir la ligue
        </button>
      </div>
      <div className="card">
        <div className="row between">
          <h3>Objectif du jour</h3>
          <span className="num muted">
            {Math.min(D.daily.xp, D.goal)} / {D.goal} XP
          </span>
        </div>
        <div className="bar">
          <i style={{ width: `${p}%` }} />
        </div>
      </div>
      <div className="card">
        <div className="row between">
          <h3>Quêtes du jour</h3>
          <button className="link" onClick={() => navigate("quests")} style={{ padding: 0 }}>
            Tout voir
          </button>
        </div>
        {quests().map((q) => (
          <QuestRow key={q.i} q={q} compact />
        ))}
      </div>
    </>
  );
}
