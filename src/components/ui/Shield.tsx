// Écusson de ligue, numéroté et coloré selon le niveau.

import { TIERC } from "@/game/constants";

export function Shield({ tier, size = 46 }: { tier: number; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={Math.round(size * 1.1)} className="shield" aria-hidden="true">
      <path d="M12 1.5 3.5 4.6v6.6c0 5.3 3.6 9.9 8.5 11.3 4.9-1.4 8.5-6 8.5-11.3V4.6z" fill={TIERC[tier]} />
      <path d="M12 4 6 6.2v5c0 3.9 2.6 7.3 6 8.4" fill="rgba(255,255,255,.22)" />
      <text x="12" y="15" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--f-d)" }}>
        {tier + 1}
      </text>
    </svg>
  );
}
