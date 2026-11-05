/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID de mesure GA4 (optionnel : valeur par défaut dans src/analytics/ga4.ts) */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** URL du webhook de l'assistant IA (optionnel) */
  readonly VITE_ASSISTANT_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
