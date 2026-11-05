import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { applyConsent } from '../analytics/ga4';
import { CONSENT_REQUEST_EVENT, getStoredConsent, storeConsent, ConsentChoice } from '../analytics/consent';

/* ─────────────────────────────────────────────────────────────
   🍪 BANDEAU DE CONSENTEMENT — mesure d'audience
   ─────────────────────────────────────────────────────────────
   • Affiché tant qu'aucun choix n'est enregistré (ou si le choix a expiré).
   • « Accepter » et « Refuser » ont le même poids visuel et la même
     facilité d'accès (exigence CNIL).
   • Aucun traceur n'est chargé avant « Accepter ».
   • Réouvrable à tout moment via le lien « Gérer les cookies » du footer.
   ───────────────────────────────────────────────────────────── */
export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(() => getStoredConsent() === null);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener(CONSENT_REQUEST_EVENT, show);
    return () => window.removeEventListener(CONSENT_REQUEST_EVENT, show);
  }, []);

  if (!visible) return null;

  const decide = (choice: ConsentChoice) => {
    // 1. On mémorise le choix AVANT d'appliquer (un éventuel rechargement le relira)
    storeConsent(choice);
    setVisible(false);
    // 2. On applique : chargement de GA4 ou arrêt complet de la mesure
    applyConsent(choice);
  };

  const buttonBase =
    'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-95 cursor-pointer';

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-[45] bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-4 sm:p-5 animate-fade-in-up"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="cookie-consent-title" className="text-sm font-bold text-white mb-1">
            Mesure d'audience
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Avec votre accord, nous utilisons Google Analytics pour savoir quelles pages et quels menus sont consultés
            et quels boutons sont utilisés, afin d'améliorer le site. Aucune publicité, aucun remarketing.
            Aucun numéro de téléphone, nom ni contenu de message n'est transmis. Vous pouvez changer d'avis à tout
            moment via « Gérer les cookies » en bas de page.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => decide('denied')}
          className={`${buttonBase} bg-neutral-900 border border-neutral-700 text-slate-200 hover:text-white hover:border-neutral-600`}
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => decide('granted')}
          className={`${buttonBase} bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md`}
        >
          Accepter
        </button>
      </div>
    </div>
  );
};
