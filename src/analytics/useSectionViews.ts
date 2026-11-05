import { useEffect } from 'react';
import { useAnalyticsActive } from './ga4';
import { trackMenuSectionView } from './events';

/**
 * 👁️ Détecte quand une section du menu devient visible à l'écran.
 *
 * @param sections  Correspondance « id HTML de la section → nom GA4 » (ex. { 'apero': 'apero' })
 * @param pageKey   Identifiant de la visite de page (location.key) : un envoi par section et par visite
 *
 * Un seul événement par section et par visite de page, même si l'utilisateur
 * remonte et redescend la page.
 */
export function useSectionViews(sections: Record<string, string>, pageKey: string): void {
  const active = useAnalyticsActive();

  useEffect(() => {
    if (!active || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const name = sections[entry.target.id];
          if (name) trackMenuSectionView(pageKey, name);
        });
      },
      { threshold: 0.25 }
    );

    Object.keys(sections).forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
    // `sections` : constante déclarée au niveau du module par l'appelant
  }, [active, pageKey]);
}
