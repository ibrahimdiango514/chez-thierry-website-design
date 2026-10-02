import React, { useEffect, useState } from 'react';
import { CartItem, OrderMode, SectionType } from '../types';
import {
  X,
  MapPin,
  Smartphone,
  User,
  CheckCircle,
  Navigation,
  PhoneCall,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  buildOrderMessage,
  getItemSection,
  RESTAURANT_PHONE_DISPLAY,
  RESTAURANT_PHONE_TEL,
  ROOFTOP_PHONE_DISPLAY,
  ROOFTOP_PHONE_TEL,
  MODE_LABELS,
  getWhatsAppNumberForCart,
} from '../utils/orderHelper';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentSection: SectionType;
  onClearCart: () => void;
  initialMode?: OrderMode | '';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentSection,
  onClearCart,
  initialMode = '',
}) => {
  const [section, setSection] = useState<SectionType>(currentSection);
  const [mode, setMode] = useState<OrderMode | ''>(initialMode);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  // C. Localisation : Par défaut, c'est « Saisir mon adresse » qui est sélectionné (aucun GPS automatique)
  const [useManualAddress, setUseManualAddress] = useState(true);
  const [geoAddress, setGeoAddress] = useState('');
  const [geoSource, setGeoSource] = useState<'gps' | 'ip' | null>(null);
  const [showPhoneRecap, setShowPhoneRecap] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPhoneRecap(false);
      setValidationError(null);
      setUseManualAddress(true);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  // Détection des sections présentes dans le panier
  const sectionsInCart = Array.from(
    new Set(cartItems.map((ci) => ci.section || getItemSection(ci.item, section)))
  );
  const isMixed = sectionsInCart.length > 1;
  const hasRestaurant = sectionsInCart.includes('restaurant') || section === 'restaurant';
  const hasRooftop = sectionsInCart.includes('rooftop') || section === 'rooftop';

  const fallbackIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
      });
      setGeoAddress(`${data.city}, ${data.region}, ${data.country_name}`);
      setGeoSource('ip');
      setFetchingLocation(false);
      setLocationError(null);
    } catch {
      setFetchingLocation(false);
      setLocationError('Localisation indisponible. Veuillez saisir votre adresse manuellement.');
    }
  };

  const handleGetLocation = async () => {
    setFetchingLocation(true);
    setLocationError(null);
    setGeoAddress('');
    setGeoSource(null);

    if (!navigator.geolocation) {
      await fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        setGeoSource('gps');

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setGeoAddress(data.display_name || '');
        } catch {
          setGeoAddress('');
        }

        setFetchingLocation(false);
        setLocationError(null);
      },
      async () => {
        await fallbackIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /**
   * Validation uniquement pour WhatsApp
   */
  const validateWhatsAppForm = (): boolean => {
    if (!mode) {
      setValidationError('Veuillez choisir un mode de commande (Sur place / À emporter / Livraison).');
      return false;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Veuillez renseigner votre nom complet et votre numéro de téléphone.');
      return false;
    }

    if (mode === 'livraison') {
      if (!useManualAddress && !location) {
        setValidationError('Veuillez activer la localisation GPS ou saisir votre adresse de livraison.');
        return false;
      }
      if (useManualAddress && !manualAddress.trim()) {
        setValidationError('Veuillez saisir votre adresse complète de livraison.');
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  /**
   * 1. « Commander par WhatsApp » (nécessite le formulaire)
   */
  const handleWhatsAppOrder = (targetEst?: SectionType) => {
    if (!validateWhatsAppForm() || !mode) return;

    const message = buildOrderMessage({
      items: cartItems,
      mode,
      customerName,
      customerPhone,
      location,
      manualAddress,
      useManualAddress,
      geoAddress,
      geoSource,
      targetSection: targetEst || section,
    });

    let targetNumber = getWhatsAppNumberForCart(cartItems, targetEst || section);
    if (targetEst === 'restaurant') targetNumber = '22366427777';
    if (targetEst === 'rooftop') targetNumber = '22376222777';

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClearCart();
    onClose();
  };

  /**
   * 2. « Commander par téléphone » (IMMÉDIAT, aucun formulaire requis)
   */
  const handlePhoneOrderStart = (targetEst?: SectionType) => {
    setValidationError(null);
    setShowPhoneRecap(true);

    const targetTel =
      targetEst === 'rooftop' || (!targetEst && !hasRestaurant && hasRooftop)
        ? ROOFTOP_PHONE_TEL
        : RESTAURANT_PHONE_TEL;
    
    // Déclenche l'appel direct sans bloquer l'écran
    window.location.href = `tel:${targetTel}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-neutral-900 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ─── VUE 1 : FORMULAIRE PRINCIPAL AVEC CHOIX WHATSAPP & TÉLÉPHONE ─── */}
        {!showPhoneRecap ? (
          <>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 font-playfair border-b border-neutral-800 pb-3">
              Finaliser votre commande
            </h3>

            {/* Avertissement commande mixte si nécessaire */}
            {isMixed && (
              <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                ✨ Votre panier contient des articles du <strong>Restaurant</strong> et du <strong>Rooftop</strong>. Vous pouvez appeler ou envoyer le message WhatsApp au service de votre choix.
              </div>
            )}

            {/* 1. Mode de récupération (Sur place / À emporter / Livraison) */}
            <div className="mb-5">
              <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
                1. Mode de récupération
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sur_place', 'emporter', 'livraison'] as OrderMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setValidationError(null);
                    }}
                    className={`py-3 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/20'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Coordonnées pour WhatsApp uniquement */}
            <div className="mb-5 space-y-3 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                  2. Coordonnées (requis pour WhatsApp)
                </h4>
                <span className="text-[10px] text-neutral-500 italic">Facultatif par appel</span>
              </div>
              
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Adresse si livraison */}
              {mode === 'livraison' && (
                <div className="pt-2 border-t border-neutral-800 space-y-3">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Adresse de Livraison
                  </h5>
                  <div className="flex items-center gap-4 py-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="radio"
                        name="address_type"
                        checked={useManualAddress}
                        onChange={() => {
                          setUseManualAddress(true);
                          setLocationError(null);
                        }}
                        className="accent-amber-500"
                      />
                      Saisir mon adresse (par défaut)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="radio"
                        name="address_type"
                        checked={!useManualAddress}
                        onChange={() => {
                          setUseManualAddress(false);
                          setLocationError(null);
                          if (!location) handleGetLocation();
                        }}
                        className="accent-amber-500"
                      />
                      Partager ma localisation
                    </label>
                  </div>

                  {useManualAddress ? (
                    <textarea
                      placeholder="Saisissez votre adresse (Quartier, Rue, Porte, Repère...)"
                      value={manualAddress}
                      onChange={(e) => {
                        setManualAddress(e.target.value);
                        setValidationError(null);
                      }}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none transition-all resize-none"
                    />
                  ) : (
                    <div className="space-y-2">
                      {location ? (
                        <div className="space-y-1 bg-green-500/10 p-2.5 rounded-xl border border-green-500/30 text-green-400 text-xs font-semibold">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Position GPS enregistrée</span>
                          </div>
                          {geoAddress && (
                            <p className="text-slate-300 text-[11px] font-normal mt-1">
                              {geoAddress}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={fetchingLocation}
                          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-md"
                        >
                          <Navigation className={`w-3.5 h-3.5 ${fetchingLocation ? 'animate-spin' : ''}`} />
                          {fetchingLocation ? 'Récupération...' : '📍 Partager ma localisation GPS'}
                        </button>
                      )}
                      {locationError && (
                        <p className="text-amber-400 text-[11px] bg-amber-950/20 p-2 rounded-xl border border-amber-900/40">
                          ⚠️ {locationError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message d'erreur de validation pour WhatsApp */}
            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold flex items-center gap-2">
                <span>⚠️</span> {validationError}
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-neutral-800 pt-3 mb-5">
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mb-3 text-xs">
                {cartItems.map((ci) => (
                  <div key={ci.item.id} className="flex justify-between items-center text-slate-300">
                    <span className="truncate pr-2">
                      {ci.quantity}x {ci.item.name}
                    </span>
                    <span className="text-white font-semibold flex-shrink-0">
                      {(ci.item.price * ci.quantity).toLocaleString()} F
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t border-neutral-800/80 pt-2">
                <span className="text-neutral-200">Total :</span>
                <span className="text-amber-400 font-playfair text-xl">
                  {total.toLocaleString()} F CFA
                </span>
              </div>
            </div>

            {/* ─── DEUX CHOIX DE VALIDATION : TÉLÉPHONE IMMÉDIAT + WHATSAPP ─── */}
            <div className="space-y-3">
              {/* Option A : Commander par Téléphone (IMMÉDIAT SANS FORMULAIRE) */}
              <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/20">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block mb-2">
                  📞 Commander par téléphone (sans formulaire)
                </span>
                {isMixed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePhoneOrderStart('restaurant')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 flex-shrink-0" />
                      <span>Appeler Resto (66 42 77 77)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePhoneOrderStart('rooftop')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 flex-shrink-0" />
                      <span>Appeler Rooftop (76 22 27 77)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePhoneOrderStart()}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-neutral-950 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <PhoneCall className="w-5 h-5 flex-shrink-0" />
                    <span>Appeler le {hasRooftop && !hasRestaurant ? '76 22 27 77 (Rooftop)' : '66 42 77 77 (Restaurant)'}</span>
                  </button>
                )}
              </div>

              {/* Option B : Commander par WhatsApp */}
              <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
                  💬 Commander par WhatsApp
                </span>
                {isMixed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrder('restaurant')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span>WhatsApp Resto (66 42 77 77)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrder('rooftop')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span>WhatsApp Rooftop (76 22 27 77)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleWhatsAppOrder()}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Envoyer sur WhatsApp ({hasRooftop && !hasRestaurant ? '76 22 27 77' : '66 42 77 77'})</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ─── VUE 2 : RÉCAPITULATIF POUR DICTÉE TÉLÉPHONIQUE ─── */
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <button
                type="button"
                onClick={() => setShowPhoneRecap(false)}
                className="p-1.5 rounded-lg bg-neutral-900 text-slate-300 hover:text-white border border-neutral-800 cursor-pointer"
                title="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold font-playfair text-amber-400 flex items-center gap-2">
                <PhoneCall className="w-5 h-5" /> Commande par téléphone
              </h3>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-xs text-amber-300 leading-relaxed">
              📞 <strong>L'appel est en cours !</strong> Vous avez sous les yeux le récapitulatif complet de votre commande à dicter :
            </div>

            {/* Boutons d'appel rapide / relance */}
            <div className="space-y-2">
              {(hasRestaurant || !hasRooftop) && (
                <a
                  href={`tel:${RESTAURANT_PHONE_TEL}`}
                  className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" /> Restaurant Chez Thierry
                  </span>
                  <span className="underline">{RESTAURANT_PHONE_DISPLAY}</span>
                </a>
              )}

              {(hasRooftop || isMixed) && (
                <a
                  href={`tel:${ROOFTOP_PHONE_TEL}`}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" /> Rooftop Le Palmier
                  </span>
                  <span className="underline">{ROOFTOP_PHONE_DISPLAY}</span>
                </a>
              )}
            </div>

            {/* Fiche récapitulative pour dictée */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Mode souhaité :</span>
                <span className="font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {mode ? MODE_LABELS[mode] : 'À préciser au téléphone'}
                </span>
              </div>

              {customerName && (
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Client :</span>
                  <span className="font-semibold text-white">{customerName} {customerPhone ? `(${customerPhone})` : ''}</span>
                </div>
              )}

              {mode === 'livraison' && manualAddress && (
                <div className="border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400 block mb-1">Adresse :</span>
                  <span className="font-medium text-slate-200">{manualAddress}</span>
                </div>
              )}

              <div>
                <span className="text-neutral-400 block mb-1.5 font-bold">Détail des plats &amp; suppléments :</span>
                <div className="space-y-1.5 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  {cartItems.map((ci) => (
                    <div key={ci.item.id} className="flex justify-between items-center text-slate-200">
                      <span>• {ci.quantity}x {ci.item.name}</span>
                      <span className="font-bold text-amber-400">{(ci.item.price * ci.quantity).toLocaleString()} F</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-base font-bold text-white">
                <span>Total :</span>
                <span className="text-amber-400 font-playfair text-lg sm:text-xl">
                  {total.toLocaleString()} F CFA
                </span>
              </div>
            </div>

            {/* Bouton de finalisation */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 border border-neutral-700 hover:border-green-500 text-slate-200 hover:text-white transition-all cursor-pointer"
              >
                ✅ J'ai passé ma commande au téléphone (Terminer)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
