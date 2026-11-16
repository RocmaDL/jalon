import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface PlayerScore {
  id: string;
  name: string;
  week: string;
  tier: number;
  xp: number;
  updatedAt: string;
}

interface LeaderboardStore {
  players: PlayerScore[];
}

interface StoredFile {
  store: LeaderboardStore;
  sha?: string;
}

const localFile = path.join(process.cwd(), "src/data/leaderboard.json");
const githubRepo = process.env.GITHUB_REPOSITORY;
const githubToken = process.env.GITHUB_TOKEN;
const githubBranch = process.env.GITHUB_BRANCH || "main";
const githubPath = process.env.LEADERBOARD_PATH || "src/data/leaderboard.json";

const githubHeaders = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${githubToken}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

function isStore(value: unknown): value is LeaderboardStore {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as LeaderboardStore).players)
  );
}

async function readLeaderboard(): Promise<StoredFile> {
  if (githubRepo && githubToken) {
    const url = `https://api.github.com/repos/${githubRepo}/contents/${githubPath}?ref=${encodeURIComponent(githubBranch)}`;
    const response = await fetch(url, { headers: githubHeaders, cache: "no-store" });
    if (response.status === 404) return { store: { players: [] } };
    if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`);
    const data = (await response.json()) as { content?: string; sha?: string };
    const decoded = data.content ? Buffer.from(data.content, "base64").toString("utf8") : "";
    const parsed: unknown = decoded ? JSON.parse(decoded) : { players: [] };
    return { store: isStore(parsed) ? parsed : { players: [] }, sha: data.sha };
  }

  try {
    const parsed: unknown = JSON.parse(await readFile(localFile, "utf8"));
    return { store: isStore(parsed) ? parsed : { players: [] } };
  } catch {
    return { store: { players: [] } };
  }
}

async function writeLeaderboard(store: LeaderboardStore, sha?: string): Promise<void> {
  const content = JSON.stringify(store, null, 2) + "\n";
  if (githubRepo && githubToken) {
    const url = `https://api.github.com/repos/${githubRepo}/contents/${githubPath}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { ...githubHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "chore: update shared leaderboard",
        content: Buffer.from(content).toString("base64"),
        branch: githubBranch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!response.ok) throw new Error(`GitHub write failed: ${response.status}`);
    return;
  }

  await writeFile(localFile, content, "utf8");
}

function publicPlayers(store: LeaderboardStore, week: string, tier: number): PlayerScore[] {
  return store.players
    .filter((player) => player.week === week && player.tier === tier)
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .slice(0, 100);
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const week = url.searchParams.get("week") || "";
    const tier = Number(url.searchParams.get("tier") || 0);
    if (!/^\d{4}-W\d{2}$/.test(week) || !Number.isInteger(tier) || tier < 0 || tier > 9) {
      return Response.json({ error: "Paramètres de ligue invalides." }, { status: 400 });
    }
    const { store } = await readLeaderboard();
    return Response.json({ players: publicPlayers(store, week, tier) });
  } catch {
    return Response.json({ error: "Classement indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as Partial<PlayerScore>;
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 20) : "";
    const week = typeof body.week === "string" ? body.week : "";
    const tier = Number(body.tier);
    const xp = Number(body.xp);
    if (
      !id ||
      !name ||
      !/^\d{4}-W\d{2}$/.test(week) ||
      !Number.isInteger(tier) ||
      tier < 0 ||
      tier > 9 ||
      !Number.isFinite(xp) ||
      xp < 0
    ) {
      return Response.json({ error: "Score invalide." }, { status: 400 });
    }

    const stored = await readLeaderboard();
    const player: PlayerScore = { id, name, week, tier, xp: Math.round(xp), updatedAt: new Date().toISOString() };
    const index = stored.store.players.findIndex((entry) => entry.id === id && entry.week === week && entry.tier === tier);
    if (index >= 0) stored.store.players[index] = player;
    else stored.store.players.push(player);
    stored.store.players = stored.store.players.slice(-500);
    await writeLeaderboard(stored.store, stored.sha);
    return Response.json({ players: publicPlayers(stored.store, week, tier) });
  } catch {
    return Response.json({ error: "Impossible d'enregistrer le score." }, { status: 503 });
  }
}
