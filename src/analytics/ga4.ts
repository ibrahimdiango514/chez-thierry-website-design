/**
 * ─────────────────────────────────────────────────────────────
 * 📊 GOOGLE ANALYTICS 4 — chargeur et envoi d'événements
 * ─────────────────────────────────────────────────────────────
 * Principes :
 *  • RIEN n'est chargé ni envoyé tant que l'internaute n'a pas accepté la
 *    mesure d'audience (CNIL : Google Analytics n'est pas exempté de consentement).
 *  • Consent Mode v2 : analytics_storage est piloté par le choix ; les signaux
 *    publicitaires (ad_storage, ad_user_data, ad_personalization) restent
 *    « denied » en permanence : aucun remarketing, aucune personnalisation.
 *  • Les pages vues sont envoyées manuellement à chaque changement de route
 *    (SPA React Router) : send_page_view est désactivé pour éviter les doublons.
 *  • Chaque paramètre est « nettoyé » avant envoi : e-mails et numéros de
 *    téléphone sont remplacés par « [redacted] » (filet de sécurité).
 *  • Le script gtag.js est chargé en asynchrone : il n'impacte pas le rendu.
 * ─────────────────────────────────────────────────────────────
 */
import { useSyncExternalStore } from 'react';
import { ConsentChoice, getStoredConsent } from './consent';

/** ID de mesure GA4 (flux « Chez Thierry x Le Palmier – Site Web »).
 *  Peut être surchargé par VITE_GA_MEASUREMENT_ID (voir .env.example). */
export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || 'G-0X8Q5E2MNL';

/** Mode debug GA4 : événements visibles dans DebugView uniquement.
 *  Actif en développement, ou sur le site avec ?ga_debug=1 (test en production). */
const DEBUG_MODE: boolean =
  import.meta.env.DEV || new URLSearchParams(window.location.search).has('ga_debug');

/** Durée de vie des cookies GA : 390 jours (CNIL : 13 mois maximum). */
const COOKIE_EXPIRES_SECONDS = 390 * 24 * 60 * 60;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let scriptRequested = false;
/** true = gtag.js chargé ET consentement accordé : les événements partent. */
let active = false;

const listeners = new Set<() => void>();
/** Clés déjà envoyées (évite les doublons : StrictMode, re-rendus, etc.). */
const sentKeys = new Set<string>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

/** File gtag standard : gtag() doit empiler l'objet `arguments` (exigence gtag.js). */
function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
  }
}

function gtagCall(...args: unknown[]): void {
  ensureGtag();
  window.gtag!(...args);
}

/* ─────────── Nettoyage des données (filet de sécurité RGPD) ─────────── */

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
// Numéros de téléphone : « +223… », « 66 42 77 77 » (groupes de 2 chiffres) ou 8 à 15 chiffres
// consécutifs. Volontairement sans correspondance sur les adresses IP, ports ou dates.
const PHONE_RE = /\+\d[\d\s().-]{6,}\d|\b\d{2}(?:[ .-]\d{2}){3,4}\b|\b\d{8,15}\b/g;

function scrub(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(EMAIL_RE, '[redacted]').replace(PHONE_RE, '[redacted]');
  }
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, scrub(v)]));
  }
  return value;
}

function sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
  const clean = scrub(params) as Record<string, unknown>;
  if (import.meta.env.DEV && JSON.stringify(clean) !== JSON.stringify(params)) {
    console.warn('[analytics] Donnée potentiellement personnelle masquée avant envoi.');
  }
  return clean;
}

/* ─────────── Cookies : suppression lors d'un retrait de consentement ─────────── */

function deleteGaCookies(): void {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => /^(_ga(_[A-Z0-9]+)?|_gid|_gat(_gtag_[A-Z0-9_]+)?)$/.test(n));

  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
        (domain ? `; domain=${domain}` : '');
    }
  }
}

/* ─────────── Cycle de vie ─────────── */

/**
 * À appeler une seule fois au démarrage de l'application (main.tsx).
 * Définit le consentement par défaut (« denied ») AVANT tout chargement de
 * gtag.js, puis active la mesure si l'internaute a déjà accepté.
 */
export function initAnalytics(): void {
  if (initialized) return;
  initialized = true;

  ensureGtag();
  gtagCall('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (getStoredConsent() === 'granted') {
    activate();
  }
}

function activate(): void {
  if (active) return;
  active = true;

  gtagCall('consent', 'update', { analytics_storage: 'granted' });

  if (!scriptRequested) {
    scriptRequested = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);

    gtagCall('js', new Date());
    gtagCall('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // pages vues envoyées par l'application (SPA)
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: COOKIE_EXPIRES_SECONDS,
      ...(DEBUG_MODE ? { debug_mode: true } : {}),
    });
  }
  notify();
}

/**
 * Applique le choix de l'internaute.
 *  • « granted » : charge GA4 et active l'envoi.
 *  • « denied »  : arrête l'envoi, supprime les cookies GA. Si gtag.js était
 *    déjà chargé sur cette page, on recharge la page pour qu'il soit
 *    complètement déchargé (aucun envoi résiduel après retrait du consentement).
 */
export function applyConsent(choice: ConsentChoice): void {
  if (choice === 'granted') {
    activate();
    return;
  }

  const wasLoaded = scriptRequested;
  active = false;
  deleteGaCookies();
  notify();

  if (wasLoaded) {
    window.location.reload();
  }
}

/* ─────────── État réactif (React) ─────────── */

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Hook : true lorsque la mesure d'audience est active (consentement accordé). */
export function useAnalyticsActive(): boolean {
  return useSyncExternalStore(subscribe, () => active, () => false);
}

/* ─────────── Envoi d'événements ─────────── */

/** Envoie un événement GA4. No-op si la mesure n'est pas active. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!active) return;
  gtagCall('event', name, { ...sanitizeParams(params), transport_type: 'beacon' });
}

/**
 * Envoie un événement une seule fois par clé (ex. « page_view:<route> »).
 * Si la mesure n'est pas encore active, rien n'est mémorisé : l'événement
 * sera envoyé dès l'acceptation du consentement.
 */
export function trackEventOnce(key: string, name: string, params: Record<string, unknown> = {}): void {
  if (!active || sentKeys.has(key)) return;
  sentKeys.add(key);
  trackEvent(name, params);
}
