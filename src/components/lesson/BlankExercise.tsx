// Phrase à trous : choisir l’étiquette qui complète la phrase.

import { clearSlot, pickTile } from "@/game/actions";
import type { BlankEx } from "@/game/types";

export function BlankExercise({ ex, chk, ok }: { ex: BlankEx; chk: boolean; ok: boolean }) {
  const s = ex.slot !== null ? ex.tiles[ex.slot] : "";
  const sc = chk ? (ok ? "ok" : "ko") : "";
  return (
    <>
      <h2 className="prompt">Choisis le mot qui manque.</h2>
      <div className="sentence">
        {ex.a}{" "}
        <button className={`slot ${s ? "full" : ""} ${sc}`} onClick={clearSlot} disabled={chk || !s} aria-label={s ? "Retirer " + s : "Case vide"}>
          {s}
        </button>{" "}
        {ex.b}
      </div>
      <div className="bank">
        {ex.tiles.map((t, k) => (
          <button key={k} className={`tile ${ex.slot === k ? "used" : ""}`} onClick={() => pickTile(k)} disabled={chk || ex.slot === k}>
            <span className="k">{k + 1}</span>
            {t}
          </button>
        ))}
      </div>
    </>
  );
}
