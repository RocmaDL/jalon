// Semaine en cours : jours de série (flamme) et jours protégés par un gel.

import { D } from "@/game/state";
import { today, weekDays } from "@/lib/dates";
import { Icon } from "./Icon";

const LAB = ["L", "M", "M", "J", "V", "S", "D"];

export function WeekRow() {
  const td = today();
  return (
    <div className="week">
      {weekDays().map((k, i) => {
        const on = D.days.includes(k);
        const fz = D.frozen.includes(k);
        return (
          <div key={k} className={`wd ${on ? "on" : fz ? "fz" : ""} ${k === td ? "today" : ""}`}>
            <span>{LAB[i]}</span>
            <i>{on ? <Icon name="flame" color="#fff" /> : fz ? <Icon name="snow" color="var(--pri)" /> : null}</i>
          </div>
        );
      })}
    </div>
  );
}
