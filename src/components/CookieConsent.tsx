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

  // Les deux boutons ont exactement le même format (taille, bordure, couleur, police) :
  // refuser est aussi simple qu'accepter (exigence CNIL).
  const buttonBase =
    'flex-1 min-h-11 py-2.5 px-4 rounded-xl text-sm font-extrabold transition-colors active:scale-95 cursor-pointer bg-neutral-950 border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-neutral-950';

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      className="fixed inset-x-3 bottom-[104px] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-sm z-[70] bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-3.5 sm:p-4 animate-fade-in-up"
    >
      <div className="flex gap-3">
        <Cookie className="hidden sm:block w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="cookie-consent-title" className="text-sm font-bold text-white mb-1">
            Mesure d'audience
          </h2>
          <p id="cookie-consent-text" className="text-[13px] text-slate-300 leading-snug">
            Avec votre accord, Google Analytics mesure les pages et les boutons consultés pour améliorer le site.
            Ni publicité ni remarketing. Aucun numéro de téléphone ni message WhatsApp n'est transmis. Vous pouvez
            changer d'avis via « Gérer les cookies » (pied de page).
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button type="button" onClick={() => decide('denied')} className={buttonBase}>
          Refuser
        </button>
        <button type="button" onClick={() => decide('granted')} className={buttonBase}>
          Accepter
        </button>
      </div>
    </div>
  );
};
