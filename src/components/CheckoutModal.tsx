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
  ShoppingBag,
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
  ESTABLISHMENT_LABELS,
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
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [geoAddress, setGeoAddress] = useState('');
  const [geoSource, setGeoSource] = useState<'gps' | 'ip' | null>(null);
  const [showPhoneRecap, setShowPhoneRecap] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPhoneRecap(false);
      setValidationError(null);
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

  const validateForm = (): boolean => {
    if (!mode) {
      setValidationError('Veuillez choisir un mode de récupération (Sur place / À emporter / Livraison).');
      return false;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Veuillez renseigner votre nom complet et votre numéro de téléphone.');
      return false;
    }

    if (mode === 'livraison') {
      if (!location && !useManualAddress) {
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
   * 1. « Commander par WhatsApp »
   */
  const handleWhatsAppOrder = (targetEst?: SectionType) => {
    if (!validateForm() || !mode) return;

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
   * 2. « Commander par téléphone »
   */
  const handlePhoneOrderStart = (targetEst?: SectionType) => {
    if (!validateForm() || !mode) return;

    setShowPhoneRecap(true);
    // Lance l'appel téléphonique automatiquement
    const targetTel =
      targetEst === 'rooftop' || (!targetEst && !hasRestaurant && hasRooftop)
        ? ROOFTOP_PHONE_TEL
        : RESTAURANT_PHONE_TEL;
    
    // Ouvre le lien d'appel
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
                ✨ Votre panier contient des articles du <strong>Restaurant</strong> et du <strong>Rooftop</strong>. Vous pourrez choisir le numéro à contacter lors de la validation.
              </div>
            )}

            {/* 1. Choisir l'Établissement si non mixte */}
            {!isMixed && (
              <div className="mb-5">
                <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
                  1. Établissement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSection('restaurant')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      section === 'restaurant'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🍽️ Chez Thierry
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('rooftop')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      section === 'rooftop'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🌇 Le Palmier
                  </button>
                </div>
              </div>
            )}

            {/* 2. Choose Mode */}
            <div className="mb-5">
              <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
                {isMixed ? '1.' : '2.'} Mode de récupération
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

            {/* 3. Informations client (requises pour tous les modes) */}
            {mode && (
              <div className="mb-5 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Vos coordonnées
                </h4>
                
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
              </div>
            )}

            {/* Adresse demandée uniquement pour une livraison */}
            {mode === 'livraison' && (
              <div className="mb-5 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Coordonnées de Livraison
                </h4>
                <div className="flex items-center gap-4 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="radio"
                      name="address_type"
                      checked={!useManualAddress}
                      onChange={() => {
                        setUseManualAddress(false);
                        setLocationError(null);
                        setValidationError(null);
                        if (!location) handleGetLocation();
                      }}
                      className="accent-amber-500"
                    />
                    Partager ma localisation
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="radio"
                      name="address_type"
                      checked={useManualAddress}
                      onChange={() => {
                        setUseManualAddress(true);
                        setLocationError(null);
                        setValidationError(null);
                      }}
                      className="accent-amber-500"
                    />
                    Saisir mon adresse
                  </label>
                </div>

                {!useManualAddress ? (
                  <div className="pt-1 space-y-2">
                    {location ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-500/10 p-2.5 rounded-xl border border-green-500/30">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Localisation GPS récupérée</span>
                        </div>
                        {geoAddress && (
                          <p className="text-slate-300 text-[11px] leading-relaxed bg-neutral-900/50 border border-neutral-800 p-2.5 rounded-xl">
                            <span className="text-amber-400 font-bold">📍 Adresse :</span><br />
                            {geoAddress}
                            {geoSource === 'ip' && (
                              <span className="text-neutral-500 block mt-0.5">(position approximative)</span>
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={fetchingLocation}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-md cursor-pointer"
                      >
                        <Navigation className={`w-4 h-4 ${fetchingLocation ? 'animate-spin' : ''}`} />
                        {fetchingLocation ? 'Récupération en cours...' : '📍 Partager ma localisation'}
                      </button>
                    )}
                    {locationError && (
                      <div className="space-y-2">
                        <p className="text-amber-400 text-xs leading-relaxed bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-xl">
                          ⚠️ {locationError}
                        </p>
                        <button
                          type="button"
                          onClick={() => setUseManualAddress(true)}
                          className="w-full text-center text-xs text-slate-400 hover:text-amber-400 underline transition-colors py-1 cursor-pointer"
                        >
                          → Saisir mon adresse manuellement
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-1">
                    <textarea
                      placeholder="Saisissez votre adresse exacte (Quartier, Rue, Porte, Repère...)"
                      value={manualAddress}
                      onChange={(e) => {
                        setManualAddress(e.target.value);
                        setValidationError(null);
                      }}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none transition-all resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Message d'erreur de validation */}
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

            {/* ─── DEUX CHOIX DE VALIDATION : WHATSAPP + TÉLÉPHONE ─── */}
            <div className="space-y-3">
              {/* Option 1 : Commander par WhatsApp */}
              {isMixed ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppOrder('restaurant')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span>WhatsApp Resto (66 42 77 77)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWhatsAppOrder('rooftop')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span>WhatsApp Rooftop (76 22 27 77)</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder()}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Commander par WhatsApp ({section === 'rooftop' ? '76 22 27 77' : '66 42 77 77'})</span>
                </button>
              )}

              {/* Option 2 : Commander par Téléphone */}
              {isMixed ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePhoneOrderStart('restaurant')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-neutral-900 hover:bg-amber-500/10 border border-amber-500/60 hover:border-amber-500 text-amber-400 active:scale-95 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 flex-shrink-0" />
                    <span>Appeler Resto (66 42 77 77)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhoneOrderStart('rooftop')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-extrabold text-xs bg-neutral-900 hover:bg-amber-500/10 border border-amber-500/60 hover:border-amber-500 text-amber-400 active:scale-95 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 flex-shrink-0" />
                    <span>Appeler Rooftop (76 22 27 77)</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePhoneOrderStart()}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base bg-neutral-900 hover:bg-amber-500/10 border border-amber-500/60 hover:border-amber-500 text-amber-400 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-5 h-5 flex-shrink-0" />
                  <span>Commander par téléphone ({section === 'rooftop' ? '76 22 27 77' : '66 42 77 77'})</span>
                </button>
              )}
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
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold font-playfair text-amber-400 flex items-center gap-2">
                <PhoneCall className="w-5 h-5" /> Commande par téléphone
              </h3>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-xs text-amber-300 leading-relaxed">
              📞 <strong>L'appel est en cours !</strong> Vous avez sous les yeux le récapitulatif complet de votre commande à dicter à votre interlocuteur.
            </div>

            {/* Boutons d'appel rapide / relance */}
            <div className="space-y-2">
              {(hasRestaurant || !hasRooftop) && (
                <a
                  href={`tel:${RESTAURANT_PHONE_TEL}`}
                  className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" /> Appeler Restaurant
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
                    <PhoneCall className="w-4 h-4" /> Appeler Rooftop
                  </span>
                  <span className="underline">{ROOFTOP_PHONE_DISPLAY}</span>
                </a>
              )}
            </div>

            {/* Fiche récapitulative à dicter */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Mode :</span>
                <span className="font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {mode ? MODE_LABELS[mode] : 'Non spécifié'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Client :</span>
                <span className="font-semibold text-white">{customerName} ({customerPhone})</span>
              </div>

              {mode === 'livraison' && (
                <div className="border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400 block mb-1">Adresse de livraison :</span>
                  <span className="font-medium text-slate-200">
                    {useManualAddress ? manualAddress : geoAddress || 'Localisation GPS partagée'}
                  </span>
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
                <span>Total à régler :</span>
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
