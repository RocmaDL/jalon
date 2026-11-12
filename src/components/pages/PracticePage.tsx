// Page « S’entraîner » : séances libres et estimation de la mémoire par notion.

import type { CSSProperties } from "react";
import { LEX } from "@/data/lexique";
import { TOPICS } from "@/data/units";
import { openSub, startExam, startExpress, startMistakes, startWeak } from "@/game/actions";
import { seenKeys, strengthOf } from "@/game/memory";
import { D } from "@/game/state";
import { S } from "@/game/store";
import type { IconName } from "@/game/types";
import { topicKeys } from "@/lib/content";
import { plural } from "@/lib/text";
import { Icon } from "../ui/Icon";
import { FlashcardsPage } from "./FlashcardsPage";
import { LexiconPage } from "./LexiconPage";

interface PracticeCard {
  key: string;
  act: () => void;
  ic: IconName;
  c: string;
  t: string;
  s: string;
  dis?: boolean;
}

export function PracticePage() {
  if (S.sub === "flash") return <FlashcardsPage />;
  if (S.sub === "lex") return <LexiconPage />;

  const seen = seenKeys().length;
  const missed = D.missed.length;
  const cards: PracticeCard[] = [
    {
      key: "weak",
      act: startWeak,
      ic: "target",
      c: "var(--pri)",
      t: "Points faibles",
      s: seen >= 3 ? "Les 12 notions que ta mémoire perd le plus vite." : "Disponible après quelques leçons.",
      dis: seen < 3,
    },
    {
      key: "mistakes",
      act: startMistakes,
      ic: "cross",
      c: "var(--bad)",
      t: "Mes erreurs",
      s: missed ? `${plural(missed, "exercice")} raté${missed > 1 ? "s" : ""} à reprendre.` : "Aucune erreur en attente.",
      dis: !missed,
    },
    {
      key: "express",
      act: startExpress,
      ic: "clock",
      c: "var(--jcc)",
      t: "Paires express",
      s: `90 secondes pour associer un maximum de paires. Record : ${D.stats.expressBest}.`,
    },
    {
      key: "exam",
      act: startExam,
      ic: "pen",
      c: "var(--good)",
      t: "Épreuve blanche",
      s: `20 questions de cours, note sur 20, correction à la fin. ${D.stats.examBest !== null ? "Meilleure note : " + D.stats.examBest + "/20." : ""}`,
    },
    { key: "flash", act: () => openSub("flash"), ic: "cards", c: "var(--legend)", t: "Flashcards", s: `Les ${LEX.length} termes du lexique, recto verso.` },
    { key: "lex", act: () => openSub("lex"), ic: "list", c: "var(--fire)", t: "Lexique", s: "Toutes les définitions, avec recherche." },
  ];

  return (
    <div className="page">
      <h1>S&apos;entraîner</h1>
      <p className="muted" style={{ margin: "-8px 0 0" }}>
        Chaque séance terminée te rend un cœur et compte pour ta série.
      </p>
      <div className="grid2">
        {cards.map((c) => (
          <button key={c.key} className="pcard" onClick={c.act} style={{ "--c": c.c } as CSSProperties} disabled={c.dis}>
            <span className="bub">
              <Icon name={c.ic} />
            </span>
            <span>
              <b>{c.t}</b>
              <small>{c.s}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="card">
        <h3>Ce que tu retiens</h3>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Estimation par notion : la mémoire baisse avec le temps et remonte à chaque bonne réponse.
        </p>
        {TOPICS.map((t) => {
          const s = strengthOf(topicKeys(t.id));
          const p = s === null ? 0 : Math.round(s * 100);
          const color = p < 50 ? "var(--bad)" : p < 75 ? "var(--xp)" : "var(--good)";
          return (
            <div key={t.id} className="strength">
              <span>
                {t.n}{" "}
                <span className="muted" style={{ fontSize: 13 }}>
                  · J{t.d}
                </span>
              </span>
              <div className="bar">
                <i style={{ width: `${p}%`, background: color }} />
              </div>
              <span className="pc">{s === null ? "—" : p + " %"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
