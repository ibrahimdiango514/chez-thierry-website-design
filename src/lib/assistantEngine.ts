/**
 * 🤖 ASSISTANT — point d'entrée public
 * ────────────────────────────────────
 * Ré-exporte l'API stable utilisée par l'interface (Assistant.tsx) :
 *  - handleMessage() : envoie un message, reçoit réponse + actions panier
 *  - getGreeting() / welcomeMessage() : salutation selon l'heure
 *  - types partagés
 * Le moteur actif (local ou n8n) est choisi par la façade provider.
 */
import { ASSISTANT_CONFIG } from '../config/assistant';

export const getGreeting = (): string => {
  const h = new Date().getHours();
  return h >= 5 && h < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

export const welcomeMessage = (): string =>
  `${getGreeting()} Je suis ${ASSISTANT_CONFIG.name}, votre guide chez Chez Thierry x Le Palmier.\n\n${ASSISTANT_CONFIG.welcome}`;

export { getActiveProvider } from './assistant/provider';
export { handleMessage } from './assistant/provider';
export type { ProviderName } from './assistant/provider';
export type {
  AssistantAction,
  AssistantState,
  CartEntry,
  ChatTurn,
  AssistantContext,
  ProviderContext,
  ProviderResult,
} from './assistant/types';
