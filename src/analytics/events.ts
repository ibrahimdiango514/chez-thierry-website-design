/**
 * ─────────────────────────────────────────────────────────────
 * 🎯 ÉVÉNEMENTS GA4 MÉTIER — Chez Thierry x Le Palmier
 * ─────────────────────────────────────────────────────────────
 * Catalogue unique des événements envoyés à Google Analytics.
 * Documentation complète (déclencheurs, paramètres) : docs/ANALYTICS.md
 *
 * ⚠️ RÈGLES
 *  • Un clic WhatsApp ou téléphone n'est JAMAIS une commande confirmée.
 *    Il indique seulement une intention. Aucun événement « purchase ».
 *  • Aucun paramètre ne contient de données personnelles : pas de nom,
 *    de numéro de téléphone, d'adresse, de position GPS ni de texte de
 *    message WhatsApp.
 * ─────────────────────────────────────────────────────────────
 */
import { trackEvent, trackEventOnce } from './ga4';
import type { OrderMode } from '../types';

/** Où le bouton / lien a été cliqué */
export type ActionPlacement =
  | 'contact_block' // Blocs « Réserver ou commander » (accueil)
  | 'floating_phone_menu' // Bouton téléphone flottant (accueil)
  | 'general_info' // Carte « Informations pratiques » (accueil)
  | 'footer' // Pied de page
  | 'menu_page_help' // Bloc « Besoin d'aide ? » (page /menu)
  | 'checkout_order' // Validation de la commande (formulaire)
  | 'checkout_recap' // Liens d'appel dans le récapitulatif téléphone
  | 'dish_order_mode' // Boutons Sur place / À emporter / Livraison (lien WhatsApp direct)
  | 'qr_share_fallback'; // Partage du QR code via WhatsApp (repli)

/** Établissement concerné par l'action */
export type BusinessUnit = 'restaurant' | 'rooftop';

/** Composition du panier : un seul établissement ou les deux */
export type OrderScope = 'restaurant' | 'rooftop' | 'mixed';

/** Mode choisi, ou 'unselected' si l'internaute n'a pas encore choisi */
export type OrderModeValue = OrderMode | 'unselected';

export interface CartLineForTracking {
  item: { id: string; name: string; category: string; price: number };
  quantity: number;
}

/* ─────────── Pages et menu ─────────── */

/** Page vue (route). Envoyé par RouteAnalytics à chaque changement de route. */
export function trackPageView(pageKey: string, pathname: string, title: string): void {
  trackEventOnce(`page_view:${pageKey}`, 'page_view', {
    page_location: `${window.location.origin}${pathname}`,
    page_path: pathname,
    page_title: title,
  });
}

/** Consultation du menu digital (/menu), une fois par visite de page. */
export function trackMenuView(pageKey: string): void {
  trackEventOnce(`menu_view:${pageKey}`, 'menu_view', { menu_name: 'menu_digital' });
}

/** Une section du menu devient visible à l'écran (une fois par visite de page). */
export function trackMenuSectionView(pageKey: string, sectionName: string): void {
  trackEventOnce(`menu_section_view:${pageKey}:${sectionName}`, 'menu_section_view', {
    section_name: sectionName,
  });
}

/* ─────────── Commande ─────────── */

/**
 * Début d'une commande : le formulaire de commande s'ouvre avec au moins un article.
 * Ne signifie PAS que la commande a été passée.
 */
export function trackBeginCheckout(lines: CartLineForTracking[], scope: OrderScope): void {
  const items = lines.map((line) => ({
    item_id: line.item.id,
    item_name: line.item.name,
    item_category: line.item.category,
    price: line.item.price,
    quantity: line.quantity,
  }));
  const value = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  trackEvent('begin_checkout', {
    currency: 'XOF', // F CFA
    value,
    item_count: lines.reduce((sum, line) => sum + line.quantity, 0),
    order_scope: scope,
    items,
  });
}

/**
 * Clic sur un bouton/lien WhatsApp (contact, réservation, commande, partage).
 * Intention uniquement : la conversation WhatsApp n'est pas mesurable.
 */
export function trackWhatsAppClick(params: {
  placement: ActionPlacement;
  businessUnit?: BusinessUnit;
  orderMode?: OrderModeValue;
}): void {
  trackEvent('whatsapp_click', {
    placement: params.placement,
    ...(params.businessUnit ? { business_unit: params.businessUnit } : {}),
    ...(params.orderMode ? { order_mode: params.orderMode } : {}),
  });
}

/** Clic sur un numéro de téléphone (appel lancé ou tenté). */
export function trackPhoneClick(params: {
  placement: ActionPlacement;
  businessUnit: BusinessUnit;
  orderMode?: OrderModeValue;
}): void {
  trackEvent('phone_click', {
    placement: params.placement,
    business_unit: params.businessUnit,
    ...(params.orderMode ? { order_mode: params.orderMode } : {}),
  });
}

/**
 * L'internaute déclare avoir passé sa commande par téléphone
 * (bouton « J'ai passé ma commande au téléphone »).
 * ⚠️ Déclaratif : l'appel n'est pas vérifié. Ne pas le considérer comme une
 * commande confirmée, ni comme un objectif « purchase ».
 */
export function trackOrderPhoneDeclared(params: {
  scope: OrderScope;
  orderMode: OrderModeValue;
  value: number;
  itemCount: number;
}): void {
  trackEvent('order_phone_declared', {
    currency: 'XOF',
    value: params.value,
    item_count: params.itemCount,
    order_scope: params.scope,
    order_mode: params.orderMode,
  });
}

/* ─────────── Utilitaires ─────────── */

/** Composition du panier (restaurant, rooftop ou mixte). */
export function orderScopeFromSections(sections: Array<'restaurant' | 'rooftop'>): OrderScope {
  const hasRestaurant = sections.includes('restaurant');
  const hasRooftop = sections.includes('rooftop');
  if (hasRestaurant && hasRooftop) return 'mixed';
  return hasRooftop ? 'rooftop' : 'restaurant';
}
