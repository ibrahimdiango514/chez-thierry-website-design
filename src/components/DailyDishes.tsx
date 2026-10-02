import React, { useEffect, useState } from 'react';
import { DailyDish, DailyDishPeriod, MenuFormula, OrderMode } from '../types';
import {
  WEEK_DAILY_DISHES,
  WEEKEND_DAILY_DISHES,
  MENU_DU_JOUR_FORMULES,
  DEFAULT_MENU_DU_JOUR_PROPOSITIONS,
} from '../data';
import { OrderModeButtons } from './OrderModeButtons';
import { Utensils, Edit3, Check, RotateCcw } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   🍽️ SECTION « PLATS DU JOUR — SEMAINE & WEEK-END » + « MENU DU JOUR »
   ───────────────────────────────────────────────────────────── */

interface DishListProps {
  dishes: DailyDish[];
  onSelectMode?: (dish: DailyDish, mode: OrderMode) => void;
}

const DishList: React.FC<DishListProps> = ({ dishes, onSelectMode }) => (
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
                    {dish.price.toLocaleString()} F
                  </span>
                  <span className="text-[10px] font-medium text-neutral-500">F CFA</span>
                </p>
              )}

              {/* Boutons de commande (désactivés si fermé) */}
              {!isClosed && (
                <OrderModeButtons
                  dish={{ name: `${dish.day} : ${dish.name}`, price: dish.price }}
                  className="mt-3 max-w-sm"
                  onSelectMode={onSelectMode ? (_dish, mode) => onSelectMode(dish, mode) : undefined}
                />
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
  onSelectMode?: (dish: DailyDish, mode: OrderMode) => void;
}

const DishCategory: React.FC<DishCategoryProps> = ({
  badge,
  title,
  subtitle,
  emoji,
  dishes,
  highlighted = false,
  onSelectMode,
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

    <DishList dishes={dishes} onSelectMode={onSelectMode} />

    {/* Note de prix */}
    <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-3">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Prix du plat du jour
      </span>
      <span className="text-xs sm:text-sm font-bold text-amber-400">
        5 000 F CFA
      </span>
    </div>
  </div>
);

const STORAGE_KEY = 'chezthierry_menu_du_jour_propositions';

export const DailyDishes: React.FC<{
  onSelectMode?: (dish: DailyDish, mode: OrderMode) => void;
  onSelectFormula?: (formula: MenuFormula, mode: OrderMode) => void;
}> = ({ onSelectMode, onSelectFormula }) => {
  /* Propositions modifiables du Menu du jour (sauvegardées en localStorage) */
  const [propositions, setPropositions] = useState(DEFAULT_MENU_DU_JOUR_PROPOSITIONS);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(DEFAULT_MENU_DU_JOUR_PROPOSITIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.entree && parsed.plat && parsed.dessert) {
          setPropositions(parsed);
          setEditForm(parsed);
        }
      }
    } catch {
      // Ignorer si indisponible
    }
  }, []);

  const handleSavePropositions = (e: React.FormEvent) => {
    e.preventDefault();
    setPropositions(editForm);
    setIsEditing(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editForm));
    } catch {
      // Ignorer
    }
  };

  const handleResetPropositions = () => {
    setEditForm(DEFAULT_MENU_DU_JOUR_PROPOSITIONS);
    setPropositions(DEFAULT_MENU_DU_JOUR_PROPOSITIONS);
    setIsEditing(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorer
    }
  };

  const categories: (Omit<DishCategoryProps, 'onSelectMode'> & { id: DailyDishPeriod })[] = [
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
            PLATS DU JOUR — 5 000 F CFA
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            Dans le cadre du nouveau service continu, découvrez les plats du jour de la semaine et du week-end.
          </p>
        </div>

        {/* Les deux catégories : Semaine & Weekend */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 mb-16">
          {categories.map((category) => (
            <DishCategory key={category.id} {...category} onSelectMode={onSelectMode} />
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            📋 SOUS-SECTION : MENU DU JOUR
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-12 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900/90 via-neutral-900/50 to-neutral-950 p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
              <Utensils className="w-3.5 h-3.5" /> Menu du jour
            </span>
            <h3 className="mt-3 font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Menu du Jour
            </h3>
            <p className="mt-2 text-sm sm:text-base font-light text-slate-300 leading-relaxed">
              En complément du plat du jour, un menu du jour est proposé quotidiennement. Le menu varie selon les propositions de la Chef.
            </p>
          </div>

          {/* Propositions du moment (Entrée, Plat, Dessert) */}
          <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">✨</span>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  Propositions du moment de la Chef
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Modifier les suggestions du jour"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Fermer l’édition' : 'Modifier les propositions'}</span>
              </button>
            </div>

            {/* Formulaire d'édition rapide (back-office simple pour le restaurateur) */}
            {isEditing ? (
              <form onSubmit={handleSavePropositions} className="space-y-4 mb-2">
                <p className="text-[11px] text-neutral-400 italic">
                  Modifiez directement les plats proposés aujourd’hui (sauvegarde automatique sur ce navigateur) :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      🥗 Entrée du jour
                    </label>
                    <input
                      type="text"
                      value={editForm.entree}
                      onChange={(e) => setEditForm({ ...editForm, entree: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      🥘 Plat du jour
                    </label>
                    <input
                      type="text"
                      value={editForm.plat}
                      onChange={(e) => setEditForm({ ...editForm, plat: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      🍰 Dessert du jour
                    </label>
                    <input
                      type="text"
                      value={editForm.dessert}
                      onChange={(e) => setEditForm({ ...editForm, dessert: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleResetPropositions}
                    className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-4 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Enregistrer les propositions
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    🥗 Entrée
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">{propositions.entree}</p>
                </div>
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    🥘 Plat
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">{propositions.plat}</p>
                </div>
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    🍰 Dessert
                  </span>
                  <p className="text-sm font-semibold text-white mt-0.5">{propositions.dessert}</p>
                </div>
              </div>
            )}
          </div>

          {/* Les 3 formules du Menu du Jour */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MENU_DU_JOUR_FORMULES.map((formula) => {
              const dishObj = {
                id: formula.id,
                name: `${formula.name} — ${formula.description}`,
                price: formula.price,
                day: 'Menu du jour',
                description: `Formule : ${formula.description} (${propositions.entree} / ${propositions.plat} / ${propositions.dessert})`,
              };

              return (
                <div
                  key={formula.id}
                  className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 transition-all hover:border-amber-500/40"
                >
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-3">
                      {formula.name}
                    </span>
                    <h4 className="font-playfair text-xl font-bold text-white mb-2">
                      {formula.description}
                    </h4>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-amber-400">
                        {formula.price.toLocaleString()} F
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">F CFA</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-900">
                    <OrderModeButtons
                      dish={{ name: `${formula.name} (${formula.description})`, price: formula.price }}
                      className="w-full"
                      onSelectMode={
                        onSelectFormula
                          ? (_d, mode) => onSelectFormula(formula, mode)
                          : onSelectMode
                          ? (_d, mode) => onSelectMode(dishObj, mode)
                          : undefined
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note d'information */}
        <p className="mt-6 text-center text-[11px] font-light italic leading-relaxed text-neutral-500 md:mt-8 md:text-xs">
          * Plats servis selon la disponibilité du marché — Restaurant et Rooftop ouverts du mardi au dimanche.
        </p>
      </div>
    </section>
  );
};
