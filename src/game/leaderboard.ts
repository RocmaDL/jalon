import { weekId } from "@/lib/dates";
import { D } from "./state";

export interface SharedPlayer {
  id: string;
  name: string;
  xp: number;
}

async function request(path: string, init?: RequestInit): Promise<SharedPlayer[]> {
  const response = await fetch(path, init);
  if (!response.ok) throw new Error(`Leaderboard request failed: ${response.status}`);
  const data = (await response.json()) as { players?: SharedPlayer[] };
  return data.players || [];
}

export function syncScore(): Promise<SharedPlayer[]> {
  if (!D.onboard || !D.playerId || !D.name) return Promise.resolve([]);
  const week = weekId();
  return request("/api/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: D.playerId,
      name: D.name,
      week,
      tier: D.league.tier,
      xp: D.league.weekXp,
    }),
  });
}

export function fetchScores(): Promise<SharedPlayer[]> {
  return request(`/api/leaderboard?week=${encodeURIComponent(weekId())}&tier=${D.league.tier}`);
}
