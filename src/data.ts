import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Marguerita', price: 5000, category: 'Pizzas', description: 'Tomate, mozzarella' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas', description: 'Tomate, jambon, fromage, origan, champignons' },
  { id: 'p3', name: 'Calzone (Soufflée/Turnover)', price: 8000, category: 'Pizzas', description: 'Tomate, jambon, chorizo, oeuf, fromage' },
  { id: 'p4', name: 'Tonello', price: 7500, category: 'Pizzas', description: 'Tomate, thon, câpres, olives, fromage' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas', description: 'Tomate, viande hachée, oignons, poivron vert, champignons, olives, herbes de Provence, fromage' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas', description: 'Tomate, poivrons, aubergines, oignons, olives, ail, basilic, fromage' },
  { id: 'p7', name: 'Orientale', price: 8000, category: 'Pizzas', description: 'Tomate, merguez, chorizo, ail, oeufs, olives, fromage, champignons' },
  { id: 'p8', name: 'Bamakoise', price: 7500, category: 'Pizzas', description: 'Tomate, poivrons, champignons, blanc de poulet, fromage, aubergine' },
  { id: 'p9', name: '5 Fromages', price: 8500, category: 'Pizzas', description: 'Mozzarella, parmesan, emmental, chèvre, roquefort, tomates' },
  { id: 'p10', name: 'Norvégienne', price: 9000, category: 'Pizzas', description: 'Saumon fumé, crème fraîche, fromage' },
  { id: 'p11', name: '4 Saisons', price: 10000, category: 'Pizzas', description: 'Reine, bolognaise, bamakoise, orientale' },
  { id: 'p12', name: 'Fruits de mer', price: 10000, category: 'Pizzas', description: 'Tomates, fruits de mer, ail, persil, céleri, oignons, fromage' },
  { id: 'p13', name: 'Pepperoni halal', price: 8000, category: 'Pizzas', description: 'Tomates, pepperoni, poivrons, oignons, fromage' },

  // ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', price: 4000, category: 'Entrées', description: 'Toasts de chèvre fondant sur lit de salade, juliennes de pomme, miel de fleurs et vinaigrette balsamique, pignons de pin' },
  { id: 'se2', name: 'Salade du chef', price: 5000, category: 'Entrées', description: 'Pâtes torti, avocat, basilic, tomates séchées, fêta, oeuf, oignon, poivrons tricolore' },
  { id: 'se3', name: 'Salade César', price: 4000, category: 'Entrées', description: 'Tomates, oignons frits, poulet, croûtons de pain, oeufs, parmesan, sauce' },
  { id: 'se4', name: 'Carpaccio de boeuf', price: 4000, category: 'Entrées', description: 'Filet de boeuf cru, coupé en fines tranches assaisonnées' },

  // PLATS
  { id: 'vp1', name: 'Côte de boeuf', price: 9000, category: 'Plats', description: 'Servie avec frites croustillantes et salade verte, sauce beurre à l\'ail' },
  { id: 'vp2', name: 'Pavé de Bœuf', price: 8000, category: 'Plats', description: 'Filet de boeuf en pavé, frites croustillantes et salade verte, sauce au poivre crémeuse' },
  { id: 'vp3', name: 'Escalope milanaise', price: 9000, category: 'Plats', description: 'Fine escalope de poulet panée à l\'italienne, frites, sauce tomate, quartier de citron' },
  { id: 'vp4', name: 'Poulet local braisé', price: 7500, category: 'Plats', description: 'Frites fraîches maison, petite salade verte' },
  { id: 'vp5', name: 'Poisson au curry', price: 9000, category: 'Plats', description: 'Filet de capitaine sauté crème coco curry, pommes de terre vapeur' },
  { id: 'vp6', name: 'Fish & chips', price: 9000, category: 'Plats', description: 'Filet de capitaine pané, frites et salade verte, sauce tartare' },

  // LES PLUS DE CHEZ THIERRY
  { id: 'lp1', name: 'Émincés de poulet au curry', price: 7500, category: 'Les plus de chez Thierry', description: 'Parfumée à la coriandre et accompagnés de riz' },
  { id: 'lp2', name: 'Filet de poulet à la crème et basilic', price: 7000, category: 'Les plus de chez Thierry', description: 'Accompagné de spaghetti' },

  // LES TEMPORELLES
  { id: 'lt1', name: 'Mijoté de côtes d\'agneau', price: 10000, category: 'Les temporelles', description: 'Côte d\'agneau mijoté façon ragoût dans un bouillon de légumes et herbes fraîches, sauce brune, servie avec une purée de patate douce selon saison' },
  { id: 'lt2', name: 'Cuisses de grenouilles', price: 7500, category: 'Les temporelles', description: 'Sautées au beurre, à l\'ail et au persil, déglacées et jus de citron, servie avec frites et salade' },
  { id: 'lt3', name: 'Jarret de porc', price: 10000, category: 'Les temporelles', description: 'Saisi et grillé au four de feu, servie avec des frites et une sauce tartare' },

  // SUPPLÉMENTS
  { id: 'su1', name: 'Supplément d\'accompagnement', price: 1500, category: 'Suppléments', description: 'Frites, Légumes sautés, aloco, Purée Maison, Pâtes, Riz' },

  // DESSERTS
  { id: 'd1', name: 'Profiterole au chocolat', price: 5000, category: 'Desserts', description: 'Duo de chouquettes, glace vanille, sauce chocolat' },
  { id: 'd2', name: 'Mousse au chocolat noir', price: 3500, category: 'Desserts' },
  { id: 'd3', name: 'Tiramisu Spéculoos', price: 3500, category: 'Desserts' },
  { id: 'd4', name: 'Coulant au chocolat et sa boule de glace vanille', price: 4000, category: 'Desserts' },
  { id: 'd5', name: 'Crêpe nature au sucre', price: 2500, category: 'Desserts' },
  { id: 'd6', name: 'Crêpe au chocolat', price: 3000, category: 'Desserts' },
  { id: 'd7', name: 'Coupe Colonel', price: 5000, category: 'Desserts', description: 'Sorbet citron et vodka' },

  // VINS
  { id: 'v1', name: 'Bordeaux / Côtes du Rhône / Listel / Muscadet', price: 17500, category: 'Vins' },
  { id: 'v2', name: 'Demi-bouteille Côte du Rhône rouge', price: 10000, category: 'Vins' },
  { id: 'v3', name: 'Demi-bouteille Blanc', price: 10000, category: 'Vins' },
  { id: 'v4', name: 'Demi-bouteille Rosé', price: 10000, category: 'Vins' },
  { id: 'v5', name: 'Quart (1/4)', price: 5000, category: 'Vins' },
  { id: 'v6', name: 'Ballon', price: 4000, category: 'Vins' },

  // COCKTAILS
  { id: 'c1', name: 'Gin-fizz', price: 4000, category: 'Cocktails' },
  { id: 'c2', name: 'Blue Hawaii', price: 5000, category: 'Cocktails' },
  { id: 'c3', name: 'Caiprina', price: 4000, category: 'Cocktails' },
  { id: 'c4', name: 'Spritz Apérol', price: 5000, category: 'Cocktails' },
  { id: 'c5', name: 'Mojito', price: 4000, category: 'Cocktails' },
  { id: 'c6', name: 'Kir Royal', price: 5000, category: 'Cocktails' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // BURGERS & FRITURES
  { id: 'rf1', name: 'Smash Burger', price: 5000, category: 'Burgers & Fritures', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf2', name: 'Double Smash', price: 7000, category: 'Burgers & Fritures', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf3', name: 'Chicken Burger', price: 6000, category: 'Burgers & Fritures', description: 'Cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf4', name: 'Tenders', price: 5000, category: 'Burgers & Fritures', description: '5 pièces de tenders croustillants, sauce maison, accompagné de frites' },
  { id: 'rf5', name: 'Wings Signature', price: 4000, category: 'Burgers & Fritures', description: 'Wings laquées signature, finition sésame & herbes fraîches, accompagné de frites' },

  // GRILL & TOUCHE AFRICAINE
  { id: 'rg1', name: 'Brochettes Grillées', price: 6000, category: 'Grill & Touche Africaine', description: '3 brochettes bœuf marinées, tomates & oignons, accompagnées de frites' },
  { id: 'rg2', name: 'Carpe Grillée', price: 7500, category: 'Grill & Touche Africaine', description: 'Carpe entière grillée, sauce fraîche tomate/oignon, accompagnement au choix : attiéké ou alloco' },

  // MOCKTAILS (SANS ALCOOL)
  { id: 'rm1', name: 'Sunrise Gingembre', price: 2500, category: 'Mocktails', description: 'Gingembre, Citron, Jus d\'ananas, Bissap' },
  { id: 'rm2', name: 'Green Lemon', price: 2500, category: 'Mocktails', description: 'Menthe, Citron, Sirop de sucre, Eau gazeuse' },
  { id: 'rm3', name: 'Palmier Fresh (Signature)', price: 2500, category: 'Mocktails', description: 'Mangue, Bissap, Citron, Menthe, Eau gazeuse' },
  { id: 'rm4', name: 'Blue Mango', price: 2500, category: 'Mocktails', description: 'Sirop blue curaçao (sans alcool), Mangue, Citron, Eau gazeuse' },
  { id: 'rm5', name: 'Piña Fresh', price: 3000, category: 'Mocktails', description: 'Ananas, Lait de coco, Crème légère' },
  { id: 'rm6', name: 'Blue Hawaii', price: 3500, category: 'Mocktails', description: 'Jus d\'ananas, Jus de citron, Sirop blue curaçao (sans alcool), Eau gazeuse' },

  // COCKTAILS (AVEC ALCOOL)
  { id: 'rc1', name: 'Gingembre Sunrise', price: 4000, category: 'Cocktails', description: 'Gingembre, Citron, Jus d\'ananas, Grenadine, Rhum' },
  { id: 'rc2', name: 'Mint Vodka Fresh', price: 4000, category: 'Cocktails', description: 'Menthe, Citron, Sirop de sucre, Vodka' },
  { id: 'rc3', name: 'Palmier Signature', price: 4000, category: 'Cocktails', description: 'Mangue, Bissap, Citron, Menthe, Rhum' },
  { id: 'rc4', name: 'Blue Sunset', price: 4000, category: 'Cocktails', description: 'Blue curaçao, Jus d\'orange, Citron, Vodka' },
  { id: 'rc5', name: 'Piña Colada', price: 5000, category: 'Cocktails', description: 'Ananas, Lait de coco, Crème légère, Malibu' },
  { id: 'rc6', name: 'Blue Hawaii', price: 5000, category: 'Cocktails', description: 'Malibu, Blue curaçao, Jus d\'ananas, Jus de citron' },

  // DESSERTS
  { id: 'rd1', name: 'Dame Blanche - Chocolat', price: 5000, category: 'Desserts', description: '2 boules de glace vanille, sauce chocolat chaud, éclats d\'Oreo, chantilly' },
  { id: 'rd2', name: 'Banana Split - Fruité & Exotique', price: 6000, category: 'Desserts', description: 'Banane, 3 boules de glace : vanille, fraise, sorbet citron gingembre, coulis d\'hibiscus, amandes grillées, chantilly' },
  { id: 'rd3', name: 'Chouquette - Gourmande', price: 5000, category: 'Desserts', description: 'Grosse chouquette croustillante, chocolat fondant, garnie d\'une boule de glace vanille, 3 pointes de chantilly, coulis de chocolat' },
];
