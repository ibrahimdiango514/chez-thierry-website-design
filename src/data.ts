import {
  DailyDish,
  MenuItem,
  MenuFormula,
  PauseGourmandeDessert,
  PauseGourmandeFormula,
  PauseGourmandeSupplement,
  AperoPlanche,
} from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS (au feu de bois)
  { id: 'p1', name: 'Marguerita', image: '/images/menu/restaurant/marguerita.jpg', price: 5000, category: 'Pizzas', description: 'Tomate mozzarella' },
  { id: 'p2', name: 'Reine', image: '/images/menu/restaurant/reine.jpg', price: 7000, category: 'Pizzas', description: 'Tomate, Jambon, fromage, origan, champignons (tomates, Ham, mozzarella, origano, mushrooms)' },
  { id: 'p3', name: 'Calzone (Soufflée/Turnover)', image: '/images/menu/restaurant/calzone-soufflee-turnover.jpg', price: 8000, category: 'Pizzas', description: 'Tomate, jambon, chorizo, oeuf, fromage (tomatoes, ham, chorizo, sausage, eggs, mozzarella)' },
  { id: 'p4', name: 'Tonello', image: '/images/menu/restaurant/tonello.jpg', price: 7500, category: 'Pizzas', description: 'Tomate, thon câpres, olives, fromage (Tomatoes, tuna, caper, olives, mozzarella)' },
  { id: 'p5', name: 'Bolognaise', image: '/images/menu/restaurant/bolognaise.jpg', price: 7000, category: 'Pizzas', description: 'Tomate, mincid meat, onions, green pepper, mushrooms, olives, Provence herbs, mozzarella' },
  { id: 'p6', name: 'Végétarienne', image: '/images/menu/restaurant/vegetarienne.jpg', price: 7000, category: 'Pizzas', description: 'tomate, poivrons, aubergines, oignons, olives, ail, basilic, fromage (tomatoes, green pepper, eggplant, onions, olives, garlic, mozzarella)' },
  { id: 'p7', name: 'Orientale', image: '/images/menu/restaurant/orientale.jpg', price: 8000, category: 'Pizzas', description: 'tomate, Merguez, chorizo, ail, oeufs, olives, fromage, champignons' },
  { id: 'p8', name: 'Bamakoise', image: '/images/menu/restaurant/bamakoise.jpg', price: 7500, category: 'Pizzas', description: 'Tomate, poivrons champignons, blanc de poulet, fromage, aubergine' },
  { id: 'p9', name: '5 Fromages', image: '/images/menu/restaurant/5-fromages.jpg', price: 8500, category: 'Pizzas', description: 'Mozzarella, parmesan, emmental, chèvre, roquefort, tomates' },
  { id: 'p10', name: 'Norvégienne', image: '/images/menu/restaurant/norvegienne.jpg', price: 9000, category: 'Pizzas', description: 'saumon fumé, crème fraîche, fromage' },
  { id: 'p11', name: '4 saisons', image: '/images/menu/restaurant/4-saisons.jpg', price: 10000, category: 'Pizzas', description: 'reine, bolognaise, bamakoise, orientale' },
  { id: 'p12', name: 'Fruits de mer', image: '/images/menu/restaurant/fruits-de-mer.jpg', price: 10000, category: 'Pizzas', description: 'tomates, fruits de mer ail persil, céleri, oignons, fromage' },
  { id: 'p13', name: 'Pepperoni halal', image: '/images/menu/restaurant/pepperoni-halal.jpg', price: 8000, category: 'Pizzas', description: 'Tomates, pepperoni poivrons, oignons, fromage' },

  // ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', image: '/images/menu/restaurant/salade-de-chevre-chaud.jpg', price: 4000, category: 'Entrées', description: 'Toasts de chèvre fondant sur lit de salade, juliennes de pomme, miel de fleurs et vinaigrette balsamique, pignons de pin' },
  { id: 'se2', name: 'Tartare exotique du chef', image: '/images/menu/restaurant/tartare-exotique-du-chef.jpg', price: 7000, category: 'Entrées', description: "Brunoise d'avocat, saumon fumé, crevette entière, mangue, citron vert et fines herbes" },
  { id: 'se3', name: 'Salade César', image: '/images/menu/restaurant/salade-cesar.jpg', price: 4000, category: 'Entrées', description: 'Salade, tomates, oignons frits, poulet, croûtons de pain, oeufs, parmesan, sauce' },
  { id: 'se4', name: 'Carpaccio de boeuf', image: '/images/menu/restaurant/carpaccio-de-boeuf.jpg', price: 4000, category: 'Entrées', description: 'Filet de boeuf cru, coupé en fines tranches assaisonnées' },

  // PLATS
  { id: 'pl1', name: 'Côte de boeuf', image: '/images/menu/restaurant/cote-de-boeuf.jpg', price: 9000, category: 'Plats', description: "Côte de bœuf, servie avec frites croustillantes et salade verte, sauce beurre à l'ail" },
  { id: 'pl2', name: 'Pavé de Bœuf', image: '/images/menu/restaurant/pave-de-b-uf.jpg', price: 8000, category: 'Plats', description: 'Filet de bœuf en pavé, servie avec frites croustillantes et salade verte, sauce au poivre crémeuse' },
  { id: 'pl3', name: 'Émincé de boeuf aux oignons et chorizo', image: '/images/menu/restaurant/emince-de-boeuf-aux-oignons-et-chorizo.jpg', price: 9000, category: 'Plats', description: "Émincé de bœuf sauté aux oignons, chorizo, relevé d'une sauce moutarde à l'ancienne, accompagné de pommes vapeur" },
  { id: 'pl4', name: 'Poulet local braisé', image: '/images/menu/restaurant/poulet-local-braise.jpg', price: 7500, category: 'Plats', description: 'Frites fraîches maison petite salade verte' },
  { id: 'pl5', name: 'Filet de capitaine à la crème et au curry', image: '/images/menu/restaurant/poisson-au-curry.jpg', price: 9000, category: 'Plats', description: "Filet de capitaine sauté, nappé d'une sauce onctueuse à la crème et au curry, accompagné de pommes vapeur" },
  { id: 'pl6', name: 'Fish& chips', image: '/images/menu/restaurant/fish-chips.jpg', price: 9000, category: 'Plats', description: 'Filet de capitaine pané, servie avec frites et salade verte, sauce tartare' },

  // LES PLUS DE CHEZ THIERRY
  { id: 'lp1', name: 'Émincés de poulet au curry', image: '/images/menu/restaurant/eminces-de-poulet-au-curry.jpg', price: 7500, category: 'Les plus de chez Thierry', description: 'Parfumés à la coriandre et accompagnés de riz' },
  { id: 'lp2', name: 'Filet de poulet à la crème et aux champignons', image: '/images/menu/restaurant/filet-de-poulet-a-la-creme-et-aux-champignons.jpg', price: 8000, category: 'Les plus de chez Thierry', description: 'Accompagné de spaghetti' },

  // LES TEMPORELLES
  { id: 'lt1', name: 'Mijoté de collier d\'agneau', image: '/images/menu/restaurant/mijote-de-collier-dagneau.jpg', price: 10000, category: 'Les temporelles', description: "Collier d'agneau mijoté lentement aux épices et herbes aromatiques, accompagné d'une onctueuse purée de pommes de terre" },
  { id: 'lt2', name: 'Cuisses de grenouilles', image: '/images/menu/restaurant/cuisses-de-grenouilles.jpg', price: 7500, category: 'Les temporelles', description: "Cuisses de grenouilles sautées au beurre, à l'ail et au persil, déglacées au jus de citron, servies avec frites et salade" },
  { id: 'lt3', name: 'Jarret d\'agneau rôti au romarin', image: '/images/menu/restaurant/jarret-dagneau-roti-au-romarin.jpg', price: 10000, category: 'Les temporelles', description: "Jarret d'agneau rôti au four au romarin, servi avec une poêlée de légumes de saison" },

  // SUPPLÉMENTS D'ACCOMPAGNEMENT & EXTRA
  { id: 'su1', name: 'Supplément Frites', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Portion généreuse de frites croustillantes dorées' },
  { id: 'su2', name: 'Supplément Légumes sautés', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Poêlée de légumes frais croquants et assaisonnés' },
  { id: 'su3', name: 'Supplément Aloco', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Bananes plantains mûres frites et fondantes' },
  { id: 'su4', name: 'Supplément Purée Maison', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Onctueuse purée de pommes de terre au beurre' },
  { id: 'su5', name: 'Supplément Pâtes', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Tagliatelles ou spaghetti cuits al dente' },
  { id: 'su6', name: 'Supplément Riz', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Portion de riz blanc parfumé' },
  { id: 'su7', name: 'Supplément Fruits frais', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Assortiment de fruits frais découpés' },
  { id: 'su8', name: 'Supplément Chantilly', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1000, category: 'Suppléments d\'accompagnement', description: 'Généreux dôme de crème chantilly maison' },
  { id: 'su9', name: 'Supplément Glace (1 boule)', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Boule de glace artisanale au choix' },

  // DESSERTS
  { id: 'd1', name: 'Profiterole au chocolat', image: '/images/menu/restaurant/profiterole-au-chocolat.jpg', price: 5000, category: 'Desserts', description: 'Duo de chouquettes glace vanille, sauce chocolat' },
  { id: 'd2', name: 'Mousse au chocolat noir', image: '/images/menu/restaurant/mousse-au-chocolat-noir.jpg', price: 3500, category: 'Desserts' },
  { id: 'd3', name: 'Tiramisu Spéculoos', image: '/images/menu/restaurant/tiramisu-speculoos.jpg', price: 3500, category: 'Desserts' },
  { id: 'd4', name: 'Fondant au chocolat et sa boule de glace vanille', image: '/images/menu/restaurant/coulant-au-chocolat-et-sa-boule-de-glace-vanille.jpg', price: 4000, category: 'Desserts' },
  { id: 'd5', name: 'Crêpe nature au sucre', image: '/images/menu/restaurant/crepe-nature-au-sucre.jpg', price: 2500, category: 'Desserts' },
  { id: 'd6', name: 'Crêpe au chocolat', image: '/images/menu/restaurant/crepe-au-chocolat.jpg', price: 3000, category: 'Desserts' },
  { id: 'd7', name: 'Coupe Colonel', image: '/images/menu/restaurant/coupe-colonel.jpg', price: 5000, category: 'Desserts', description: 'sorbet citron et vodka' },

  // VINS BOUTEILLES
  { id: 'v1', name: 'Côtes du Rhône, Bordeaux, Côtes de Provence, Muscat, Sauvignon', image: '/images/menu/restaurant/bordeaux-cotes-du-rhone-listel-muscadet.jpg', price: 17500, category: 'Vins bouteilles' },
  { id: 'v2', name: 'Demi-bouteille Côte du Rhône rouge', image: '/images/menu/restaurant/demi-bouteille-cote-du-rhone-rouge.jpg', price: 10000, category: 'Vins bouteilles' },
  { id: 'v3', name: 'Demi-bouteille Blanc', image: '/images/menu/restaurant/demi-bouteille-blanc.jpg', price: 10000, category: 'Vins bouteilles' },
  { id: 'v4', name: 'Demi-bouteille Rosé', image: '/images/menu/restaurant/demi-bouteille-rose.jpg', price: 10000, category: 'Vins bouteilles' },

  // VINS EN PICHET ET AU VERRE
  { id: 'vv1', name: 'Quart (1/4)', image: '/images/menu/restaurant/quart-1-4.jpg', price: 5000, category: 'Vins en pichet et au verre' },
  { id: 'vv2', name: 'Ballon', image: '/images/menu/restaurant/ballon.jpg', price: 4000, category: 'Vins en pichet et au verre' },

  // COCKTAILS ALCOOLISÉS
  { id: 'c1', name: 'Gin-fizz', image: '/images/menu/restaurant/gin-fizz.jpg', price: 5000, category: 'Cocktails alcoolisés' },
  { id: 'c2', name: 'Spritz Apérol', image: '/images/menu/restaurant/spritz-aperol.jpg', price: 7000, category: 'Cocktails alcoolisés' },
  { id: 'c3', name: 'Kir Royal', image: '/images/menu/restaurant/kir-royal.jpg', price: 7000, category: 'Cocktails alcoolisés' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // COCKTAILS AVEC ALCOOL
  { id: 'rc1', name: 'Piña Malibu', image: '/images/menu/rooftop/pina-colada.jpg', price: 6000, category: 'Cocktails - Avec alcool', description: "Rhum Malibu, jus d'ananas, crème de coco, lait" },
  { id: 'rc2', name: 'Mojito', image: '/images/menu/rooftop/mojito.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Rhum blanc, citron vert, menthe fraîche, sucre de canne, eau gazeuse' },
  { id: 'rc3', name: 'Tequila Sunrise', image: '/images/menu/rooftop/tequila-sunrise.jpg', price: 6000, category: 'Cocktails - Avec alcool', description: "Tequila, jus d'orange, sirop de grenadine" },
  { id: 'rc4', name: 'Cuba Libre', image: '/images/menu/rooftop/cuba-libre.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Rhum, Coca-Cola, citron vert' },
  { id: 'rc5', name: 'Hawaï Rhum', image: '/images/menu/rooftop/blue-hawaii-cocktail.jpg', price: 7000, category: 'Cocktails - Avec alcool', description: "Rhum blanc, jus d'ananas, curaçao bleu, citron vert" },
  { id: 'rc6', name: 'Rosé Pamplemousse', image: '/images/menu/rooftop/rose-pamplemousse.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Vin rosé, jus de pamplemousse, sirop de rose, citron vert' },
  { id: 'rc7', name: 'Caipirinha', image: '/images/menu/rooftop/caipirinha.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Cachaça, citron vert, sucre de canne' },
  { id: 'rc8', name: 'Glitter Mousseux', image: '/images/menu/rooftop/glitter-mousseux.jpg', price: 7000, category: 'Cocktails - Avec alcool', description: 'Champagne / Blanc de Blancs, sirop pailleté' },
  { id: 'rc9', name: 'Passion Rhum Tropical', image: '/images/menu/rooftop/passion-rhum-tropical.jpg', price: 6000, category: 'Cocktails - Avec alcool', description: "Rhum blanc, jus de passion, jus d'ananas" },

  // MOCKTAILS SANS ALCOOL
  { id: 'rm1', name: 'Piña Colada', image: '/images/menu/rooftop/pina-fresh.jpg', price: 4500, category: 'Mocktails - Sans alcool', description: "Jus d'ananas, crème de coco, lait, crème" },
  { id: 'rm2', name: 'Virgin Mojito', image: '/images/menu/rooftop/green-lemon.jpg', price: 3500, category: 'Mocktails - Sans alcool', description: 'Citron vert, menthe fraîche, sucre de canne, eau gazeuse' },
  { id: 'rm3', name: 'Blue Hawaii', image: '/images/menu/rooftop/blue-hawaii-sans-alcool.jpg', price: 5000, category: 'Mocktails - Sans alcool', description: "Jus d'ananas, sirop bleu, jus de citron, décoration tropicale" },
  { id: 'rm4', name: 'Pinki Pastèque', image: '/images/menu/rooftop/pinki-pasteque.jpg', price: 4000, category: 'Mocktails - Sans alcool', description: 'Jus de pastèque, sirop de rose, citron vert' },
  { id: 'rm5', name: 'Black Mango', image: '/images/menu/rooftop/black-mango.jpg', price: 4000, category: 'Mocktails - Sans alcool', description: "Jus d'ananas, sirop black, jus de mangue, citron vert" },
  { id: 'rm6', name: 'Palmier Fresh', image: '/images/menu/rooftop/palmier-fresh-signature.jpg', price: 4500, category: 'Mocktails - Sans alcool', description: 'Papaye, crème, lait, décoration tropicale' },
  { id: 'rm7', name: 'Glitter Pétillant', image: '/images/menu/rooftop/glitter-petillant.jpg', price: 5000, category: 'Mocktails - Sans alcool', description: 'Mousseux sans alcool, sirop pailleté' },
  { id: 'rm8', name: 'Passion Tropical', image: '/images/menu/rooftop/passion-tropical.jpg', price: 4000, category: 'Mocktails - Sans alcool', description: 'Jus de passion mixé, glace, jus de gingembre (sur le dessus)' },
  { id: 'rm9', name: 'Palmier Cookie Frost', image: '/images/menu/rooftop/palmier-cookie-frost.jpg', price: 6000, category: 'Mocktails - Sans alcool', description: "Oreo mixé, lait, crème, chantilly, éclats d'Oreo" },

  // BURGERS & FRIED FOOD
  { id: 'rf1', name: 'Smash Burger', image: '/images/menu/rooftop/smash-burger.jpg', price: 6000, category: 'Burgers & Fried Food', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf2', name: 'Double Smash', image: '/images/menu/rooftop/double-smash.jpg', price: 8000, category: 'Burgers & Fried Food', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf3', name: 'Chicken Burger', image: '/images/menu/rooftop/chicken-burger.jpg', price: 7000, category: 'Burgers & Fried Food', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf4', name: 'Tenders', image: '/images/menu/rooftop/tenders.jpg', price: 7000, category: 'Burgers & Fried Food', description: '5 pièces de tenders croustillants, sauce maison, accompagné de frites' },
  { id: 'rf5', name: 'Wings Signature', image: '/images/menu/rooftop/wings-signature.jpg', price: 6000, category: 'Burgers & Fried Food', description: 'Wings laquées signature, finition sésame & herbes fraîches, accompagné de frites' },

  // GRILL & AFRICAN TOUCH
  { id: 'rg1', name: 'Brochettes grillées', image: '/images/menu/rooftop/brochettes-grillees.jpg', price: 7500, category: 'Grill & African Touch', description: '3 brochettes bœuf marinées, tomates & oignons, accompagnées de frites' },
  { id: 'rg2', name: 'Carpe grillée', image: '/images/menu/rooftop/carpe-grillee.jpg', price: 8000, category: 'Grill & African Touch', description: 'Carpe entière grillée, sauce fraîche tomate/oignon, accompagnement au choix : attiéké ou alloco' },

  // DESSERTS (Rooftop)
  { id: 'rd1', name: 'Dame Blanche - Chocolat', image: '/images/menu/rooftop/dame-blanche-chocolat.jpg', price: 5000, category: 'Desserts', description: '2 boules de glace vanille, sauce chocolat chaud, éclats d\'Oreo, chantilly' },
  { id: 'rd2', name: 'Banana Split - Fruité & Exotique', image: '/images/menu/rooftop/banana-split-fruite-exotique.jpg', price: 6000, category: 'Desserts', description: 'Banane, 3 boules de glace : vanille, fraise, sorbet citron gingembre, coulis d\'hibiscus, amandes grillées, chantilly' },
  { id: 'rd3', name: 'Chouquette - Gourmande', image: '/images/menu/rooftop/chouquette-gourmande.jpg', price: 5000, category: 'Desserts', description: 'Grosse chouquette croustillante, chocolat fondant, garnie d\'une boule de glace vanille, 3 pointes de chantilly, coulis de chocolat' },
];

// ─── SPÉCIALITÉS (hors carte) ─────────────────────────────────────────────
export interface SpecialDish extends MenuItem {
  availability: string;
}

export const RESTAURANT_SPECIAL_DISH: SpecialDish = {
  id: 'signature-couscous',
  name: 'Couscous Royal',
  price: 7000,
  category: 'Plat Signature',
  description: 'Couscous royal généreux composé de poulet, merguez et mouton',
  image: '/images/couscous-royal.jpg',
  availability: 'Disponible uniquement les dimanches de 12h à 15h',
};

// ─── PLAT DU JOUR (semaine & weekend) ─────────────────────────────────────
// Service continu : plats du jour de la semaine et du week-end (5 000 F CFA)

/** Plats de la semaine — du lundi au vendredi */
export const WEEK_DAILY_DISHES: DailyDish[] = [
  {
    id: 'dj-lundi',
    day: 'LUNDI',
    name: 'Fermé',
    description: '',
  },
  {
    id: 'dj-mardi',
    day: 'MARDI',
    name: 'Facou',
    description: 'À base de viande de mouton',
    price: 5000,
  },
  {
    id: 'dj-mercredi',
    day: 'MERCREDI',
    name: 'Mafé',
    description: "Sauce à base d'arachide, viande de bœuf",
    price: 5000,
  },
  {
    id: 'dj-jeudi',
    day: 'JEUDI',
    name: 'Yassa Poulet',
    description: '',
    price: 5000,
  },
  {
    id: 'dj-vendredi',
    day: 'VENDREDI',
    name: 'Tchep poisson',
    description: '',
    price: 5000,
  },
];

/** Plats du weekend — samedi et dimanche */
export const WEEKEND_DAILY_DISHES: DailyDish[] = [
  {
    id: 'dj-samedi',
    day: 'SAMEDI',
    name: "Spécialité d'ici & d'ailleurs de la Chef",
    description: '',
    price: 5000,
  },
  {
    id: 'dj-dimanche',
    day: 'DIMANCHE',
    name: 'Couscous oriental – 3 viandes',
    description: 'Agneau, merguez et poulet',
    price: 5000,
  },
];

// ─── MENU DU JOUR ─────────────────────────────────────────────────────────
export const MENU_DU_JOUR_FORMULES: MenuFormula[] = [
  {
    id: 'mdj-f1',
    name: 'FORMULE 1',
    price: 9000,
    description: 'Entrée + Plat + Dessert',
  },
  {
    id: 'mdj-f2',
    name: 'FORMULE 2',
    price: 7500,
    description: 'Entrée + Plat',
  },
  {
    id: 'mdj-f3',
    name: 'FORMULE 3',
    price: 7500,
    description: 'Plat + Dessert',
  },
];

export const DEFAULT_MENU_DU_JOUR_PROPOSITIONS = {
  entree: 'Salade fraîcheur de saison',
  plat: 'Plat du jour au choix',
  dessert: 'Douceur maison de la Chef',
};

// ─── PAUSE GOURMANDE / SWEET BREAK (15h00 à 17h30) ─────────────────────────
export const PAUSE_GOURMANDE_DESSERTS: PauseGourmandeDessert[] = [
  {
    id: 'pg-gaufre',
    name: 'Gaufre Gourmande',
    price: 6000,
    image: '/images/menu/restaurant/gaufre-gourmande.jpg',
    emoji: '🧇',
  },
  {
    id: 'pg-pancake',
    name: 'Pancake Gourmand',
    price: 5000,
    image: '/images/menu/restaurant/pancake-gourmand.jpg',
    emoji: '🥞',
  },
  {
    id: 'pg-crepe',
    name: 'Crêpe Gourmande',
    price: 4000,
    image: '/images/menu/restaurant/crepe-au-chocolat.jpg',
    emoji: '🥞',
  },
];

export const PAUSE_GOURMANDE_FORMULES: PauseGourmandeFormula[] = [
  {
    id: 'pg-f-douceur',
    name: 'Formule Douceur',
    price: 5000,
    description: '1 crêpe classique + 1 boisson chaude ou soft au choix',
  },
  {
    id: 'pg-f-gourmande',
    name: 'Formule Gourmande',
    price: 6000,
    description: '1 gaufre ou 1 pancake gourmand + 1 boisson chaude ou soft au choix',
  },
  {
    id: 'pg-f-partager',
    name: 'Formule à Partager',
    price: 13000,
    description: 'Assortiment crêpe + gaufre + pancakes gourmands + 2 boissons au choix',
  },
];

export const PAUSE_GOURMANDE_TOPPINGS: string[] = [
  'Chocolat',
  'Caramel',
  'Chantilly',
  'Glace',
  'Spéculoos',
  'Oreo',
  'Noisettes / amandes',
];

export const PAUSE_GOURMANDE_SUPPLEMENTS: PauseGourmandeSupplement[] = [
  { id: 'pg-s-fruits', name: 'Fruits frais', price: 1500 },
  { id: 'pg-s-chantilly', name: 'Chantilly', price: 1000 },
  { id: 'pg-s-glace', name: 'Glace', price: 1500 },
];

// ─── NOS PLANCHES APÉRO (17h30 à 19h30) ────────────────────────────────────
export const APERO_PLANCHES: AperoPlanche[] = [
  {
    id: 'ap-charcuterie',
    name: 'Planche Charcuterie Halal',
    price: 8000,
    description: 'Assortiment de charcuteries halal, fromages, olives, cornichons et toasts.',
    image: '/images/menu/restaurant/planche-charcuterie-halal.jpg',
    emoji: '🥩',
  },
  {
    id: 'ap-mini-bites',
    name: 'Planche Mini Bites',
    price: 6000,
    description: 'Mini-pizzas, bruschettas et mini-tacos.',
    image: '/images/menu/restaurant/planche-mini-bites.jpg',
    emoji: '🍕',
  },
  {
    id: 'ap-mini-brochettes',
    name: 'Planche Mini-Brochettes',
    price: 7000,
    description: 'Assortiment de mini-brochettes de poulet et de bœuf, accompagnées de sauce maison.',
    image: '/images/menu/rooftop/brochettes-grillees.jpg',
    emoji: '🍢',
  },
  {
    id: 'ap-grande-partager',
    name: 'Grande Planche à Partager',
    price: 15000,
    description:
      'Assortiment complet : charcuteries halal, fromages, mini-pizzas, mini-brochettes, bruschettas, mini-tacos, olives, cornichons et sauces maison.',
    image: '/images/menu/restaurant/grande-planche-partager.jpg',
    emoji: '🍱',
    highlighted: true,
  },
];
