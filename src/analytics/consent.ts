/**
 * ─────────────────────────────────────────────────────────────
 * 🍪 CONSENTEMENT — mesure d'audience (Google Analytics 4)
 * ─────────────────────────────────────────────────────────────
 * Stocke le choix de l'internaute (« accepter » / « refuser ») dans le
 * localStorage du navigateur. Aucune donnée personnelle n'est stockée ici :
 * seulement la valeur du choix et la date à laquelle il a été fait.
 *
 * Durée de validité : 6 mois. Passé ce délai, le bandeau est de nouveau
 * proposé (recommandation de la CNIL pour les traceurs de mesure d'audience).
 * ─────────────────────────────────────────────────────────────
 */

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'ct_consent_analytics_v1';
const MAX_AGE_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 mois

/** Événement window émis pour réafficher le bandeau (lien « Cookies » du footer) */
export const CONSENT_REQUEST_EVENT = 'ct:consent-request';

interface StoredConsent {
  choice: ConsentChoice;
  savedAt: number;
}

/** Retourne le choix enregistré, ou `null` s'il n'existe pas / a expiré. */
export function getStoredConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    const { choice, savedAt } = parsed;
    if ((choice !== 'granted' && choice !== 'denied') || typeof savedAt !== 'number') {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() - savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return choice;
  } catch {
    // Stockage indisponible (navigation privée stricte, etc.) : on considère « pas de choix »
    return null;
  }
}

/** Enregistre le choix de l'internaute. */
export function storeConsent(choice: ConsentChoice): void {
  try {
    const value: StoredConsent = { choice, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* stockage indisponible : le bandeau sera simplement reproposé */
  }
}

/** Demande l'affichage du bandeau de préférences (ex. depuis le footer). */
export function requestConsentBanner(): void {
  window.dispatchEvent(new Event(CONSENT_REQUEST_EVENT));
}
