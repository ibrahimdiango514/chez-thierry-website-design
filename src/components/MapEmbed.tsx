import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   🗺️ CARTE GOOGLE MAPS — chargée à la demande
   ─────────────────────────────────────────────────────────────
   L'iframe Google Maps transmet l'adresse IP et des cookies à Google dès son
   chargement. Elle n'est donc insérée dans la page qu'après un clic explicite
   de l'utilisateur (aucune requête vers Google avant cette action).
   ───────────────────────────────────────────────────────────── */

const EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.1894458319694!2d-7.9866449!3d12.6355418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe51cd655a0b27b9%3A0x67399a9cf5187e1a!2sChez%20Thierry!5e0!3m2!1sfr!2sml!4v1700000000000!5m2!1sfr!2sml';

const OPEN_URL = 'https://www.google.com/maps/search/?api=1&query=Chez+Thierry,+Rue+548,+Quinzambougou,+Bamako,+Mali';

export const MapEmbed: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl h-72">
      {loaded ? (
        <iframe
          title="Localisation Chez Thierry Bamako"
          src={EMBED_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-neutral-900/60 px-6 text-center">
          <MapPin className="w-8 h-8 text-amber-400" aria-hidden="true" />
          <p className="text-sm text-slate-300 max-w-xs leading-snug">
            La carte est chargée à votre demande. Google peut alors recevoir des informations de connexion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="min-h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Afficher la carte
            </button>
            <a
              href={OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 inline-flex items-center px-5 rounded-xl border border-neutral-700 text-slate-200 hover:text-white hover:border-amber-500 font-bold text-sm transition-colors"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
