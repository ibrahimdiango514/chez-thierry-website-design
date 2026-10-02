import React from 'react';
import { OrderMode } from '../types';
import {
  PAUSE_GOURMANDE_DESSERTS,
  PAUSE_GOURMANDE_FORMULES,
  PAUSE_GOURMANDE_TOPPINGS,
  PAUSE_GOURMANDE_SUPPLEMENTS,
} from '../data';
import { DishImage } from './DishImage';
import { OrderModeButtons } from './OrderModeButtons';
import { Clock, Coffee, Sparkles, PlusCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   ☕ SECTION « PAUSE GOURMANDE / SWEET BREAK » (15h00 à 17h30)
   ───────────────────────────────────────────────────────────── */

interface PauseGourmandeProps {
  onSelectMode?: (item: { name: string; price: number; description?: string }, mode: OrderMode) => void;
  onAddToCart?: (item: MenuItem) => void;
}

export const PauseGourmande: React.FC<PauseGourmandeProps> = ({ onSelectMode, onAddToCart }) => {
  return (
    <section
      id="pause-gourmande"
      aria-labelledby="pause-gourmande-title"
      className="relative w-full max-w-full overflow-hidden border-t border-neutral-900/60 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20 scroll-mt-16"
    >
      {/* Halo ambré doux */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-1/4 h-72 w-96 max-w-full rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* En-tête de section */}
        <div className="mb-10 text-center md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
            <Coffee className="w-3.5 h-3.5" /> Pause Gourmande / Sweet Break
          </span>
          <h2
            id="pause-gourmande-title"
            className="mt-4 font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Pause Gourmande / Sweet Break
          </h2>

          {/* Horaires */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-400 shadow-md">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>HORAIRES : Pause Gourmande : de 15h00 à 17h30</span>
          </div>
        </div>

        {/* ── 1. NOS DESSERTS GOURMANDS ── */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span>🥞</span> Nos Desserts Gourmands
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Gaufre • Pancake • Crêpe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAUSE_GOURMANDE_DESSERTS.map((dessert) => (
              <div
                key={dessert.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-amber-500/40 hover:bg-neutral-900/80 shadow-xl"
              >
                <div>
                  {/* Photo soignée prête à recevoir l'image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800/80">
                    <DishImage
                      src={dessert.image}
                      alt={dessert.name}
                      emoji={dessert.emoji ?? '🥞'}
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-neutral-950/80 backdrop-blur-md border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
                      {dessert.price.toLocaleString()} F CFA
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-playfair text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {dessert.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 font-light">
                      Servi généreusement avec glace et chantilly, selon vos envies.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800/60 flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold text-neutral-400">Prix</span>
                    <span className="text-base font-extrabold text-amber-400">
                      {dessert.price.toLocaleString()} F CFA
                    </span>
                  </div>
                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: dessert.id,
                          name: dessert.name,
                          price: dessert.price,
                          category: 'Pause Gourmande',
                          description: 'Servi avec glace et chantilly',
                          image: dessert.image,
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/40 hover:border-amber-500 text-amber-400 hover:text-neutral-950 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <span>🛒</span> Ajouter au panier
                    </button>
                  )}
                  <OrderModeButtons
                    dish={{ name: dessert.name, price: dessert.price }}
                    className="w-full"
                    onSelectMode={
                      onSelectMode
                        ? (_d, mode) =>
                            onSelectMode(
                              {
                                id: dessert.id,
                                name: dessert.name,
                                price: dessert.price,
                                description: 'Pause Gourmande',
                              },
                              mode
                            )
                        : undefined
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. NOS FORMULES ── */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" /> Nos Formules
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Formules gourmandes &amp; boissons
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAUSE_GOURMANDE_FORMULES.map((formula) => (
              <div
                key={formula.id}
                className="relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950 p-6 shadow-xl transition-all hover:border-amber-500/40"
              >
                <div>
                  <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3">
                    {formula.name}
                  </span>
                  <h4 className="font-playfair text-xl font-bold text-white">
                    {formula.name}
                  </h4>
                  <div className="my-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-amber-400">
                      {formula.price.toLocaleString()} F
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">F CFA</span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {formula.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: formula.id,
                          name: `${formula.name} — ${formula.description}`,
                          price: formula.price,
                          category: 'Pause Gourmande',
                          description: formula.description,
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/40 hover:border-amber-500 text-amber-400 hover:text-neutral-950 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <span>🛒</span> Ajouter au panier
                    </button>
                  )}
                  <OrderModeButtons
                    dish={{ name: `${formula.name} (${formula.description})`, price: formula.price }}
                    className="w-full"
                    onSelectMode={
                      onSelectMode
                        ? (_d, mode) =>
                            onSelectMode(
                              {
                                id: formula.id,
                                name: formula.name,
                                price: formula.price,
                                description: formula.description,
                              },
                              mode
                            )
                        : undefined
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. TOPPINGS & ACCOMPAGNEMENTS + 4. SUPPLÉMENTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Toppings & Accompagnements */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 shadow-xl">
            <h4 className="font-playfair text-xl font-bold text-amber-400 flex items-center gap-2 mb-3">
              <span>🍫</span> Toppings &amp; Accompagnements
            </h4>
            <p className="text-xs text-neutral-400 font-light mb-4">
              Personnalisez vos crêpes, gaufres et pancakes avec notre sélection d’accompagnements :
            </p>
            <div className="flex flex-wrap gap-2">
              {PAUSE_GOURMANDE_TOPPINGS.map((topping) => (
                <span
                  key={topping}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1.5 text-xs font-medium text-slate-200"
                >
                  <span className="text-amber-400">•</span> {topping}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-neutral-500 italic">
              Chocolat • Caramel • Chantilly • Glace • Spéculoos • Oreo • Noisettes / amandes
            </p>
          </div>

          {/* Suppléments avec bouton « Ajouter au panier » individuel */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 shadow-xl">
            <h4 className="font-playfair text-xl font-bold text-amber-400 flex items-center gap-2 mb-3">
              <PlusCircle className="w-5 h-5" /> Suppléments
            </h4>
            <p className="text-xs text-neutral-400 font-light mb-4">
              Ajoutez une touche de gourmandise supplémentaire à votre commande :
            </p>
            <div className="space-y-3">
              {PAUSE_GOURMANDE_SUPPLEMENTS.map((supp) => (
                <div
                  key={supp.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-3.5 hover:border-amber-500/30 transition-colors"
                >
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {supp.name}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">
                      {supp.price.toLocaleString()} F CFA
                    </span>
                  </div>

                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: supp.id,
                          name: `Supplément ${supp.name}`,
                          price: supp.price,
                          category: 'Suppléments',
                          description: `Supplément ${supp.name}`,
                          image: '/images/menu/restaurant/supplement-daccompagnement.jpg',
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer self-end sm:self-auto"
                    >
                      <span>+</span> Ajouter au panier
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
