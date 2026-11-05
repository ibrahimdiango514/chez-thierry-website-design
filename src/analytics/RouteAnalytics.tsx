import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './events';
import { useAnalyticsActive } from './ga4';
import { useVisitId } from './useVisitId';

/**
 * 📄 Suivi des pages vues pour l'application SPA (React Router).
 *
 * Envoie un événement `page_view` à chaque changement de route.
 * Monté une seule fois dans App.tsx, à l'intérieur de <BrowserRouter>.
 * Si le consentement est accordé après l'arrivée sur la page, la page
 * courante est envoyée dès l'acceptation (pas de trou de mesure).
 */
export function RouteAnalytics(): null {
  const visitId = useVisitId();
  const { pathname } = useLocation();
  const active = useAnalyticsActive();

  useEffect(() => {
    if (!active) return;
    trackPageView(visitId, pathname, document.title);
  }, [active, visitId, pathname]);

  return null;
}
