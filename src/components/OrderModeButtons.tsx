import React from 'react';
import { ShoppingBag, Truck, Utensils } from 'lucide-react';
import { OrderMode } from '../types';
import { MODE_LABELS, ORDER_MODES, buildDishOrderUrl, type Establishment } from '../lib/whatsappOrder';

/* ─────────────────────────────────────────────────────────────
   🛒 BOUTONS DE COMMANDE — Sur place / À emporter / Livraison
   ─────────────────────────────────────────────────────────────
   Style repris **à l'identique** des boutons de mode de commande du site :
     • CheckoutModal.tsx → grid grid-cols-3 + rounded-xl + border
       (état ambré : bg-amber-500 text-neutral-950 border-amber-500)
     • pages/Menu.tsx (OrderModal) → mêmes couleurs / mêmes libellés
   …et mêmes icônes que les badges « Sur Place / À Emporter / Livraison »
   de SignatureDish.tsx (Utensils / ShoppingBag / Truck).

   ⚠️ CORRECTIF : les boutons sont de vrais liens `<a href="…whatsapp…">`
   (exactement comme les boutons WhatsApp qui fonctionnent sur le reste du
   site — voir Home.tsx). L'ancienne version appelait `window.open()` :
   les bloqueurs de pop-up, les aperçus affichés en iframe et les
   navigateurs intégrés (Instagram, Facebook, TikTok…) bloquaient
   silencieusement l'ouverture → « le bouton ne fait rien ».
   ───────────────────────────────────────────────────────────── */

/** Icônes identiques à celles de SignatureDish.tsx */
const MODE_ICONS: Record<OrderMode, React.ComponentType<{ className?: string }>> = {
  sur_place: Utensils,
  emporter: ShoppingBag,
  livraison: Truck,
};

interface OrderModeButtonsProps {
  /** Plat commandé : le nom et le prix servent à construire le message */
  dish: { name: string; price?: number };
  /** Établissement destinataire du message (Restaurant par défaut) */
  establishment?: Establishment;
  /** Quantité commandée (1 par défaut) */
  quantity?: number;
  className?: string;
  onSelectMode?: (dish: { name: string; price?: number }, mode: OrderMode) => void;
}

export const OrderModeButtons: React.FC<OrderModeButtonsProps> = ({
  dish,
  establishment = 'restaurant',
  quantity = 1,
  className = '',
  onSelectMode,
}) => (
  <div className={`grid grid-cols-3 gap-1.5 sm:gap-2 ${className}`}>
    {ORDER_MODES.map((mode) => {
      const Icon = MODE_ICONS[mode];
      const label = MODE_LABELS[mode];
      // URL WhatsApp pré-remplie pour ce plat et ce mode (aucun JavaScript requis)
      const href = buildDishOrderUrl({ dish, mode, quantity, establishment });

      return (
        onSelectMode ? (
        <button
          key={mode}
          type="button"
          onClick={() => onSelectMode(dish, mode)}
          aria-label={`Commander ${dish.name} — ${label}`}
          title={`Commander : ${label}`}
          className="group/order flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-slate-300 text-[10px] sm:text-xs font-extrabold transition-all duration-300 hover:bg-amber-500 hover:text-neutral-950 hover:border-amber-500 active:scale-95 cursor-pointer"
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-400 transition-colors group-hover/order:text-neutral-950" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
        ) : (
          <a key={mode} href={href} target="_blank" rel="noreferrer" aria-label={`Commander ${dish.name} — ${label}`} title={`Commander : ${label}`} className="group/order flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-slate-300 text-[10px] sm:text-xs font-extrabold transition-all duration-300 hover:bg-amber-500 hover:text-neutral-950 hover:border-amber-500 active:scale-95 cursor-pointer">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-400 transition-colors group-hover/order:text-neutral-950" />
            <span className="whitespace-nowrap">{label}</span>
          </a>
        )
      );
    })}
  </div>
);
