/**
 * 📚 SOURCE DE CONNAISSANCES DU RESTAURANT — Chez Thierry x Le Palmier
 * ───────────────────────────────────────────────────────────────────
 * TOUTES les informations de l'assistant proviennent d'ici, et cette source
 * est alimentée directement par les données du site (src/data.ts) + les
 * informations affichées sur le site (contacts, horaires, spécialité).
 *
 * → Si un prix, un nom, une description ou une catégorie change dans
 *   src/data.ts, l'assistant l'utilise automatiquement. Aucune donnée
 *   n'est dupliquée en dur dans les réponses.
 *
 * Dans le futur, cette source locale pourra être remplacée par un agent
 * IA externe (n8n) — voir ASSISTANT_CONFIG.webhookUrl — l'interface
 * utilisateur restera identique.
 */
import { RESTAURANT_MENU, ROOFTOP_MENU, RESTAURANT_SPECIAL_DISH } from '../data';
import { MenuItem } from '../types';

export type Establishment = 'restaurant' | 'rooftop';

export interface KnowledgeItem {
  item: MenuItem;
  section: Establishment;
}

/* ── Contacts & informations (affichés sur le site) ─────────────────── */

export const RESTAURANT_PHONE_DISPLAY = '+223 66 42 77 77';
export const RESTAURANT_PHONE_TEL = '+22366427777';
export const ROOFTOP_PHONE_DISPLAY = '+223 76 22 27 77';
export const ROOFTOP_PHONE_TEL = '+22376222777';
export const RESTAURANT_WHATSAPP = '22366427777';
export const ROOFTOP_WHATSAPP = '22376222777';
export const ADDRESS = 'Rue 548, Quinzambougou, Bamako, Mali';
export const EMAIL = 'chezthierryresto@gmail.com';
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Chez+Thierry,+Rue+548,+Quinzambougou,+Bamako,+Mali';

/** Horaires affichés sur le site principal (Restaurant) */
export const RESTAURANT_HOURS: { day: string; hours: string }[] = [
  { day: 'Lundi', hours: 'Fermé' },
  { day: 'Mardi', hours: '18h30 - 23h30' },
  { day: 'Mercredi', hours: '18h30 - 23h30' },
  { day: 'Jeudi', hours: '18h30 - 23h30' },
  { day: 'Vendredi', hours: '18h30 - 00h00' },
  { day: 'Samedi', hours: '18h30 - 00h00' },
  { day: 'Dimanche', hours: '18h30 - 23h30' },
];

/** Horaires affichés sur le site principal (Rooftop) */
export const ROOFTOP_HOURS: { day: string; hours: string }[] = [
  { day: 'Lundi', hours: 'Fermé' },
  { day: 'Mardi', hours: '18h30 - 00h00' },
  { day: 'Mercredi', hours: '18h30 - 00h00' },
  { day: 'Jeudi', hours: '18h30 - 00h00' },
  { day: 'Vendredi', hours: '18h30 - 02h00' },
  { day: 'Samedi', hours: '18h30 - 02h00' },
  { day: 'Dimanche', hours: '18h30 - 00h00' },
];

export const RESTAURANT_SPECIAL_NOTE =
  'Le Couscous Royal est disponible uniquement le dimanche midi (12h-15h).';

/* ── Toute la carte, avec la section de chaque plat ──────────────────── */

export const ALL_ITEMS: KnowledgeItem[] = [
  ...RESTAURANT_MENU.map((item) => ({ item, section: 'restaurant' as const })),
  ...ROOFTOP_MENU.map((item) => ({ item, section: 'rooftop' as const })),
];

/** Spécialité (Couscous Royal) — donnée dans src/data.ts */
export const SPECIAL_DISH: KnowledgeItem = {
  item: RESTAURANT_SPECIAL_DISH,
  section: 'restaurant',
};

/** Pool de recherche : toute la carte + les spécialités (Couscous Royal) */
const SEARCH_POOL: KnowledgeItem[] = [...ALL_ITEMS, SPECIAL_DISH];

/* ── Utilitaires de recherche dans les données ──────────────────────── */

/** Normalise un texte pour la recherche (minuscules, sans accents) */
export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const formatPrice = (n: number): string => `${n.toLocaleString('fr-FR')} F`;

/** Catégories uniques de tous les plats */
export const allCategories = (): string[] =>
  Array.from(new Set(ALL_ITEMS.map((k) => k.item.category)));

/** Trouve les plats correspondant à une requête (le plus long nom matchant d'abord) */
export function findItems(query: string): KnowledgeItem[] {
  const nq = normalize(query);
  if (!nq) return [];

  // 1) Match le plus précis : le nom complet du plat est contenu dans la requête
  const byName = SEARCH_POOL.filter((k) => {
    const n = normalize(k.item.name);
    return nq.includes(n) && n.length > 1;
  }).sort((a, b) => normalize(b.item.name).length - normalize(a.item.name).length);

  if (byName.length > 0) return byName;

  // 2) Sinon : correspondance par mots significatifs
  const tokens = nq.split(' ').filter((t) => t.length > 2);
  if (tokens.length === 0) return [];

  return SEARCH_POOL.map((k) => {
    const hay = normalize(`${k.item.name} ${k.item.description ?? ''} ${k.item.composants ?? ''} ${k.item.category}`);
    const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { k, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.k);
}

/** Trouve les plats d'une catégorie (toutes sections confondues) */
export function itemsByCategory(category: string): KnowledgeItem[] {
  return ALL_ITEMS.filter((k) => k.item.category === category);
}

/** Formats les horaires d'un tableau en texte lisible */
export function formatHours(rows: { day: string; hours: string }[]): string {
  return rows
    .map((r) => `• ${r.day} : ${r.hours}`)
    .join('\n');
}

/** Petite description d'un plat (nom — prix, section) */
export function describeItem(k: KnowledgeItem, detail = false): string {
  const sectionLabel = k.section === 'restaurant' ? '🍽️ Restaurant' : '🌇 Rooftop';
  let out = `• ${k.item.name} — ${formatPrice(k.item.price)} (${sectionLabel})`;
  if (detail && k.item.description) out += `\n   ${k.item.description}`;
  if (detail && k.item.composants) out += `\n   📋 ${k.item.composants}`;
  return out;
}
