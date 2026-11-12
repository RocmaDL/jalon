// Mémo, la mascotte post-it.

import type { Mood } from "@/game/types";

const K = "#29303d";

function Eyes({ mood }: { mood: Mood }) {
  switch (mood) {
    case "sleepy":
      return <path d="M33 47q6 5 12 0M59 47q6 5 12 0" stroke={K} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
    case "sad":
      return (
        <>
          <circle cx="39" cy="49" r="5" fill={K} />
          <circle cx="65" cy="49" r="5" fill={K} />
          <path d="M31 40l12 4M73 40l-12 4" stroke={K} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "wow":
      return (
        <>
          <circle cx="39" cy="46" r="7.5" fill="#fff" stroke={K} strokeWidth="3" />
          <circle cx="39" cy="47" r="3.6" fill={K} />
          <circle cx="65" cy="46" r="7.5" fill="#fff" stroke={K} strokeWidth="3" />
          <circle cx="65" cy="47" r="3.6" fill={K} />
        </>
      );
    default:
      return (
        <>
          <circle cx="39" cy="46" r="5.6" fill={K} />
          <circle cx="65" cy="46" r="5.6" fill={K} />
          <circle cx="41" cy="44" r="1.8" fill="#fff" />
          <circle cx="67" cy="44" r="1.8" fill="#fff" />
        </>
      );
  }
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case "proud":
      return (
        <>
          <path d="M38 57q14 18 28 0z" fill={K} />
          <path d="M45 64q7 4 14 0" fill="#ff7b8a" />
        </>
      );
    case "sad":
      return <path d="M43 67q9-8 18 0" stroke={K} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
    case "wow":
      return <ellipse cx="52" cy="64" rx="6" ry="7.5" fill={K} />;
    case "sleepy":
      return (
        <>
          <path d="M46 63h12" stroke={K} strokeWidth="3.6" strokeLinecap="round" />
          <text x="78" y="22" fontSize="16" fontWeight="700" fill={K} opacity=".6">
            z
          </text>
        </>
      );
    default:
      return <path d="M42 59q10 10 20 0" stroke={K} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
  }
}

export function Mascot({ mood = "happy", size = 90 }: { mood?: Mood; size?: number }) {
  const armsUp = mood === "proud" || mood === "wow";
  return (
    <svg viewBox="-6 0 116 108" width={size} height={Math.round((size * 108) / 116)} className="mascot" aria-hidden="true">
      <path
        d={armsUp ? "M14 56 3 38M90 56l11-18" : "M14 62 5 72M90 62l9 10"}
        stroke="var(--note-deep)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M12 10h80v66L72 96H12z" fill="var(--note)" />
      <path d="M92 76H72v20z" fill="var(--note-deep)" />
      <rect x="12" y="10" width="80" height="11" fill="var(--note-deep)" opacity=".45" />
      <circle cx="29" cy="58" r="5" fill="#ff8fa3" opacity=".5" />
      <circle cx="75" cy="58" r="5" fill="#ff8fa3" opacity=".5" />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
    </svg>
  );
}
