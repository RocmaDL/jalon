// Questions pédagogiques construites à partir du lexique des supports.
import type { QcmItem } from "./types";
import { LEX } from "./lexique";
import { TOPICS } from "./units";

const firstSentence = (text: string): string => text.split(/(?<=\.)\s/)[0];
const topicDay = Object.fromEntries(TOPICS.map((topic) => [topic.id, topic.d]));

const question = (term: string): string => {
  const lower = term.toLowerCase();
  if (lower.startsWith("use") || lower === "signals" || lower.includes("redux") || lower === "zustand")
    return `Quel est le rôle de « ${term} » ?`;
  if (lower.includes("ci") || lower.includes("cd") || lower === "pipeline" || lower === "build" || lower === "lint")
    return `Que fait « ${term} » dans un projet ?`;
  if (lower.includes("lcp") || lower.includes("cls") || lower.includes("inp"))
    return `Que mesure « ${term} » ?`;
  return `Que signifie « ${term} » ?`;
};

export const COURSE_QCM: QcmItem[] = LEX.map((entry, index) => {
  const day = topicDay[entry.t];
  const related = LEX.filter((candidate, candidateIndex) => {
    return candidateIndex !== index && topicDay[candidate.t] === day;
  });
  const distractors = related.slice(0, 3).map((candidate) => firstSentence(candidate.x));
  return {
    t: entry.t,
    q: question(entry.n),
    ok: firstSentence(entry.x),
    ko: distractors,
    e: entry.x,
  };
});
