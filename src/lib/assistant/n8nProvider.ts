/**
 * 🤖 PROVIDER EXTERNE (n8n / LLM) — FUTUR
 * ────────────────────────────────────────
 * Quand ASSISTANT_CONFIG.webhookUrl est renseigné (ou VITE_ASSISTANT_WEBHOOK_URL),
 * chaque message du client est envoyé à l'agent n8n avec l'historique,
 * l'état de conversation et le panier — et la réponse de l'agent est affichée.
 *
 * Protocole attendu (réponse JSON) :
 * {
 *   "reply": "texte de réponse de l'agent",
 *   "actions": [ { "type": "addToCart", ... } ]   // optionnel, même format que local
 * }
 *
 * En cas d'erreur réseau, on retombe automatiquement sur le moteur local.
 */
import { ASSISTANT_CONFIG } from '../../config/assistant';
import { localHandleMessage } from './localProvider';
import type { AssistantAction, ProviderContext, ProviderResult } from './types';

function isAction(v: unknown): v is AssistantAction {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  if (a.type === 'addToCart') return typeof (a as { item?: unknown }).item === 'object';
  if (a.type === 'removeFromCart') return typeof (a as { itemId?: unknown }).itemId === 'string';
  if (a.type === 'updateQuantity') return typeof (a as { itemId?: unknown }).itemId === 'string';
  if (a.type === 'clearCart') return true;
  return false;
}

export async function n8nHandleMessage(ctx: ProviderContext): Promise<ProviderResult> {
  try {
    const res = await fetch(ASSISTANT_CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: ctx.text,
        history: ctx.history,
        state: ctx.state,
        cart: ctx.cart,
        context: {
          cartCount: ctx.cartInfo.cartCount,
          cartTotal: ctx.cartInfo.cartTotal,
          page: ctx.cartInfo.page,
          assistantName: ASSISTANT_CONFIG.name,
        },
      }),
    });
    const data = await res.json();
    const reply = data?.reply ?? data?.message ?? data?.text ?? data?.response;
    const actions = Array.isArray(data?.actions) ? data.actions.filter(isAction) : [];
    if (typeof reply === 'string' && reply.trim()) {
      return { reply, actions, state: ctx.state };
    }
  } catch {
    /* erreur réseau : fallback local */
  }
  return localHandleMessage(ctx);
}
