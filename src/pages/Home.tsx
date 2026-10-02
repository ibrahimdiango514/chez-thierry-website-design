import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SectionType, CartItem, MenuItem, OrderMode, DailyDish, MenuFormula } from '../types';
import { RESTAURANT_MENU, ROOFTOP_MENU } from '../data';
import { Hero } from '../components/Hero';
import { GeneralInfo } from '../components/GeneralInfo';
import { DailyDishes } from '../components/DailyDishes';
import { PauseGourmande } from '../components/PauseGourmande';
import { ApresMidisApero } from '../components/ApresMidisApero';
import { SignatureDish } from '../components/SignatureDish';
import { MenuSection } from '../components/MenuSection';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';
import { Footer } from '../components/Footer';
import { Assistant } from '../components/Assistant';
import { QRCodeSection } from '../components/QRCodeSection';

export default function Home() {
  const [activeSection] = useState<SectionType>('restaurant');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<OrderMode | ''>('');
  const [showPhoneMenu, setShowPhoneMenu] = useState(false);

  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Gestion du scroll automatique selon la route ou le hash
    const path = location.pathname;
    if (path === '/pause-gourmande' || path === '/sweet-break') {
      scrollToSection('pause-gourmande');
    } else if (path === '/nos-apres-midis-apero' || path === '/apero') {
      scrollToSection('apero');
    } else if (path === '/plats-du-jour') {
      scrollToSection('plat-du-jour');
    } else if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      scrollToSection(id);
    }
  }, [location.pathname, location.hash]);

  const handleAddToCart = (item: MenuItem, section?: SectionType) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevItems.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prevItems,
        {
          item,
          quantity: 1,
          section:
            section ||
            (item.category.includes('Rooftop') ||
            item.category.includes('Burgers') ||
            item.category.includes('Grill') ||
            item.category.includes('Mocktails') ||
            item.category.includes('Cocktails - Avec alcool')
              ? 'rooftop'
              : 'restaurant'),
        },
      ];
    });
    // Open cart drawer for feedback
    setIsCartOpen(true);
  };

  /* Ajout silencieux (utilisé par l'assistant) : ajoute au panier sans
     ouvrir le drawer, pour ne pas interrompre la conversation. */
  const handleAssistantAddToCart = (item: MenuItem, section?: string, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((ci) => ci.item.id === item.id);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }
      return [...prevItems, { item, quantity, section: (section as SectionType) || 'restaurant' }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((ci) => (ci.item.id === id ? { ...ci, quantity } : ci))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((ci) => ci.item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleDirectOrder = (item: MenuItem) => {
    handleAddToCart(item, 'restaurant');
    setCheckoutMode('');
    setIsCheckoutOpen(true);
  };

  const handleDailyDishOrder = (dish: DailyDish, mode: OrderMode) => {
    const item: MenuItem = {
      id: dish.id,
      name: `${dish.day} : ${dish.name}`,
      price: dish.price ?? 5000,
      category: 'Plats du jour',
      description: dish.description,
    };
    handleAddToCart(item, 'restaurant');
    setCheckoutMode(mode);
    setIsCheckoutOpen(true);
  };

  const handleSpecialItemOrder = (
    item: { name: string; price: number; description?: string; id?: string },
    mode: OrderMode
  ) => {
    const menuItem: MenuItem = {
      id: item.id ?? `item-${Date.now()}`,
      name: item.name,
      price: item.price,
      category: item.id?.startsWith('apero') ? 'Nos après-midis apéro' : 'Pause Gourmande',
      description: item.description,
    };
    const sec: SectionType = item.id?.startsWith('apero') ? 'rooftop' : 'restaurant';
    handleAddToCart(menuItem, sec);
    setCheckoutMode(mode);
    setIsCheckoutOpen(true);
  };

  const handleFormulaOrder = (formula: MenuFormula, mode: OrderMode) => {
    const item: MenuItem = {
      id: formula.id,
      name: `${formula.name} — ${formula.description}`,
      price: formula.price,
      category: 'Menu du jour',
      description: formula.description,
    };
    handleAddToCart(item, 'restaurant');
    setCheckoutMode(mode);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans select-none antialiased text-slate-100 scroll-smooth">
      
      {/* 🧭 Sticky Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 px-4 md:px-8 py-2 flex items-center justify-between shadow-xl">
        <button onClick={() => scrollToSection('accueil')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <img 
            src="/images/logo.png" 
            alt="Chez Thierry x Le Palmier" 
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-amber-500/30 shadow-lg"
          />
          <span className="font-playfair text-base md:text-lg font-bold text-amber-500 tracking-wider hidden sm:inline">
            CHEZ THIERRY <span className="text-white">x</span> LE PALMIER
          </span>
        </button>

        {/* Desktop Navigation Tabs */}
        <div className="hidden xl:flex items-center gap-5 text-xs xl:text-sm font-semibold text-slate-300">
          <button onClick={() => scrollToSection('accueil')} className="hover:text-amber-400 transition-colors cursor-pointer">Accueil</button>
          <button onClick={() => scrollToSection('plat-du-jour')} className="hover:text-amber-400 transition-colors cursor-pointer">Plats du jour</button>
          <button onClick={() => scrollToSection('pause-gourmande')} className="hover:text-amber-400 transition-colors cursor-pointer">Pause Gourmande / Sweet Break</button>
          <button onClick={() => scrollToSection('apero')} className="hover:text-amber-400 transition-colors cursor-pointer">Nos après-midis apéro</button>
          <button onClick={() => scrollToSection('restaurant')} className="hover:text-amber-400 transition-colors cursor-pointer">Restaurant</button>
          <button onClick={() => scrollToSection('rooftop')} className="hover:text-amber-400 transition-colors cursor-pointer">Rooftop</button>
          <Link to="/menu" className="hover:text-amber-400 transition-colors">Menu</Link>
          <button onClick={() => scrollToSection('contact-restaurant')} className="hover:text-amber-400 transition-colors cursor-pointer">Contact / Réservation</button>
        </div>

        {/* Medium Screen Navigation Tabs (Tablet) */}
        <div className="hidden md:flex xl:hidden items-center gap-3 text-xs font-semibold text-slate-300">
          <button onClick={() => scrollToSection('plat-du-jour')} className="hover:text-amber-400 transition-colors cursor-pointer">Plats du jour</button>
          <button onClick={() => scrollToSection('pause-gourmande')} className="hover:text-amber-400 transition-colors cursor-pointer">Pause Gourmande</button>
          <button onClick={() => scrollToSection('apero')} className="hover:text-amber-400 transition-colors cursor-pointer">Apéro</button>
          <button onClick={() => scrollToSection('restaurant')} className="hover:text-amber-400 transition-colors cursor-pointer">Resto</button>
          <button onClick={() => scrollToSection('rooftop')} className="hover:text-amber-400 transition-colors cursor-pointer">Rooftop</button>
          <Link to="/menu" className="hover:text-amber-400 transition-colors">Menu</Link>
        </div>

        {/* Mobile quick action menu */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto py-1 max-w-[65vw] scrollbar-hide">
          <button 
            onClick={() => scrollToSection('plat-du-jour')} 
            className="text-[10px] bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-slate-200 font-bold whitespace-nowrap"
          >
            🍽️ Plats du jour
          </button>
          <button 
            onClick={() => scrollToSection('pause-gourmande')} 
            className="text-[10px] bg-neutral-900 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-400 font-bold whitespace-nowrap"
          >
            ☕ Pause Gourmande
          </button>
          <button 
            onClick={() => scrollToSection('apero')} 
            className="text-[10px] bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-slate-200 font-bold whitespace-nowrap"
          >
            🍷 Apéro
          </button>
          <Link 
            to="/menu"
            className="text-[10px] bg-amber-500/10 border border-amber-500/40 px-2.5 py-1 rounded-lg text-amber-400 font-bold whitespace-nowrap"
          >
            📖 Menu
          </Link>
        </div>
      </nav>

      {/* SECTION 1 : RESTAURANT CHEZ THIERRY */}
      <div id="accueil">
        <div id="restaurant" className="scroll-mt-20">
          {/* 1. Hero restaurant */}
          <Hero type="restaurant" />

          {/* INFORMATIONS GÉNÉRALES : MISE EN AVANT DÈS L'ARRIVÉE */}
          <GeneralInfo />

          {/* 1 bis. PARTIE 1 : Plat du jour — plats de la semaine & du weekend + Menu du jour */}
          <DailyDishes
            onSelectMode={handleDailyDishOrder}
            onSelectFormula={handleFormulaOrder}
          />

          {/* 1 ter. PARTIE 2 : NOUVEL ONGLET « Pause Gourmande / Sweet Break » (15h00 à 17h30) */}
          <PauseGourmande
            onSelectMode={handleSpecialItemOrder}
            onAddToCart={(item) => handleAddToCart(item, 'restaurant')}
          />

          {/* 1 quater. PARTIE 3 : NOUVEL ONGLET « Nos après-midis apéro » (17h30 à 19h30) */}
          <ApresMidisApero
            onSelectMode={handleSpecialItemOrder}
            onAddToCart={(item) => handleAddToCart(item, 'rooftop')}
          />

          {/* Visuel Restaurant — Présentation Premium */}
          <section className="bg-neutral-950 py-8 px-4 sm:px-6 md:px-8 overflow-hidden w-full max-w-full">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  🔥 Spécialité Grillades
                </span>
              </div>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-500/20 via-neutral-900 to-neutral-950 p-[3px] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <div className="relative rounded-[20px] overflow-hidden border border-amber-500/10 bg-neutral-900">
                  <img 
                    src="/images/menu/restaurant/pave-de-b-uf.jpg" 
                    alt="Pavé de Bœuf — plat signature Chez Thierry" 
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🥩 Pavé de Bœuf
                    </span>
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🍷 Sauce au Poivre
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-neutral-500 text-[11px] mt-4 font-light tracking-widest uppercase">
                Grillades • Viandes • Cuisine Authentique
              </p>
            </div>
          </section>

          {/* 2. Couscous Royal */}
          <div id="signature" className="pt-8 bg-neutral-950">
            <SignatureDish onAddToCart={handleAddToCart} onDirectOrder={handleDirectOrder} />
          </div>

          {/* 3. Menu restaurant complet */}
          <MenuSection 
            items={RESTAURANT_MENU} 
            onAddToCart={handleAddToCart} 
            sectionType="restaurant" 
          />

          {/* Visuel Desserts — Présentation Premium */}
          <section className="bg-neutral-950 py-8 px-4 sm:px-6 md:px-8 overflow-hidden w-full max-w-full">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  🍫 Douceurs Maison
                </span>
              </div>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-500/20 via-neutral-900 to-neutral-950 p-[3px] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <div className="relative rounded-[20px] overflow-hidden border border-amber-500/10 bg-neutral-900">
                  <img 
                    src="/images/menu/restaurant/coulant-au-chocolat-et-sa-boule-de-glace-vanille.jpg" 
                    alt="Coulant au chocolat et glace vanille — Chez Thierry" 
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🍰 Desserts Faits Maison
                    </span>
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🍨 Glaces &amp; Gourmandises
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-neutral-500 text-[11px] mt-4 font-light tracking-widest uppercase">
                Pâtisseries • Glaces • Douceurs Sucrées
              </p>
            </div>
          </section>

          {/* 4 & 5. Horaires & Contact Restaurant */}
          <section id="contact-restaurant" className="bg-neutral-950 text-white py-12 px-4 md:px-8 border-t border-neutral-900/40">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-neutral-900/30 p-8 rounded-3xl border border-neutral-900">
              <div>
                <h3 className="text-2xl font-bold font-playfair text-amber-400 mb-4 flex items-center gap-2">
                  <span>🕒</span> Horaires &amp; Service Restaurant
                </h3>
                <p className="text-xs text-amber-300 font-semibold mb-4 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg inline-block">
                  ✨ Service continu du mardi au dimanche, midi → soir
                </p>
                <div className="space-y-2 text-sm text-slate-300 font-light border-l-2 border-amber-500/30 pl-4">
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span className="font-bold">Lundi :</span> <span className="text-neutral-500 italic">Fermé</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Mardi :</span> <span>11h30 - 23h30</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Mercredi :</span> <span>11h30 - 23h30</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Jeudi :</span> <span>11h30 - 23h30</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Vendredi :</span> <span>11h30 - 23h30</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Samedi :</span> <span>11h30 - 23h30</span></p>
                  <p className="flex justify-between pb-1"><span>Dimanche :</span> <span>11h30 - 23h30</span></p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span className="bg-neutral-800/60 px-2.5 py-1 rounded-md border border-neutral-700/40">❄️ Salle climatisée</span>
                  <span className="bg-neutral-800/60 px-2.5 py-1 rounded-md border border-neutral-700/40">🌿 Terrasse rafraîchie</span>
                  <span className="bg-neutral-800/60 px-2.5 py-1 rounded-md border border-neutral-700/40">🪵 Pizzas au feu de bois</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold font-playfair text-amber-400 mb-2">📞 Réserver ou Commander</h3>
                <a
                  href="tel:+22366427777"
                  className="w-full text-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold px-6 py-5 rounded-2xl text-base transition-all shadow-lg shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-3 animate-pulse"
                >
                  <span className="text-2xl">📞</span>
                  <span>Appeler le 66 42 77 77</span>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=22366427777"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-slate-200 hover:text-white px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  💬 Réserver via WhatsApp (66 42 77 77)
                </a>
              </div>
            </div>
          </section>

          {/* 6. Avis clients restaurant */}
          <section className="bg-neutral-950 text-white py-12 px-4 sm:px-6 md:px-8 border-t border-neutral-900/40 overflow-hidden w-full max-w-full">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center gap-1 mb-6">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xl">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
                <h2 className="text-3xl font-bold font-playfair text-amber-400">4.8 / 5</h2>
                <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase">+350 avis Google Restaurant</p>
              </div>
              <div className="bg-neutral-900/30 border border-neutral-800/80 p-6 rounded-2xl text-left max-w-xl mx-auto">
                <p className="text-slate-300 text-sm italic font-light leading-relaxed">
                  "Une cuisine raffinée, un cadre chaleureux et un accueil irréprochable. Le pavé de bœuf et les pizzas sont incontournables à Bamako !"
                </p>
                <h4 className="text-amber-400 font-bold text-xs mt-3 tracking-wide">— Fatoumata D.</h4>
              </div>
            </div>
          </section>

          {/* 7. Localisation & Google Maps */}
          <section className="bg-neutral-950 text-white py-12 px-4 md:px-8 border-t border-neutral-900/40 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold font-playfair text-amber-400 mb-2">📍 Nous Trouver</h3>
              <p className="text-sm text-slate-300 mb-6 font-light">Quinzambougou – La Total, Bamako, Mali</p>
              <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl h-72">
                <iframe
                  title="Localisation Chez Thierry Bamako"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.1894458319694!2d-7.9866449!3d12.6355418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe51cd655a0b27b9%3A0x67399a9cf5187e1a!2sChez%20Thierry!5e0!3m2!1sfr!2sml!4v1700000000000!5m2!1sfr!2sml"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 2 : ROOFTOP LE PALMIER */}
        <div id="rooftop" className="scroll-mt-20 border-t-8 border-neutral-900">
          {/* 1. Hero rooftop */}
          <Hero type="rooftop" />

          {/* 2. Menu rooftop complet */}
          <MenuSection 
            items={ROOFTOP_MENU} 
            onAddToCart={handleAddToCart} 
            sectionType="rooftop" 
          />

          {/* Visuel Rooftop — Présentation Street Food & Burgers Premium */}
          <section className="bg-neutral-950 py-8 px-4 sm:px-6 md:px-8 overflow-hidden w-full max-w-full">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  🍔 Burgers &amp; Snacks Rooftop
                </span>
              </div>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-500/20 via-neutral-900 to-neutral-950 p-[3px] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <div className="relative rounded-[20px] overflow-hidden border border-amber-500/10 bg-neutral-900">
                  <img 
                    src="/images/menu/rooftop/double-smash.jpg" 
                    alt="Double Smash Burger — Rooftop Le Palmier" 
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🍔 Double Smash Burger
                    </span>
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🧀 Cheddar Fondant
                    </span>
                    <span className="bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      🍟 Frites Maison
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-neutral-500 text-[11px] mt-4 font-light tracking-widest uppercase">
                Grillades • Snacks • Street Food Premium
              </p>
            </div>
          </section>

          {/* Soirées Thématiques Rooftop */}
          <section className="bg-neutral-950 py-10 px-4 sm:px-6 md:px-8 border-t border-neutral-900/40">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                  ✨ Ambiance &amp; Événements
                </span>
                <h3 className="text-3xl font-bold font-playfair text-white tracking-wide">
                  Nos Soirées Thématiques
                </h3>
                <p className="text-neutral-400 text-xs mt-2 max-w-md mx-auto">
                  Vivez des moments inoubliables sur le Rooftop Le Palmier au rythme de nos rendez-vous hebdomadaires.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mercredi Happy Hours */}
                <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-500/20 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-500/30">
                        Mercredi
                      </span>
                      <span className="text-2xl">🍹</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 font-playfair">Happy Hours</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Cocktails • Détente • Musique • Rooftop. L'ambiance idéale en milieu de semaine pour savourer nos créations mixologiques.
                    </p>
                  </div>
                </div>

                {/* Vendredi After Work */}
                <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-500/20 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-500/30">
                        Vendredi
                      </span>
                      <span className="text-2xl">🍢</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 font-playfair">After Work</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Cocktails • Tapas • Musique • Ambiance. Décompressez de votre semaine de travail avec une atmosphère festive et lounge.
                    </p>
                  </div>
                </div>

                {/* Samedi Karaoké */}
                <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-500/20 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-500/30">
                        Samedi
                      </span>
                      <span className="text-2xl">🎤</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 font-playfair">Karaoké Party</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Entre amis, en couple ou en groupe : chantez, dansez, profitez ! Une soirée inoubliable sous les étoiles de Bamako.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 & 4. Horaires & Contact Rooftop */}
          <section className="bg-neutral-950 text-white py-12 px-4 md:px-8 border-t border-neutral-900/40">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-neutral-900/30 p-8 rounded-3xl border border-neutral-900">
              <div>
                <h3 className="text-2xl font-bold font-playfair text-amber-400 mb-6 flex items-center gap-2">
                  <span>🕒</span> Horaires Rooftop
                </h3>
                <div className="space-y-2 text-sm text-slate-300 font-light border-l-2 border-red-500/30 pl-4">
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span className="font-bold">Lundi :</span> <span className="text-neutral-500 italic">Fermé</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Mardi :</span> <span>18h30 - 00h00</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Mercredi :</span> <span>18h30 - 00h00</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Jeudi :</span> <span>18h30 - 00h00</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Vendredi :</span> <span>18h30 - 02h00</span></p>
                  <p className="flex justify-between border-b border-neutral-900/60 pb-1"><span>Samedi :</span> <span>18h30 - 02h00</span></p>
                  <p className="flex justify-between pb-1"><span>Dimanche :</span> <span>18h30 - 00h00</span></p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold font-playfair text-amber-400 mb-2">📞 Réserver ou Commander</h3>
                <a
                  href="tel:+22376222777"
                  className="w-full text-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold px-6 py-5 rounded-2xl text-base transition-all shadow-lg shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-3 animate-pulse"
                >
                  <span className="text-2xl">📞</span>
                  <span>Appeler le 76 22 27 77</span>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=22376222777"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-slate-200 hover:text-white px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  💬 Réserver via WhatsApp (76 22 27 77)
                </a>
              </div>
            </div>
          </section>

          {/* 5. Avis clients rooftop */}
          <section className="bg-neutral-950 text-white py-12 px-4 md:px-8 border-t border-neutral-900/40 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-1 mb-6">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xl">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
                <h2 className="text-3xl font-bold font-playfair text-amber-400">4.9 / 5</h2>
                <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase">+200 avis Google Rooftop</p>
              </div>
              <div className="bg-neutral-900/30 border border-neutral-800/80 p-6 rounded-2xl text-left max-w-xl mx-auto">
                <p className="text-slate-300 text-sm italic font-light leading-relaxed">
                  "Le Palmier Rooftop est l'endroit parfait pour décompresser le week-end. Les cocktails Signature sont excellents !"
                </p>
                <h4 className="text-amber-400 font-bold text-xs mt-3 tracking-wide">— Moussa T.</h4>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Social Media Buttons (Homepage) */}
      <div className="fixed left-6 bottom-6 z-40 flex flex-col gap-3">
        <a
          href="https://www.tiktok.com/@chez_tchierry?_r=1&_t=ZS-95vI7ZXa0W5"
          target="_blank"
          rel="noreferrer"
          className="bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 p-3 rounded-2xl text-white border border-neutral-800 hover:border-neutral-700 shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Suivez-nous sur TikTok"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06-.03-.11-.07-.17-.1v9.83c.02 4.59-3.28 8.64-7.84 9.24-5.41.71-10.35-3.37-10.35-8.82.03-4.43 3.44-8.17 7.85-8.51.1-.01.21-.01.31-.02v4.13c-2.1.25-3.65 2.1-3.48 4.22.18 2.3 2.19 3.93 4.46 3.63 1.83-.24 3.14-1.76 3.12-3.6V0z" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/chez_thierry_x_le_palmier?igsh=MWVkNnVpN3oyNGNnZw=="
          target="_blank"
          rel="noreferrer"
          className="bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 p-3 rounded-2xl text-pink-500 border border-neutral-800 hover:border-neutral-700 shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Suivez-nous sur Instagram"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <button
          onClick={() => setShowPhoneMenu(!showPhoneMenu)}
          className="bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 p-3 rounded-2xl text-amber-500 border border-neutral-800 hover:border-amber-500 shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center relative cursor-pointer"
          title="Nous appeler"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {showPhoneMenu && (
            <div className="absolute left-full ml-3 bottom-0 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 w-44">
              <a
                href="tel:+22366427777"
                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <span>🍽️</span> Restaurant
              </a>
              <a
                href="tel:+22376222777"
                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <span>🌇</span> Rooftop
              </a>
            </div>
          )}
        </button>
      </div>

      {/* Floating Cart & Checkout Components */}
      <Cart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentSection={activeSection}
        onClearCart={handleClearCart}
        initialMode={checkoutMode}
      />

      {/* 🤖 Assistant IA — Chez Thierry */}
      <Assistant
        cartInfo={{
          cartCount: cartItems.reduce((s, ci) => s + ci.quantity, 0),
          cartTotal: cartItems.reduce((s, ci) => s + ci.item.price * ci.quantity, 0),
          page: 'home',
        }}
        cart={cartItems.map((ci) => ({ key: ci.item.id, item: ci.item, quantity: ci.quantity }))}
        onAddToCart={handleAssistantAddToCart}
        onRemoveFromCart={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* 📱 QR Code — Site Officiel Chez Thierry (uniquement sur le site principal) */}
      <QRCodeSection variant="site" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
