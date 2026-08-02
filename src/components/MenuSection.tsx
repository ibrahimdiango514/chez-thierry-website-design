import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Search } from 'lucide-react';
import { DishImage, CATEGORY_EMOJIS } from './DishImage';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  sectionType: 'restaurant' | 'rooftop';
}

/* Ordre naturel du menu (parcours vertical, comme une carte de restaurant) */
const RESTAURANT_CATEGORY_ORDER = [
  'Entrées',
  'Plats',
  'Les plus de chez Thierry',
  'Les temporelles',
  "Suppléments d'accompagnement",
  'Desserts',
  'Pizzas',
  'Vins bouteilles',
  'Vins en pichet et au verre',
  'Cocktails alcoolisés',
];

const ROOFTOP_CATEGORY_ORDER = [
  'Burgers & Fried Food',
  'Grill & African Touch',
  'Mocktails - Sans alcool',
  'Cocktails - Avec alcool',
  'Desserts',
];

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart, sectionType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isRooftop = sectionType === 'rooftop';

  // Ordre naturel, suivi des éventuelles catégories non listées (sécurité)
  const allCategories = Array.from(new Set(items.map((item) => item.category)));
  const order = isRooftop ? ROOFTOP_CATEGORY_ORDER : RESTAURANT_CATEGORY_ORDER;
  const orderedCategories = [
    ...order.filter((c) => allCategories.includes(c)),
    ...allCategories.filter((c) => !order.includes(c)),
  ];

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const matches = (item: MenuItem) =>
    item.name.toLowerCase().includes(query) ||
    (item.description ?? '').toLowerCase().includes(query);

  let totalResults = 0;

  return (
    <div className="w-full bg-neutral-950 text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair border-l-4 border-amber-500 pl-4 text-white">
            {isRooftop ? 'Menu Rooftop Le Palmier' : 'Menu Restaurant Chez Thierry'}
          </h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher un plat, une boisson..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
          </div>
        </div>

        {/* 🔎 Accès rapide par catégories (raccourci — le défilement complet reste disponible) */}
        <div className="sticky top-[68px] z-30 -mx-1 mb-8 bg-neutral-950/95 backdrop-blur-md py-2.5 px-1 rounded-xl">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {orderedCategories.map((category, i) => (
              <button
                key={category}
                onClick={() =>
                  document
                    .getElementById(`ms-${sectionType}-${i}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border bg-neutral-900 text-slate-300 border-neutral-800/80 hover:border-amber-500/60 hover:text-white"
              >
                <span className="mr-1">{CATEGORY_EMOJIS[category] ?? '•'}</span>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Toutes les catégories se suivent dans un seul parcours vertical */}
        {orderedCategories.map((category, i) => {
          const categoryItems = items.filter(
            (item) => item.category === category && (!isSearching || matches(item))
          );
          if (categoryItems.length === 0) return null;
          totalResults += categoryItems.length;

          return (
            <div key={category} id={`ms-${sectionType}-${i}`} className="mb-10 scroll-mt-36">
              <h3 className="flex items-center gap-2 text-xl md:text-2xl font-playfair font-bold text-amber-400 border-b border-neutral-800/60 pb-2">
                <span className="text-2xl">{CATEGORY_EMOJIS[category] ?? '•'}</span>
                {category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-md"
                  >
                    {/* Photo du plat (placeholder élégant si l'image n'existe pas encore) */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800/60 mb-4 bg-neutral-900">
                      <DishImage
                        src={item.image}
                        alt={item.name}
                        emoji={CATEGORY_EMOJIS[item.category] ?? '🍽️'}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      {item.description && (
                        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {item.composants && (
                        <p className="text-amber-500/80 text-xs mt-2 leading-relaxed border-t border-neutral-800/50 pt-2">
                          📋 {item.composants}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800/40">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-amber-400">
                          {item.price.toLocaleString()} F
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">F CFA</span>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        className={`flex items-center gap-2 text-xs font-extrabold py-3 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-neutral-950 ${
                          isRooftop && (item.category === 'Cocktails' || item.category === 'Suggestions')
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                            : item.category === 'Pizzas'
                            ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                            : 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Ajouter au panier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isSearching && totalResults === 0 && (
          <div className="text-center py-12 text-neutral-400">
            Aucun article trouvé pour « {searchQuery.trim()} ».
          </div>
        )}
      </div>
    </div>
  );
};
