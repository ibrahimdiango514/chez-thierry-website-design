import React from 'react';
import { DailyDish, DailyDishPeriod, OrderMode } from '../types';
import { WEEK_DAILY_DISHES, WEEKEND_DAILY_DISHES } from '../data';
import { OrderModeButtons } from './OrderModeButtons';
import {
  buildDishOrderMessage,
  openWhatsAppOrder,
  WHATSAPP_NUMBERS,
  type Establishment,
} from '../lib/whatsappOrder';

/* ─────────────────────────────────────────────────────────────
   🍽️ SECTION « PLAT DU JOUR » — Page d'accueil (juste après le hero)
   ─────────────────────────────────────────────────────────────
   Deux catégories affichées séparément :
     • Plats de la semaine  → lundi à vendredi
     • Plats du weekend     → samedi et dimanche

   Affichage volontairement sans photo : uniquement le nom du plat
   et une courte description (demande client).

   Le contenu se modifie dans src/data.ts (WEEK_DAILY_DISHES /
   WEEKEND_DAILY_DISHES) — ce composant ne contient aucune donnée en dur.
   ───────────────────────────────────────────────────────────── */

/** Liste des plats d'une catégorie (nom + courte description + commande) */
const DishList: React.FC<{
  dishes: DailyDish[];
  onOrder: (dish: DailyDish, mode: OrderMode) => void;
}> = ({ dishes, onOrder }) => (
  <ul className="flex flex-col">
    {dishes.map((dish) => (
      <li
        key={dish.id}
        className="group border-b border-neutral-800/60 py-4 first:pt-0 last:border-b-0 last:pb-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
          {/* Jour */}
          <span className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 sm:w-24">
            {dish.day}
          </span>

          {/* Plat + description + prix */}
          <div className="mt-2 sm:mt-0 min-w-0 flex-1">
            <h4 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold leading-snug text-white break-words transition-colors group-hover:text-amber-400">
              {dish.name}
            </h4>
            <p className="mt-1 text-xs sm:text-sm font-light leading-relaxed text-slate-400 break-words">
              {dish.description}
            </p>
            {dish.price !== undefined && (
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold text-amber-400">
                  {dish.price.toLocaleString()} F
                </span>
                <span className="text-[10px] font-medium text-neutral-500">F CFA</span>
              </p>
            )}

            {/* Boutons de commande — Sur place / À emporter / Livraison */}
            <OrderModeButtons
              className="mt-3 max-w-sm"
              dishName={dish.name}
              onSelect={(mode) => onOrder(dish, mode)}
            />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

interface DishCategoryProps {
  badge: string;
  title: string;
  subtitle: string;
  emoji: string;
  dishes: DailyDish[];
  /** Accent plus marqué pour la catégorie weekend (mise en avant) */
  highlighted?: boolean;
  /** Commande d'un plat — déclenche l'envoi du message WhatsApp */
  onOrder: (dish: DailyDish, mode: OrderMode) => void;
}

/** Carte d'une catégorie (semaine ou weekend) */
const DishCategory: React.FC<DishCategoryProps> = ({
  badge,
  title,
  subtitle,
  emoji,
  dishes,
  highlighted = false,
  onOrder,
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

    <DishList dishes={dishes} onOrder={onOrder} />

    {/* Nombre de plats proposés */}
    <p className="mt-5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
      {dishes.length} {dishes.length > 1 ? 'plats à la carte' : 'plat à la carte'}
    </p>
  </div>
);

export const DailyDishes: React.FC = () => {
  /**
   * Commande d'un plat du jour : ouvre directement le WhatsApp du Restaurant
   * avec le même format de message que les autres menus, adapté au plat.
   */
  const handleOrder = (dish: DailyDish, mode: OrderMode) => {
    const establishment: Establishment = 'restaurant';
    const message = buildDishOrderMessage({ dish, mode, establishment });
    openWhatsAppOrder(WHATSAPP_NUMBERS[establishment], message);
  };

  /* Les deux catégories demandées, définies dans l'ordre d'affichage
     (onOrder est ajouté au rendu : un seul gestionnaire pour toute la section) */
  const categories: (Omit<DishCategoryProps, 'onOrder'> & { id: DailyDishPeriod })[] = [
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

  return (
    <section
      id="plat-du-jour"
      aria-labelledby="plat-du-jour-title"
      className="relative w-full max-w-full overflow-hidden border-t border-neutral-900/60 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20"
    >
      {/* Halo ambré discret (rappel des autres mises en avant du site) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Titre de la section */}
        <div className="mb-8 text-center md:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
            🍽️ Plat du jour
          </span>
          <h2
            id="plat-du-jour-title"
            className="mt-4 font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Nos Plats du Jour
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            Chaque jour, une suggestion préparée maison au Restaurant Chez Thierry —
            retrouvez les plats de la semaine et les plats du weekend.
          </p>
        </div>

        {/* Les deux catégories, affichées séparément */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {categories.map((category) => (
            <DishCategory key={category.id} {...category} onOrder={handleOrder} />
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
