import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { RESTAURANT_MENU, ROOFTOP_MENU, RESTAURANT_SPECIAL_DISH } from '../data';
import { MenuItem, OrderMode } from '../types';
import { Footer } from '../components/Footer';
import { DishImage, CATEGORY_EMOJIS } from '../components/DishImage';

type Establishment = 'restaurant' | 'rooftop';

interface CartLine {
  key: string;
  item: MenuItem;
  section: Establishment;
  qty: number;
}

/** Un bloc de menu : catégorie simple, ou groupe de sous-catégories (ex: Boissons) */
type MenuBlock =
  | { title: string; items: MenuItem[] }
  | { title: string; subs: { title: string; items: MenuItem[] }[] };

/* Ordre naturel du menu (parcours vertical) */
const RESTAURANT_CATEGORY_ORDER = [
  'Entrées',
  'Plats',
  'Les plus de chez Thierry',
  'Les temporelles',
  "Suppléments d'accompagnement",
  'Desserts',
  'Pizzas',
];
const RESTAURANT_BOISSONS = ['Vins bouteilles', 'Vins en pichet et au verre', 'Cocktails alcoolisés'];

const ROOFTOP_CATEGORY_ORDER = [
  'Burgers & Fried Food',
  'Grill & African Touch',
  'Mocktails - Sans alcool',
  'Cocktails - Avec alcool',
  'Desserts',
];

const ESTABLISHMENT_LABELS: Record<Establishment, string> = {
  restaurant: 'Restaurant Chez Thierry',
  rooftop: 'Rooftop Le Palmier',
};

const ESTABLISHMENT_SHORT: Record<Establishment, string> = {
  restaurant: 'Restaurant',
  rooftop: 'Rooftop',
};

const WHATSAPP_NUMBERS: Record<Establishment, string> = {
  restaurant: '22366427777',
  rooftop: '22376222777',
};

const MODE_LABELS: Record<OrderMode, string> = {
  sur_place: 'Sur place',
  emporter: 'À emporter',
  livraison: 'Livraison',
};

/** Salutation automatique selon l'heure (Bonjour le jour / Bonsoir le soir) */
const getSalutation = () => {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18 ? 'Bonjour 👋' : 'Bonsoir 🌙';
};

const matchesQuery = (item: MenuItem, q: string) =>
  item.name.toLowerCase().includes(q) ||
  (item.description ?? '').toLowerCase().includes(q) ||
  (item.composants ?? '').toLowerCase().includes(q);

/**
 * Construit les blocs du menu dans l'ordre naturel du parcours vertical.
 * - Les catégories sont placées selon `order`.
 * - `boissons` (si fourni) regroupe plusieurs catégories sous un seul titre « Boissons ».
 */
function buildMenuBlocks(
  items: MenuItem[],
  order: string[],
  boissons?: string[]
): MenuBlock[] {
  const byCat = new Map<string, MenuItem[]>();
  for (const item of items) {
    const list = byCat.get(item.category) ?? [];
    list.push(item);
    byCat.set(item.category, list);
  }

  const blocks: MenuBlock[] = [];
  for (const cat of order) {
    const list = byCat.get(cat);
    if (list && list.length) blocks.push({ title: cat, items: list });
  }

  if (boissons) {
    const subs = boissons
      .map((b) => ({ title: b, items: byCat.get(b) ?? [] }))
      .filter((s) => s.items.length > 0);
    if (subs.length) blocks.push({ title: 'Boissons', subs });
  }
  return blocks;
}

/** Filtre les blocs selon la recherche (garde l'ordre naturel) */
function filterBlocks(blocks: MenuBlock[], q: string): MenuBlock[] {
  const res: MenuBlock[] = [];
  for (const b of blocks) {
    if ('subs' in b) {
      const subs = b.subs
        .map((s) => ({ ...s, items: s.items.filter((i) => matchesQuery(i, q)) }))
        .filter((s) => s.items.length > 0);
      if (subs.length) res.push({ title: b.title, subs });
    } else {
      const items = b.items.filter((i) => matchesQuery(i, q));
      if (items.length) res.push({ title: b.title, items });
    }
  }
  return res;
}

/** Nombre total d'articles dans une liste de blocs */
function countBlockItems(blocks: MenuBlock[]): number {
  return blocks.reduce((s, b) => {
    if ('subs' in b) return s + b.subs.reduce((x, sb) => x + sb.items.length, 0);
    return s + b.items.length;
  }, 0);
}

/* ─────────────────────────── Carte d'un plat ─────────────────────────── */

function DishCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800/70 hover:border-amber-500/30 rounded-2xl overflow-hidden flex flex-col transition-colors">
      <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
        <DishImage
          src={item.image}
          alt={item.name}
          emoji={CATEGORY_EMOJIS[item.category] ?? '🍽️'}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{item.description}</p>
        )}
        {item.composants && (
          <p className="text-xs text-amber-500/80 mt-1.5 leading-relaxed">📋 {item.composants}</p>
        )}
        <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-extrabold text-amber-400">
              {item.price.toLocaleString()} F
            </span>
            <span className="block text-[10px] text-neutral-500">F CFA</span>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-base px-4 py-2.5 rounded-xl active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Bloc de menu (titre + cartes) ─────────────────────── */

function MenuBlockView({ block, onAdd }: { block: MenuBlock; onAdd: (item: MenuItem) => void }) {
  // Groupe avec sous-catégories (ex: Boissons → Vins / Pichets / Cocktails)
  if ('subs' in block) {
    return (
      <div className="mb-10">
        <h3 className="flex items-center gap-2 text-xl md:text-2xl font-playfair font-bold text-amber-400 border-b border-neutral-800/60 pb-2">
          <span className="text-2xl">{CATEGORY_EMOJIS[block.title] ?? '🍹'}</span>
          {block.title}
        </h3>
        {block.subs.map((sub) => (
          <div key={sub.title} className="mt-6">
            <h4 className="flex items-center gap-2 text-base md:text-lg font-bold text-slate-200 border-l-4 border-amber-500/50 pl-3 mb-3">
              <span>{CATEGORY_EMOJIS[sub.title] ?? '•'}</span>
              {sub.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sub.items.map((item) => (
                <DishCard key={item.id} item={item} onAdd={() => onAdd(item)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Catégorie simple
  return (
    <div className="mb-10">
      <h3 className="flex items-center gap-2 text-xl md:text-2xl font-playfair font-bold text-amber-400 border-b border-neutral-800/60 pb-2">
        <span className="text-2xl">{CATEGORY_EMOJIS[block.title] ?? '•'}</span>
        {block.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {block.items.map((item) => (
          <DishCard key={item.id} item={item} onAdd={() => onAdd(item)} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Bannière plat spécial ─────────────────────── */

function SpecialDishBanner({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 md:p-7 mb-10 flex flex-col md:flex-row gap-5 items-center shadow-2xl">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border-2 border-amber-500/20 bg-neutral-900">
          <DishImage
            src={RESTAURANT_SPECIAL_DISH.image}
            alt={RESTAURANT_SPECIAL_DISH.name}
            emoji={CATEGORY_EMOJIS[RESTAURANT_SPECIAL_DISH.category] ?? '🌟'}
          />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
          <span className="bg-amber-500 text-neutral-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            🌟 Plat Spécialité
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {RESTAURANT_SPECIAL_DISH.availability}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-playfair font-bold text-amber-400">
          {RESTAURANT_SPECIAL_DISH.name}
        </h3>
        <p className="text-sm md:text-base text-slate-300 font-light mt-1.5">
          {RESTAURANT_SPECIAL_DISH.description}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
          <div className="text-center md:text-left">
            <span className="text-3xl font-extrabold text-amber-400">
              {RESTAURANT_SPECIAL_DISH.price.toLocaleString()} F
            </span>
            <span className="block text-[10px] text-neutral-500">F CFA</span>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-base px-6 py-3.5 rounded-xl active:scale-95 transition-transform shadow-lg shadow-amber-500/30"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Ajouter à la commande
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Étape de validation de commande ─────────────────── */

function OrderModal({
  lines,
  totalPrice,
  onClose,
  onUpdateQty,
  onClearCart,
}: {
  lines: CartLine[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onClearCart: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState<OrderMode>('sur_place');
  const [useManual, setUseManual] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoAddress, setGeoAddress] = useState('');
  const [geoSource, setGeoSource] = useState<'gps' | 'ip' | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const sections = Array.from(new Set(lines.map((l) => l.section)));
  const mixed = sections.length > 1;
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);

  const fallbackIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setLocation({ lat: data.latitude, lng: data.longitude });
      setGeoAddress(`${data.city}, ${data.region}, ${data.country_name}`);
      setGeoSource('ip');
      setFetching(false);
      setError('');
    } catch {
      setFetching(false);
      setError('Localisation indisponible. Veuillez saisir votre adresse manuellement.');
    }
  };

  const handleGetLocation = async () => {
    setFetching(true);
    setError('');
    setGeoAddress('');
    setGeoSource(null);

    if (!navigator.geolocation) {
      await fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setGeoSource('gps');
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const d = await r.json();
          setGeoAddress(d.display_name || '');
        } catch {
          /* adresse inverse indisponible : on garde la position GPS */
        }
        setFetching(false);
      },
      async () => {
        await fallbackIP();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validate = () => {
    if (!name.trim()) return 'Veuillez entrer votre nom.';
    if (!phone.trim()) return 'Veuillez entrer votre numéro de téléphone.';
    if (mode === 'livraison') {
      if (!useManual && !location)
        return 'Veuillez partager votre localisation ou saisir votre adresse.';
      if (useManual && !manualAddress.trim()) return 'Veuillez saisir votre adresse complète.';
    }
    return '';
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const salutation = getSalutation();
    const sectionLine = mixed
      ? `📍 Sections : ${sections.map((s) => ESTABLISHMENT_LABELS[s]).join(' + ')}`
      : `📍 Section : ${ESTABLISHMENT_LABELS[sections[0]]}`;

    let msg = `${salutation}\n\n${sectionLine}\n`;
    msg += `🍽️ Mode : ${MODE_LABELS[mode]}\n\n`;
    msg += `📝 Commande :\n`;
    for (const l of lines) {
      let line = `- ${l.qty}x ${l.item.name} (${(l.item.price * l.qty).toLocaleString()} F)`;
      if (mixed) line += ` [${ESTABLISHMENT_SHORT[l.section]}]`;
      msg += line + '\n';
    }
    msg += `\n💰 Total : ${totalPrice.toLocaleString()} F CFA\n\n`;
    msg += `👤 Client : ${name.trim()}\n`;
    msg += `📞 Téléphone : ${phone.trim()}`;

    if (mode === 'livraison') {
      if (location && !useManual) {
        msg += `\n🗺️ Localisation : https://www.google.com/maps?q=${location.lat},${location.lng}`;
        if (geoAddress)
          msg += `\n📍 Adresse : ${geoAddress}${geoSource === 'ip' ? ' (approximative)' : ''}`;
      } else {
        msg += `\n🏠 Adresse : ${manualAddress.trim()}`;
      }
    }

    // Le message part vers le Restaurant s'il contient des articles du Restaurant,
    // sinon vers le Rooftop.
    const number = sections.includes('restaurant')
      ? WHATSAPP_NUMBERS.restaurant
      : WHATSAPP_NUMBERS.rooftop;
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-bold font-playfair text-white">
            🛒 Votre commande
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-neutral-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {mixed && (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-4">
            Votre commande contient des articles du Restaurant et du Rooftop — ils seront
            indiqués dans le message.
          </p>
        )}

        {/* Articles */}
        <div className="space-y-2 mb-5">
          {lines.map((l) => (
            <div
              key={l.key}
              className="flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800/60 rounded-xl p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base font-bold text-white truncate">{l.item.name}</p>
                <p className="text-xs text-neutral-500">
                  {mixed ? `${ESTABLISHMENT_SHORT[l.section]} · ` : ''}
                  {(l.item.price * l.qty).toLocaleString()} F
                </p>
              </div>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-1.5 py-1">
                <button
                  onClick={() => onUpdateQty(l.key, -1)}
                  className="text-slate-300 hover:text-white p-1.5 transition-colors"
                >
                  {l.qty === 1 ? (
                    <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                </button>
                <span className="text-white font-bold text-sm w-5 text-center">{l.qty}</span>
                <button
                  onClick={() => onUpdateQty(l.key, 1)}
                  className="text-slate-300 hover:text-white p-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nom + téléphone */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-neutral-500" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              autoComplete="name"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3.5 text-base text-white focus:outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-neutral-500" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3.5 text-base text-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Mode de commande */}
        <div className="mb-5">
          <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            Mode de commande
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(MODE_LABELS) as OrderMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-3 rounded-xl text-sm font-extrabold border transition-all ${
                  mode === m
                    ? 'bg-amber-500 text-neutral-950 border-amber-500'
                    : 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white'
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Livraison : position GPS ou adresse */}
        {mode === 'livraison' && (
          <div className="mb-5 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Où livrer ?
            </h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <input
                  type="radio"
                  checked={!useManual}
                  onChange={() => {
                    setUseManual(false);
                    if (!location) handleGetLocation();
                  }}
                  className="accent-amber-500"
                />
                Ma position GPS
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <input
                  type="radio"
                  checked={useManual}
                  onChange={() => {
                    setUseManual(true);
                    setError('');
                  }}
                  className="accent-amber-500"
                />
                Mon adresse
              </label>
            </div>

            {!useManual ? (
              <div>
                {location ? (
                  <p className="text-green-400 text-sm font-semibold bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                    ✅ {geoAddress ? geoAddress : 'Localisation récupérée avec succès.'}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={fetching}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold py-3.5 rounded-xl disabled:opacity-60 active:scale-95 transition-all"
                  >
                    <Navigation className={`w-5 h-5 ${fetching ? 'animate-spin' : ''}`} />
                    {fetching ? 'Récupération...' : '📍 Partager ma position'}
                  </button>
                )}
              </div>
            ) : (
              <textarea
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                rows={2}
                placeholder="Votre adresse complète (quartier, rue...)"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-3 text-base text-white resize-none focus:outline-none transition-all"
              />
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-4 mb-4">
          <span className="text-slate-300 font-medium text-sm md:text-base">
            {totalQty} article{totalQty > 1 ? 's' : ''} · Total
          </span>
          <span className="text-2xl font-extrabold text-amber-400">
            {totalPrice.toLocaleString()} F CFA
          </span>
        </div>

        {error && <p className="text-red-400 text-sm font-semibold mb-3">⚠️ {error}</p>}

        {/* Envoi WhatsApp */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-neutral-950 font-extrabold text-base md:text-lg py-4 rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
          Valider et envoyer sur WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────── Page /menu ───────────────────────────── */

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const restaurantBlocks = useMemo(
    () => buildMenuBlocks(RESTAURANT_MENU, RESTAURANT_CATEGORY_ORDER, RESTAURANT_BOISSONS),
    []
  );
  const rooftopBlocks = useMemo(
    () => buildMenuBlocks(ROOFTOP_MENU, ROOFTOP_CATEGORY_ORDER),
    []
  );

  const isSearching = searchQuery.trim().length > 0;
  const query = searchQuery.trim().toLowerCase();

  const visibleRestaurant = useMemo(
    () => (isSearching ? filterBlocks(restaurantBlocks, query) : restaurantBlocks),
    [isSearching, query, restaurantBlocks]
  );
  const visibleRooftop = useMemo(
    () => (isSearching ? filterBlocks(rooftopBlocks, query) : rooftopBlocks),
    [isSearching, query, rooftopBlocks]
  );
  const showSpecial = useMemo(
    () => !isSearching || matchesQuery(RESTAURANT_SPECIAL_DISH, query),
    [isSearching, query]
  );

  const resultCount =
    countBlockItems(visibleRestaurant) +
    countBlockItems(visibleRooftop) +
    (showSpecial ? 1 : 0);

  const totalQty = cart.reduce((s, l) => s + l.qty, 0);
  const totalPrice = cart.reduce((s, l) => s + l.item.price * l.qty, 0);

  const addToCart = (item: MenuItem, section: Establishment) => {
    setCart((prev) => {
      const key = `${section}-${item.id}`;
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, item, section, qty: 1 }];
    });
  };

  const updateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((l) => {
        if (l.key !== key) return [l];
        const q = l.qty + delta;
        return q <= 0 ? [] : [{ ...l, qty: q }];
      })
    );
  };

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`min-h-screen bg-neutral-950 font-sans antialiased text-slate-100 ${
        cart.length > 0 ? 'pb-28' : ''
      }`}
    >
      {/* 🧭 Barre du haut */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 px-4 md:px-8 py-2 flex items-center justify-between shadow-xl">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/images/logo.png"
            alt="Chez Thierry x Le Palmier"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-amber-500/30 shadow-lg"
          />
          <span className="font-playfair text-sm md:text-lg font-bold text-amber-500 tracking-wider">
            CHEZ THIERRY <span className="text-white">x</span> LE PALMIER
          </span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors bg-neutral-900 border border-neutral-800 hover:border-amber-500 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Retour au site</span>
          <span className="md:hidden">Accueil</span>
        </Link>
      </nav>

      {/* 🎬 En-tête simple */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="/images/rooftop-hero.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-neutral-950" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            📱 Menu Digital
          </div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white leading-tight">
            Notre <span className="text-amber-400">Menu</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-light mt-3 max-w-lg mx-auto">
            Défilez, choisissez vos plats, puis commandez en quelques secondes.
          </p>
          <div className="relative max-w-md mx-auto mt-6">
            <input
              type="text"
              placeholder="Rechercher un plat, une boisson..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 backdrop-blur-md border border-neutral-800 focus:border-amber-500 text-white rounded-2xl pl-11 pr-4 py-3.5 text-base focus:outline-none transition-all shadow-xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          </div>
        </div>
      </section>

      {/* 🧭 Navigation rapide (restaurant / rooftop) */}
      <div className="sticky top-16 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900/60 py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
          <button
            onClick={() => jumpTo('menu-restaurant')}
            className="flex items-center gap-1.5 text-sm md:text-base font-extrabold px-5 py-2 rounded-xl border transition-all bg-neutral-900 border-neutral-800 text-slate-200 hover:border-amber-500/50"
          >
            🍽️ Restaurant
          </button>
          <button
            onClick={() => jumpTo('menu-rooftop')}
            className="flex items-center gap-1.5 text-sm md:text-base font-extrabold px-5 py-2 rounded-xl border transition-all bg-neutral-900 border-neutral-800 text-slate-200 hover:border-amber-500/50"
          >
            🌇 Rooftop
          </button>
        </div>
        <p className="text-center text-[11px] text-neutral-500 mt-1">
          👆 Faites défiler pour découvrir tout le menu
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Résultats de recherche */}
        {isSearching && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-300 text-sm md:text-base">
              🔍 Résultats pour « {searchQuery.trim()} » ({resultCount} article
              {resultCount > 1 ? 's' : ''})
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-amber-400 underline hover:text-amber-300"
            >
              Effacer la recherche
            </button>
          </div>
        )}

        {/* ─── Restaurant Chez Thierry ─── */}
        <section id="menu-restaurant" className="scroll-mt-32 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🍽️</span> Restaurant Chez Thierry
            </h2>
            <span className="hidden sm:inline text-xs text-neutral-500 font-semibold">
              💬 WhatsApp : +223 66 42 77 77
            </span>
          </div>

          {showSpecial && <SpecialDishBanner onAdd={() => addToCart(RESTAURANT_SPECIAL_DISH, 'restaurant')} />}

          {visibleRestaurant.map((b) => (
            <MenuBlockView
              key={b.title}
              block={b}
              onAdd={(item) => addToCart(item, 'restaurant')}
            />
          ))}
        </section>

        {/* ─── Rooftop Le Palmier ─── */}
        <section id="menu-rooftop" className="scroll-mt-32 pt-10 border-t border-neutral-800/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🌇</span> Rooftop Le Palmier
            </h2>
            <span className="hidden sm:inline text-xs text-neutral-500 font-semibold">
              💬 WhatsApp : +223 76 22 27 77
            </span>
          </div>

          {visibleRooftop.map((b) => (
            <MenuBlockView key={b.title} block={b} onAdd={(item) => addToCart(item, 'rooftop')} />
          ))}
        </section>

        {!isSearching && visibleRestaurant.length === 0 && visibleRooftop.length === 0 && (
          <div className="text-center py-16 text-neutral-400">Aucun plat pour le moment.</div>
        )}

        {/* Aide téléphonique */}
        <section className="mt-12 text-center bg-neutral-900/30 border border-neutral-900 rounded-2xl p-5">
          <p className="text-slate-300 text-sm md:text-base">
            📞 Besoin d'aide ? Appelez le Restaurant{' '}
            <a href="tel:+22366427777" className="text-amber-400 font-bold">
              +223 66 42 77 77
            </a>{' '}
            ou le Rooftop{' '}
            <a href="tel:+22376222777" className="text-amber-400 font-bold">
              +223 76 22 27 77
            </a>
          </p>
        </section>
      </main>

      <Footer />

      {/* 🛒 Panier flottant */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <button
            onClick={() => setIsOrderOpen(true)}
            className="w-full flex items-center justify-between gap-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-base md:text-lg py-4 px-5 rounded-2xl shadow-2xl shadow-amber-500/30 active:scale-95 transition-all"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              {totalQty} article{totalQty > 1 ? 's' : ''}
            </span>
            <span>{totalPrice.toLocaleString()} F</span>
            <span className="bg-neutral-950/20 px-3 py-1.5 rounded-xl text-sm">Commander</span>
          </button>
        </div>
      )}

      {/* Étape de validation avant WhatsApp */}
      {isOrderOpen && (
        <OrderModal
          lines={cart}
          totalPrice={totalPrice}
          onClose={() => setIsOrderOpen(false)}
          onUpdateQty={updateQty}
          onClearCart={() => setCart([])}
        />
      )}
    </div>
  );
}
