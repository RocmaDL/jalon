// Saisie libre du terme correspondant à une définition, avec indices.

import { useEffect, useRef } from "react";
import { askHint, setTyped } from "@/game/actions";
import type { TypeEx } from "@/game/types";

export function TypeExercise({ ex, chk, ok }: { ex: TypeEx; chk: boolean; ok: boolean }) {
  const ref = useRef<HTMLInputElement>(null);

  // Garde le focus dans le champ (y compris après un indice), curseur en fin de texte.
  useEffect(() => {
    const el = ref.current;
    if (!el || chk) return;
    el.focus();
    const n = el.value.length;
    el.setSelectionRange(n, n);
  }, [ex, chk, ex.hint]);

  const sc = chk ? (ok ? "ok" : "ko") : "";
  const hint = ex.hint ? ex.alts[0].slice(0, ex.hint * 2) : "";
  return (
    <>
      <h2 className="prompt">{ex.prompt}</h2>
      <blockquote className="quote">{ex.quote}</blockquote>
      <input
        ref={ref}
        className={`tinput ${sc}`}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="Écris le terme"
        value={ex.text}
        onChange={(e) => setTyped(e.target.value)}
        disabled={chk}
        aria-label="Ta réponse"
      />
      {!chk && (
        <div className="row between">
          <button className="link" onClick={askHint} style={{ paddingLeft: 0 }}>
            {ex.hint ? "Encore un indice" : "Un indice ?"}
          </button>
          {hint && <span className="muted">Commence par « {hint}… »</span>}
        </div>
      )}
    </>
  );
}
