// Remise en ordre : toucher les étiquettes dans l’ordre voulu.

import { pushOrder, removeOrder } from "@/game/actions";
import type { OrderEx } from "@/game/types";

export function OrderExercise({ ex, chk, ok }: { ex: OrderEx; chk: boolean; ok: boolean }) {
  const sc = chk ? (ok ? "ok" : "ko") : "";
  return (
    <>
      <h2 className="prompt">{ex.prompt}</h2>
      <div className={`seq ${sc}`}>
        {ex.seq.length ? (
          ex.seq.map((j, p) => (
            <button key={j} className="tile" onClick={() => removeOrder(p)} disabled={chk}>
              <span className="n">{p + 1}.</span>
              {ex.items[j]}
            </button>
          ))
        ) : (
          <div className="seq-empty">Touche les étiquettes dans le bon ordre.</div>
        )}
      </div>
      <div className="bank">
        {ex.bank.map((j, b) => {
          const used = ex.seq.includes(j);
          return (
            <button key={j} className={`tile ${used ? "used" : ""}`} onClick={() => pushOrder(j)} disabled={chk || used}>
              <span className="k">{b + 1}</span>
              {ex.items[j]}
            </button>
          );
        })}
      </div>
    </>
  );
}
