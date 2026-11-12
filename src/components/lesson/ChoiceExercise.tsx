// QCM, définition à choisir ou vrai/faux.

import { selectOption } from "@/game/actions";
import type { ChoiceEx } from "@/game/types";

export function ChoiceExercise({ ex, chk }: { ex: ChoiceEx; chk: boolean }) {
  const cls = (o: string, k: number): string =>
    chk ? (o === ex.ok ? "ok" : k === ex.sel ? "ko" : "") : k === ex.sel ? "sel" : "";
  const buttons = ex.opts.map((o, k) => (
    <button key={k} className={`opt ${cls(o, k)}`} onClick={() => selectOption(k)} disabled={chk}>
      {ex.type === "tf" ? null : <span className="k">{k + 1}</span>}
      <span>{o}</span>
    </button>
  ));
  return (
    <>
      <h2 className="prompt">{ex.prompt}</h2>
      {ex.quote && <blockquote className="quote">{ex.quote}</blockquote>}
      {ex.type === "tf" ? (
        <div className="tf">{buttons}</div>
      ) : (
        <ul className="opts">
          {buttons.map((b, k) => (
            <li key={k}>{b}</li>
          ))}
        </ul>
      )}
    </>
  );
}
