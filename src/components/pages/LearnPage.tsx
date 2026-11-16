// Page « Apprendre » : les unités sous forme de parcours.

import { UNITS } from "@/data/units";
import { globalCurrent } from "@/game/path";
import { UnitPath } from "./UnitPath";

export function LearnPage() {
  const current = globalCurrent();
  return (
    <div className="learn">
      {UNITS.map((u) => (
        <UnitPath key={u.d} unit={u} current={current} />
      ))}
      <p className="muted" style={{ textAlign: "center", fontSize: 14, margin: "0 0 20px" }}>
        Les {UNITS.length} unités sont ouvertes : avance à ton rythme, une notion dense à la fois.
      </p>
    </div>
  );
}
