import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Marguerita', price: 5000, category: 'Pizzas', composants: 'Tomate mozzarella' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas', composants: 'Tomate, Jambon, fromage, origan, champignons (tomates, Ham, mozzarella, oregano, mushrooms)' },
  { id: 'p3', name: 'Calzone (Soufflée/Tunover)', price: 7000, category: 'Pizzas', composants: 'Tomate, jambon, chorizo, oeuf, fromage (tomatoes, ham, chorizo, sausage, eggs, mozzarella)' },
  { id: 'p4', name: 'Napolitaine', price: 7000, category: 'Pizzas', composants: 'Tomate, anchois, câpres, olives, fromage (Tomatoes, anchoivies, caper, olives, mozzarella)' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas', composants: 'Tomate, mincid meat, onions, green pepper, mushrooms, olives, Provence herbs, mozzarella' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas', composants: 'Tomate, poivrons, aubergines, oignons, olives, ail, basilic, fromage (tomatoes, green pepper, eggplant, onions, olives, garlic, mozzarella)' },
  { id: 'p7', name: 'Orientale', price: 7000, category: 'Pizzas', composants: 'Tomate, Merguez, chorizo, ail, oeufs, olives, fromage, champignons' },
  { id: 'p8', name: 'Bamakoise', price: 7000, category: 'Pizzas', composants: 'Tomate, poivrons, champignons, blanc de poulet, fromage, aubergine' },
  { id: 'p9', name: '5 Fromages', price: 8000, category: 'Pizzas', composants: 'Mozzarella, parmesan, emmental, chèvre, roquefort, tomates' },
  { id: 'p10', name: 'Norvégienne', price: 8000, category: 'Pizzas', composants: 'Saumon fumé, crème fraîche, fromage' },
  { id: 'p11', name: '4 saisons', price: 8000, category: 'Pizzas', composants: 'Tomates, cœur d\'artichaut, champignons, poivrons, oignons, fromage' },
  { id: 'p12', name: 'Arménienne', price: 8000, category: 'Pizzas', composants: 'Tomates, poivrons, chorizo, soudjour, bastelma, fromage' },
  { id: 'p13', name: 'Pepperoni halal', price: 7000, category: 'Pizzas', composants: 'Tomates, pepperoni, poivrons, oignons, fromage' },

  // ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', price: 3500, category: 'Entrées', composants: 'Toasts de chèvre fondant sur lit de salade, juliennes de pomme, miel de fleurs et vinaigrette balsamique, pignons de pin' },
  { id: 'se2', name: 'Salade du chef', price: 3500, category: 'Entrées', composants: 'Salade, oignons, ail, avocat, oeuf, toast de pain cheddar, carotte râpée, concombre' },
  { id: 'se3', name: 'Salade César', price: 4000, category: 'Entrées', composants: 'Salade, tomates, oignons frits, poulet, croûtons de pain, oeufs, parmesan, sauce' },
  { id: 'se4', name: 'Carpaccio de boeuf ou capitaine', price: 4000, category: 'Entrées', composants: 'Filet de capitaine ou de boeuf coupé en fines tranches assaisonnées' },

  // PLATS
  { id: 'vp1', name: 'Côte de boeuf', price: 9000, category: 'Plats', composants: 'Côte de boeuf, servie avec frites croustillantes et salade verte, sauce beurre à l’ail' },
  { id: 'vp2', name: 'Pavé de Boeuf', price: 8000, category: 'Plats', composants: 'Filet de boeuf en pavé, servie avec frites croustillantes et salade verte, sauce au poivre crémeuse' },
  { id: 'vp3', name: 'Côte de porc', price: 7000, category: 'Plats', composants: '2 pièces de côtes accompagnées de frittes' },
  { id: 'vp4', name: 'Poulet local braisé', price: 7000, category: 'Plats', composants: 'Frites fraîches maison petite salade Verte' },
  { id: 'vp5', name: 'Filet de capitaine en papillote', price: 9000, category: 'Plats', composants: 'Filet de capitaine herbes fraîches cuit en aluminium au feu de bois accompagné de légumes et pommes de terre' },
  { id: 'vp6', name: 'Fish & chips', price: 8000, category: 'Plats', composants: 'Filet de capitaine pané, servie avec frites et salade verte, sauce tartare' },
  { id: 'vp7', name: 'Cuisse de poulet grillée au feu de bois', price: 5000, category: 'Plats', composants: 'Parfumée et accompagnée de riz et sauce à l’origan' },
  { id: 'vp8', name: 'Filet de poulet à la crème et basilic', price: 6000, category: 'Plats', composants: 'Accompagné de spaghetti' },
  { id: 'vp9', name: 'Souris d\'agneau', price: 9000, category: 'Plats', composants: 'Souris d\'agneau mijoté dans un bouillon de légumes et herbes fraîches, sauce brune, servie avec une purée' },
  { id: 'vp10', name: 'Cuisses de grenouilles', price: 7000, category: 'Plats', composants: '12 cuisses de grenouilles sautées au beurre, à l’ail et au persil, déglacées et jus de citron, servie avec une salade verte' },
  { id: 'vp11', name: 'Jarret de porc', price: 10000, category: 'Plats', composants: 'Jarret de porc saisie et grillé au four de feu, servie avec des frites et une sauce tartare' },

  // SUPPLÉMENTS
  { id: 'su1', name: 'Frites', price: 1500, category: 'Suppléments', composants: 'Frites' },
  { id: 'su2', name: 'Légumes sautés', price: 1500, category: 'Suppléments', composants: 'Légumes sautés' },
  { id: 'su3', name: 'Aloco', price: 1500, category: 'Suppléments', composants: 'Aloco' },
  { id: 'su4', name: 'Purée Maison', price: 1500, category: 'Suppléments', composants: 'Purée Maison' },
  { id: 'su5', name: 'Pâtes', price: 1500, category: 'Suppléments', composants: 'Pâtes' },
  { id: 'su6', name: 'Riz', price: 1500, category: 'Suppléments', composants: 'Riz' },

  // DESSERTS
  { id: 'd1', name: 'Tarte à la mangue', price: 4000, category: 'Desserts', composants: 'Selon saison et sa boule de sorbet citron gingembre' },
  { id: 'd2', name: 'Mousse au chocolat noir', price: 3500, category: 'Desserts', composants: 'Mousse au chocolat noir' },
  { id: 'd3', name: 'Tiramisu Spéculoos', price: 3500, category: 'Desserts', composants: 'Tiramisu Spéculoos' },
  { id: 'd4', name: 'Coulant au chocolat', price: 3500, category: 'Desserts', composants: 'Coulant au chocolat et sa boule de glace vanille' },
  { id: 'd5', name: 'Crêpe nature au sucre', price: 2500, category: 'Desserts', composants: 'Crêpe nature au sucre' },
  { id: 'd6', name: 'Crêpe au chocolat', price: 3000, category: 'Desserts', composants: 'Crêpe au chocolat' },
  { id: 'd7', name: 'Coupe Colonel', price: 5000, category: 'Desserts', composants: 'Sorbet citron et vodka' },

  // VINS
  { id: 'v1', name: 'Bordeaux, côtes du Rhône, Listel, Muscadet', price: 17500, category: 'Vins', composants: 'Bouteille' },
  { id: 'v2', name: 'Demi-bouteille Côte du Rhône rouge', price: 10000, category: 'Vins', composants: 'Demi-bouteille' },
  { id: 'v3', name: 'Demi-bouteille Blanc', price: 10000, category: 'Vins', composants: 'Demi-bouteille' },
  { id: 'v4', name: 'Demi-bouteille Rosé', price: 10000, category: 'Vins', composants: 'Demi-bouteille' },
  { id: 'v5', name: 'Demi (1/2)', price: 6000, category: 'Vins', composants: 'Vin en pichet' },
  { id: 'v6', name: 'Quart (1/4)', price: 4000, category: 'Vins', composants: 'Vin en pichet' },
  { id: 'v7', name: 'Ballon', price: 3000, category: 'Vins', composants: 'Vin au verre' },

  // COCKTAILS
  { id: 'c1', name: 'Gin-fizz', price: 4000, category: 'Cocktails', composants: 'Gin-fizz' },
  { id: 'c2', name: 'Arkia Paloma', price: 5000, category: 'Cocktails', composants: 'Arkia Paloma' },
  { id: 'c3', name: 'Caiprina', price: 4000, category: 'Cocktails', composants: 'Caiprina' },
  { id: 'c4', name: 'Spritz Apérol', price: 5000, category: 'Cocktails', composants: 'Spritz Apérol' },
  { id: 'c5', name: 'Mojito', price: 4000, category: 'Cocktails', composants: 'Mojito' },
  { id: 'c6', name: 'Kir Royal', price: 5000, category: 'Cocktails', composants: 'Kir Royal' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  { id: 'rf1', name: 'Smash Burger', price: 5000, category: 'Burgers & Fritures', composants: 'Cheddar fondant, salade fraîche, sauce maison, frites', description: 'Cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf2', name: 'Double Smash', price: 7000, category: 'Burgers & Fritures', composants: 'Double steak, cheddar fondant, salade fraîche, sauce maison, frites', description: 'Double steak, cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf3', name: 'Chicken Burger', price: 6000, category: 'Burgers & Fritures', composants: 'Filet de poulet pané, cheddar fondant, salade fraîche, sauce maison, frites', description: 'Filet de poulet pané, cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf4', name: 'Tenders', price: 5000, category: 'Burgers & Fritures', composants: '5 pièces de poulet croustillantes, sauce maison, frites', description: '5 pièces croustillantes, sauce maison, frites' },
  { id: 'rf5', name: 'Wings Signature', price: 4000, category: 'Burgers & Fritures', composants: 'Wings de poulet laquées, sésame & herbes fraîches, frites', description: 'Wings laquées, sésame & herbes fraîches, frites' },
  { id: 'rg1', name: 'Brochettes Grillées', price: 6000, category: 'Grill & Touche Africaine', composants: '3 brochettes de bœuf marinées, tomates, oignons, frites', description: '3 brochettes bœuf marinées, tomates, oignons, frites' },
  { id: 'rg2', name: 'Carpe Grillée', price: 7500, category: 'Grill & Touche Africaine', composants: 'Carpe entière grillée, sauce tomate/oignon, attiéké ou alloco', description: 'Carpe entière, sauce tomate/oignon, attiéké ou alloco' },
  { id: 'rc1', name: 'Pina Fresh', price: 3000, category: 'Cocktails', composants: 'Ananas frais, menthe, eau gazeuse, sucre' },
  { id: 'rc2', name: 'Pina Colada', price: 4500, category: 'Cocktails', composants: 'Rhum blanc, lait de coco, jus d’ananas, glace' },
  { id: 'rc3', name: 'Palmier Fresh', price: 2500, category: 'Cocktails', composants: 'Jus de palmier, citron vert, menthe' },
  { id: 'rc4', name: 'Blue Mango', price: 2500, category: 'Cocktails', composants: 'Mangue, curaçao bleu, citron vert' },
  { id: 'rc5', name: 'Sunrise Gingembre', price: 2500, category: 'Cocktails', composants: 'Jus de gingembre, orange, grenadine' },
  { id: 'rc6', name: 'Green Lemon', price: 2500, category: 'Cocktails', composants: 'Citron vert, menthe, eau gazeuse, sucre' },
  { id: 'rc7', name: 'Palmier Signature', price: 4000, category: 'Cocktails', composants: 'Jus de palmier, rhum, vanille, cannelle' },
  { id: 'rc8', name: 'Blue Sunset', price: 4000, category: 'Cocktails', composants: 'Vodka, liqueur de bleu, jus d’orange, ananas' },
  { id: 'rc9', name: 'Gingembre Sunrise', price: 4000, category: 'Cocktails', composants: 'Gingembre, rhum blanc, jus d’orange, grenadine' },
  { id: 'rc10', name: 'Mint Vodka', price: 4000, category: 'Cocktails', composants: 'Vodka, menthe fraîche, citron vert, eau gazeuse' },
  { id: 'rc11', name: 'Tasty Crousty', price: 6000, category: 'Cocktails', composants: 'Mélange de fruits exotiques, rhum brun, épices' },
  { id: 'rc12', name: 'Cocktail Glitter', price: 5000, category: 'Cocktails', composants: 'Vodka, liqueur pailletée, jus de fruits, sirop de sucre' }
];
