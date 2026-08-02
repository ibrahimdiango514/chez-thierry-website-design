/**
 * 🏗️ FAÇADE DU PROVIDER — point d'entrée unique de l'assistant
 * ─────────────────────────────────────────────────────────────
 * L'interface appelle handleMessage() ; la façade choisit le moteur actif :
 *  - 'local' → le moteur conversationnel embarqué (par défaut)
 *  - 'n8n'   → le futur agent IA externe (si VITE_ASSISTANT_WEBHOOK_URL défini)
 *
 * L'interface utilisateur reste identique quel que soit le moteur.
 */
import { ASSISTANT_CONFIG } from '../../config/assistant';
import { localHandleMessage } from './localProvider';
import { n8nHandleMessage } from './n8nProvider';
import type { ProviderContext, ProviderResult } from './types';

export type ProviderName = 'local' | 'n8n';

export function getActiveProvider(): ProviderName {
  return ASSISTANT_CONFIG.useExternalAI && ASSISTANT_CONFIG.webhookUrl ? 'n8n' : 'local';
}

export async function handleMessage(ctx: ProviderContext): Promise<ProviderResult> {
  const provider = getActiveProvider();
  if (provider === 'n8n') return n8nHandleMessage(ctx);
  return localHandleMessage(ctx);
}
