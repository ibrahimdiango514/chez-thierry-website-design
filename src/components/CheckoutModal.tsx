import React, { useState } from 'react';
import { CartItem, OrderMode, SectionType } from '../types';
import { X, MapPin, Smartphone, User, CheckCircle, Navigation } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentSection: SectionType;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentSection,
  onClearCart,
}) => {
  const [section, setSection] = useState<SectionType>(currentSection);
  const [mode, setMode] = useState<OrderMode | ''>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [geoAddress, setGeoAddress] = useState('');
  const [geoSource, setGeoSource] = useState<'gps' | 'ip' | null>(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

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
    } catch (e) {
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
        } catch (e) {
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

  const getSalutation = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 18) {
      return "Bonjour 👋";
    }
    return "Bonsoir 🌙";
  };

  const handleSubmitOrder = () => {
    if (!mode) {
      alert("Veuillez choisir un mode de commande.");
      return;
    }

    if (mode === 'livraison') {
      if (!customerName.trim() || !customerPhone.trim()) {
        alert("Veuillez remplir vos informations de livraison.");
        return;
      }
      if (!location && !useManualAddress) {
        alert("Veuillez activer la localisation GPS ou saisir une adresse manuelle.");
        return;
      }
      if (useManualAddress && !manualAddress.trim()) {
        alert("Veuillez saisir votre adresse complète.");
        return;
      }
    }

    const salutation = getSalutation();
    const sectionName = section === 'restaurant' ? 'Restaurant Chez Thierry' : 'Rooftop Le Palmier';
    const modeName = mode === 'sur_place' ? 'Sur place' : mode === 'emporter' ? 'À emporter' : 'Livraison';

    let orderDetailsText = cartItems
      .map((ci) => `- ${ci.quantity}x ${ci.item.name} (${(ci.item.price * ci.quantity).toLocaleString()} F)`)
      .join('\n');

    let message = `${salutation}\n\n`;
    message += `📍 Section : ${sectionName}\n`;
    message += `🍽️ Mode : ${modeName}\n\n`;
    message += `📝 Commande :\n${orderDetailsText}\n\n`;
    message += `💰 Total : ${total.toLocaleString()} F CFA`;

    if (mode === 'livraison') {
      message += `\n\n👤 Client : ${customerName}`;
      message += `\n📞 Téléphone : ${customerPhone}`;
      if (location && !useManualAddress) {
        message += `\n🗺️ Localisation : https://www.google.com/maps?q=${location.lat},${location.lng}`;
        if (geoAddress) {
          message += `\n📍 Adresse : ${geoAddress}${geoSource === 'ip' ? ' (approximative)' : ''}`;
        }
      } else {
        message += `\n🏠 Adresse : ${manualAddress}`;
      }
    }

    const whatsappNumber = section === 'restaurant' ? '22366427777' : '22376222777';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-neutral-900"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6 font-playfair border-b border-neutral-800 pb-3">
          Finaliser votre commande
        </h3>

        {/* 1. Choose Section */}
        <div className="mb-6">
          <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">1. Choisir l'Établissement</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSection('restaurant')}
              className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                section === 'restaurant'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
              }`}
            >
              🍽️ Chez Thierry
            </button>
            <button
              type="button"
              onClick={() => setSection('rooftop')}
              className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                section === 'rooftop'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
              }`}
            >
              🌇 Le Palmier
            </button>
          </div>
        </div>

        {/* 2. Choose Mode */}
        <div className="mb-6">
          <label className="block text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">2. Mode de récupération</label>
          <div className="grid grid-cols-3 gap-2">
            {(['sur_place', 'emporter', 'livraison'] as OrderMode[]).map((m) => {
              const labels = { sur_place: 'Sur Place', emporter: 'À Emporter', livraison: 'Livraison' };
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`py-3 px-1 rounded-xl text-xs font-bold border transition-all ${
                    mode === m
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {labels[m]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Delivery Details */}
        {mode === 'livraison' && (
          <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Coordonnées de Livraison
            </h4>
            
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Nom complet"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="tel"
                placeholder="Numéro de téléphone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4 py-1">
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
                Saisir mon adresse
              </label>
            </div>

            {!useManualAddress ? (
              <div className="pt-1 space-y-2">
                {location ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-500/10 p-3 rounded-xl border border-green-500/30">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Localisation récupérée avec succès</span>
                    </div>
                    {geoAddress && (
                      <p className="text-slate-300 text-[11px] leading-relaxed bg-neutral-900/50 border border-neutral-800 p-2.5 rounded-xl">
                        <span className="text-amber-400 font-bold">📍 Adresse détectée :</span><br />
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
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold py-3 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-md"
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
                      className="w-full text-center text-xs text-slate-400 hover:text-amber-400 underline transition-colors py-1"
                    >
                      → Saisir mon adresse manuellement
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-1">
                <textarea
                  placeholder="Saisissez votre adresse exacte (ex: Quartier du Fleuve, Rue 310...)"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t border-neutral-800 pt-4 mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-neutral-400">Nombre d'articles :</span>
            <span className="text-white font-medium">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-neutral-200">Total :</span>
            <span className="text-amber-400">
              {total.toLocaleString()} F CFA
            </span>
          </div>
        </div>

        {/* Submit Order Button */}
        <button
          onClick={handleSubmitOrder}
          className="w-full text-center py-4 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95 bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/10 hover:shadow-amber-500/20"
        >
          Valider ma Commande via WhatsApp
        </button>

      </div>
    </div>
  );
};
