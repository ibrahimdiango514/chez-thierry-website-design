/**
 * 📲 COMMANDE WHATSAPP — logique partagée du site
 * ───────────────────────────────────────────────────────────────────
 * Ce module reprend **à l'identique** la logique des boutons de commande
 * déjà utilisés sur les autres menus :
 *   • CheckoutModal.tsx  → boutons « Sur Place / À Emporter / Livraison »
 *   • pages/Menu.tsx     → OrderModal (mêmes boutons + message WhatsApp)
 *
 * Sont repris tels quels :
 *   • les libellés des modes (`MODE_LABELS`) ;
 *   • la salutation automatique Bonjour/Bonsoir (`getSalutation`) ;
 *   • la structure du message : salutation → 📍 Section → 🍽️ Mode →
 *     📝 Commande → 💰 Total ;
 *   • l'URL `https://api.whatsapp.com/send?phone=…&text=…` ;
 *   • les numéros WhatsApp (source unique : restaurantKnowledge.ts).
 *
 * ⚠️ Les autres menus ne sont pas modifiés : ils continuent d'utiliser leur
 *    propre code. Ce module garantit seulement que la section « Plat du jour »
 *    envoie exactement le même format de message.
 */
import { OrderMode } from '../types';
import { RESTAURANT_WHATSAPP, ROOFTOP_WHATSAPP } from './restaurantKnowledge';

export type Establishment = 'restaurant' | 'rooftop';

/** Libellés des modes de commande — identiques à ceux des autres menus */
export const MODE_LABELS: Record<OrderMode, string> = {
  sur_place: 'Sur place',
  emporter: 'À emporter',
  livraison: 'Livraison',
};

/** Ordre d'affichage des boutons — identique aux autres menus */
export const ORDER_MODES: OrderMode[] = ['sur_place', 'emporter', 'livraison'];

/** Noms des établissements — identiques à ceux utilisés dans les messages */
export const ESTABLISHMENT_LABELS: Record<Establishment, string> = {
  restaurant: 'Restaurant Chez Thierry',
  rooftop: 'Rooftop Le Palmier',
};

/** Numéros WhatsApp (source unique : src/lib/restaurantKnowledge.ts) */
export const WHATSAPP_NUMBERS: Record<Establishment, string> = {
  restaurant: RESTAURANT_WHATSAPP,
  rooftop: ROOFTOP_WHATSAPP,
};

/** Salutation automatique selon l'heure (Bonjour le jour / Bonsoir le soir) */
export const getSalutation = (): string => {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

export interface DishOrderMessageParams {
  /** Plat commandé (nom + prix optionnel) */
  dish: { name: string; price?: number };
  /** Mode choisi via les boutons Sur place / À emporter / Livraison */
  mode: OrderMode;
  /** Quantité (1 par défaut) */
  quantity?: number;
  /** Établissement concerné (Restaurant par défaut) */
  establishment?: Establishment;
}

/**
 * Construit le message WhatsApp d'un plat — même structure que celle des
 * autres menus, adaptée au nom du plat sélectionné.
 *
 * Exemple :
 *   Bonjour 👋
 *
 *   📍 Section : Restaurant Chez Thierry
 *   🍽️ Mode : Sur place
 *
 *   📝 Commande :
 *   - 1x Pavé de Bœuf (8 000 F)
 *
 *   💰 Total : 8 000 F CFA
 */
export const buildDishOrderMessage = ({
  dish,
  mode,
  quantity = 1,
  establishment = 'restaurant',
}: DishOrderMessageParams): string => {
  const total = (dish.price ?? 0) * quantity;

  let message = `${getSalutation()}\n\n`;
  message += `📍 Section : ${ESTABLISHMENT_LABELS[establishment]}\n`;
  message += `🍽️ Mode : ${MODE_LABELS[mode]}\n\n`;
  message += `📝 Commande :\n`;
  // Ligne identique aux autres menus ; le prix est omis s'il n'est pas renseigné
  message += dish.price
    ? `- ${quantity}x ${dish.name} (${total.toLocaleString()} F)`
    : `- ${quantity}x ${dish.name}`;

  if (dish.price) {
    message += `\n\n💰 Total : ${total.toLocaleString()} F CFA`;
  }

  return message;
};

/** URL WhatsApp — même format que celui utilisé par les autres menus */
export const buildWhatsAppUrl = (number: string, message: string): string =>
  `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;

/**
 * URL WhatsApp complète pour la commande d'un plat.
 * ⚠️ Sert directement d'attribut `href` aux boutons : la redirection est ainsi
 * native (comme les autres boutons WhatsApp du site) et n'est jamais bloquée
 * par les bloqueurs de pop-up ni par les navigateurs intégrés.
 */
export const buildDishOrderUrl = ({
  dish,
  mode,
  quantity = 1,
  establishment = 'restaurant',
}: DishOrderMessageParams): string =>
  buildWhatsAppUrl(WHATSAPP_NUMBERS[establishment], buildDishOrderMessage({ dish, mode, quantity, establishment }));
