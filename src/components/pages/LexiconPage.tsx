// Lexique complet avec recherche et pastille de mémoire.

import { LEX } from "@/data/lexique";
import { backToPractice, setLexDay, setSearch } from "@/game/actions";
import { recall } from "@/game/memory";
import { S } from "@/game/store";
import { TOPIC } from "@/lib/content";
import { norm } from "@/lib/text";
import { DaySeg } from "./FlashcardsPage";

const dotColor = (i: number): string => {
  const r = recall("x:" + i);
  return r === null ? "var(--line)" : r > 0.75 ? "var(--good)" : r > 0.5 ? "var(--xp)" : "var(--bad)";
};

export function LexiconPage() {
  const q = norm(S.search);
  const items = LEX.map((x, i) => [x, i] as const).filter(
    ([x]) => (S.lexDay === "all" || TOPIC[x.t].d === +S.lexDay) && (!q || norm(x.n + " " + x.x).includes(q)),
  );
  return (
    <div className="page">
      <div className="row between">
        <button className="link" onClick={backToPractice} style={{ paddingLeft: 0 }}>
          ← Entraînement
        </button>
        <DaySeg value={S.lexDay} onPick={setLexDay} />
      </div>
      <h1>Lexique</h1>
      <input
        className="input"
        type="search"
        placeholder="Chercher un terme ou un mot de la définition"
        value={S.search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Rechercher dans le lexique"
      />
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>
        La pastille indique ta mémoire du terme : verte solide, orange fragile, rouge à revoir, grise jamais vu.
      </p>
      <div className="card" style={{ gap: 0 }}>
        {items.length ? (
          <dl style={{ margin: 0 }}>
            {items.map(([x, i]) => (
              <div key={i} className="lexi">
                <dt>
                  <span className="dot" style={{ background: dotColor(i) }} />
                  <span>
                    {x.n}
                    <br />
                    <span className="muted" style={{ font: "500 13px var(--f-b)" }}>
                      J{TOPIC[x.t].d} · {TOPIC[x.t].n}
                    </span>
                  </span>
                </dt>
                <dd>{x.x}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="empty">Aucun terme ne correspond.</p>
        )}
      </div>
    </div>
  );
}
