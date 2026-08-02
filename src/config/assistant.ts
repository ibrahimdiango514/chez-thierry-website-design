/**
 * ⚙️ CONFIGURATION DE L'ASSISTANT — Chez Thierry x Le Palmier
 * ─────────────────────────────────────────────────────────────
 * Tout se modifie ici : le nom, l'avatar, les messages.
 * La structure est prête pour brancher plus tard un vrai agent IA (n8n) :
 * il suffira de renseigner l'URL du webhook dans les variables
 * d'environnement (voir `.env.example`) — l'interface restera identique.
 */

/* Récupère une variable d'environnement Vite de façon typée (sans plugin). */
function env(name: string): string {
  const meta = import.meta as unknown as { env?: Record<string, string> };
  return meta.env?.[name] ?? '';
}

export const ASSISTANT_CONFIG = {
  /** 👤 Nom de l'assistant (identité de marque Chez Thierry) */
  name: 'Chef Thierry',

  /** 🖼️ Avatar 3D du personnage (déposée dans public/images/assistant/) */
  avatar: '/images/assistant/assistant-avatar-3d.jpg',

  /** 👋 Message d'accueil (l'heure est ajoutée automatiquement : Bonjour/Bonsoir) */
  welcome: 'Je peux vous aider à choisir un plat, découvrir notre carte ou préparer votre commande.',

  /**
   * 💬 Bulle de bienvenue affichée à l'arrivée (avant tout clic),
   * pour que le client comprenne immédiatement qu'un assistant existe.
   */
  bubble: 'Bonjour 👋 Je suis l’assistant Chez Thierry. Je peux vous aider à découvrir notre carte et préparer votre commande.',
  /** Durée d'affichage de la bulle (ms) avant qu'elle ne disparaisse seule */
  bubbleDuration: 12000,
  /** Délai avant l'apparition de la bulle au chargement (ms) */
  bubbleDelay: 1200,
  /** Étiquette discrète sous l'avatar (hover/desktop) */
  hint: 'Besoin d’aide ?',

  /** 🤖 FUTUR : URL du webhook n8n / API externe (vide pour l'instant) */
  webhookUrl: env('VITE_ASSISTANT_WEBHOOK_URL'),

  /**
   * Passe à `true` (ou renseigne VITE_ASSISTANT_WEBHOOK_URL) quand le vrai
   * agent n8n est prêt : l'assistant enverra alors chaque message au webhook
   * et affichera la réponse du moteur externe.
   */
  useExternalAI: Boolean(env('VITE_ASSISTANT_WEBHOOK_URL')),
} as const;
