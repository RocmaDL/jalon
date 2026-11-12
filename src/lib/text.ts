// Outils de texte : normalisation des réponses saisies, distance d’édition, formats.

/** Minuscules, sans accents ni ponctuation, espaces simples. */
export const norm = (s: string): string =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[-–—_/]/g, " ")
    .replace(/[^a-z0-9' ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Distance de Levenshtein, plafonnée à 9 si les longueurs diffèrent de plus de 2. */
export function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 9;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return d[m][n];
}

export const plural = (n: number, s: string, p?: string): string =>
  n + " " + (n > 1 ? p || s + "s" : s);

/** Millisecondes → « m:ss ». */
export const fmtMin = (ms: number): string => {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  return m + ":" + String(s % 60).padStart(2, "0");
};

export const ordinal = (rank: number): string => rank + (rank === 1 ? "er" : "e");
