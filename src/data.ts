import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Marguerita', price: 5000, category: 'Pizzas', description: 'Tomate mozzarella' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas', description: 'Tomate, Jambon, fromage, origan, champignons (tomates, Ham, mozzarella, origano, mushrooms)' },
  { id: 'p3', name: 'Calzone (Soufflée/Turnover)', price: 8000, category: 'Pizzas', description: 'Tomate, jambon, chorizo, oeuf, fromage (tomatoes, ham, chorizo, sausage, eggs, mozzarella)' },
  { id: 'p4', name: 'Tonello', price: 7500, category: 'Pizzas', description: 'Tomate, thon câpres, olives, fromage (Tomatoes, tuna, caper, olives, mozzarella)' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas', description: 'Tomate, mincid meat, onions, green pepper, mushrooms, olives, Provence herbs, mozzarella' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas', description: 'tomate, poivrons, aubergines, oignons, olives, ail, basilic, fromage (tomatoes, green pepper, eggplant, onions, olives, garlic, mozzarella)' },
  { id: 'p7', name: 'Orientale', price: 8000, category: 'Pizzas', description: 'tomate, Merguez, chorizo, ail, oeufs, olives, fromage, champignons' },
  { id: 'p8', name: 'Bamakoise', price: 7500, category: 'Pizzas', description: 'Tomate, poivrons champignons, blanc de poulet, fromage, aubergine' },
  { id: 'p9', name: '5 Fromages', price: 8500, category: 'Pizzas', description: 'Mozzarella, parmesan, emmental, chèvre, roquefort, tomates' },
  { id: 'p10', name: 'Norvégienne', price: 9000, category: 'Pizzas', description: 'saumon fumé, crème fraîche, fromage' },
  { id: 'p11', name: '4 saisons', price: 10000, category: 'Pizzas', description: 'reine, bolognaise, bamakoise, orientale' },
  { id: 'p12', name: 'Fruits de mer', price: 10000, category: 'Pizzas', description: 'tomates, fruits de mer ail persil, céleri, oignons, fromage' },
  { id: 'p13', name: 'Pepperoni halal', price: 8000, category: 'Pizzas', description: 'Tomates, pepperoni poivrons, oignons, fromage' },

  // ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', price: 4000, category: 'Entrées', description: 'Toasts de chèvre fondant sur lit de salade, juliennes de pomme, miel de fleurs et vinaigrette balsamique, pignons de pin' },
  { id: 'se2', name: 'Salade du chef', price: 5000, category: 'Entrées', description: 'Salade, de pâtes torti, avocat, basilic, tomates séchées, fêta, oeuf, oignon, poivrons tricolore' },
  { id: 'se3', name: 'Salade César', price: 4000, category: 'Entrées', description: 'salade, tomates, oignons frits, poulet, croûtons de pain, oeufs, parmesan, sauce' },
  { id: 'se4', name: 'Carpaccio de boeuf', price: 4000, category: 'Entrées', description: 'filet de boeuf cru, coupé en fines tranches assaisonnées' },

  // PLATS
  { id: 'pl1', name: 'Côte de boeuf', price: 9000, category: 'Plats', description: 'Côte de bœuf, servie avec frites croustillantes et salade verte, sauce beurre à l\'ail' },
  { id: 'pl2', name: 'Pavé de Bœuf', price: 8000, category: 'Plats', description: 'Filet de boeuf en pavé, servie avec frites croustillantes et salade verte, sauce au poivre crémeuse.' },
  { id: 'pl3', name: 'Escalope milanaise', price: 9000, category: 'Plats', description: 'Fine escalope de poulet panée à l\'italienne, accompagnée de frites, de sauce tomate et d\'un quartier de citron.' },
  { id: 'pl4', name: 'Poulet local braisé', price: 7500, category: 'Plats', description: 'Frites fraîches maison petite salade Verte' },
  { id: 'pl5', name: 'Poisson au curry', price: 9000, category: 'Plats', description: 'filet de capitaine sauté crème coco, Curry accompagné de pommes de terre vapeur' },
  { id: 'pl6', name: 'Fish & chips', price: 9000, category: 'Plats', description: 'filet de capitaine pané, servie avec frites et salade verte, sauce tartare' },

  // LES PLUS DE CHEZ THIERRY
  { id: 'lp1', name: 'Émincés de poulet au curry', price: 7500, category: 'Les plus de chez Thierry', description: 'Parfumée à la coriandre et accompagnés de riz' },
  { id: 'lp2', name: 'Filet de poulet à la crème et basilic', price: 7000, category: 'Les plus de chez Thierry', description: 'accompagné de spaghetti' },

  // LES TEMPORELLES
  { id: 'lt1', name: 'Mijoté de côtes d\'agneau', price: 10000, category: 'Les temporelles', description: 'Côte d\'agneau mijoté façon ragoût dans un bouillon de légumes et herbes fraîches, sauce brûne, servie avec une purée de patate douce selon saison' },
  { id: 'lt2', name: 'Cuisses de grenouilles', price: 7500, category: 'Les temporelles', description: 'cuisses de grenouilles sautées au beurre, à l\'ail et au persil, déglacées et jus de citron, servie avec Frites et Salade' },
  { id: 'lt3', name: 'Jarret de porc', price: 10000, category: 'Les temporelles', description: 'Jarret de porc saisie et grillé au four de feu, servie avec des frites et une sauce tartare' },

  // SUPPLÉMENTS D'ACCOMPAGNEMENT
  { id: 'su1', name: 'Supplément d\'accompagnement', price: 1500, category: 'Suppléments d\'accompagnement', description: 'Frites, Légumes sautés, aloco, Purée Maison, Pâtes, Riz' },

  // DESSERTS
  { id: 'd1', name: 'Profiterole au chocolat', price: 5000, category: 'Desserts', description: 'Duo de chouquettes glace vanille, sauce chocolat' },
  { id: 'd2', name: 'Mousse au chocolat noir', price: 3500, category: 'Desserts' },
  { id: 'd3', name: 'Tiramisu Spéculoos', price: 3500, category: 'Desserts' },
  { id: 'd4', name: 'Coulant au chocolat et sa boule de glace vanille', price: 4000, category: 'Desserts' },
  { id: 'd5', name: 'Crêpe nature au sucre', price: 2500, category: 'Desserts' },
  { id: 'd6', name: 'Crêpe au chocolat', price: 3000, category: 'Desserts' },
  { id: 'd7', name: 'Coupe Colonel', price: 5000, category: 'Desserts', description: 'sorbet citron et vodka' },

  // VINS BOUTEILLES
  { id: 'v1', name: 'Bordeaux, côtes du Rhône, Listel, Muscadet', price: 17500, category: 'Vins bouteilles' },
  { id: 'v2', name: 'Demi-bouteille Côte du Rhône rouge', price: 10000, category: 'Vins bouteilles' },
  { id: 'v3', name: 'Demi-bouteille Blanc', price: 10000, category: 'Vins bouteilles' },
  { id: 'v4', name: 'Demi-bouteille Rosé', price: 10000, category: 'Vins bouteilles' },

  // VINS EN PICHET ET AU VERRE
  { id: 'vv1', name: 'Quart (1/4)', price: 5000, category: 'Vins en pichet et au verre' },
  { id: 'vv2', name: 'Ballon', price: 4000, category: 'Vins en pichet et au verre' },

  // COCKTAILS ALCOOLISÉS
  { id: 'c1', name: 'Gin-fizz', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c2', name: 'Blue Hawaii', price: 5000, category: 'Cocktails alcoolisés' },
  { id: 'c3', name: 'Caiprina', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c4', name: 'Spritz Apérol', price: 5000, category: 'Cocktails alcoolisés' },
  { id: 'c5', name: 'Mojito', price: 4000, category: 'Cocktails alcoolisés' },
  { id: 'c6', name: 'Kir Royal', price: 5000, category: 'Cocktails alcoolisés' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // BURGERS & FRIED FOOD
  { id: 'rf1', name: 'Smash Burger', price: 5000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf2', name: 'Double Smash', price: 7000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf3', name: 'Chicken Burger', price: 6000, category: 'Burgers & Fried Food', description: 'cheddar fondant, salade fraîche, sauce maison, accompagné de frites' },
  { id: 'rf4', name: 'Tenders', price: 5000, category: 'Burgers & Fried Food', description: '5 pièces de tenders croustillants, sauce maison, accompagné de frites' },
  { id: 'rf5', name: 'Wings Signature', price: 4000, category: 'Burgers & Fried Food', description: 'wings laquées signature, finition sésame & herbes fraîches, accompagné de frites' },

  // GRILL & AFRICAN TOUCH
  { id: 'rg1', name: 'Brochettes Grillées', price: 6000, category: 'Grill & African Touch', description: '3 brochettes bœuf marinées, tomates & oignons, accompagnées de frites' },
  { id: 'rg2', name: 'Carpe Grillée', price: 7500, category: 'Grill & African Touch', description: 'carpe entière grillée, sauce fraîche tomate/oignon, accompagnement au choix : attiéké ou alloco' },

  // MOCKTAILS - SANS ALCOOL
  { id: 'rm1', name: 'Sunrise Gingembre', price: 2500, category: 'Mocktails - Sans alcool', description: 'Gingembre, Citron, Jus d\'ananas, Bissap.' },
  { id: 'rm2', name: 'Green Lemon', price: 2500, category: 'Mocktails - Sans alcool', description: 'Menthe, Citron, Sirop de sucre, Eau gazeuse.' },
  { id: 'rm3', name: 'Palmier Fresh (Signature)', price: 2500, category: 'Mocktails - Sans alcool', description: 'Mangue, Bissap, Citron, Menthe, Eau gazeuse.' },
  { id: 'rm4', name: 'Blue Mango', price: 2500, category: 'Mocktails - Sans alcool', description: 'Sirop blue curaçao (sans alcool), Mangue, Citron, Eau gazeuse.' },
  { id: 'rm5', name: 'Piña Fresh', price: 3000, category: 'Mocktails - Sans alcool', description: 'Ananas, Lait de coco, Crème légère.' },
  { id: 'rm6', name: 'Blue Hawaii', price: 3500, category: 'Mocktails - Sans alcool', description: 'Jus d\'ananas, Jus de citron, Sirop blue curaçao (sans alcool), Eau gazeuse.' },

  // COCKTAILS - AVEC ALCOOL
  { id: 'rc1', name: 'Gingembre Sunrise', price: 4000, category: 'Cocktails - Avec alcool', description: 'Gingembre, Citron, Jus d\'ananas, Grenadine, Rhum.' },
  { id: 'rc2', name: 'Mint Vodka Fresh', price: 4000, category: 'Cocktails - Avec alcool', description: 'Menthe, Citron, Sirop de sucre, Vodka.' },
  { id: 'rc3', name: 'Palmier Signature', price: 4000, category: 'Cocktails - Avec alcool', description: 'Mangue, Bissap, Citron, Menthe, Rhum.' },
  { id: 'rc4', name: 'Blue Sunset', price: 4000, category: 'Cocktails - Avec alcool', description: 'Blue curaçao, Jus d\'orange, Citron, Vodka.' },
  { id: 'rc5', name: 'Piña Colada', price: 5000, category: 'Cocktails - Avec alcool', description: 'Ananas, Lait de coco, Crème légère, Malibu.' },
  { id: 'rc6', name: 'Blue Hawaii', price: 5000, category: 'Cocktails - Avec alcool', description: 'Malibu, Blue curaçao, Jus d\'ananas, Jus de citron.' },

  // DESSERTS
  { id: 'rd1', name: 'Dame Blanche - Chocolat', price: 5000, category: 'Desserts', description: '2 boules de glace vanille, sauce chocolat chaud, éclats d\'Oreo, chantilly.' },
  { id: 'rd2', name: 'Banana Split - Fruité & Exotique', price: 6000, category: 'Desserts', description: 'Banane, 3 boules de glace : vanille, fraise, sorbet citron gingembre, coulis d\'hibiscus, amandes grillées, chantilly.' },
  { id: 'rd3', name: 'Chouquette - Gourmande', price: 5000, category: 'Desserts', description: 'Grosse chouquette croustillante, chocolat fondant, garnie d\'une boule de glace vanille, 3 pointes de chantilly, coulis de chocolat.' },
];
