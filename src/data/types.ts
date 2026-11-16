// Types du contenu pédagogique. Les clés courtes sont celles du fichier d’origine.

/** Journée de cours (unité du parcours). */
export interface Unit {
  /** Numéro d'unité du parcours. */
  d: number;
  /** Intitulé. */
  n: string;
  /** Les sept idées clés affichées dans le guide. */
  ideas: string[];
}

/** Notion rattachée à une journée. */
export interface Topic {
  id: string;
  d: number;
  n: string;
}

export interface LexEntry {
  t: string;
  n: string;
  x: string;
}

export interface QcmItem {
  t: string;
  q: string;
  ok: string;
  ko: string[];
  e: string;
}

export interface TrueFalseItem {
  t: string;
  s: string;
  v: boolean;
  e: string;
}

export interface BlankItem {
  t: string;
  a: string;
  ok: string;
  b: string;
  ko: string[];
  e: string;
}

export interface OrderItem {
  t: string;
  p: string;
  items: string[];
  e: string;
}
