/**
 * 🔷 TYPES PARTAGÉS DE L'ASSISTANT — agent conversationnel
 * ──────────────────────────────────────────────────────
 * Ces types sont utilisés par le moteur local ET par le futur agent n8n.
 * L'état est sérialisable (JSON) : il peut donc être transmis à un
 * webhook externe et restauré — l'interface utilisateur ne change pas.
 */
import { MenuItem } from '../../types';
import type { Establishment } from '../restaurantKnowledge';

/** Action retournée par le moteur et exécutée par l'interface (panier réel) */
export type AssistantAction =
  | { type: 'addToCart'; item: MenuItem; section: Establishment; quantity: number }
  | { type: 'removeFromCart'; itemId: string }
  | { type: 'updateQuantity'; itemId: string; quantity: number }
  | { type: 'clearCart' };

/** Entrée de panier normalisée (fournie par la page à l'assistant) */
export interface CartEntry {
  key: string;
  item: MenuItem;
  quantity: number;
  section?: Establishment;
}

/** État conversationnel de l'assistant (sérialisable) */
export interface AssistantState {
  /** Action en attente de validation explicite du client */
  pendingAction?: AssistantAction;
  awaiting?: 'confirm-action';
  /** Dernière liste présentée (pour « le premier », « le 2e »…) */
  lastList?: { id: string; name: string; section: Establishment }[];
  /** Dernier plat mentionné */
  lastMentioned?: { id: string; name: string; section: Establishment };
  /** Dernière catégorie évoquée */
  lastCategory?: string;
  /** Menus complets présentés (pour « le menu 2 »…) */
  lastMenus?: { label: string; ids: string[] }[];
}

/** Tour de conversation (historique) */
export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

/** Contexte léger du client (panier résumé) */
export interface AssistantContext {
  cartCount?: number;
  cartTotal?: number;
  page?: 'home' | 'menu';
}

/** Contexte complet transmis au moteur (local ou n8n) */
export interface ProviderContext {
  text: string;
  history: ChatTurn[];
  state: AssistantState;
  cart: CartEntry[];
  cartInfo: AssistantContext;
  assistantName: string;
  welcome: string;
}

/** Résultat renvoyé par le moteur */
export interface ProviderResult {
  reply: string;
  actions: AssistantAction[];
  state: AssistantState;
}
