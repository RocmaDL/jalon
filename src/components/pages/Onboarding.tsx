// Premier lancement : pseudo de ligue et objectif quotidien.

import { useState } from "react";
import { finishOnboarding } from "@/game/actions";
import { GOALS } from "@/game/constants";
import { Mascot } from "../ui/Mascot";

const MINUTES = [5, 10, 15, 20];

export function Onboarding() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(20);
  return (
    <div className="onb">
      <Mascot mood="proud" size={120} />
      <h1>Salut, moi c&apos;est Mémo.</h1>
      <p>
        Je vais t&apos;aider à réviser JavaScript et React, un petit peu chaque jour. Sept journées thématiques et des
        exercices variés.
      </p>
      <div className="card" style={{ width: "100%", textAlign: "left" }}>
        <label htmlFor="obname" style={{ font: "600 16px var(--f-d)" }}>
          Ton pseudo pour la ligue
        </label>
        <input
          className="input"
          id="obname"
          maxLength={20}
          placeholder="Par exemple Rocma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="card" style={{ width: "100%", textAlign: "left" }}>
        <h3>Combien de temps par jour ?</h3>
        <div className="goals">
          {GOALS.map(([g, label], i) => (
            <button key={g} className={`segb ${goal === g ? "on" : ""}`} onClick={() => setGoal(g)}>
              <span>{label}</span>
              <span className="muted">
                {g} XP · environ {MINUTES[i]} min
              </span>
            </button>
          ))}
        </div>
      </div>
      <button className="b3 wide" onClick={() => finishOnboarding(name, goal)}>
        C&apos;est parti
      </button>
    </div>
  );
}
