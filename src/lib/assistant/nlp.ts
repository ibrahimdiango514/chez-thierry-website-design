/**
 * 🧰 OUTILS NLP — compréhension du langage naturel
 * ────────────────────────────────────────────────
 * Normalisation, tokenisation et correspondance floue (distance de
 * Levenshtein) pour tolérer les fautes d'orthographe, les abréviations
 * et les expressions courantes.
 */
import { normalize } from '../restaurantKnowledge';

export { normalize };

/** Découpe un texte en mots significatifs */
export function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter((t) => t.length > 0);
}

/** Distance de Levenshtein entre deux chaînes */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

/**
 * Correspondance floue d'une requête parmi des candidats.
 * La tolérance s'adapte à la longueur du candidat (les noms longs
 * tolèrent plus d'erreurs).
 */
export function fuzzyMatch(
  query: string,
  candidates: string[]
): { value: string; distance: number } | null {
  let best: { value: string; distance: number } | null = null;
  for (const c of candidates) {
    const dist = levenshtein(query, c);
    const maxDist = Math.max(2, Math.floor(c.length / 4));
    if (dist <= maxDist && (!best || dist < best.distance)) {
      best = { value: c, distance: dist };
    }
  }
  return best;
}

/** Recherche le candidat le plus proche (exact ou flou) et renvoie son index */
export function bestIndex(query: string, candidates: string[]): number {
  const idx = candidates.findIndex((c) => c === query);
  if (idx > -1) return idx;
  const fm = fuzzyMatch(query, candidates);
  if (fm) return candidates.indexOf(fm.value);
  return -1;
}
