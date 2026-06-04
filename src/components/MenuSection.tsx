import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Search } from 'lucide-react';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  sectionType: 'restaurant' | 'rooftop';
}

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart, sectionType }) => {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isRooftop = sectionType === 'rooftop';

  return (
    <div className="w-full bg-neutral-950 text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
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

        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                activeCategory === category
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-slate-400 border-neutral-800/80 hover:border-neutral-700 hover:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-md"
            >
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
                  <span>Commander</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            Aucun article trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  );
};
