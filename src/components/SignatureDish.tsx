import React from 'react';
import { Clock, ShoppingBag, Truck, Utensils } from 'lucide-react';

interface SignatureDishProps {
  onAddToCart: (item: any) => void;
  onDirectOrder?: (item: any) => void;
}

export const SignatureDish: React.FC<SignatureDishProps> = ({ onAddToCart, onDirectOrder }) => {
  const couscousItem = {
    id: 'signature-couscous',
    name: 'Couscous Royal',
    price: 7000,
    category: 'Plat Signature',
    description: 'Couscous royal généreux composé de poulet, merguez et mouton'
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-amber-500/30 p-6 sm:p-8 md:p-12 shadow-2xl my-8 mx-3 sm:mx-4 md:mx-auto max-w-4xl text-center">
      <div className="inline-block bg-amber-500 text-neutral-950 font-extrabold px-5 py-1.5 rounded-full shadow-md text-[10px] sm:text-xs tracking-wider uppercase mb-6">
        🌟 Plat Spécialité
      </div>

      <div className="flex flex-col items-center w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-playfair text-amber-400 tracking-wide break-words">
          Couscous Royal
        </h2>

        {/* Visuel Couscous Royal */}
        <div className="mt-5 w-full max-w-lg mx-auto">
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/20 shadow-2xl bg-neutral-900">
            <img 
              src="/images/couscous-royal.jpg" 
              alt="Couscous Royal - Poulet, Merguez, Mouton" 
              className="w-full h-auto object-contain mx-auto"
              loading="lazy"
            />
          </div>
        </div>

        <p className="text-white mt-4 text-sm sm:text-base md:text-xl font-light max-w-xl leading-relaxed px-2 break-words">
          Couscous royal généreux composé de poulet, merguez et mouton
        </p>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full text-xs text-slate-300 mt-5 shadow-sm max-w-full">
          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="break-words">Disponible tous les dimanches de 12h à 15h</span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-5">
          <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-neutral-800 text-slate-200">
            <Utensils className="w-3.5 h-3.5 text-amber-500" /> Sur Place
          </span>
          <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-neutral-800 text-slate-200">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> À Emporter
          </span>
          <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold border border-neutral-800 text-slate-200">
            <Truck className="w-3.5 h-3.5 text-amber-500" /> Livraison
          </span>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 w-full max-w-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400">7 000 F</span>
            <span className="text-xs text-neutral-500 font-bold block">F CFA</span>
          </div>

          <button
            onClick={() => {
              if (onDirectOrder) {
                onDirectOrder(couscousItem);
              } else {
                onAddToCart(couscousItem);
              }
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-extrabold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
          >
            🛒 Commander mon Couscous Royal
          </button>
        </div>
      </div>
    </div>
  );
};
