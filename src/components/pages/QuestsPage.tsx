// Quêtes du jour et défi du mois.

import { quests } from "@/game/quests";
import { D } from "@/game/state";
import type { IconName, Quest } from "@/game/types";
import { msToMidnight } from "@/lib/dates";
import { Coin, Icon } from "../ui/Icon";

const questIcon = (q: Quest): IconName =>
  q.done ? "check" : q.k === "xp" ? "bolt" : q.k === "flash" ? "cards" : q.k === "maxCombo" ? "flame" : "star";

/** Ligne de quête ; `compact` pour la colonne de droite. */
export function QuestRow({ q, compact = false }: { q: Quest; compact?: boolean }) {
  const icon: IconName = compact ? (q.done ? "check" : "bolt") : questIcon(q);
  return (
    <div className="quest">
      <div className={`qi ${q.done ? "done" : ""}`}>
        <Icon name={icon} />
      </div>
      <div>
        <b style={compact ? { fontSize: 15 } : undefined}>{q.t}</b>
        <div className="bar">
          <i style={{ width: `${(q.cur / q.n) * 100}%` }} />
          <span>
            {q.cur} / {q.n}
          </span>
        </div>
        {!compact && (
          <div className="rw">
            <Coin /> {q.claimed ? "Récompense reçue" : "+" + q.rw + " JCC"}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuestsPage() {
  const left = msToMidnight();
  return (
    <div className="page">
      <h1>Quêtes</h1>
      <div className="card">
        <div className="row between">
          <h3>Quêtes du jour</h3>
          <span className="muted">
            {Math.floor(left / 36e5)} h {Math.floor((left % 36e5) / 6e4)} min restantes
          </span>
        </div>
        {quests().map((q) => (
          <QuestRow key={q.i} q={q} />
        ))}
      </div>
      <div className="card">
        <div className="row between">
          <h3>Défi du mois</h3>
          <span className="num muted">{Math.min(D.month.quests, 20)} / 20</span>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          Réussis 20 quêtes ce mois-ci pour gagner 50 JCC.
        </p>
        <div className="bar">
          <i style={{ width: `${Math.min(100, (D.month.quests / 20) * 100)}%`, background: "var(--league)" }} />
        </div>
        {D.month.done && <p style={{ margin: 0, color: "var(--good)", fontWeight: 700 }}>Défi réussi.</p>}
      </div>
    </div>
  );
}
