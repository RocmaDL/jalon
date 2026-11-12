// Bandeau bas : boutons Passer / Vérifier, puis correction et Continuer.

import { LEX } from "@/data/lexique";
import { check, cont } from "@/game/actions";
import type { Exercise, Session } from "@/game/types";
import { keyIndex, termAlts } from "@/lib/content";
import { canCheck } from "@/lib/exercises";
import { plural } from "@/lib/text";
import { Icon } from "../ui/Icon";

const PRAISE = ["Bien joué !", "Excellent !", "Parfait !", "Exactement !", "Bravo !"];

/** Solution et explication à afficher après la correction. */
function correction(ex: Exercise, ok: boolean): { sol: string; exp: string } {
  if (ex.type === "pairs") return { sol: "", exp: ex.errs ? `${plural(ex.errs, "mauvaise association")} en route.` : "Aucune erreur." };
  let sol = "";
  if (!ok) sol = ex.type === "order" ? ex.items.map((s, i) => i + 1 + ". " + s).join("  ·  ") : ex.ok;
  if (ex.type === "type" && ok && ex.typo) sol = "Attention à l'orthographe : " + ex.ok;
  if (ex.type === "type" && ok && !ex.typo && termAlts(ex.ok).length > 1) sol = ex.ok;
  let exp = ex.e || "";
  if (ex.mode === "term" && !ok && ex.k) exp = LEX[keyIndex(ex.k)].x;
  return { sol, exp };
}

export function FeedbackBar({ ex, chk, ls }: { ex: Exercise; chk: boolean; ls: Session }) {
  if (!chk) {
    if (ex.type === "pairs")
      return (
        <div className="fbar">
          <div>
            <span className="muted">Touche un terme, puis sa définition.</span>
          </div>
        </div>
      );
    const can = canCheck(ex);
    return (
      <div className="fbar">
        <div>
          {ls.exam ? (
            <span />
          ) : (
            <button className="b3 ghost" onClick={() => check(true)}>
              Passer
            </button>
          )}
          <button className={`b3 ${can ? "good" : ""}`} onClick={() => check(false)} disabled={!can}>
            {ls.exam ? "Valider" : "Vérifier"}
          </button>
        </div>
      </div>
    );
  }

  const ok = !!ls.res;
  const { sol, exp } = correction(ex, ok);
  const title = ok
    ? ex.type === "type" && ex.typo
      ? "Presque parfait !"
      : PRAISE[(ls.answered + ls.solved) % PRAISE.length]
    : "Pas tout à fait";
  return (
    <div className={`fbar ${ok ? "good" : "bad"}`} role="status">
      <div>
        <div className="ftxt">
          <div className="ftitle">
            <span className="badge">
              <Icon name={ok ? "check" : "cross"} />
            </span>
            {title}
          </div>
          {sol && (
            <div className="sol">
              {ok ? "" : "Bonne réponse : "}
              {sol}
            </div>
          )}
          {exp && <div className="ex">{exp}</div>}
        </div>
        <button className={`b3 ${ok ? "good" : "bad"}`} onClick={cont}>
          Continuer
        </button>
      </div>
    </div>
  );
}
