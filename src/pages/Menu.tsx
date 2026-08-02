import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle, Phone, Search } from 'lucide-react';
import { RESTAURANT_MENU, ROOFTOP_MENU, RESTAURANT_SPECIAL_DISH } from '../data';
import { MenuItem } from '../types';
import { Footer } from '../components/Footer';

type Establishment = 'restaurant' | 'rooftop';

const ESTABLISHMENTS: {
  id: Establishment;
  label: string;
  shortLabel: string;
  emoji: string;
  whatsapp: string;
  phone: string;
}[] = [
  {
    id: 'restaurant',
    label: 'Restaurant Chez Thierry',
    shortLabel: 'Chez Thierry',
    emoji: '🍽️',
    whatsapp: '22366427777',
    phone: '+22366427777',
  },
  {
    id: 'rooftop',
    label: 'Rooftop Le Palmier',
    shortLabel: 'Le Palmier',
    emoji: '🌇',
    whatsapp: '22376222777',
    phone: '+22376222777',
  },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  // Restaurant
  Pizzas: '🍕',
  Entrées: '🥗',
  Plats: '🍽️',
  'Les plus de chez Thierry': '🌟',
  'Les temporelles': '🍲',
  "Suppléments d'accompagnement": '🍟',
  Desserts: '🍰',
  'Vins bouteilles': '🍷',
  'Vins en pichet et au verre': '🥂',
  'Cocktails alcoolisés': '🍹',
  // Rooftop
  'Burgers & Fried Food': '🍔',
  'Grill & African Touch': '🍢',
  'Mocktails - Sans alcool': '🧃',
  'Cocktails - Avec alcool': '🍸',
  // Spécialités
  'Plat Signature': '🌟',
};

const buildWhatsAppLink = (item: MenuItem, establishment: Establishment) => {
  const sectionName =
    establishment === 'restaurant' ? 'Restaurant Chez Thierry' : 'Rooftop Le Palmier';
  const whatsapp = establishment === 'restaurant' ? '22366427777' : '22376222777';
  const message = `Bonjour 👋\n\nJe souhaite commander via votre menu digital :\n\n- ${item.name} (${item.price.toLocaleString()} F)\n\n📍 Section : ${sectionName}\n💰 Total : ${item.price.toLocaleString()} F CFA`;
  return `https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(message)}`;
};

/**
 * Image d'un plat avec placeholder automatique :
 * - si la photo existe, elle s'affiche ;
 * - sinon (fichier pas encore déposé), un placeholder élégant est montré
 *   et le nom / description / prix restent visibles.
 */
function DishImage({ src, alt, emoji }: { src?: string; alt: string; emoji: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-900 to-neutral-950 select-none">
        <span className="text-4xl opacity-60">{emoji}</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-600">
          Photo à venir
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

export default function Menu() {
  const [establishment, setEstablishment] = useState<Establishment>('restaurant');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items = establishment === 'restaurant' ? RESTAURANT_MENU : ROOFTOP_MENU;
  const current = ESTABLISHMENTS.find((e) => e.id === establishment)!;

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items]
  );

  const activeCat = activeCategory || categories[0] || '';

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description ?? '').toLowerCase().includes(query)
      );
    }
    return items.filter((item) => item.category === activeCat);
  }, [items, searchQuery, activeCat]);

  const switchEstablishment = (id: Establishment) => {
    setEstablishment(id);
    setActiveCategory('');
    setSearchQuery('');
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 font-sans antialiased text-slate-100">
      {/* 🧭 Top bar — Menu Digital */}
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
        <span className="hidden sm:inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
          📱 Menu Digital
        </span>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors bg-neutral-900 border border-neutral-800 hover:border-amber-500 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Retour au site</span>
          <span className="md:hidden">Accueil</span>
        </Link>
      </nav>

      {/* 🎬 Hero Menu Digital */}
      <section className="relative pt-20 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="/images/rooftop-hero.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-xs md:text-sm font-semibold tracking-wider uppercase mb-5">
            📱 Menu Digital
          </div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-3 leading-tight">
            Découvrez notre <span className="text-amber-400">Menu</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto mb-8">
            Les plats et cocktails de Chez Thierry & Le Palmier Rooftop, directement sur votre
            téléphone. Scannez, consultez, commandez.
          </p>

          {/* Choix de l'établissement */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            {ESTABLISHMENTS.map((e) => (
              <button
                key={e.id}
                onClick={() => switchEstablishment(e.id)}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm md:text-base font-extrabold transition-all transform active:scale-95 border ${
                  establishment === e.id
                    ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-neutral-900/80 backdrop-blur-md text-slate-300 border-neutral-800 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                <span className="text-lg">{e.emoji}</span>
                {e.shortLabel}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Rechercher un plat, une boisson..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 backdrop-blur-md border border-neutral-800 focus:border-amber-500 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all shadow-xl"
            />
            <Search className="absolute left-4 top-4 w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </section>

      {/* 🗂️ Catégories sticky */}
      <div className="sticky top-16 z-30 bg-neutral-950/95 backdrop-blur-md border-y border-neutral-900/60 py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex overflow-x-auto pb-1 gap-2 scrollbar-hide">
          {categories.map((category) => {
            const count = items.filter((item) => item.category === category).length;
            const isActive = !isSearching && category === activeCat;
            return (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchQuery('');
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-slate-400 border-neutral-800/80 hover:border-neutral-700 hover:text-slate-200'
                }`}
              >
                <span>{CATEGORY_EMOJIS[category] ?? '•'}</span>
                {category}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-neutral-950/20 text-neutral-900' : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🍽️ Contenu du menu */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* 🌟 Plat Spécialité — Couscous Royal (Restaurant uniquement) */}
        {establishment === 'restaurant' && !isSearching && (
          <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/30 p-6 md:p-8 mb-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              {/* Image */}
              <div className="w-full md:w-72 lg:w-80 flex-shrink-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-amber-500/20 bg-neutral-900 shadow-xl">
                  <DishImage
                    src={RESTAURANT_SPECIAL_DISH.image}
                    alt={RESTAURANT_SPECIAL_DISH.name}
                    emoji={CATEGORY_EMOJIS[RESTAURANT_SPECIAL_DISH.category] ?? '🌟'}
                  />
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-amber-500 text-neutral-950 font-extrabold px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-wider uppercase">
                    🌟 Plat Spécialité
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-full text-[11px] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {RESTAURANT_SPECIAL_DISH.availability}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-amber-400 tracking-wide">
                  {RESTAURANT_SPECIAL_DISH.name}
                </h2>
                <p className="text-slate-300 text-sm font-light mt-2 leading-relaxed max-w-lg mx-auto md:mx-0">
                  {RESTAURANT_SPECIAL_DISH.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-5">
                  <div className="text-center sm:text-left">
                    <span className="text-2xl md:text-3xl font-extrabold text-amber-400">
                      {RESTAURANT_SPECIAL_DISH.price.toLocaleString()} F
                    </span>
                    <span className="text-xs text-neutral-500 font-bold block">F CFA</span>
                  </div>
                  <a
                    href={buildWhatsAppLink(RESTAURANT_SPECIAL_DISH, 'restaurant')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-extrabold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-neutral-950 bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_28px_rgba(34,197,94,0.55)]"
                  >
                    <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                    Commander via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-playfair border-l-4 border-amber-500 pl-4 text-white">
            {isSearching
              ? `Résultats pour « ${searchQuery.trim()} »`
              : `${current.emoji} ${current.label}`}
          </h2>
          <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">
            {filteredItems.length} article{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-amber-500/30 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-md"
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
                  <h3 className="font-bold text-base md:text-lg text-slate-100 group-hover:text-white transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>
                {item.description && (
                  <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">{item.description}</p>
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

                <a
                  href={buildWhatsAppLink(item, establishment)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-extrabold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-neutral-950 bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                  Commander
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-4xl mb-3">🔍</p>
            Aucun article trouvé
            {isSearching ? ` pour « ${searchQuery.trim()} »` : ' dans cette catégorie'}.
          </div>
        )}

        {/* 📞 Appel à l'action — Commander / Réserver */}
        <section className="mt-14 bg-neutral-900/30 border border-neutral-900 rounded-3xl p-6 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold font-playfair text-amber-400 mb-2">
            {current.emoji} {current.label}
          </h3>
          <p className="text-slate-400 text-sm font-light mb-6">
            Une question, une réservation ou une commande ? Contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={`tel:${current.phone}`}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold px-6 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <Phone className="w-4 h-4" />
              Appeler {current.shortLabel}
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=${current.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-green-500 text-slate-200 hover:text-white font-extrabold px-6 py-3.5 rounded-xl transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              WhatsApp
            </a>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
