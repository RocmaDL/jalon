// Dates au format « AAAA-MM-JJ » en heure locale.

export const dkey = (d: Date): string =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

export const today = (): string => dkey(new Date());

const parse = (k: string): Date => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};

export const dayAdd = (k: string, n: number): string => {
  const [y, m, d] = k.split("-").map(Number);
  return dkey(new Date(y, m - 1, d + n, 12));
};

export const dayDiff = (a: string, b: string): number =>
  Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);

/** Lundi 0 h de la semaine contenant la date. */
export const weekStartOf = (k: string): Date => {
  const [y, m, d] = k.split("-").map(Number);
  const x = new Date(y, m - 1, d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  x.setHours(0, 0, 0, 0);
  return x;
};

export const weekId = (): string => dkey(weekStartOf(today()));

/** Les sept jours (lundi → dimanche) de la semaine en cours. */
export const weekDays = (): string[] => {
  const ws = weekStartOf(today());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws);
    d.setDate(d.getDate() + i);
    return dkey(d);
  });
};

/** Millisecondes avant minuit. */
export const msToMidnight = (): number => {
  const mid = new Date();
  mid.setHours(24, 0, 0, 0);
  return mid.getTime() - Date.now();
};
