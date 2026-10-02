import { MenuItem, OrderMode, SectionType, CartItem } from '../types';

export const RESTAURANT_PHONE_DISPLAY = '+223 66 42 77 77';
export const RESTAURANT_PHONE_TEL = '+22366427777';
export const RESTAURANT_PHONE_RAW = '22366427777';

export const ROOFTOP_PHONE_DISPLAY = '+223 76 22 27 77';
export const ROOFTOP_PHONE_TEL = '+22376222777';
export const ROOFTOP_PHONE_RAW = '22376222777';

export const ESTABLISHMENT_LABELS: Record<SectionType, string> = {
  restaurant: 'Restaurant Chez Thierry',
  rooftop: 'Rooftop Le Palmier',
};

export const ESTABLISHMENT_SHORT: Record<SectionType, string> = {
  restaurant: 'Restaurant',
  rooftop: 'Rooftop',
};

export const MODE_LABELS: Record<OrderMode, string> = {
  sur_place: 'Sur place',
  emporter: 'À emporter',
  livraison: 'Livraison',
};

export const getSalutation = (): string => {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

/**
 * Détermine si un article appartient au Restaurant ou au Rooftop
 */
export function getItemSection(item: MenuItem, explicitSection?: SectionType): SectionType {
  if (explicitSection) return explicitSection;

  const rooftopCategories = [
    'Burgers & Fried Food',
    'Grill & African Touch',
    'Mocktails - Sans alcool',
    'Cocktails - Avec alcool',
    'Nos après-midis apéro',
    'Planches Apéro',
  ];

  if (rooftopCategories.includes(item.category)) return 'rooftop';
  if (
    item.id.startsWith('apero-') ||
    item.id.startsWith('rf') ||
    item.id.startsWith('rg') ||
    item.id.startsWith('rm') ||
    item.id.startsWith('rc') ||
    item.id.startsWith('rd')
  ) {
    return 'rooftop';
  }

  return 'restaurant';
}

export interface FormattedOrderMessageParams {
  items: CartItem[];
  mode: OrderMode;
  customerName: string;
  customerPhone: string;
  location?: { lat: number; lng: number } | null;
  manualAddress?: string;
  useManualAddress?: boolean;
  geoAddress?: string;
  geoSource?: 'gps' | 'ip' | null;
  targetSection?: SectionType;
}

/**
 * Construit le texte de commande WhatsApp formaté et propre
 */
export function buildOrderMessage({
  items,
  mode,
  customerName,
  customerPhone,
  location,
  manualAddress,
  useManualAddress,
  geoAddress,
  geoSource,
  targetSection,
}: FormattedOrderMessageParams): string {
  const salutation = getSalutation();
  const total = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const sectionsInCart = Array.from(
    new Set(items.map((ci) => ci.section || getItemSection(ci.item)))
  );
  const isMixed = sectionsInCart.length > 1;

  let sectionLabel = isMixed
    ? `📍 Sections : ${sectionsInCart.map((s) => ESTABLISHMENT_LABELS[s]).join(' + ')}`
    : `📍 Section : ${ESTABLISHMENT_LABELS[targetSection || sectionsInCart[0] || 'restaurant']}`;

  let msg = `${salutation}\n\n${sectionLabel}\n`;
  msg += `🍽️ Mode : ${MODE_LABELS[mode]}\n\n`;
  msg += `📝 Commande :\n`;

  for (const ci of items) {
    const sec = ci.section || getItemSection(ci.item);
    const lineTotal = ci.item.price * ci.quantity;
    let line = `- ${ci.quantity}x ${ci.item.name} (${lineTotal.toLocaleString()} F)`;
    if (isMixed) {
      line += ` [${ESTABLISHMENT_SHORT[sec]}]`;
    }
    msg += `${line}\n`;
  }

  msg += `\n💰 Total : ${total.toLocaleString()} F CFA\n\n`;
  msg += `👤 Client : ${customerName.trim()}\n`;
  msg += `📞 Téléphone : ${customerPhone.trim()}`;

  if (mode === 'livraison') {
    if (location && !useManualAddress) {
      msg += `\n🗺️ Localisation : https://www.google.com/maps?q=${location.lat},${location.lng}`;
      if (geoAddress) {
        msg += `\n📍 Adresse : ${geoAddress}${geoSource === 'ip' ? ' (position approximative)' : ''}`;
      }
    } else if (manualAddress?.trim()) {
      msg += `\n🏠 Adresse : ${manualAddress.trim()}`;
    }
  }

  return msg;
}

/**
 * Retourne le bon numéro WhatsApp selon la composition du panier
 */
export function getWhatsAppNumberForCart(
  items: CartItem[],
  fallbackSection: SectionType = 'restaurant'
): string {
  const sections = Array.from(new Set(items.map((ci) => ci.section || getItemSection(ci.item))));
  if (sections.includes('restaurant')) return RESTAURANT_PHONE_RAW;
  if (sections.includes('rooftop')) return ROOFTOP_PHONE_RAW;
  return fallbackSection === 'rooftop' ? ROOFTOP_PHONE_RAW : RESTAURANT_PHONE_RAW;
}
