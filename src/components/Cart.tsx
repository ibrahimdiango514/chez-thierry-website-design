import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  isOpen,
  setIsOpen,
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold transition-all transform active:scale-95 text-neutral-950 bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-neutral-950 text-xs text-amber-500 border border-neutral-800 rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        </div>
        <span className="hidden md:inline">{totalPrice.toLocaleString()} F CFA</span>
      </button>

      {/* Cart Sidebar/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-950 h-full shadow-2xl flex flex-col border-l border-neutral-800 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                Votre Panier
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white text-sm font-semibold p-2 rounded-lg hover:bg-neutral-900"
              >
                Fermer
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.item.id}
                  className="flex justify-between items-center bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl gap-3"
                >
                  <div className="flex-1">
                    <h4 className="text-slate-100 font-bold text-sm">{item.item.name}</h4>
                    <p className="text-xs mt-1 font-semibold text-amber-400">
                      {item.item.price.toLocaleString()} F CFA
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          onRemoveItem(item.item.id);
                        } else {
                          onUpdateQuantity(item.item.id, item.quantity - 1);
                        }
                      }}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-500" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>
                    <span className="text-white font-bold text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.item.id, item.quantity + 1)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/40">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-400 font-medium">Total</span>
                <span className="text-xl font-bold text-amber-400 font-playfair">{totalPrice.toLocaleString()} F CFA</span>
              </div>
              <button
                onClick={onOpenCheckout}
                className="w-full text-center py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20"
              >
                Passer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
