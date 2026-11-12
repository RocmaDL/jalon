// Profil : statistiques, XP des 7 derniers jours, succès et réglages.

import { LEX } from "@/data/lexique";
import { ACH, achTier } from "@/game/achievements";
import { askReset, confirmReset, setGoal, setName, toggleSound, toggleUnlimited } from "@/game/actions";
import { GOALS, TIERS } from "@/game/constants";
import { mastered } from "@/game/memory";
import { liveStreak } from "@/game/progress";
import { D } from "@/game/state";
import { S } from "@/game/store";
import type { Achievement } from "@/game/types";
import { dayAdd, today } from "@/lib/dates";
import { plural } from "@/lib/text";
import { Icon } from "../ui/Icon";
import { Mascot } from "../ui/Mascot";
import { Shield } from "../ui/Shield";

const WD = ["D", "L", "M", "M", "J", "V", "S"];

function XpChart() {
  const days = Array.from({ length: 7 }, (_, i) => dayAdd(today(), i - 6));
  const vals = days.map((d) => D.xpLog[d] || 0);
  const mx = Math.max(D.goal, ...vals, 10);
  const W = 320;
  const H = 150;
  const bw = 30;
  const gap = (W - 7 * bw) / 6;
  const gy = H - 24 - (D.goal / mx) * (H - 44);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" width="100%" style={{ maxWidth: 420 }} role="img" aria-label="XP des 7 derniers jours">
      <line x1="0" x2={W} y1={gy} y2={gy} stroke="var(--xp)" strokeDasharray="4 4" strokeWidth="2" />
      <text x="0" y={gy - 6} textAnchor="start">
        objectif {D.goal} XP
      </text>
      {vals.map((v, i) => {
        const h = v ? Math.max(4, (v / mx) * (H - 44)) : 0;
        const x = i * (bw + gap);
        const [y, m, d] = days[i].split("-").map(Number);
        return (
          <g key={days[i]}>
            <rect x={x} y={H - 24 - h} width={bw} height={h} rx="6" fill={v >= D.goal ? "var(--xp)" : "var(--pri)"} />
            {v ? (
              <text x={x + bw / 2} y={H - 28 - h} textAnchor="middle">
                {v}
              </text>
            ) : null}
            <text x={x + bw / 2} y={H - 6} textAnchor="middle">
              {WD[new Date(y, m - 1, d).getDay()]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AchRow({ a }: { a: Achievement }) {
  const t = achTier(a);
  const next = a.lv[Math.min(t, 2)];
  const v = a.v();
  return (
    <div className="ach">
      <div className="med" style={{ background: `color-mix(in srgb,${a.c} ${t ? 22 : 8}%,transparent)`, color: t ? a.c : "var(--muted)" }}>
        <Icon name={a.ic} />
        {t ? <em>Niv. {t}</em> : null}
      </div>
      <div>
        <b>{a.n}</b>
        <div className="muted" style={{ fontSize: 14 }}>
          {t >= 3 ? "Niveau maximum atteint" : a.d(next)}
        </div>
        {t < 3 && (
          <div className="bar">
            <i style={{ width: `${Math.min(100, (v / next) * 100)}%`, background: a.c }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ title, desc, on, onClick }: { title: string; desc: string; on: boolean; onClick: () => void }) {
  return (
    <div className="toggle">
      <span>
        <b>{title}</b>
        <br />
        <span className="muted" style={{ fontSize: 14 }}>
          {desc}
        </span>
      </span>
      <button className="sw" onClick={onClick} aria-pressed={on} aria-label={title} />
    </div>
  );
}

function Settings() {
  return (
    <div className="card">
      <h3>Réglages</h3>
      <label className="muted" htmlFor="pname" style={{ fontSize: 14 }}>
        Pseudo dans la ligue
      </label>
      <input
        className="input"
        id="pname"
        maxLength={20}
        defaultValue={D.name}
        placeholder="Ton pseudo"
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>
          Objectif quotidien
        </div>
        <div className="seg">
          {GOALS.map(([g, label]) => (
            <button key={g} className={`segb ${D.goal === g ? "on" : ""}`} onClick={() => setGoal(g)}>
              {label} · {g} XP
            </button>
          ))}
        </div>
      </div>
      <Toggle title="Effets sonores" desc="Sons de bonne et mauvaise réponse." on={D.sound} onClick={toggleSound} />
      <Toggle
        title="Cœurs illimités"
        desc="Les erreurs ne coûtent plus de cœur. Pratique la veille de l'examen."
        on={D.unlimited}
        onClick={toggleUnlimited}
      />
      <div className="toggle">
        <span>
          <b>Remettre à zéro</b>
          <br />
          <span className="muted" style={{ fontSize: 14 }}>
            Efface XP, série, mémoire et progression.
          </span>
        </span>
        {S.resetAsk ? (
          <span className="row">
            <button className="b3 sm ghost" onClick={() => askReset(false)}>
              Annuler
            </button>
            <button className="b3 sm bad" onClick={confirmReset}>
              Effacer
            </button>
          </span>
        ) : (
          <button className="b3 sm ghost" onClick={() => askReset(true)}>
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const m = mastered();
  return (
    <div className="page">
      <div className="row" style={{ gap: 16 }}>
        <Mascot mood="happy" size={80} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ fontSize: 28 }}>{D.name || "Sans pseudo"}</h1>
          <p className="muted" style={{ margin: 0 }}>
            Module Management de projets · {plural(m, "terme")} maîtrisé{m > 1 ? "s" : ""} sur {LEX.length}
          </p>
        </div>
      </div>
      <div className="stats4">
        <div className="stat">
          <Icon name="flame" color="var(--fire)" />
          <div>
            <b>{liveStreak()}</b>
            <small>Série (record {D.best})</small>
          </div>
        </div>
        <div className="stat">
          <Icon name="bolt" color="var(--xp)" />
          <div>
            <b>{D.xp}</b>
            <small>XP au total</small>
          </div>
        </div>
        <div className="stat">
          <Shield tier={D.league.tier} size={26} />
          <div>
            <b>{TIERS[D.league.tier]}</b>
            <small>Ligue actuelle</small>
          </div>
        </div>
        <div className="stat">
          <Icon name="pen" color="var(--good)" />
          <div>
            <b>{D.stats.examBest !== null ? D.stats.examBest + "/20" : "—"}</b>
            <small>Épreuve blanche</small>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Ces 7 derniers jours</h3>
        <XpChart />
      </div>
      <div className="card" style={{ gap: 0 }}>
        <h3 style={{ marginBottom: 8 }}>Succès</h3>
        {ACH.map((a) => (
          <AchRow key={a.id} a={a} />
        ))}
      </div>
      <Settings />
    </div>
  );
}
