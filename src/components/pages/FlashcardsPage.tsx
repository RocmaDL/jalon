// Flashcards du lexique, recto verso, filtrables par journée.

import { LEX } from "@/data/lexique";
import { backToPractice, fcAnswer, fcFlip, fcReset, fcToggleDir, setFcDay } from "@/game/actions";
import { DAY_FILTERS } from "@/game/constants";
import { S } from "@/game/store";
import { TOPIC } from "@/lib/content";
import { plural } from "@/lib/text";
import { Mascot } from "../ui/Mascot";

/** Filtre Tout / J1...Jn, partagé avec le lexique. */
export function DaySeg({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  return (
    <div className="seg">
      {DAY_FILTERS.map(([v, label]) => (
        <button key={v} className={`segb ${value === v ? "on" : ""}`} onClick={() => onPick(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function FlashcardsPage() {
  const f = S.fc;
  const head = (
    <>
      <div className="row between">
        <button className="link" onClick={backToPractice} style={{ paddingLeft: 0 }}>
          ← Entraînement
        </button>
        <DaySeg value={S.fcDay} onPick={setFcDay} />
      </div>
      <h1>Flashcards</h1>
    </>
  );
  if (!f) return <div className="page">{head}</div>;

  if (!f.queue.length)
    return (
      <div className="page">
        {head}
        <div className="card" style={{ alignItems: "center", textAlign: "center" }}>
          <Mascot mood="proud" size={90} />
          <h3>
            Paquet terminé : {f.known} / {f.total}
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            {f.again ? `Tu as demandé à revoir une carte ${plural(f.again, "fois", "fois")}.` : "Tout du premier coup."}
          </p>
          <button className="b3" onClick={fcReset}>
            Recommencer
          </button>
        </div>
      </div>
    );

  const x = LEX[f.queue[0]];
  const td = S.fcDir === "td";
  const day = TOPIC[x.t].d;
  const term = <span className="big">{x.n}</span>;
  const def = <span className="txt">{x.x}</span>;
  const front = (
    <>
      <span className="eyebrow">
        {td ? "Terme" : "Définition"} · J{day}
      </span>
      {td ? term : def}
    </>
  );
  const back = (
    <>
      <span className="eyebrow" style={{ color: "var(--pri)" }}>
        {td ? "Définition" : "Terme"}
      </span>
      {td ? def : term}
    </>
  );

  return (
    <div className="page">
      {head}
      <div className="row between">
        <span className="muted num">
          {f.known} sue{f.known > 1 ? "s" : ""} · {f.queue.length} restante{f.queue.length > 1 ? "s" : ""}
        </span>
        <button className="segb" onClick={fcToggleDir}>
          {td ? "Terme → définition" : "Définition → terme"}
        </button>
      </div>
      <div className="bar">
        <i style={{ width: `${(f.known / f.total) * 100}%`, background: "var(--legend)" }} />
      </div>
      <button className={`fc-face ${f.flip ? "back" : ""}`} onClick={fcFlip} aria-label="Retourner la carte">
        {f.flip ? back : front}
      </button>
      {f.flip ? (
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="b3 ghost" onClick={() => fcAnswer(false)}>
            À revoir
          </button>
          <button className="b3 good" onClick={() => fcAnswer(true)}>
            Je savais
          </button>
        </div>
      ) : (
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="b3" onClick={fcFlip}>
            Retourner
          </button>
        </div>
      )}
      <p className="muted" style={{ textAlign: "center", fontSize: 14, margin: 0 }}>
        Clavier : espace ou ↑ ↓ pour retourner · → je savais · ← à revoir
      </p>
    </div>
  );
}
