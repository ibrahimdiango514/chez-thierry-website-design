/**
 * 🧠 MOTEUR DE L'ASSISTANT — logique locale de réponse
 * ─────────────────────────────────────────────────────
 * Connaît toute la carte (Restaurant + Rooftop + spécialités) et répond
 * aux questions courantes. Cette logique pourra être remplacée par un
 * appel à un agent IA externe (n8n) : voir ASSISTANT_CONFIG.webhookUrl.
 */
import { RESTAURANT_MENU, ROOFTOP_MENU, RESTAURANT_SPECIAL_DISH } from '../data';
import { MenuItem } from '../types';
import { ASSISTANT_CONFIG } from '../config/assistant';

export interface AssistantContext {
  cartCount?: number;
  cartTotal?: number;
  page?: 'home' | 'menu';
}

const ALL_ITEMS: MenuItem[] = [...RESTAURANT_MENU, ...ROOFTOP_MENU];

const fmt = (n: number) => `${n.toLocaleString('fr-FR')} F`;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* ── Salutation selon l'heure ─────────────────────────────────────────── */

export const getGreeting = (): string => {
  const h = new Date().getHours();
  return h >= 5 && h < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

export const welcomeMessage = (): string =>
  `${getGreeting()} Je suis ${ASSISTANT_CONFIG.name}, votre guide chez Chez Thierry x Le Palmier.\n\n${ASSISTANT_CONFIG.welcome}`;

/* ── Aide interne ─────────────────────────────────────────────────────── */

const HELP_TEXT = `Voici ce que je peux faire pour vous :
• « Le menu » — je vous présente toute la carte
• « Recommande-moi un plat » — une suggestion selon vos goûts
• « Pizzas », « Desserts », « Cocktails »… — les plats d'une catégorie
• « Couscous » — la spécialité du dimanche
• « Léger », « épicé », « végétarien »… — des suggestions adaptées
• « Commander » — les étapes pour passer commande`;

const listCategory = (title: string, items: MenuItem[]): string => {
  if (items.length === 0) return '';
  const lines = items
    .slice(0, 8)
    .map((i) => `• ${i.name} — ${fmt(i.price)}`)
    .join('\n');
  return `${title} :\n${lines}${items.length > 8 ? `\n… et ${items.length - 8} autres` : ''}`;
};

/* ── Recherche dans la carte (noms + descriptions + composants) ────────── */

function searchMenu(q: string): MenuItem[] {
  const tokens = q.split(' ').filter((t) => t.length > 1);
  if (tokens.length === 0) return [];
  return ALL_ITEMS.map((item) => {
    const hay = normalize(`${item.name} ${item.description ?? ''} ${item.composants ?? ''}`);
    const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { item, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

/* ── Recommandations ──────────────────────────────────────────────────── */

function recommend(q: string): string {
  const n = normalize(q);
  const pick = (ids: string[]) =>
    ALL_ITEMS.filter((i) => ids.includes(i.id)).map((i) => `• ${i.name} — ${fmt(i.price)}`).join('\n');

  if (/(leger|legere|sante|frais|salade)/.test(n))
    return `Pour un repas léger, je vous conseille 😊 :\n${pick(['se1', 'se2', 'se3'])}\n\nVous pouvez aussi essayer notre Salade César, un grand classique.`;
  if (/(vegetarien|vegetarienne|veggie|sans viande)/.test(n))
    return `Nos options végétariennes 🥗 :\n${pick(['p6', 'se1', 'se2'])}\n\nLa pizza Végétarienne est très appréciée (poivrons, aubergines, oignons, olives, basilic).`;
  if (/(viande|boeuf|steak|grillade|brochette)/.test(n))
    return `Amateur de viande ? 🥩\n${pick(['pl2', 'pl1', 'rf1', 'rg1'])}\n\nLe Pavé de Bœuf sauce au poivre est notre valeur sûre.`;
  if (/(poulet|volaille)/.test(n))
    return `Côté poulet 🍗 :\n${pick(['pl4', 'lp1', 'lp2', 'rf3'])}\n\nLe Poulet local braisé est un favori de la maison.`;
  if (/(poisson|mer|crevette|carpe)/.test(n))
    return `Côté poisson 🐟 :\n${pick(['pl5', 'pl6', 'rg2'])}\n\nLa Carpe grillée du Rooftop (sauce tomate/oignon, attiéké ou alloco) est à essayer.`;
  if (/(epice|releve|piquant|fort)/.test(n))
    return `Vous aimez les sensations fortes 🌶️ :\n${pick(['p7', 'p13', 'c4'])}\n\nLa pizza Orientale (merguez & chorizo) est parfaite pour vous.`;
  if (/(sucre|dessert|chocolat|glace)/.test(n))
    return `Pour finir en douceur 🍰 :\n${pick(['d4', 'rd1', 'rd2', 'd1'])}\n\nLe Coulant au chocolat et sa boule de glace vanille fait l'unanimité.`;
  if (/(soiree|fete|cocktail|boire|apero)/.test(n))
    return `Pour une soirée réussie 🍸 :\n${pick(['rc3', 'rc5', 'rc6', 'c5'])}\n\nLe Palmier Signature (mangue, bissap, menthe, rhum) est le cocktail vedette du Rooftop.`;
  if (/(faim|copieux|gourmand|beaucoup)/.test(n))
    return `Grosse faim ? 🍽️\n${pick(['pl1', 'p11', 'rf2'])}\n\nEt le dimanche, ne manquez pas notre Couscous Royal (12h-15h) !`;

  return `Voici une petite sélection de la maison 🌟 :\n${pick(['pl2', 'p1', 'rc3', 'd4'])}\n\nDites-moi ce que vous aimez (léger, viande, poisson, épicé, sucré…) et je vous guide !`;
}

/* ── Réponse principale ───────────────────────────────────────────────── */

export function respond(raw: string, ctx: AssistantContext = {}): string {
  const text = normalize(raw);

  if (!text) return `Dites-moi comment je peux vous aider 😊\n\n${HELP_TEXT}`;

  // Salutations
  if (/(bonjour|bonsoir|salut|hello|bonsoir|bjr|cc|ca va|comment va)/.test(text))
    return `${getGreeting()} Ravi de vous accueillir ! ${ASSISTANT_CONFIG.welcome}\n\n${HELP_TEXT}`;

  // Remerciements
  if (/(merci|thanks|super|genial|top|parfait)/.test(text))
    return `Avec plaisir 😊 N'hésitez pas si vous avez une autre question, je suis là pour vous aider !`;

  // Présentation
  if (/(qui es tu|qui es-tu|tu es qui|c\'est quoi toi|presente toi|ton nom)/.test(text) || /(presente|qui es)/.test(text))
    return `${getGreeting()} Je suis ${ASSISTANT_CONFIG.name} 🧑‍🍳, le guide digital de Chez Thierry x Le Palmier à Bamako.\n\n${ASSISTANT_CONFIG.welcome}`;

  // Recommandations
  if (/(recommande|recommendation|suggestion|conseil|aide moi|aide-moi|choisir|tu proposes|propose moi|que me conseilles|hesite)/.test(text)) {
    return recommend(text);
  }

  // Aide / menu
  if (/(menu|carte|quoi manger|que manger|propose|disponible|plats?$|specialites)/.test(text) && !/(pizzas?|desserts?|cocktails?)/.test(text)) {
    const r = (list: MenuItem[]) =>
      Array.from(new Set(list.map((i) => i.category)))
        .map((c) => `${c} (${list.filter((i) => i.category === c).length})`)
        .join(' · ');
    return `📖 Voici notre carte :\n\n🍽️ Restaurant Chez Thierry\n${r(RESTAURANT_MENU)}\n\n🌇 Rooftop Le Palmier\n${r(ROOFTOP_MENU)}\n\n🌟 Spécialité : ${RESTAURANT_SPECIAL_DISH.name} (${fmt(RESTAURANT_SPECIAL_DISH.price)}) — ${RESTAURANT_SPECIAL_DISH.availability}.\n\nDites-moi une catégorie ou un plat pour en savoir plus !`;
  }

  // Couscous Royal (spécialité)
  if (/(couscous|specialite|plat special)/.test(text))
    return `🌟 ${RESTAURANT_SPECIAL_DISH.name} — ${fmt(RESTAURANT_SPECIAL_DISH.price)}\n\n${RESTAURANT_SPECIAL_DISH.description}.\n\n📅 ${RESTAURANT_SPECIAL_DISH.availability}.`;

  // Commander / panier
  if (/(commander|panier|whatsapp|commande|passer)/.test(text)) {
    const cartLine = ctx.cartCount && ctx.cartCount > 0
      ? `\n\n🛒 Votre panier contient actuellement ${ctx.cartCount} article${ctx.cartCount > 1 ? 's' : ''} pour ${fmt(ctx.cartTotal ?? 0)}.`
      : '';
    return `🛒 Commander chez Chez Thierry, c'est simple :\n\n1️⃣ Touchez « Commander » sur un plat pour l'ajouter au panier\n2️⃣ Ouvrez le panier (en bas de l'écran)\n3️⃣ Validez : votre nom, votre téléphone, et le mode (sur place / à emporter / livraison)\n4️⃣ Votre commande s'envoie sur WhatsApp 📲${cartLine}\n\nUn de nos équipes confirmera avec vous !`;
  }

  // Horaires
  if (/(horaire|ouvert|ferme|heure)/.test(text))
    return `🕒 Nos horaires :\n\n🍽️ Restaurant Chez Thierry : mar-dim 18h30-23h30 (ven-sam jusqu'à 00h00), fermé le lundi. Le Couscous Royal est servi le dimanche midi (12h-15h).\n\n🌇 Rooftop Le Palmier : mar-jeu 18h30-00h00, ven-sam 18h30-02h00, dim 18h30-00h00, fermé le lundi.`;

  // Adresse / contact
  if (/(adresse|ou etes|localisation|maps|quartier)/.test(text))
    return `📍 Nous sommes au Rue 548, Quinzambougou, Bamako, Mali.\n\nRetrouvez-nous sur Google Maps : https://www.google.com/maps/search/?api=1&query=Chez+Thierry,+Rue+548,+Quinzambougou,+Bamako,+Mali`;
  if (/(telephone|appeler|contact|reserver|reservation|num)/.test(text))
    return `📞 Restaurant Chez Thierry : +223 66 42 77 77\n🌇 Rooftop Le Palmier : +223 76 22 27 77\n\nOu commandez directement via notre Menu Digital !`;

  // Catégories précises
  if (/(pizzas?)/.test(text)) return listCategory('🍕 Nos pizzas', RESTAURANT_MENU.filter((i) => i.category === 'Pizzas'));
  if (/(entrees?)/.test(text)) return listCategory('🥗 Nos entrées', RESTAURANT_MENU.filter((i) => i.category === 'Entrées'));
  if (/(desserts?)/.test(text)) {
    const r = [...RESTAURANT_MENU, ...ROOFTOP_MENU].filter((i) => i.category === 'Desserts');
    return listCategory('🍰 Nos desserts', r);
  }
  if (/(cocktails?)/.test(text)) {
    const r = [...RESTAURANT_MENU.filter((i) => i.category === 'Cocktails alcoolisés'), ...ROOFTOP_MENU.filter((i) => i.category === 'Cocktails - Avec alcool')];
    return listCategory('🍸 Nos cocktails', r);
  }
  if (/(mocktail|sans alcool)/.test(text)) return listCategory('🧃 Nos mocktails (sans alcool)', ROOFTOP_MENU.filter((i) => i.category === 'Mocktails - Sans alcool'));
  if (/(vins?|bouteille)/.test(text)) return listCategory('🍷 Nos vins', RESTAURANT_MENU.filter((i) => i.category.startsWith('Vins')));
  if (/(burgers?|smash|frit)/.test(text)) return listCategory('🍔 Burgers & fried food', ROOFTOP_MENU.filter((i) => i.category === 'Burgers & Fried Food'));
  if (/(grill|brochette|carpe|skewer)/.test(text)) return listCategory('🔥 Grill & African Touch', ROOFTOP_MENU.filter((i) => i.category === 'Grill & African Touch'));

  // Préférences alimentaires / goûts (léger, viande, épicé, sucré…)
  if (/(leger|legere|sante|frais|salade|vegetarien|veggie|sans viande|viande|boeuf|steak|grillade|brochette|poulet|volaille|poisson|mer|crevette|carpe|epice|releve|piquant|sucre|chocolat|glace|soiree|fete|apero|faim|copieux|gourmand|vegan)/.test(text)) {
    return recommend(text);
  }

  // Recherche libre dans la carte
  const results = searchMenu(text);
  if (results.length > 0) {
    const unique = results.slice(0, 6);
    const lines = unique
      .map((i) => `• ${i.name} — ${fmt(i.price)} (${i.category})`)
      .join('\n');
    return `J'ai trouvé ${results.length} plat${results.length > 1 ? 's' : ''} pour vous 🔎 :\n\n${lines}\n\nSouhaitez-vous plus de détails sur l'un d'entre eux ?`;
  }

  return `Je suis désolé, je n'ai pas bien compris 😊\n\n${HELP_TEXT}`;
}
