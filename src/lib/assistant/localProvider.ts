/**
 * 🧠 MOTEUR CONVERSATIONNEL LOCAL — agent de restaurant
 * ──────────────────────────────────────────────────────
 * Comprend le langage naturel (fautes d'orthographe, expressions courantes),
 * conserve le contexte sur toute la conversation, connaît le restaurant via
 * restaurantKnowledge (données du site) et agit sur le panier — uniquement
 * après validation explicite du client.
 *
 * Ce moteur sera remplacé par un vrai LLM via n8n (même interface) : le
 * ProviderContext/ProviderResult est sérialisable et déjà transmis au webhook.
 */
import { ASSISTANT_CONFIG } from '../../config/assistant';
import {
  ALL_ITEMS,
  SPECIAL_DISH,
  itemsByCategory,
  normalize,
  formatPrice,
  describeItem,
  formatHours,
  RESTAURANT_HOURS,
  ROOFTOP_HOURS,
  RESTAURANT_PHONE_DISPLAY,
  ROOFTOP_PHONE_DISPLAY,
  ADDRESS,
  EMAIL,
  MAPS_URL,
  RESTAURANT_SPECIAL_NOTE,
  Establishment,
  KnowledgeItem,
} from '../restaurantKnowledge';
import { tokenize, fuzzyMatch } from './nlp';
import type {
  AssistantAction,
  AssistantState,
  CartEntry,
  ProviderContext,
  ProviderResult,
} from './types';

/* ── Constantes de langage ───────────────────────────────────────────── */

const CONFIRM = /^(oui|ok|d'accord|dac|dacc|vas-y|vas y|bien sur|bien sûr|yep|ouais|carrément|si|ajoute|ajoute-le|retire-le|vas-y)$/;
const DENY = /^(non|non merci|pas maintenant|plus tard|annule|non ça|négatif|non pas ça|non je ne pense pas)$/;

const ADD_VERB = /(je voudrais|je voudrai|je veux|j'aimerais|j'aimerai|je vais prendre|je prends|je prendrai|ajoute|ajouter|ajoutez|mets|mettre|commande|commander|prendre|prend|ajouté)/;
const REMOVE_VERB = /(retire|retirer|enleve|enlève|supprime|supprimer|virer|enlever|ôte|ot )/;
const QTY_VERB = /(mets-en|mets en|met-en|met en|change la quantit|quantité|quantite|en plus|encore un|encore une|double)/;
const DETAIL_INTENT = /(c'est quoi|c est quoi|detail|détail|ingrédient|ingredient|composant|avec quoi|dedans|contenu|composition|contient)/;
const PRICE_INTENT = /(combien|prix|coute|coûte|tarif|ça fait)/;
const COMPARE_INTENT = /(vs |versus|compare|comparer|différence|difference|diff )/;
const PAIR_INTENT = /(avec quoi|quelle boisson|en accompagnement|accompagnement|association|quel vin|quelle boisson)/;
const CLEAR_INTENT = /(vider|vide le panier|vide mon panier|tout retirer|tout enlever|vide)/;

const NUMBERS: Record<string, number> = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
};

/* ── Helpers ─────────────────────────────────────────────────────────── */

const HELP_TEXT = `Voici ce que je peux faire pour vous :
• « Le menu » — je présente toute la carte
• « Recommande-moi » — une suggestion selon vos goûts
• « Je voudrais une pizza Reine » — je l'ajoute à votre panier
• « Retire la pizza » / « mets-en 3 » — je modifie votre panier
• « Compare X et Y » — je compare deux plats
• « Un menu complet » — entrée + plat + dessert + boisson
• « Couscous » — la spécialité du dimanche
• « Horaires », « Adresse », « Téléphone » — les infos pratiques`;

const greet = () => {
  const h = new Date().getHours();
  return h >= 5 && h < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

function parseQuantity(text: string): number {
  const m = text.match(/\b(\d{1,2})\b/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 20) return n;
  }
  if (/(double|2x|x2)/.test(text)) return 2;
  for (const [w, n] of Object.entries(NUMBERS)) if (text.includes(w)) return n;
  return 1;
}

/** Pool de recherche : carte complète + spécialité (Couscous Royal) */
const SEARCH_POOL: KnowledgeItem[] = [...ALL_ITEMS, SPECIAL_DISH];

const nameOf = (k: KnowledgeItem) => normalize(k.item.name);
const wordsOf = (s: string) => normalize(s).split(' ').filter((w) => w.length >= 3);

/**
 * Extraction d'un plat PRÉCIS évoqué par son nom.
 * Robuste : mots du nom, fautes d'orthographe (distance de Levenshtein).
 * N'utilise PAS la catégorie (évite les faux positifs).
 */
function extractDishByName(text: string): KnowledgeItem[] {
  const norm = normalize(text);
  const found: KnowledgeItem[] = [];

  // A) Nom complet (ou sous-chaîne de mots) contenu dans la phrase
  const byContain = SEARCH_POOL.filter((k) => {
    const n = nameOf(k);
    return n.length > 2 && norm.includes(n);
  }).sort((a, b) => nameOf(b).length - nameOf(a).length);
  found.push(...byContain);

  // B) Mots du nom présents dans la phrase ('couscous' → 'Couscous Royal')
  if (found.length === 0) {
    const words = new Set(wordsOf(norm));
    for (const k of SEARCH_POOL) {
      const nameWords = wordsOf(k.item.name);
      if (nameWords.length === 0) continue;
      const hits = nameWords.filter((w) => words.has(w) || norm.includes(w));
      if (hits.length > 0 && hits.length >= Math.min(1, Math.ceil(nameWords.length / 2))) {
        found.push(k);
      }
    }
  }

  // C) Correspondance floue (fautes d'orthographe : 'piza' → Marguerita…)
  if (found.length === 0) {
    const tokens = tokenize(text).filter((t) => t.length >= 4);
    const names = SEARCH_POOL.map(nameOf);
    for (const tok of tokens) {
      const fm = fuzzyMatch(tok, names);
      if (fm) {
        const k = SEARCH_POOL.find((x) => nameOf(x) === fm.value);
        if (k && !found.some((f) => f.item.id === k.item.id)) found.push(k);
      }
    }
  }

  return found.filter((k, i, arr) => arr.findIndex((x) => x.item.id === k.item.id) === i);
}

/** Recherche par mots-clés dans nom + description + composants (fallback) */
function searchByWords(text: string): KnowledgeItem[] {
  const sig = wordsOf(text);
  if (sig.length === 0) return [];
  const scored = SEARCH_POOL.map((k) => ({
    k,
    score: sig.reduce(
      (s, t) =>
        s +
        (normalize(`${k.item.name} ${k.item.description ?? ''} ${k.item.composants ?? ''}`).includes(t)
          ? 1
          : 0),
      0
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map((r) => r.k);
}

/** Détection d'une catégorie évoquée */
function findCategory(text: string): string | null {
  const norm = normalize(text);
  const cats = Array.from(new Set(ALL_ITEMS.map((k) => k.item.category)));
  const exact = cats.find((c) => norm.includes(normalize(c)));
  if (exact) return exact;
  if (norm.includes('pizza')) return 'Pizzas';
  if (norm.includes('entree')) return 'Entrées';
  if (norm.includes('dessert')) return 'Desserts';
  if (norm.includes('mocktail')) return 'Mocktails - Sans alcool';
  if (norm.includes('cocktail')) return 'Cocktails - Avec alcool';
  if (norm.includes('vin') || norm.includes('pichet') || norm.includes('ballon')) return 'Vins bouteilles';
  if (norm.includes('burger') || norm.includes('smash') || norm.includes('frit')) return 'Burgers & Fried Food';
  if (norm.includes('grill') || norm.includes('brochette') || norm.includes('carpe')) return 'Grill & African Touch';
  return null;
}

/** Détection d'une préférence (recommandation) */
function detectPreference(text: string): string | null {
  const n = normalize(text);
  if (/(leger|legere|sante|frais|salade|vegetarien|veggie|sans viande|vegan)/.test(n)) return 'leger';
  if (/(viande|boeuf|steak|grillade|brochette)/.test(n)) return 'viande';
  if (/(poulet|volaille)/.test(n)) return 'poulet';
  if (/(poisson|mer|crevette|carpe|fruits de mer)/.test(n)) return 'poisson';
  if (/(epice|releve|piquant|fort|piment)/.test(n)) return 'epice';
  if (/(sucre|sucree|dessert|chocolat|glace|gourmand)/.test(n)) return 'sucre';
  if (/(soiree|fete|cocktail|boire|apero|bar)/.test(n)) return 'soiree';
  if (/(faim|copieux|beaucoup|appetit)/.test(n)) return 'copieux';
  return null;
}

const PREFS: Record<string, { label: string; ids: string[]; note: string }> = {
  leger: { label: 'repas léger', ids: ['se1', 'se2', 'se3'], note: 'La Salade César (poulet, croûtons, parmesan) est un grand classique.' },
  viande: { label: 'viande', ids: ['pl2', 'pl1', 'rg1', 'rf1'], note: 'Le Pavé de Bœuf sauce au poivre est notre valeur sûre.' },
  poulet: { label: 'poulet', ids: ['pl4', 'lp1', 'lp2', 'rf3'], note: 'Le Poulet local braisé (frites maison, salade) est un favori.' },
  poisson: { label: 'poisson', ids: ['pl5', 'pl6', 'rg2'], note: 'La Carpe grillée du Rooftop (sauce tomate/oignon, attiéké ou alloco) vaut le détour.' },
  epice: { label: 'épicé', ids: ['p7', 'p13', 'c4'], note: 'La pizza Orientale (merguez & chorizo) est faite pour vous.' },
  sucre: { label: 'sucré', ids: ['d4', 'rd1', 'rd2', 'd1'], note: 'Le Coulant au chocolat et sa boule de glace vanille fait l\'unanimité.' },
  soiree: { label: 'soirée', ids: ['rc3', 'rc5', 'rc6', 'c5'], note: 'Le Palmier Signature (mangue, bissap, menthe, rhum) est le cocktail vedette.' },
  copieux: { label: 'copieux', ids: ['pl1', 'p11', 'rf2'], note: 'Et le dimanche, ne manquez pas notre Couscous Royal (12h-15h) !' },
};

function describeIds(ids: string[]): string {
  return ids
    .map((id) => SEARCH_POOL.find((k) => k.item.id === id))
    .filter((k): k is KnowledgeItem => Boolean(k))
    .map((k) => describeItem(k))
    .join('\n');
}

function listCategory(category: string): string {
  const all = itemsByCategory(category);
  if (all.length === 0) return '';
  const items = all.slice(0, 10);
  const more = all.length - items.length;
  return `${category} :\n${items.map((k) => describeItem(k)).join('\n')}${more > 0 ? `\n… et ${more} autres` : ''}`;
}

function menuOverview(): string {
  const restaurantCats = Array.from(new Set(ALL_ITEMS.filter((k) => k.section === 'restaurant').map((k) => k.item.category)));
  const rooftopCats = Array.from(new Set(ALL_ITEMS.filter((k) => k.section === 'rooftop').map((k) => k.item.category)));
  const count = (cat: string, sec: Establishment) =>
    ALL_ITEMS.filter((k) => k.item.category === cat && k.section === sec).length;
  return `📖 Voici notre carte :\n\n🍽️ Restaurant Chez Thierry\n${restaurantCats.map((c) => `• ${c} (${count(c, 'restaurant')})`).join('\n')}\n\n🌇 Rooftop Le Palmier\n${rooftopCats.map((c) => `• ${c} (${count(c, 'rooftop')})`).join('\n')}\n\n🌟 Spécialité : ${SPECIAL_DISH.item.name} — ${formatPrice(SPECIAL_DISH.item.price)} (${RESTAURANT_SPECIAL_NOTE})\n\nDites-moi une catégorie ou un plat pour en savoir plus !`;
}

function showCart(cart: CartEntry[]): string {
  if (cart.length === 0)
    return `Votre panier est vide pour le moment 🛒\n\nDites-moi ce que vous aimeriez commander, par exemple : « Je voudrais une pizza Marguerita ».`;
  const total = cart.reduce((s, e) => s + e.item.price * e.quantity, 0);
  const lines = cart.map((e) => `• ${e.quantity}x ${e.item.name} — ${formatPrice(e.item.price * e.quantity)}`).join('\n');
  return `🛒 Votre panier :\n${lines}\n\n💰 Total : ${formatPrice(total)}\n\nJe peux ajouter un plat, retirer un article ou modifier une quantité si vous le souhaitez.`;
}

function hoursInfo(): string {
  return `🕒 Nos horaires :\n\n🍽️ Restaurant Chez Thierry\n${formatHours(RESTAURANT_HOURS)}\n\n🌇 Rooftop Le Palmier\n${formatHours(ROOFTOP_HOURS)}\n\nℹ️ ${RESTAURANT_SPECIAL_NOTE}`;
}

function contactInfo(): string {
  return `📞 Restaurant Chez Thierry : ${RESTAURANT_PHONE_DISPLAY}\n🌇 Rooftop Le Palmier : ${ROOFTOP_PHONE_DISPLAY}\n\n📍 ${ADDRESS}\n✉️ ${EMAIL}\n\nOu commandez directement via notre Menu Digital !`;
}

/** Associations plat + boisson (données réelles du site) */
function pairingFor(k: KnowledgeItem): string {
  const cat = k.item.category;
  if (cat === 'Pizzas') return `Avec une pizza, je vous conseille un Spritz Apérol ou un Mojito 🍸\n${describeIds(['c4', 'c5'])}`;
  if (cat === 'Entrées') return `En entrée, accompagnez-la d'un Kir Royal pour bien commencer 🥂\n${describeIds(['c6'])}`;
  if (cat === 'Plats' || cat === 'Les plus de chez Thierry' || cat === 'Les temporelles')
    return `Avec ce plat, un bon verre de Côte du Rhône rouge sera parfait 🍷\n${describeIds(['v2', 'vv2'])}`;
  if (cat === 'Desserts') return `Pour accompagner ce dessert, un café ou un verre de vin doux ferait merveille ☕\n${describeIds(['vv2'])}`;
  if (cat === 'Burgers & Fried Food' || cat === 'Grill & African Touch')
    return `Côté Rooftop, je vous conseille un mocktail frais ou un cocktail signature 🍹\n${describeIds(['rm3', 'rc3'])}`;
  if (cat === 'Cocktails - Avec alcool' || cat === 'Cocktails alcoolisés')
    return `Pour accompagner, des brochettes grillées ou des tenders croustillants 🍢\n${describeIds(['rg1', 'rf4'])}`;
  return `Je peux vous proposer une boisson ou un plat qui accompagne bien ${k.item.name} — dites-moi ce qui vous ferait plaisir 😊`;
}

/** Menus complets (ids réels du site) */
const FULL_MENUS = [
  { label: 'Menu Viande', ids: ['se4', 'pl2', 'd4', 'c5'] },
  { label: 'Menu Poisson', ids: ['se2', 'pl5', 'd1', 'c1'] },
  { label: 'Menu Léger', ids: ['se1', 'lp1', 'd5', 'rm3'] },
  { label: 'Menu Rooftop', ids: ['rf2', 'rg2', 'rd2', 'rc3'] },
  { label: 'Menu Gourmand', ids: ['se3', 'pl1', 'rd1', 'rc5'] },
];

const buildAddAction = (k: KnowledgeItem, quantity: number): AssistantAction =>
  ({ type: 'addToCart', item: k.item, section: k.section, quantity });

const listSummary = (ks: KnowledgeItem[]) =>
  ks.slice(0, 5).map((d) => ({ id: d.item.id, name: d.item.name, section: d.section }));

/** Retrouve la dernière catégorie évoquée dans l'historique */
function lastCategoryFromHistory(history: { role: string; text: string }[]): string | null {
  const cats = Array.from(new Set(ALL_ITEMS.map((k) => k.item.category)));
  for (let i = history.length - 1; i >= 0; i--) {
    const t = normalize(history[i].text);
    const hit = cats.find((c) => t.includes(normalize(c)));
    if (hit) return hit;
  }
  return null;
}

/* ── Entrée du moteur ────────────────────────────────────────────────── */

export function localHandleMessage(ctx: ProviderContext): ProviderResult {
  const text = normalize(ctx.text);
  const cart = ctx.cart ?? [];
  const history = ctx.history ?? [];
  let state: AssistantState = { ...(ctx.state ?? {}) };
  const hasCartItems = cart.length > 0;
  const lastKnownCategory = state.lastCategory ?? lastCategoryFromHistory(history);

  if (!text) return { reply: `Dites-moi comment je peux vous aider 😊\n\n${HELP_TEXT}`, actions: [], state };

  /* ── 1) Validation explicite d'une action en attente ── */
  if (state.awaiting === 'confirm-action' && state.pendingAction) {
    if (CONFIRM.test(text)) {
      const action = state.pendingAction;
      const reply =
        action.type === 'addToCart'
          ? `C'est noté ! 🛒 J'ajoute ${action.quantity}x ${action.item.name} (${formatPrice(action.item.price * action.quantity)}) à votre panier.\n\nSouhaitez-vous autre chose ?`
          : action.type === 'removeFromCart'
            ? `C'est fait ! 🗑️ J'ai retiré cet article de votre panier.\n\nSouhaitez-vous autre chose ?`
            : action.type === 'updateQuantity'
              ? `C'est noté ! 🔢 Quantité mise à jour.\n\nSouhaitez-vous autre chose ?`
              : `C'est fait ! 🧹 Votre panier a été vidé.\n\nSouhaitez-vous autre chose ?`;
      return { reply, actions: [action], state: { ...state, pendingAction: undefined, awaiting: undefined } };
    }
    if (DENY.test(text)) {
      return {
        reply: `Pas de souci ! 😊 Je n'ai rien modifié. Dites-moi si vous changez d'avis.\n\n${HELP_TEXT}`,
        actions: [],
        state: { ...state, pendingAction: undefined, awaiting: undefined },
      };
    }
    state = { ...state, pendingAction: undefined, awaiting: undefined };
  }

  /* ── 2) Vider / retirer (verbes d'action prioritaires) ── */
  if (CLEAR_INTENT.test(text) || REMOVE_VERB.test(text)) {
    if (CLEAR_INTENT.test(text) && /(vider|vide|tout retirer|tout enlever)/.test(text)) {
      if (!hasCartItems) return { reply: `Votre panier est déjà vide 😊`, actions: [], state };
      const n = cart.reduce((s, e) => s + e.quantity, 0);
      return {
        reply: `Souhaitez-vous vraiment vider tout votre panier ? (${n} article${n > 1 ? 's' : ''})`,
        actions: [],
        state: { ...state, pendingAction: { type: 'clearCart' }, awaiting: 'confirm-action' },
      };
    }
    const dishes = extractDishByName(text);
    if (dishes.length > 0) {
      const target = cart.find((e) => e.item.id === dishes[0].item.id);
      if (target) {
        return {
          reply: `Je peux retirer ${dishes[0].item.name} de votre panier (${target.quantity}x). Confirmez-vous ?`,
          actions: [],
          state: { ...state, pendingAction: { type: 'removeFromCart', itemId: target.item.id }, awaiting: 'confirm-action' },
        };
      }
      return {
        reply: `Hmm, ${dishes[0].item.name} n'est pas dans votre panier actuellement.\n\n${showCart(cart)}`,
        actions: [],
        state,
      };
    }
    return {
      reply: `Quel article souhaitez-vous retirer ? Dites-moi par exemple : « Retire la pizza Reine ».\n\n${showCart(cart)}`,
      actions: [],
      state,
    };
  }

  /* ── 3) Affichage du panier ── */
  if (/(mon panier|le panier|récap|recap|contenu du panier|j'ai quoi|voir mon panier|panier$|panier \?)/.test(text))
    return { reply: showCart(cart), actions: [], state: { ...state, lastCategory: undefined } };

  /* ── 4) Modification de quantité ── */
  if (QTY_VERB.test(text) || /\b(\d{1,2})\s*x\b|\bx\s*(\d{1,2})\b/.test(text)) {
    const qty = parseQuantity(text);
    const dishes = extractDishByName(text);
    let target: CartEntry | undefined;
    if (dishes.length > 0) target = cart.find((e) => e.item.id === dishes[0].item.id);
    if (!target && state.lastMentioned) target = cart.find((e) => e.item.id === state.lastMentioned?.id);
    if (!target && cart.length === 1) target = cart[0];
    if (target) {
      return {
        reply: `Je passe ${target.item.name} à ${qty}x dans votre panier. Confirmez-vous ?`,
        actions: [],
        state: { ...state, pendingAction: { type: 'updateQuantity', itemId: target.item.id, quantity: qty }, awaiting: 'confirm-action' },
      };
    }
    return {
      reply: `Pour modifier une quantité, dites-moi quel article : « Mets-en 3 » ou « Passe la pizza à 2 ».\n\n${showCart(cart)}`,
      actions: [],
      state,
    };
  }

  /* ── 5) Salutations & petits mots ── */
  if (/(bonjour|bonsoir|salut|hello|bjr|cc|bonjour tout le monde|rebonjour)/.test(text))
    return { reply: `${greet()} Ravi de vous accueillir ! ${ASSISTANT_CONFIG.welcome}\n\n${HELP_TEXT}`, actions: [], state };
  if (/(merci|thanks|super|genial|top|parfait|au top|génial|géniale)/.test(text))
    return { reply: `Avec plaisir 😊 N'hésitez pas si vous avez une autre question, je suis là pour vous aider !`, actions: [], state };
  if (/(au revoir|a bientot|à bientôt|bye|ciao|bonne journee|bonne soirée)/.test(text))
    return { reply: `Au revoir et à bientôt chez Chez Thierry x Le Palmier ! 🌟 N'hésitez pas à revenir si besoin.`, actions: [], state };
  if (/(qui es tu|qui es-tu|tu es qui|presente toi|presente-toi|ton nom|c'est quoi toi)/.test(text))
    return { reply: `${greet()} Je suis ${ASSISTANT_CONFIG.name} 🧑‍🍳, votre guide digital de Chez Thierry x Le Palmier à Bamako.\n\n${ASSISTANT_CONFIG.welcome}`, actions: [], state };
  if (/(ca va|ça va|comment vas|comment tu vas|tu vas bien|comment allez)/.test(text))
    return { reply: `Très bien, merci ! 😊 Et vous, en quoi puis-je vous aider aujourd'hui ?\n\n${HELP_TEXT}`, actions: [], state };

  /* ── 6) « Oui » / « Non » sans action en attente ── */
  if (CONFIRM.test(text))
    return { reply: `Très bien 😊 Que puis-je faire pour vous ?\n\n${HELP_TEXT}`, actions: [], state };
  if (DENY.test(text))
    return { reply: `Pas de problème ! Dites-moi ce dont vous avez envie 😊\n\n${HELP_TEXT}`, actions: [], state };

  /* ── 7) Références à la conversation (le premier, ça, ce plat…) ── */
  if (/(le premier|le 1er|la premiere|la première|le deuxième|le 2e|la deuxieme|la deuxième|le troisieme|le troisième|le dernier|celui-là|celui la|celle-là|celle la|ce plat|ce cocktail|ce dessert|ce burger|cette pizza)/.test(text)) {
    const list = state.lastList ?? [];
    let target: { id: string; name: string; section: Establishment } | undefined;
    if (/(premier|1er)/.test(text)) target = list[0];
    else if (/(deuxieme|deuxième|2e)/.test(text)) target = list[1];
    else if (/(troisieme|troisième|3e)/.test(text)) target = list[2];
    else if (/(dernier)/.test(text)) target = list[list.length - 1];
    else target = state.lastMentioned;
    if (target) {
      const k = SEARCH_POOL.find((x) => x.item.id === target?.id);
      if (k) {
        return {
          reply: `${describeItem(k, true)}\n\nSouhaitez-vous que je l'ajoute à votre panier ?`,
          actions: [],
          state: { ...state, pendingAction: buildAddAction(k, 1), awaiting: 'confirm-action', lastMentioned: { id: k.item.id, name: k.item.name, section: k.section } },
        };
      }
    }
  }

  /* ── 8) Plat précis évoqué par son nom ── */
  const dishes = extractDishByName(text);
  if (dishes.length > 0) {
    const k = dishes[0];
    const mentioned = { id: k.item.id, name: k.item.name, section: k.section };

    if (COMPARE_INTENT.test(text) && dishes.length >= 2) {
      const [a, b] = [dishes[0], dishes[1]];
      const verdict =
        a.item.price < b.item.price
          ? `${a.item.name} est plus abordable (${formatPrice(a.item.price)} vs ${formatPrice(b.item.price)}).`
          : b.item.price < a.item.price
            ? `${b.item.name} est plus abordable (${formatPrice(b.item.price)} vs ${formatPrice(a.item.price)}).`
            : `Les deux sont au même prix (${formatPrice(a.item.price)}).`;
      return {
        reply: `Comparons 🔍\n\n${describeItem(a, true)}\n\n${describeItem(b, true)}\n\n💡 ${verdict}\n\nSouhaitez-vous que j'ajoute l'un des deux à votre panier ?`,
        actions: [],
        state: { ...state, lastMentioned: mentioned, lastList: listSummary(dishes) },
      };
    }

    if (PAIR_INTENT.test(text))
      return { reply: pairingFor(k), actions: [], state: { ...state, lastMentioned: mentioned } };

    if (PRICE_INTENT.test(text))
      return {
        reply: `${k.item.name} est à ${formatPrice(k.item.price)}${k.item.description ? `\n\n${k.item.description}` : ''}.\n\nJe peux vous l'ajouter au panier si vous le souhaitez.`,
        actions: [],
        state: { ...state, pendingAction: buildAddAction(k, 1), awaiting: 'confirm-action', lastMentioned: mentioned },
      };

    if (DETAIL_INTENT.test(text))
      return {
        reply: `Voici le détail de ${k.item.name} 😊 :\n\n${describeItem(k, true)}\n\nJe peux vous l'ajouter au panier si vous le souhaitez.`,
        actions: [],
        state: { ...state, pendingAction: buildAddAction(k, 1), awaiting: 'confirm-action', lastMentioned: mentioned },
      };

    if (ADD_VERB.test(text)) {
      const qty = parseQuantity(text);
      return {
        reply: `Très bon choix ! 😊 ${qty > 1 ? `${qty}x ` : ''}${k.item.name} — ${formatPrice(k.item.price * qty)}${k.item.description ? `\n\n${k.item.description}` : ''}\n\nSouhaitez-vous que je l'ajoute à votre panier ?`,
        actions: [],
        state: { ...state, pendingAction: buildAddAction(k, qty), awaiting: 'confirm-action', lastMentioned: mentioned },
      };
    }

    return {
      reply: `${describeItem(k, true)}\n\nSouhaitez-vous que je l'ajoute à votre panier ?`,
      actions: [],
      state: { ...state, pendingAction: buildAddAction(k, 1), awaiting: 'confirm-action', lastMentioned: mentioned },
    };
  }

  /* ── 9) Association plat + boisson (catégorie) ── */
  if (PAIR_INTENT.test(text)) {
    const cat = findCategory(text);
    if (cat) {
      const sample = itemsByCategory(cat)[0];
      if (sample) return { reply: pairingFor(sample), actions: [], state: { ...state, lastCategory: cat } };
    }
  }

  /* ── 10) Catégorie évoquée ── */
  const cat = findCategory(text);
  if (cat) {
    const items = itemsByCategory(cat);
    return {
      reply: `${listCategory(cat)}\n\nLequel vous tente ? Dites-moi et je peux l'ajouter à votre panier.`,
      actions: [],
      state: { ...state, lastCategory: cat, lastList: listSummary(items) },
    };
  }

  /* ── 11) Recommandations ── */
  if (/(recommande|recommendation|suggestion|conseil|conseilles|aide-moi|aide moi|choisir|quelque chose|une idée|une idee|j'ai envie|j'ai faim|quoi prendre|que manger|tu me conseilles)/.test(text)) {
    const pref = detectPreference(text);
    if (pref && PREFS[pref]) {
      const p = PREFS[pref];
      const ks = p.ids.map((id) => SEARCH_POOL.find((x) => x.item.id === id)).filter((k): k is KnowledgeItem => Boolean(k));
      return {
        reply: `Pour un ${p.label}, je vous conseille 😊 :\n${describeIds(p.ids)}\n\n${p.note}\n\nJe peux ajouter l'un de ces plats à votre panier si vous voulez.`,
        actions: [],
        state: { ...state, lastList: listSummary(ks) },
      };
    }
    return {
      reply: `Voici une sélection de la maison 🌟 :\n${describeIds(['pl2', 'p1', 'rc3', 'd4'])}\n\nDites-moi ce que vous aimez (léger, viande, poisson, épicé, sucré…) et je vous guide !`,
      actions: [],
      state,
    };
  }

  /* ── 12) Menus complets ── */
  if (/(menu complet|repas complet|formule|accord|suggestion de menu|propose-moi un menu)/.test(text)) {
    const menus = FULL_MENUS.map((m, i) => `${i + 1}. ${m.label} :\n${describeIds(m.ids)}`).join('\n\n');
    return {
      reply: `Voici des menus complets conseillés par la maison 🍽️✨ :\n\n${menus}\n\nDites-moi « le menu 1 » (ou son nom) et je peux tout ajouter à votre panier !`,
      actions: [],
      state: { ...state, lastMenus: FULL_MENUS },
    };
  }
  if (/menu (1|2|3|4|5)|menu (viande|poisson|léger|leger|rooftop|gourmand)/.test(text) && state.lastMenus) {
    const idx = /menu 1/.test(text) ? 0 : /menu 2/.test(text) ? 1 : /menu 3/.test(text) ? 2 : /menu 4/.test(text) ? 3 : /menu 5/.test(text) ? 4 : -1;
    const byLabel = state.lastMenus.find((m) => text.includes(normalize(m.label)));
    const chosen = idx >= 0 ? state.lastMenus[idx] : byLabel;
    if (chosen) {
      const ks = chosen.ids.map((id) => SEARCH_POOL.find((k) => k.item.id === id)).filter((k): k is KnowledgeItem => Boolean(k));
      const total = ks.reduce((s, k) => s + k.item.price, 0);
      return {
        reply: `Excellent choix ! 🍽️ ${chosen.label} :\n${ks.map((k) => describeItem(k)).join('\n')}\n\n💰 Total : ${formatPrice(total)}\n\nSouhaitez-vous que j'ajoute tout ce menu à votre panier ?`,
        actions: [],
        state: { ...state, pendingAction: buildAddAction(ks[0], 1), awaiting: 'confirm-action', lastList: listSummary(ks) },
      };
    }
  }

  /* ── 13) Infos pratiques ── */
  if (/(horaire|ouvert|ferme|heure|ouverture|quand)/.test(text)) return { reply: hoursInfo(), actions: [], state };
  if (/(adresse|ou etes|ou êtes|localisation|maps|quartier|trouver)/.test(text))
    return { reply: `📍 Nous sommes au ${ADDRESS}.\n\nRetrouvez-nous sur Google Maps : ${MAPS_URL}`, actions: [], state };
  if (/(telephone|appeler|contact|reserver|reservation|num|email|mail)/.test(text))
    return { reply: contactInfo(), actions: [], state };

  /* ── 14) Vue d'ensemble de la carte ── */
  if (/(menu|carte|quoi manger|que manger|propose|disponible|specialites|plats?$|tout)/.test(text))
    return { reply: menuOverview(), actions: [], state };

  /* ── 15) Questions incomplètes (contexte) ── */
  if (/(et (pour )?(le|la|les)? ?(dessert|boisson|entree|entrée|plat|apéro|apero|cocktail|mocktail|vin|la suite|le reste))|(et ensuite|et apres|et après|ensuite\?|apres\?|après\?)/.test(text)) {
    const lastCat = lastKnownCategory;
    if (lastCat) {
      const items = itemsByCategory(lastCat);
      return {
        reply: `${listCategory(lastCat)}\n\nLequel vous tente ?`,
        actions: [],
        state: { ...state, lastList: listSummary(items) },
      };
    }
    return { reply: `Bien sûr ! Dites-moi ce que vous cherchez (pizza, dessert, cocktail, plat…) et je vous guide 😊`, actions: [], state };
  }

  /* ── 16) Recherche générale ── */
  const results = searchByWords(text);
  if (results.length > 0) {
    return {
      reply: `J'ai trouvé ${results.length} plat${results.length > 1 ? 's' : ''} pour vous 🔎 :\n\n${results.slice(0, 6).map((k) => describeItem(k)).join('\n')}\n\nSouhaitez-vous plus de détails, ou que j'ajoute l'un d'eux à votre panier ?`,
      actions: [],
      state: { ...state, lastList: listSummary(results) },
    };
  }

  return { reply: `Je suis désolé, je n'ai pas bien compris 😊 Pouvez-vous reformuler ?\n\n${HELP_TEXT}`, actions: [], state };
}
