import React from 'react';
import { ShoppingBag, Truck, Utensils } from 'lucide-react';
import { OrderMode } from '../types';
import { MODE_LABELS, ORDER_MODES } from '../lib/whatsappOrder';

/* ─────────────────────────────────────────────────────────────
   🛒 BOUTONS DE COMMANDE — Sur place / À emporter / Livraison
   ─────────────────────────────────────────────────────────────
   Reprend **exactement** le style des boutons de mode de commande
   déjà présents sur le site :
     • CheckoutModal.tsx → grid grid-cols-3 + rounded-xl + border
       (état actif : bg-amber-500 text-neutral-950 border-amber-500)
     • pages/Menu.tsx (OrderModal) → mêmes couleurs / mêmes libellés
   …et les mêmes icônes que les badges « Sur Place / À Emporter /
   Livraison » de SignatureDish.tsx (Utensils / ShoppingBag / Truck).

   Seule différence : ici les boutons déclenchent directement la
   commande WhatsApp, donc l'état ambré (« actif ») s'affiche au survol.
   ───────────────────────────────────────────────────────────── */

/** Icônes identiques à celles de SignatureDish.tsx */
const MODE_ICONS: Record<OrderMode, React.ComponentType<{ className?: string }>> = {
  sur_place: Utensils,
  emporter: ShoppingBag,
  livraison: Truck,
};

interface OrderModeButtonsProps {
  /** Appelé avec le mode choisi : 'sur_place' | 'emporter' | 'livraison' */
  onSelect: (mode: OrderMode) => void;
  /** Nom du plat — utilisé pour les libellés accessibles (aria-label) */
  dishName?: string;
  className?: string;
}

export const OrderModeButtons: React.FC<OrderModeButtonsProps> = ({
  onSelect,
  dishName,
  className = '',
}) => (
  <div className={`grid grid-cols-3 gap-1.5 sm:gap-2 ${className}`}>
    {ORDER_MODES.map((mode) => {
      const Icon = MODE_ICONS[mode];
      const label = MODE_LABELS[mode];
      return (
        <button
          key={mode}
          type="button"
          onClick={() => onSelect(mode)}
          aria-label={dishName ? `Commander ${dishName} — ${label}` : `Commander — ${label}`}
          title={`Commander : ${label}`}
          className="group/order flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-1 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-slate-300 text-[10px] sm:text-xs font-extrabold transition-all duration-300 hover:bg-amber-500 hover:text-neutral-950 hover:border-amber-500 active:scale-95"
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-400 transition-colors group-hover/order:text-neutral-950" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      );
    })}
  </div>
);
