import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
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
  { id: 'se2', name: 'Salade du chef', image: '/images/menu/restaurant/salade-du-chef.jpg', price: 5000, category: 'Entrées', description: 'Salade, de pâtes torti, avocat, basilic, tomates séchées, fêta, oeuf, oignon, poivrons tricolore' },
  { id: 'se3', name: 'Salade César', image: '/images/menu/restaurant/salade-cesar.jpg', price: 4000, category: 'Entrées', description: 'salade, tomates, oignons frits, poulet, croûtons de pain, oeufs, parmesan, sauce' },
  { id: 'se4', name: 'Carpaccio de boeuf', image: '/images/menu/restaurant/carpaccio-de-boeuf.jpg', price: 4000, category: 'Entrées', description: 'filet de boeuf cru, coupé en fines tranches assaisonnées' },

  // PLATS
  { id: 'pl1', name: 'Côte de boeuf', image: '/images/menu/restaurant/cote-de-boeuf.jpg', price: 9000, category: 'Plats', description: 'Côte de bœuf, servie avec frites croustillantes et salade verte, sauce beurre à l\'ail' },
  { id: 'pl2', name: 'Pavé de Bœuf', image: '/images/menu/restaurant/pave-de-b-uf.jpg', price: 8000, category: 'Plats', description: 'Filet de boeuf en pavé, servie avec frites croustillantes et salade verte, sauce au poivre crémeuse.' },
  { id: 'pl3', name: 'Escalope milanaise', image: '/images/menu/restaurant/escalope-milanaise.jpg', price: 9000, category: 'Plats', description: 'Fine escalope de poulet panée à l\'italienne, accompagnée de frites, de sauce tomate et d\'un quartier de citron.' },
  { id: 'pl4', name: 'Poulet local braisé', image: '/images/menu/restaurant/poulet-local-braise.jpg', price: 7500, category: 'Plats', description: 'Frites fraîches maison petite salade Verte' },
  { id: 'pl5', name: 'Poisson au curry', image: '/images/menu/restaurant/poisson-au-curry.jpg', price: 9000, category: 'Plats', description: 'filet de capitaine sauté crème coco, Curry accompagné de pommes de terre vapeur' },
  { id: 'pl6', name: 'Fish & chips', image: '/images/menu/restaurant/fish-chips.jpg', price: 9000, category: 'Plats', description: 'filet de capitaine pané, servie avec frites et salade verte, sauce tartare' },

  // LES PLUS DE CHEZ THIERRY
  { id: 'lp1', name: 'Émincés de poulet au curry', image: '/images/menu/restaurant/eminces-de-poulet-au-curry.jpg', price: 7500, category: 'Les plus de chez Thierry', description: 'Parfumée à la coriandre et accompagnés de riz' },
  { id: 'lp2', name: 'Filet de poulet à la crème et basilic', image: '/images/menu/restaurant/filet-de-poulet-a-la-creme-et-basilic.jpg', price: 7000, category: 'Les plus de chez Thierry', description: 'accompagné de spaghetti' },

  // LES TEMPORELLES
  { id: 'lt1', name: 'Mijoté de côtes d\'agneau', image: '/images/menu/restaurant/mijote-de-cotes-dagneau.jpg', price: 10000, category: 'Les temporelles', description: 'Côte d\'agneau mijoté façon ragoût dans un bouillon de légumes et herbes fraîches, sauce brûne, servie avec une purée de patate douce selon saison' },
  { id: 'lt2', name: 'Cuisses de grenouilles', image: '/images/menu/restaurant/cuisses-de-grenouilles.jpg', price: 7500, category: 'Les temporelles', description: 'cuisses de grenouilles sautées au beurre, à l\'ail et au persil, déglacées et jus de citron, servie avec Frites et Salade' },
  { id: 'lt3', name: 'Jarret de porc', image: '/images/menu/restaurant/jarret-de-porc.jpg', price: 10000, category: 'Les temporelles', description: 'Jarret de porc saisie et grillé au four de feu, servie avec des frites et une sauce tartare' },

  // SUPPLÉMENTS D'ACCOMPAGNEMENT
  { id: 'su1', name: 'Supplément d\'accompagnement', image: '/images/menu/restaurant/supplement-daccompagnement.jpg', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Frites, Légumes sautés, aloco, Purée Maison, Pâtes, Riz' },

  // DESSERTS
  { id: 'd1', name: 'Profiterole au chocolat', image: '/images/menu/restaurant/profiterole-au-chocolat.jpg', price: 5000, category: 'Desserts', description: 'Duo de chouquettes glace vanille, sauce chocolat' },
  { id: 'd2', name: 'Mousse au chocolat noir', image: '/images/menu/restaurant/mousse-au-chocolat-noir.jpg', price: 3500, category: 'Desserts' },
  { id: 'd3', name: 'Tiramisu Spéculoos', image: '/images/menu/restaurant/tiramisu-speculoos.jpg', price: 3500, category: 'Desserts' },
  { id: 'd4', name: 'Coulant au chocolat et sa boule de glace vanille', image: '/images/menu/restaurant/coulant-au-chocolat-et-sa-boule-de-glace-vanille.jpg', price: 4000, category: 'Desserts' },
  { id: 'd5', name: 'Crêpe nature au sucre', image: '/images/menu/restaurant/crepe-nature-au-sucre.jpg', price: 2500, category: 'Desserts' },
  { id: 'd6', name: 'Crêpe au chocolat', image: '/images/menu/restaurant/crepe-au-chocolat.jpg', price: 3000, category: 'Desserts' },
  { id: 'd7', name: 'Coupe Colonel', image: '/images/menu/restaurant/coupe-colonel.jpg', price: 5000, category: 'Desserts', description: 'sorbet citron et vodka' },

  // VINS BOUTEILLES
  { id: 'v1', name: 'Bordeaux, côtes du Rhône, Listel, Muscadet', image: '/images/menu/restaurant/bordeaux-cotes-du-rhone-listel-muscadet.jpg', price: 17500, category: 'Vins bouteilles' },
  { id: 'v2', name: 'Demi-bouteille Côte du Rhône rouge', image: '/images/menu/restaurant/demi-bouteille-cote-du-rhone-rouge.jpg', price: 10000, category: 'Vins bouteilles' },
  { id: 'v3', name: 'Demi-bouteille Blanc', image: '/images/menu/restaurant/demi-bouteille-blanc.jpg', price: 10000, category: 'Vins bouteilles' },
  { id: 'v4', name: 'Demi-bouteille Rosé', image: '/images/menu/restaurant/demi-bouteille-rose.jpg', price: 10000, category: 'Vins bouteilles' },

  // VINS EN PICHET ET AU VERRE
  { id: 'vv1', name: 'Quart (1/4)', image: '/images/menu/restaurant/quart-1-4.jpg', price: 5000, category: 'Vins en pichet et au verre' },
  { id: 'vv2', name: 'Ballon', image: '/images/menu/restaurant/ballon.jpg', price: 4000, category: 'Vins en pichet et au verre' },

  // COCKTAILS ALCOOLISÉS
  { id: 'c1', name: 'Gin-fizz', image: '/images/menu/restaurant/gin-fizz.jpg', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c2', name: 'Blue Hawaii', image: '/images/menu/restaurant/blue-hawaii.jpg', price: 5000, category: 'Cocktails alcoolisés' },
  { id: 'c3', name: 'Caiprina', image: '/images/menu/restaurant/caiprina.jpg', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c4', name: 'Spritz Apérol', image: '/images/menu/restaurant/spritz-aperol.jpg', price: 5000, category: 'Cocktails alcoolisés' },
  { id: 'c5', name: 'Mojito', image: '/images/menu/restaurant/mojito.jpg', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c6', name: 'Kir Royal', image: '/images/menu/restaurant/kir-royal.jpg', price: 5000, category: 'Cocktails alcoolisés' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // BURGERS & FRIED FOOD
  { id: 'rf1', name: 'Smash Burger', image: '/images/menu/rooftop/smash-burger.jpg', price: 5000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf2', name: 'Double Smash', image: '/images/menu/rooftop/double-smash.jpg', price: 7000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf3', name: 'Chicken Burger', image: '/images/menu/rooftop/chicken-burger.jpg', price: 6000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf4', name: 'Tenders', image: '/images/menu/rooftop/tenders.jpg', price: 5000, category: 'Burgers & Fried Food', description: '5 pièces de tenders croustillants, sauce maison, accompagné de frites' },
  { id: 'rf5', name: 'Wings Signature', image: '/images/menu/rooftop/wings-signature.jpg', price: 4000, category: 'Burgers & Fried Food', description: 'wings laquées signature, finition sésame & herbes fraîches, accompagné de frites' },

  // GRILL & AFRICAN TOUCH
  { id: 'rg1', name: 'Brochettes Grillées', image: '/images/menu/rooftop/brochettes-grillees.jpg', price: 6000, category: 'Grill & African Touch', description: '3 brochettes bœuf marinées, tomates & oignons, accompagnées de frites' },
  { id: 'rg2', name: 'Carpe Grillée', image: '/images/menu/rooftop/carpe-grillee.jpg', price: 7500, category: 'Grill & African Touch', description: 'carpe entière grillée, sauce fraîche tomate/oignon, accompagnement au choix : attiéké ou alloco' },

  // MOCKTAILS - SANS ALCOOL
  { id: 'rm1', name: 'Sunrise Gingembre', image: '/images/menu/rooftop/sunrise-gingembre.jpg', price: 2500, category: 'Mocktails - Sans alcool', description: 'Gingembre, Citron, Jus d\'ananas, Bissap.' },
  { id: 'rm2', name: 'Green Lemon', image: '/images/menu/rooftop/green-lemon.jpg', price: 2500, category: 'Mocktails - Sans alcool', description: 'Menthe, Citron, Sirop de sucre, Eau gazeuse.' },
  { id: 'rm3', name: 'Palmier Fresh (Signature)', image: '/images/menu/rooftop/palmier-fresh-signature.jpg', price: 2500, category: 'Mocktails - Sans alcool', description: 'Mangue, Bissap, Citron, Menthe, Eau gazeuse.' },
  { id: 'rm4', name: 'Blue Mango', image: '/images/menu/rooftop/blue-mango.jpg', price: 2500, category: 'Mocktails - Sans alcool', description: 'Sirop blue curaçao (sans alcool), Mangue, Citron, Eau gazeuse.' },
  { id: 'rm5', name: 'Piña Fresh', image: '/images/menu/rooftop/pina-fresh.jpg', price: 3000, category: 'Mocktails - Sans alcool', description: 'Ananas, Lait de coco, Crème légère.' },
  { id: 'rm6', name: 'Blue Hawaii', image: '/images/menu/rooftop/blue-hawaii.jpg', price: 3500, category: 'Mocktails - Sans alcool', description: 'Jus d\'ananas, Jus de citron, Sirop blue curaçao (sans alcool), Eau gazeuse.' },

  // COCKTAILS - AVEC ALCOOL
  { id: 'rc1', name: 'Gingembre Sunrise', image: '/images/menu/rooftop/gingembre-sunrise.jpg', price: 4000, category: 'Cocktails - Avec alcool', description: 'Gingembre, Citron, Jus d\'ananas, Grenadine, Rhum.' },
  { id: 'rc2', name: 'Mint Vodka Fresh', image: '/images/menu/rooftop/mint-vodka-fresh.jpg', price: 4000, category: 'Cocktails - Avec alcool', description: 'Menthe, Citron, Sirop de sucre, Vodka.' },
  { id: 'rc3', name: 'Palmier Signature', image: '/images/menu/rooftop/palmier-signature.jpg', price: 4000, category: 'Cocktails - Avec alcool', description: 'Mangue, Bissap, Citron, Menthe, Rhum.' },
  { id: 'rc4', name: 'Blue Sunset', image: '/images/menu/rooftop/blue-sunset.jpg', price: 4000, category: 'Cocktails - Avec alcool', description: 'Blue curaçao, Jus d\'orange, Citron, Vodka.' },
  { id: 'rc5', name: 'Piña Colada', image: '/images/menu/rooftop/pina-colada.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Ananas, Lait de coco, Crème légère, Malibu.' },
  { id: 'rc6', name: 'Blue Hawaii', image: '/images/menu/rooftop/blue-hawaii.jpg', price: 5000, category: 'Cocktails - Avec alcool', description: 'Malibu, Blue curaçao, Jus d\'ananas, Jus de citron.' },

  // DESSERTS
  { id: 'rd1', name: 'Dame Blanche - Chocolat', image: '/images/menu/rooftop/dame-blanche-chocolat.jpg', price: 5000, category: 'Desserts', description: '2 boules de glace vanille, sauce chocolat chaud, éclats d\'Oreo, chantilly.' },
  { id: 'rd2', name: 'Banana Split - Fruité & Exotique', image: '/images/menu/rooftop/banana-split-fruite-exotique.jpg', price: 6000, category: 'Desserts', description: 'Banane, 3 boules de glace : vanille, fraise, sorbet citron gingembre, coulis d\'hibiscus, amandes grillées, chantilly.' },
  { id: 'rd3', name: 'Chouquette - Gourmande', image: '/images/menu/rooftop/chouquette-gourmande.jpg', price: 5000, category: 'Desserts', description: 'Grosse chouquette croustillante, chocolat fondant, garnie d\'une boule de glace vanille, 3 pointes de chantilly, coulis de chocolat.' },
];


// ─── SPÉCIALITÉS (hors carte) ─────────────────────────────────────────────
// Plats spéciaux présentés sur le site principal (SignatureDish) et repris
// dans le Menu Digital. Disponibles selon des conditions particulières.

export interface SpecialDish extends MenuItem {
  /** Conditions de disponibilité (ex: "uniquement les dimanches") */
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
