import React from 'react';
import { OrderMode } from '../types';
import { APERO_PLANCHES } from '../data';
import { DishImage } from './DishImage';
import { OrderModeButtons } from './OrderModeButtons';
import { Clock, Wine, Users } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   🍷 SECTION « NOS APRÈS-MIDIS APÉRO » / « NOS PLANCHES APÉRO »
   (17h30 à 19h30)
   ───────────────────────────────────────────────────────────── */

interface ApresMidisAperoProps {
  onSelectMode?: (item: { name: string; price: number; description?: string }, mode: OrderMode) => void;
}

export const ApresMidisApero: React.FC<ApresMidisAperoProps> = ({ onSelectMode }) => {
  return (
    <section
      id="apero"
      aria-labelledby="apero-title"
      className="relative w-full max-w-full overflow-hidden border-t border-neutral-900/60 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20 scroll-mt-16"
    >
      {/* Halo ambré doux */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 h-72 w-96 max-w-full rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* En-tête de section */}
        <div className="mb-10 text-center md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
            <Wine className="w-3.5 h-3.5" /> Nos après-midis apéro
          </span>
          <h2
            id="apero-title"
            className="mt-4 font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Nos Planches Apéro
          </h2>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-400 shadow-md">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>NOS PLANCHES APÉRO — 17H30 À 19H30</span>
          </div>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-300 md:text-base">
            Un moment convivial autour de planches gourmandes à partager.
          </p>
        </div>

        {/* ── GRILLE DES PLANCHES APÉRO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {APERO_PLANCHES.map((planche) => {
            const isSignature = Boolean(planche.highlighted);

            return (
              <div
                key={planche.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-b p-5 sm:p-6 shadow-2xl transition-all duration-300 ${
                  isSignature
                    ? 'border-amber-500/40 from-amber-500/10 via-neutral-900/80 to-neutral-950 md:col-span-2 shadow-amber-500/10'
                    : 'border-neutral-800 from-neutral-900/70 via-neutral-900/40 to-neutral-950 hover:border-amber-500/40'
                }`}
              >
                <div>
                  {/* Photo container soigné et prêt à recevoir la photo */}
                  <div
                    className={`relative w-full overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800/80 ${
                      isSignature ? 'aspect-[21/9] sm:aspect-[24/9]' : 'aspect-video'
                    }`}
                  >
                    <DishImage
                      src={planche.image}
                      alt={planche.name}
                      emoji={planche.emoji ?? '🍷'}
                    />

                    {/* Badge de prix superposé */}
                    <div className="absolute top-3 right-3 rounded-full bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-amber-400 shadow-lg">
                      {planche.price.toLocaleString()} F CFA
                    </div>

                    {isSignature && (
                      <div className="absolute top-3 left-3 rounded-full bg-amber-500 text-neutral-950 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Grande Planche
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {planche.name}
                      </h3>
                      <span className="text-base sm:text-lg font-extrabold text-amber-400">
                        {planche.price.toLocaleString()} F CFA
                      </span>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
                      {planche.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <OrderModeButtons
                    dish={{ name: planche.name, price: planche.price }}
                    className="w-full"
                    onSelectMode={
                      onSelectMode
                        ? (_d, mode) =>
                            onSelectMode(
                              {
                                name: planche.name,
                                price: planche.price,
                                description: planche.description,
                              },
                              mode
                            )
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Note conviviale */}
        <p className="mt-8 text-center text-[11px] font-light italic leading-relaxed text-neutral-500 md:text-xs">
          * Planches préparées minute pour garantir fraîcheur et saveur — Service apéro de 17h30 à 19h30.
        </p>
      </div>
    </section>
  );
};
