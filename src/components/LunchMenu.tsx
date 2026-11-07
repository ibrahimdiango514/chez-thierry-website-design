import React, { useState } from 'react';
import { DejeunerCourse, DejeunerFormule, DejeunerJour, MenuItem } from '../types';
import { DEJEUNER_FORMULES, DEJEUNER_JOURS } from '../data';
import { Plus, Sun } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   🥗 SECTION « DÉJEUNER »
   Les six journées s'affichent à la suite (sans onglets), chacune en carte
   complète : photo, entrée / plat / dessert, choix de formule et ajout au panier.
   Même panier et même parcours de commande que les autres sections.
   ───────────────────────────────────────────────────────────── */

interface LunchMenuProps {
  onAddToCart?: (item: MenuItem) => void;
}

const COURSE_LABELS: Record<DejeunerCourse, string> = {
  entree: 'Entrée',
  plat: 'Plat',
  dessert: 'Dessert',
};

const COURSES: DejeunerCourse[] = ['entree', 'plat', 'dessert'];

const formatPrice = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;

/** Une formule est disponible si tous ses cours existent pour la journée */
const isFormuleAvailable = (day: DejeunerJour, formule: DejeunerFormule) =>
  formule.courses.every((c) => Boolean(day[c]));

const formuleDescription = (day: DejeunerJour, formule: DejeunerFormule) =>
  formule.courses.map((c) => `${COURSE_LABELS[c]} : ${day[c]}`).join(' • ');

const firstAvailableFormule = (day: DejeunerJour) =>
  DEJEUNER_FORMULES.find((f) => isFormuleAvailable(day, f));

/* ─── Carte d'une journée ─── */
interface DayCardProps {
  day: DejeunerJour;
  onAddToCart?: (item: MenuItem) => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onAddToCart }) => {
  const [selectedFormuleId, setSelectedFormuleId] = useState<string>(
    firstAvailableFormule(day)?.id ?? ''
  );
  const selectedFormule =
    DEJEUNER_FORMULES.find((f) => f.id === selectedFormuleId && isFormuleAvailable(day, f)) ??
    firstAvailableFormule(day);

  const addFormule = () => {
    if (!onAddToCart || !selectedFormule) return;
    onAddToCart({
      id: `dejeuner-${day.id}-${selectedFormule.id}`,
      name: `Déjeuner ${day.day} — ${selectedFormule.name}`,
      price: selectedFormule.price,
      category: 'Déjeuner',
      description: formuleDescription(day, selectedFormule),
    });
  };

  const addPlatSeul = () => {
    if (!onAddToCart || !day.platSeul) return;
    onAddToCart({
      id: `dejeuner-${day.id}-plat`,
      name: `Déjeuner ${day.day} — ${day.platSeul.name}`,
      price: day.platSeul.price,
      category: 'Déjeuner',
      description: day.platSeul.description,
    });
  };

  return (
    <article
      id={`dejeuner-${day.id}`}
      aria-labelledby={`dejeuner-${day.id}-title`}
      className="scroll-mt-32 min-w-0 w-full rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900/90 via-neutral-900/50 to-neutral-950 p-5 shadow-2xl sm:p-6 md:p-8"
    >
      <h3
        id={`dejeuner-${day.id}-title`}
        className="font-playfair text-2xl sm:text-3xl font-bold text-amber-400 break-words"
      >
        {day.day}
      </h3>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8">
        {/* Photo du jour (style commun) */}
        <div className="flex justify-center md:justify-start">
          <img
            src={day.image}
            alt={`Menu déjeuner du ${day.day.toLowerCase()} — Chez Thierry`}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full max-w-[260px] sm:max-w-[300px] rounded-2xl border border-neutral-800 bg-neutral-950 object-contain"
          />
        </div>

        <div className="min-w-0">
          {day.platSeul ? (
            <>
              <p className="text-base sm:text-lg font-bold text-white break-words">{day.platSeul.name}</p>
              <p className="mt-1 text-sm font-light text-slate-400 break-words">{day.platSeul.description}</p>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-amber-400">
                  {formatPrice(day.platSeul.price)}
                </span>
              </div>
              <p className="text-xs italic text-neutral-500">
                Plat servi à la carte, sans formule entrée / dessert.
              </p>
              {onAddToCart && (
                <button
                  type="button"
                  onClick={addPlatSeul}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-neutral-950 shadow-md shadow-amber-500/10 transition-all hover:bg-amber-400 active:scale-95 cursor-pointer sm:w-auto sm:px-6"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  <span>Ajouter au panier</span>
                </button>
              )}
            </>
          ) : (
            <>
              {/* Cours du jour */}
              <ul className="flex flex-col gap-3">
                {COURSES.map((course) => (
                  <li key={course} className="flex min-w-0 flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                      {COURSE_LABELS[course]}
                    </span>
                    <span className="text-sm font-medium text-slate-200 break-words sm:text-base">
                      {day[course] ?? '—'}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Choix de formule (choix unique) */}
              <fieldset className="mt-6 min-w-0">
                <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
                  Choisissez votre formule
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {DEJEUNER_FORMULES.map((formule) => {
                    const available = isFormuleAvailable(day, formule);
                    const checked = selectedFormule?.id === formule.id;
                    return (
                      <label
                        key={formule.id}
                        className={`flex min-w-0 cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                          !available
                            ? 'cursor-not-allowed border-neutral-900 bg-neutral-950/40 opacity-40'
                            : checked
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-800 bg-neutral-950 hover:border-amber-500/40'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">{formule.name}</span>
                          <input
                            type="radio"
                            name={`dejeuner-formule-${day.id}`}
                            value={formule.id}
                            checked={checked}
                            disabled={!available}
                            onChange={() => setSelectedFormuleId(formule.id)}
                            className="h-4 w-4 accent-amber-500"
                          />
                        </span>
                        <span className="mt-1 text-xs text-slate-400">
                          {formule.courses.map((c) => COURSE_LABELS[c]).join(' + ')}
                        </span>
                        <span className="mt-2 text-lg font-extrabold text-amber-400">
                          {formatPrice(formule.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {onAddToCart && selectedFormule && (
                <button
                  type="button"
                  onClick={addFormule}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-neutral-950 shadow-md shadow-amber-500/10 transition-all hover:bg-amber-400 active:scale-95 cursor-pointer sm:w-auto sm:px-6"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  <span className="break-words text-left">
                    Ajouter {selectedFormule.name} — {formatPrice(selectedFormule.price)}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

/* ─── Section complète ─── */
export const LunchMenu: React.FC<LunchMenuProps> = ({ onAddToCart }) => (
  <section
    id="dejeuner"
    aria-labelledby="dejeuner-title"
    className="relative w-full max-w-full overflow-hidden border-t border-neutral-900/60 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20 scroll-mt-16"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
    />

    <div className="relative mx-auto max-w-6xl min-w-0">
      {/* Titre */}
      <div className="mb-8 text-center md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-amber-400">
          <Sun className="h-3.5 w-3.5" aria-hidden="true" /> Déjeuner
        </div>
        <h2
          id="dejeuner-title"
          className="mt-4 font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl"
        >
          Menu Déjeuner
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
          Entrée, plat et dessert : choisissez votre formule pour chaque jour.
        </p>
      </div>

      {/* Rappel des formules */}
      <div className="mb-8 rounded-3xl border border-amber-500/30 bg-neutral-900/70 p-5 sm:p-6">
        <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-amber-400">
          Nos formules déjeuner
        </h3>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DEJEUNER_FORMULES.map((formule) => (
            <li
              key={formule.id}
              className="flex min-w-0 flex-col items-center rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-center"
            >
              <span className="text-sm font-bold text-white">{formule.name}</span>
              <span className="mt-1 text-xs text-slate-400">
                {formule.courses.map((c) => COURSE_LABELS[c]).join(' + ')}
              </span>
              <span className="mt-2 text-xl font-extrabold text-amber-400">
                {formatPrice(formule.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Les six journées, à la suite (mardi → dimanche) */}
      <div className="flex flex-col gap-6 md:gap-8">
        {DEJEUNER_JOURS.map((day) => (
          <DayCard key={day.id} day={day} onAddToCart={onAddToCart} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] font-light italic leading-relaxed text-neutral-500 md:text-xs">
        * Menu déjeuner sous réserve de disponibilité. Commande et paiement via le panier, comme pour les autres plats.
      </p>
    </div>
  </section>
);
