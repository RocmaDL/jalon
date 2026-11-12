// Associer quatre termes à leur définition (aussi utilisé par les paires express).

import { LEX } from "@/data/lexique";
import { pairPick } from "@/game/actions";
import type { PairsEx } from "@/game/types";
import { shortDef, termAlts } from "@/lib/content";

/** Terme affiché : la première variante si l’intitulé complet est trop long. */
const termLabel = (i: number): string => {
  const n = LEX[i].n;
  const alts = termAlts(n);
  return alts.length > 1 && n.length > 22 ? alts[0] : n;
};

interface Props {
  ex: PairsEx;
  chk: boolean;
  express: boolean;
  matches: number;
}

export function PairsExercise({ ex, chk, express, matches }: Props) {
  const cls = (side: "l" | "r", i: number): string =>
    ex.matched.includes(i)
      ? "done"
      : (side === "l" ? ex.selL : ex.selR) === i
        ? "sel"
        : ex.bad && ex.bad[side === "l" ? 0 : 1] === i
          ? "ko"
          : "";
  // La clé change à chaque erreur pour rejouer l’animation de secousse.
  const key = (side: "l" | "r", i: number): string => `${side}${i}-${cls(side, i) === "ko" ? ex.errs : ""}`;
  return (
    <>
      <h2 className="prompt">
        {express ? (
          <>
            Paires express · <span className="num">{matches}</span> trouvée{matches > 1 ? "s" : ""}
          </>
        ) : (
          "Associe les paires"
        )}
      </h2>
      <div className="pairs">
        <div className="col">
          {ex.left.map((i, n) => (
            <button key={key("l", i)} className={`pr term ${cls("l", i)}`} onClick={() => pairPick("l", i)} disabled={ex.matched.includes(i) || chk}>
              <span className="k">{n + 1}</span>
              <span>{termLabel(i)}</span>
            </button>
          ))}
        </div>
        <div className="col">
          {ex.right.map((i, n) => (
            <button key={key("r", i)} className={`pr ${cls("r", i)}`} onClick={() => pairPick("r", i)} disabled={ex.matched.includes(i) || chk}>
              <span className="k">{n + 5}</span>
              <span>{shortDef(LEX[i].x)}</span>
            </button>
          ))}
        </div>
      </div>
      {express && (
        <p className="muted" style={{ textAlign: "center", margin: 0 }}>
          Une erreur coûte 3 secondes. Clavier : 1-4 puis 5-8.
        </p>
      )}
    </>
  );
}
