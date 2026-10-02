import React from 'react';
import { Phone, MapPin, Clock, Utensils, Sparkles, Flame, Music, Wine, Compass } from 'lucide-react';

export const GeneralInfo: React.FC = () => {
  return (
    <section 
      id="infos-pratiques" 
      aria-label="Informations générales et horaires"
      className="relative bg-neutral-950 text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 border-b border-neutral-900/70"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête discret */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5" /> Informations &amp; Horaires d'Ouverture
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-white mt-3">
            Bienvenue chez <span className="text-amber-400">Chez Thierry</span> &amp; <span className="text-amber-400">Le Palmier</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto mt-2">
            Deux ambiances complémentaires à Bamako : la gastronomie continue au restaurant &amp; l'expérience festive sur le rooftop.
          </p>
        </div>

        {/* Grille des 2 Blocs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* 🍽️ BLOC 1 : CHEZ THIERRY — Restaurant • Brasserie — LA TOTAL */}
          <div className="bg-gradient-to-b from-neutral-900/90 via-neutral-900/60 to-neutral-950 p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/60 transition-all">
            {/* Halo ambré doux */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Badge & Titre */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" /> Restaurant • Brasserie
                </span>
                <span className="text-xs font-bold text-amber-400/80 tracking-widest uppercase">
                  LA TOTAL
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-white mb-2">
                CHEZ THIERRY
              </h3>

              {/* Service continu */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-300">
                    Service continu du mardi au dimanche, midi → soir
                  </p>
                  <p className="text-xs text-slate-300 font-light mt-0.5">
                    Déjeuner • Pause gourmande (15h-17h30) • Apéro (17h30-19h30) • Dîner
                  </p>
                </div>
              </div>

              {/* Atouts & Spécificités */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-200 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span><strong>Cadre :</strong> Salle climatisée • Terrasse rafraîchie • Pizzas au feu de bois</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-amber-300">Du mardi au vendredi :</span> Plats du jour (chaque jour, deux propositions : plat du jour local et plat du jour occidental).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-amber-300">Samedi &amp; dimanche :</span> Week-end Plats du Chef &amp; Couscous Royal le dimanche midi.
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-neutral-800 text-neutral-400 text-xs">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Adresse :</strong> Quinzambougou – La Total, Bamako, Mali</span>
                </div>
              </div>
            </div>

            {/* Bouton Contact Restaurant (tel cliquable) */}
            <div className="pt-4 border-t border-neutral-800/80">
              <a
                href="tel:+22366427777"
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Restaurant : 66 42 77 77</span>
              </a>
            </div>
          </div>

          {/* 🌇 BLOC 2 : LE PALMIER ROOFTOP */}
          <div className="bg-gradient-to-b from-neutral-900/90 via-neutral-900/60 to-neutral-950 p-6 sm:p-7 rounded-3xl border border-rose-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/60 transition-all">
            {/* Halo rosé doux */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Badge & Titre */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Bar • Cocktails • Ambiance
                </span>
                <span className="text-xs font-bold text-rose-400/80 tracking-widest uppercase">
                  VUE PANORAMIQUE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-white mb-2">
                LE PALMIER ROOFTOP
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mb-5 font-light">
                Votre destination nocturne incontournable à Bamako. Cocktails signatures, mocktails frais, grillades &amp; street food premium sous les étoiles.
              </p>

              {/* Les 3 Soirées Thématiques */}
              <div className="space-y-3 mb-6">
                <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-2xl">
                  <p className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5" /> Mercredi : Happy Hours
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-light">
                    Cocktails • Détente • Musique • Rooftop.
                  </p>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-2xl">
                  <p className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> Vendredi : After Work
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-light">
                    Cocktails • Tapas • Musique • Ambiance festive.
                  </p>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-2xl">
                  <p className="text-xs sm:text-sm font-bold text-purple-400 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" /> Samedi : Karaoké
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-light">
                    Entre amis, en couple ou en groupe : chantez, dansez, profitez !
                  </p>
                </div>
              </div>

              {/* Réseaux & Site */}
              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-wrap items-center justify-between gap-2">
                <span>📱 Réseaux : <strong className="text-white">@chezthierrylepalmier</strong> (Instagram &amp; TikTok)</span>
                <span className="text-amber-400 font-semibold">chezthierrylepalmier.com</span>
              </div>
            </div>

            {/* Bouton Contact Rooftop (tel cliquable) */}
            <div className="pt-4 border-t border-neutral-800/80 mt-4">
              <a
                href="tel:+22376222777"
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Rooftop : 76 22 27 77</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
