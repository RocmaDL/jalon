// Messages éphémères : toasts (bas d’écran) et bulles de combo avec la mascotte.

import { notices } from "@/game/store";
import { Mascot } from "../ui/Mascot";

export function Toasts() {
  return (
    <>
      {notices.map((n) =>
        n.kind === "toast" ? (
          <div key={n.id} className="toast" role="status">
            {n.msg}
          </div>
        ) : (
          <div key={n.id} className="burst">
            <Mascot mood={n.mood ?? "wow"} size={46} />
            <span>{n.msg}</span>
          </div>
        ),
      )}
    </>
  );
}
