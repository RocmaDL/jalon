// Écran de séance : en-tête, exercice courant et bandeau de correction.

import { LS } from "@/game/store";
import type { Exercise, Session } from "@/game/types";
import { Icon } from "../ui/Icon";
import { BlankExercise } from "./BlankExercise";
import { ChoiceExercise } from "./ChoiceExercise";
import { FeedbackBar } from "./FeedbackBar";
import { ConfirmQuit, FailScreen, NoHearts } from "./InterruptScreens";
import { LessonHeader } from "./LessonHeader";
import { OrderExercise } from "./OrderExercise";
import { PairsExercise } from "./PairsExercise";
import { PostScreen } from "./PostScreen";
import { TypeExercise } from "./TypeExercise";

function ExerciseTag({ ex }: { ex: Exercise }) {
  const cls = ex.retry ? "retry" : ex.isNew ? "new" : "";
  return (
    <div className={`etag ${cls}`}>
      {ex.retry ? (
        <>
          <Icon name="cross" />
          Erreur précédente
        </>
      ) : ex.isNew ? (
        <>
          <Icon name="star" />
          Nouveau terme
        </>
      ) : (
        ex.tag
      )}
    </div>
  );
}

function ExerciseBody({ ex, chk, ls }: { ex: Exercise; chk: boolean; ls: Session }) {
  const ok = !!ls.res;
  switch (ex.type) {
    case "choice":
    case "tf":
      return <ChoiceExercise ex={ex} chk={chk} />;
    case "blank":
      return <BlankExercise ex={ex} chk={chk} ok={ok} />;
    case "order":
      return <OrderExercise ex={ex} chk={chk} ok={ok} />;
    case "type":
      return <TypeExercise ex={ex} chk={chk} ok={ok} />;
    case "pairs":
      return <PairsExercise ex={ex} chk={chk} express={!!ls.express} matches={ls.matches} />;
  }
}

export function Lesson() {
  const ls = LS;
  if (!ls) return null;
  if (ls.state === "post") return <PostScreen ls={ls} />;
  if (ls.state === "fail") return <FailScreen />;
  if (ls.confirm)
    return (
      <div className="lwrap">
        <LessonHeader ls={ls} />
        <ConfirmQuit ls={ls} />
      </div>
    );
  if (ls.state === "nohearts")
    return (
      <div className="lwrap">
        <LessonHeader ls={ls} />
        <NoHearts />
      </div>
    );

  const ex = ls.queue[0];
  if (!ex) return null;
  const chk = ls.phase === "chk";
  return (
    <div className="lwrap">
      <LessonHeader ls={ls} />
      <div className="combo">{!ls.exam && ls.combo >= 3 ? `${ls.combo} d'affilée` : ""}</div>
      <ExerciseTag ex={ex} />
      <ExerciseBody ex={ex} chk={chk} ls={ls} />
      {!ls.express && <FeedbackBar ex={ex} chk={chk} ls={ls} />}
    </div>
  );
}
