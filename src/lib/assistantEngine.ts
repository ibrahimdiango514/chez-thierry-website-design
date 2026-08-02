/**
 * 🧠 MOTEUR DE L'ASSISTANT — conversation naturelle + actions panier
 * ───────────────────────────────────────────────────────────────────
 * - Comprend le langage courant, garde le contexte (historique + état)
 * - Connaît le restaurant UNIQUEMENT via restaurantKnowledge (données du site)
 * - Peut proposer d'ajouter des plats au panier (actions retournées au composant)
 * - Remplaçable par un agent IA externe (n8n) : même interface utilisateur
 */
import { MenuItem } from '../types';
import { ASSISTANT_CONFIG } from '../config/assistant';
import {
  ALL_ITEMS,
  SPECIAL_DISH,
  itemsByCategory,
  findItems,
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
} from './restaurantKnowledge';

/* ── Types publics ──────────────────────────────────────────────────── */

export interface AssistantAction {
  type: 'addToCart';
  item: MenuItem;
  section: Establishment;
}

export interface AssistantState {
  /** Plat proposé pour ajout, en attente de confirmation */
  pendingAdd?: KnowledgeItem;
  awaiting?: 'add-confirm';
  /** Dernière catégorie évoquée (pour les questions incomplètes) */
  lastCategory?: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface AssistantContext {
  cartCount?: number;
  cartTotal?: number;
  page?: 'home' | 'menu';
}

export interface AssistantResult {
  reply: string;
  actions: AssistantAction[];
  state: AssistantState;
}

/* ── Salutation ─────────────────────────────────────────────────────── */

export const getGreeting = (): string => {
  const h = new Date().getHours();
  return h >= 5 && h < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

export const welcomeMessage = (): string =>
  `${getGreeting()} Je suis ${ASSISTANT_CONFIG.name}, votre guide chez Chez Thierry x Le Palmier.\n\n${ASSISTANT_CONFIG.welcome}`;

const HELP_TEXT = `Voici ce que je peux faire pour vous :
• « Le menu » — je vous présente toute la carte
• « Recommande-moi » — une suggestion selon vos goûts
• « Je voudrais une pizza Reine » — je peux l'ajouter à votre panier
• « Pizzas », « Desserts », « Cocktails »… — les plats d'une catégorie
• « Compare X et Y » — je compare deux plats
• « Un menu complet » — entrée + plat + dessert + boisson
• « Couscous » — la spécialité du dimanche
• « Horaires », « Adresse », « Téléphone »… — les infos pratiques`;

/* ── Détection d'intention ──────────────────────────────────────────── */

const ADD_PATTERNS = [
  /(je voudrais|je voudrai|je veux|je vais prendre|je prends|j'aimerais|j'aimerai|ajoute|ajoutez|mets|mettre|commande-moi|je commande|je prendrai|add|ajouter)/,
];

const CONFIRM_WORDS = /^(oui|ok|d'accord|daccord|vas-y|vas y|ajoute|ajoute-le|ajoute le|yep|bien sur|bien sûr|carrément|avec plaisir|ouais|si)$/;
const DENY_WORDS = /^(non|non merci|pas maintenant|plus tard|annule|non pas ça|négatif)$/;

const GOODS = [
  /(leger|legere|sante|frais|salade|vegetarien|veggie|sans viande|vegan)/,
  /(viande|boeuf|steak|grillade|brochette|cote de boeuf|cote de bœuf)/,
  /(poulet|volaille)/,
  /(poisson|mer|crevette|carpe|fruits de mer)/,
  /(epice|releve|piquant|fort|piment)/,
  /(sucre|sucree|dessert|chocolat|glace|gourmand)/,
  /(soiree|fete|cocktail|boire|apero|bar)/,
  /(faim|copieux|gourmand|beaucoup|appetit)/,
];

/* ── Recommandations (ids réels → données du site) ──────────────────── */

function itemById(ids: string[]): KnowledgeItem[] {
  return ids
    .map((id) => ALL_ITEMS.find((k) => k.item.id === id))
    .filter((k): k is KnowledgeItem => Boolean(k));
}

function recommend(text: string, ctx: AssistantContext): string {
  const n = normalize(text);
  const cart = ctx.cartCount ? `\n\n🛒 Vous avez actuellement ${ctx.cartCount} article${ctx.cartCount > 1 ? 's' : ''} au panier (${formatPrice(ctx.cartTotal ?? 0)}).` : '';

  if (/(leger|legere|sante|frais|salade|vegetarien|veggie|sans viande|vegan)/.test(n))
    return `Pour un repas léger, je vous conseille 😊 :\n${describeItems(['se1', 'se2', 'se3'])}\n\nLa Salade César (poulet, croûtons, parmesan) est un grand classique.${cart}`;
  if (/(viande|boeuf|steak|grillade|brochette)/.test(n))
    return `Amateur de viande ? 🥩\n${describeItems(['pl2', 'pl1', 'rg1', 'rf1'])}\n\nLe Pavé de Bœuf sauce au poivre est notre valeur sûre.${cart}`;
  if (/(poulet|volaille)/.test(n))
    return `Côté poulet 🍗 :\n${describeItems(['pl4', 'lp1', 'lp2', 'rf3'])}\n\nLe Poulet local braisé (frites maison, petite salade) est un favori.${cart}`;
  if (/(poisson|mer|crevette|carpe|fruits de mer)/.test(n))
    return `Côté poisson 🐟 :\n${describeItems(['pl5', 'pl6', 'rg2'])}\n\nLa Carpe grillée du Rooftop (sauce tomate/oignon, attiéké ou alloco) vaut le détour.${cart}`;
  if (/(epice|releve|piquant|fort|piment)/.test(n))
    return `Vous aimez les sensations fortes 🌶️ :\n${describeItems(['p7', 'p13', 'c4'])}\n\nLa pizza Orientale (merguez & chorizo) est faite pour vous.${cart}`;
  if (/(sucre|sucree|dessert|chocolat|glace|gourmand)/.test(n))
    return `Pour finir en douceur 🍰 :\n${describeItems(['d4', 'rd1', 'rd2', 'd1'])}\n\nLe Coulant au chocolat et sa boule de glace vanille fait l'unanimité.${cart}`;
  if (/(soiree|fete|cocktail|boire|apero|bar)/.test(n))
    return `Pour une soirée réussie 🍸 :\n${describeItems(['rc3', 'rc5', 'rc6', 'c5'])}\n\nLe Palmier Signature (mangue, bissap, menthe, rhum) est le cocktail vedette du Rooftop.${cart}`;
  if (/(faim|copieux|gourmand|beaucoup|appetit)/.test(n))
    return `Grosse faim ? 🍽️\n${describeItems(['pl1', 'p11', 'rf2'])}\n\nEt le dimanche, ne manquez pas notre Couscous Royal (12h-15h) !${cart}`;
  return `Voici une sélection de la maison 🌟 :\n${describeItems(['pl2', 'p1', 'rc3', 'd4'])}\n\nDites-moi ce que vous aimez (léger, viande, poisson, épicé, sucré…) et je vous guide !`;
}

/** Menus complets conseillés (entrée + plat + dessert + boisson) — ids réels */
const FULL_MENUS: { label: string; ids: string[] }[] = [
  { label: 'Menu Viande', ids: ['se4', 'pl2', 'd4', 'c5'] },
  { label: 'Menu Poisson', ids: ['se2', 'pl5', 'd1', 'c1'] },
  { label: 'Menu Léger', ids: ['se1', 'lp1', 'd5', 'rm3'] },
  { label: 'Menu Rooftop', ids: ['rf2', 'rg2', 'rd2', 'rc3'] },
  { label: 'Menu Gourmand', ids: ['se3', 'pl1', 'rd1', 'rc5'] },
];

function describeItems(ids: string[]): string {
  return itemById(ids).map((k) => describeItem(k)).join('\n');
}

/* ── Carte / catégories ─────────────────────────────────────────────── */

function menuOverview(): string {
  const restaurantCats = Array.from(new Set(ALL_ITEMS.filter((k) => k.section === 'restaurant').map((k) => k.item.category)));
  const rooftopCats = Array.from(new Set(ALL_ITEMS.filter((k) => k.section === 'rooftop').map((k) => k.item.category)));
  const count = (cat: string, sec: Establishment) =>
    ALL_ITEMS.filter((k) => k.item.category === cat && k.section === sec).length;
  return `📖 Voici notre carte :\n\n🍽️ Restaurant Chez Thierry\n${restaurantCats.map((c) => `• ${c} (${count(c, 'restaurant')})`).join('\n')}\n\n🌇 Rooftop Le Palmier\n${rooftopCats.map((c) => `• ${c} (${count(c, 'rooftop')})`).join('\n')}\n\n🌟 Spécialité : ${SPECIAL_DISH.item.name} — ${formatPrice(SPECIAL_DISH.item.price)} (${RESTAURANT_SPECIAL_NOTE})\n\nDites-moi une catégorie ou un plat pour en savoir plus !`;
}

function listCategory(category: string): string {
  const items = itemsByCategory(category).slice(0, 10);
  if (items.length === 0) return '';
  const more = itemsByCategory(category).length - items.length;
  return `${category} :\n${items.map((k) => describeItem(k)).join('\n')}${more > 0 ? `\n… et ${more} autres` : ''}`;
}

/* ── Comparaison de deux plats ──────────────────────────────────────── */

function compareItems(a: KnowledgeItem, b: KnowledgeItem): string {
  const pa = a.item.price;
  const pb = b.item.price;
  let verdict: string;
  if (pa < pb) verdict = `${a.item.name} est plus abordable (${formatPrice(pa)} vs ${formatPrice(pb)}).`;
  else if (pb < pa) verdict = `${b.item.name} est plus abordable (${formatPrice(pb)} vs ${formatPrice(pa)}).`;
  else verdict = `Les deux sont au même prix (${formatPrice(pa)}).`;
  return `Comparons 🔍\n\n${describeItem(a, true)}\n\n${describeItem(b, true)}\n\n💡 ${verdict}\n\nSouhaitez-vous que j'ajoute l'un des deux à votre panier ?`;
}

/* ── Infos pratiques ────────────────────────────────────────────────── */

function hoursInfo(): string {
  return `🕒 Nos horaires :\n\n🍽️ Restaurant Chez Thierry\n${formatHours(RESTAURANT_HOURS)}\n\n🌇 Rooftop Le Palmier\n${formatHours(ROOFTOP_HOURS)}\n\nℹ️ ${RESTAURANT_SPECIAL_NOTE}`;
}

function contactInfo(): string {
  return `📞 Restaurant Chez Thierry : ${RESTAURANT_PHONE_DISPLAY}\n🌇 Rooftop Le Palmier : ${ROOFTOP_PHONE_DISPLAY}\n\n📍 ${ADDRESS}\n✉️ ${EMAIL}\n\nOu commandez directement via notre Menu Digital !`;
}

/* Retrouve la dernière catégorie évoquée dans l'historique de conversation */
function lastCategoryFromHistory(history: ChatTurn[]): string | undefined {
  const cats = Array.from(new Set(ALL_ITEMS.map((k) => k.item.category)));
  for (let i = history.length - 1; i >= 0; i--) {
    const t = normalize(history[i].text);
    const hit = cats.find((c) => t.includes(normalize(c)));
    if (hit) return hit;
  }
  return undefined;
}

/* ── Réponse principale ─────────────────────────────────────────────── */

export function respond(
  raw: string,
  opts: { state?: AssistantState; history?: ChatTurn[]; cartInfo?: AssistantContext } = {}
): AssistantResult {
  const state: AssistantState = { ...(opts.state ?? {}) };
  const ctx: AssistantContext = opts.cartInfo ?? {};
  const history = opts.history ?? [];
  const text = normalize(raw);
  const hasCart = Boolean(ctx.cartCount && ctx.cartCount > 0);

  /* Pas de message */
  if (!text)
    return { reply: `Dites-moi comment je peux vous aider 😊\n\n${HELP_TEXT}`, actions: [], state };

  /* Confirmation d'ajout en attente */
  if (state.awaiting === 'add-confirm' && CONFIRM_WORDS.test(text)) {
    const k = state.pendingAdd;
    if (k) {
      const newState: AssistantState = { ...state, pendingAdd: undefined, awaiting: undefined };
      const newTotal = (ctx.cartTotal ?? 0) + k.item.price;
      return {
        reply: `C'est noté ! 🛒 J'ajoute ${k.item.name} (${formatPrice(k.item.price)}) à votre panier.\n\nVotre panier : ${(ctx.cartCount ?? 0) + 1} article${(ctx.cartCount ?? 0) + 1 > 1 ? 's' : ''} — total ${formatPrice(newTotal)}.\n\nSouhaitez-vous autre chose ?`,
        actions: [{ type: 'addToCart', item: k.item, section: k.section }],
        state: newState,
      };
    }
  }
  if (state.awaiting === 'add-confirm' && DENY_WORDS.test(text)) {
    return {
      reply: `Pas de souci ! 😊 Dites-moi si vous changez d'avis.\n\n${HELP_TEXT}`,
      actions: [],
      state: { ...state, pendingAdd: undefined, awaiting: undefined },
    };
  }

  /* Salutations */
  if (/(bonjour|bonsoir|salut|hello|bjr|cc|ca va|comment va|bonjour tout le monde)/.test(text))
    return {
      reply: `${getGreeting()} Ravi de vous accueillir ! ${ASSISTANT_CONFIG.welcome}\n\n${HELP_TEXT}`,
      actions: [],
      state,
    };

  /* Remerciements */
  if (/(merci|thanks|super|genial|top|parfait|au top)/.test(text))
    return { reply: `Avec plaisir 😊 N'hésitez pas si vous avez une autre question, je suis là pour vous aider !`, actions: [], state };

  /* Présentation */
  if (/(qui es tu|qui es-tu|tu es qui|presente toi|presente-toi|ton nom|c'est quoi toi)/.test(text))
    return {
      reply: `${getGreeting()} Je suis ${ASSISTANT_CONFIG.name} 🧑‍🍳, le guide digital de Chez Thierry x Le Palmier à Bamako.\n\n${ASSISTANT_CONFIG.welcome}`,
      actions: [],
      state,
    };

  /* Demande d'ajout d'un plat au panier */
  if (ADD_PATTERNS.some((re) => re.test(text)) && !/(quelque chose|une idee|une idée|recommand|suggestion)/.test(text)) {
    const found = findItems(text);
    const exact = found.find((k) => normalize(k.item.name).length > 2 && text.includes(normalize(k.item.name)));
    const target = exact ?? found[0];
    if (target) {
      const newState: AssistantState = { ...state, pendingAdd: target, awaiting: 'add-confirm', lastCategory: target.item.category };
      return {
        reply: `Très bon choix ! 😊 ${target.item.name} — ${formatPrice(target.item.price)}${target.item.description ? `\n\n${target.item.description}` : ''}\n\nSouhaitez-vous que je l'ajoute à votre panier ?`,
        actions: [],
        state: newState,
      };
    }
    /* Pas de plat précis : catégorie ? */
    const catMatch = ALL_ITEMS.map((k) => k.item.category).find((c) => text.includes(normalize(c)));
    if (catMatch) {
      return {
        reply: `Bien sûr ! Voici nos plats de la catégorie « ${catMatch} » 😊 :\n\n${listCategory(catMatch)}\n\nLequel souhaitez-vous ? Dites-moi et je l'ajoute à votre panier.`,
        actions: [],
        state: { ...state, lastCategory: catMatch },
      };
    }
    return {
      reply: `Bien sûr, je vous aide à composer votre commande 😊\n\nQuel plat souhaitez-vous ? Par exemple : « Je voudrais une pizza Marguerita » ou « Ajoutez le Couscous Royal ».`,
      actions: [],
      state,
    };
  }

  /* Recommandations & menus complets */
  if (/(recommande|recommandation|suggestion|conseil|aide-moi|aide moi|choisir|quelque chose|une idee|une idée|tu me conseilles|j'ai envie|j'ai faim|menu complet|repas complet|accord|quoi prendre|que manger)/.test(text)) {
    if (/(menu complet|repas complet|accord|entree.*plat|plat.*dessert|suggestion de menu)/.test(text)) {
      const menus = FULL_MENUS.map((m) => `${m.label} :\n${describeItems(m.ids)}`).join('\n\n');
      return {
        reply: `Voici des menus complets conseillés par la maison 🍽️✨ :\n\n${menus}\n\nDites-moi lequel vous tente, et je peux tout ajouter à votre panier !`,
        actions: [],
        state,
      };
    }
    return { reply: recommend(text, ctx), actions: [], state };
  }

  /* Comparaison */
  if (/(compare|ou |vs |plutot|plutôt)/.test(text) && text.includes('ou')) {
    const found = findItems(text);
    const uniq = found.filter((k, i, arr) => arr.findIndex((x) => x.item.id === k.item.id) === i).slice(0, 2);
    if (uniq.length === 2) return { reply: compareItems(uniq[0], uniq[1]), actions: [], state };
  }

  /* Questions sur un plat précis (ingrédients / composition) */
  if (/(qu'est-ce qu'il y a|qu est ce qu il y a|ingredients|ingrédients|composants|avec quoi|dans le|dans la|contenu|c'est quoi|composition|accompagne)/.test(text)) {
    const found = findItems(text);
    if (found.length > 0) {
      const k = found[0];
      return {
        reply: `Voici le détail de ${k.item.name} 😊 :\n\n${describeItem(k, true)}\n\nJe peux vous le proposer pour l'ajouter à votre panier si vous voulez.`,
        actions: [],
        state: { ...state, lastCategory: k.item.category },
      };
    }
  }

  /* Couscous Royal (spécialité) */
  if (/(couscous|specialite|plat special)/.test(text))
    return {
      reply: `🌟 ${SPECIAL_DISH.item.name} — ${formatPrice(SPECIAL_DISH.item.price)}\n\n${SPECIAL_DISH.item.description}.\n\n📅 ${RESTAURANT_SPECIAL_NOTE}\n\nSouhaitez-vous que je l'ajoute à votre panier ?`,
      actions: [],
      state: { ...state, pendingAdd: SPECIAL_DISH, awaiting: 'add-confirm' },
    };

  /* Commander / panier */
  if (/(commander|panier|whatsapp|commande|passer|valider)/.test(text)) {
    const cartLine = hasCart
      ? `\n\n🛒 Votre panier contient ${ctx.cartCount} article${ctx.cartCount! > 1 ? 's' : ''} pour ${formatPrice(ctx.cartTotal ?? 0)}.`
      : '';
    return {
      reply: `🛒 Commander, c'est simple :\n\n1️⃣ Dites-moi ce que vous voulez (ex : « Je voudrais une pizza Reine ») ou utilisez « Commander » sur un plat\n2️⃣ Je l'ajoute à votre panier pour vous\n3️⃣ Ouvrez le panier en bas de l'écran et validez (nom, téléphone, mode)\n4️⃣ Votre commande part sur WhatsApp 📲${cartLine}\n\nVoulez-vous que je vous aide à composer votre commande ?`,
      actions: [],
      state,
    };
  }

  /* Questions incomplètes (références au contexte) */
  if (/(et (pour |une |un |des )?(dessert|boisson|entree|entrée|plat|apéro|apero|cocktail|mocktail|vin|la suite|le reste))|(et ensuite|et apres|et après|ensuite\?|apres\?|après\?)/.test(text)) {
    if (/(dessert)/.test(text)) {
      return { reply: listCategory('Desserts'), actions: [], state: { ...state, lastCategory: 'Desserts' } };
    }
    if (/(boisson|cocktail|mocktail|a boire|à boire)/.test(text)) {
      const drinks = listCategory('Cocktails - Avec alcool') + '\n\n' + listCategory('Mocktails - Sans alcool');
      return { reply: drinks, actions: [], state: { ...state, lastCategory: 'Boissons' } };
    }
    /* Dernière catégorie connue : état courant, sinon historique */
    const lastCat = state.lastCategory ?? lastCategoryFromHistory(history);
    if (lastCat) {
      const cat = itemsByCategory(lastCat);
      if (cat.length) return { reply: listCategory(lastCat), actions: [], state: { ...state, lastCategory: lastCat } };
    }
  }

  /* Horaires */
  if (/(horaire|ouvert|ferme|heure|ouverture)/.test(text))
    return { reply: hoursInfo(), actions: [], state };

  /* Adresse / contact */
  if (/(adresse|ou etes|ou êtes|localisation|maps|quartier|trouver)/.test(text))
    return { reply: `📍 Nous sommes au ${ADDRESS}.\n\nRetrouvez-nous sur Google Maps : ${MAPS_URL}`, actions: [], state };
  if (/(telephone|appeler|contact|reserver|reservation|num|email|mail)/.test(text))
    return { reply: contactInfo(), actions: [], state };

  /* Catégories précises */
  if (/(pizzas?|pizza)/.test(text)) return { reply: listCategory('Pizzas'), actions: [], state: { ...state, lastCategory: 'Pizzas' } };
  if (/(entrees?|entrées?)/.test(text)) return { reply: listCategory('Entrées'), actions: [], state: { ...state, lastCategory: 'Entrées' } };
  if (/(desserts?)/.test(text)) return { reply: listCategory('Desserts'), actions: [], state: { ...state, lastCategory: 'Desserts' } };
  if (/(cocktails?)/.test(text)) return { reply: listCategory('Cocktails - Avec alcool') + '\n\n' + listCategory('Cocktails alcoolisés'), actions: [], state: { ...state, lastCategory: 'Cocktails' } };
  if (/(mocktail|sans alcool)/.test(text)) return { reply: listCategory('Mocktails - Sans alcool'), actions: [], state: { ...state, lastCategory: 'Mocktails' } };
  if (/(vins?|bouteille|pichet|ballon)/.test(text)) return { reply: listCategory('Vins bouteilles') + '\n\n' + listCategory('Vins en pichet et au verre'), actions: [], state: { ...state, lastCategory: 'Vins' } };
  if (/(burgers?|smash|frit)/.test(text)) return { reply: listCategory('Burgers & Fried Food'), actions: [], state: { ...state, lastCategory: 'Burgers' } };
  if (/(grill|brochette|carpe|skewer|african)/.test(text)) return { reply: listCategory('Grill & African Touch'), actions: [], state: { ...state, lastCategory: 'Grill' } };

  /* Carte générale */
  if (/(menu|carte|quoi manger|que manger|propose|disponible|specialites|plats?$)/.test(text))
    return { reply: menuOverview(), actions: [], state };

  /* Préférences / goûts (léger, viande, épicé…) */
  if (GOODS.some((re) => re.test(text))) return { reply: recommend(text, ctx), actions: [], state };

  /* Recherche libre dans la carte */
  const results = findItems(text);
  if (results.length > 0) {
    const unique = results.filter((k, i, arr) => arr.findIndex((x) => x.item.id === k.item.id) === i).slice(0, 6);
    return {
      reply: `J'ai trouvé ${results.length} plat${results.length > 1 ? 's' : ''} pour vous 🔎 :\n\n${unique.map((k) => describeItem(k)).join('\n')}\n\nSouhaitez-vous plus de détails sur l'un d'entre eux, ou que je l'ajoute à votre panier ?`,
      actions: [],
      state,
    };
  }

  return { reply: `Je suis désolé, je n'ai pas bien compris 😊\n\n${HELP_TEXT}`, actions: [], state };
}
