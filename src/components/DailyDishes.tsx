import React from 'react';
import { DailyDish, DailyDishPeriod, MenuItem } from '../types';
import {
  WEEK_DAILY_DISHES,
  WEEKEND_DAILY_DISHES,
} from '../data';
import { Plus } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   🍽️ SECTION « PLATS DU JOUR — SEMAINE & WEEK-END »
   ───────────────────────────────────────────────────────────── */

interface DishListProps {
  dishes: DailyDish[];
  onAddToCart?: (item: MenuItem) => void;
}

const DishList: React.FC<DishListProps> = ({ dishes, onAddToCart }) => (
  <ul className="flex flex-col">
    {dishes.map((dish) => {
      const isClosed = dish.name.toLowerCase() === 'fermé';

      return (
        <li
          key={dish.id}
          className="group border-b border-neutral-800/60 py-4 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            {/* Jour */}
            <span
              className={`inline-flex w-fit shrink-0 items-center justify-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest sm:w-28 ${
                isClosed
                  ? 'border-neutral-800 bg-neutral-900/60 text-neutral-500'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}
            >
              {dish.day}
            </span>

            {/* Plat + description + prix */}
            <div className="mt-2 sm:mt-0 min-w-0 flex-1">
              {dish.image && !isClosed && (
                <img
                  src={dish.image}
                  alt={`${dish.name} — plat du ${dish.day.toLowerCase()}`}
                  loading="lazy"
                  decoding="async"
                  className="mb-3 w-full max-w-[300px] rounded-xl border border-neutral-800 bg-neutral-950 object-contain"
                />
              )}
              <div className="flex flex-wrap items-baseline gap-2">
                <h4
                  className={`font-playfair text-lg sm:text-xl md:text-2xl font-bold leading-snug break-words transition-colors ${
                    isClosed
                      ? 'text-neutral-500 italic'
                      : 'text-white group-hover:text-amber-400'
                  }`}
                >
                  {dish.name}
                </h4>
                {isClosed && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">
                    Restaurant fermé
                  </span>
                )}
              </div>

              {dish.description && (
                <p className="mt-1 text-xs sm:text-sm font-light leading-relaxed text-slate-400 break-words">
                  {dish.description}
                </p>
              )}

              {dish.price !== undefined && (
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-bold text-amber-400">
                    {dish.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </p>
              )}

              {/* Bouton unique « Ajouter au panier » */}
              {!isClosed && onAddToCart && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      onAddToCart({
                        id: dish.id,
                        name: `${dish.day} : ${dish.name}`,
                        price: dish.price ?? 5000,
                        category: 'Plats du jour',
                        description: dish.description,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </li>
      );
    })}
  </ul>
);

interface DishCategoryProps {
  badge: string;
  title: string;
  subtitle: string;
  emoji: string;
  dishes: DailyDish[];
  highlighted?: boolean;
  onAddToCart?: (item: MenuItem) => void;
}

export const DishCategory: React.FC<DishCategoryProps> = ({
  badge,
  title,
  subtitle,
  emoji,
  dishes,
  highlighted = false,
  onAddToCart,
}) => (
  <div
    className={`relative flex h-full flex-col rounded-3xl border bg-gradient-to-b p-5 sm:p-6 md:p-8 shadow-2xl ${
      highlighted
        ? 'border-amber-500/40 from-amber-500/10 via-neutral-900/60 to-neutral-950 shadow-amber-500/10'
        : 'border-neutral-800/80 from-neutral-900/60 via-neutral-900/30 to-neutral-950'
    }`}
  >
    {/* En-tête de catégorie */}
    <div className="mb-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
        {badge}
      </span>
      <h3 className="mt-4 flex items-center gap-2 font-playfair text-2xl md:text-3xl font-bold text-amber-400">
        <span aria-hidden="true">{emoji}</span>
        {title}
      </h3>
      <p className="mt-1 text-[11px] sm:text-xs font-light uppercase tracking-widest text-neutral-500">
        {subtitle}
      </p>
    </div>

    <DishList dishes={dishes} onAddToCart={onAddToCart} />

    {/* Note de prix */}
    <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-3">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Tarifs des plats
      </span>
      <span className="text-xs sm:text-sm font-bold text-amber-400">
        Selon sélection
      </span>
    </div>
  </div>
);

export const DAILY_DISH_CATEGORIES: (Omit<DishCategoryProps, 'onAddToCart'> & { id: DailyDishPeriod })[] = [
  {
    id: 'semaine',
    badge: '🗓️ Lundi → Vendredi',
    emoji: '🥘',
    title: 'Plats de la semaine',
    subtitle: 'Les suggestions du lundi au vendredi',
    dishes: WEEK_DAILY_DISHES,
  },
  {
    id: 'weekend',
    badge: '✨ Samedi & Dimanche',
    emoji: '⭐',
    title: 'Plats du weekend',
    subtitle: 'Les plats généreux du samedi et du dimanche',
    dishes: WEEKEND_DAILY_DISHES,
    highlighted: true,
  },
];

export const DailyDishes: React.FC<{
  onAddToCart?: (item: MenuItem) => void;
}> = ({ onAddToCart }) => {
  const categories = DAILY_DISH_CATEGORIES;

  return (
    <section
      id="plat-du-jour"
      aria-labelledby="plat-du-jour-title"
      className="relative w-full max-w-full overflow-hidden border-t border-neutral-900/60 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20"
    >
      {/* Halo ambré discret */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Titre de la section */}
        <div className="mb-8 text-center md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
            🍽️ Plats du jour – Semaine &amp; Week-end
          </div>
          <h2
            id="plat-du-jour-title"
            className="mt-4 font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Nos Plats du Jour
          </h2>
          <div className="mt-3 inline-block rounded-xl border border-amber-500/40 bg-neutral-900/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-400">
            PLATS DU JOUR — SEMAINE &amp; WEEKEND
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            Dans le cadre du nouveau service continu, découvrez les plats du jour de la semaine et du week-end.
          </p>
        </div>

        {/* Les deux catégories : Semaine & Weekend */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 mb-16">
          {categories.map((category) => (
            <DishCategory key={category.id} {...category} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* Note d'information */}
        <p className="mt-6 text-center text-[11px] font-light italic leading-relaxed text-neutral-500 md:mt-8 md:text-xs">
          * Plats servis selon la disponibilité du marché — Restaurant et Rooftop ouverts du mardi au dimanche.
        </p>
      </div>
    </section>
  );
};
