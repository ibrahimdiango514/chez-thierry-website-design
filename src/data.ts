import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Margherita', price: 5000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, basilic frais' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, jambon, champignons, origan' },
  { id: 'p3', name: 'Calzone', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, jambon, chorizo, œuf, fromage' },
  { id: 'p4', name: 'Napolitaine', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, anchois, câpres, olives noires' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, viande hachée, oignons, poivrons verts, champignons, olives, herbes de Provence' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, poivrons, aubergines, oignons, olives, ail, basilic' },
  { id: 'p7', name: 'Orientale', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, merguez, chorizo, ail, œufs, olives, champignons' },
  { id: 'p8', name: 'Bamakoise', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, poivrons, champignons, blanc de poulet, aubergine' },
  { id: 'p9', name: '5 Fromages', price: 8000, category: 'Pizzas', composants: 'Sauce tomate (légère), mozzarella, parmesan, emmental, chèvre, roquefort' },
  { id: 'p10', name: 'Norvégienne', price: 8000, category: 'Pizzas', composants: 'Crème fraîche, saumon fumé, mozzarella, aneth' },
  { id: 'p11', name: '4 Saisons', price: 8000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, cœur d\'artichaut, champignons, poivrons, oignons' },
  { id: 'p12', name: 'Arménienne', price: 8000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, poivrons, chorizo, soujouk, bastelma, fromage' },
  { id: 'p13', name: 'Pepperoni halal', price: 7000, category: 'Pizzas', composants: 'Sauce tomate, mozzarella, pepperoni halal, poivrons, oignons' },

  // SALADES & ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', price: 3500, category: 'Salades & Entrées', composants: 'Toasts de pain, chèvre fondant, salade verte, juliennes de pomme, miel de fleurs, vinaigrette balsamique, pignons de pin' },
  { id: 'se2', name: 'Salade du chef', price: 3500, category: 'Salades & Entrées', composants: 'Salade verte, oignons, ail, avocat, œuf dur, toast de pain cheddar, carotte râpée, concombre, vinaigrette maison' },
  { id: 'se3', name: 'Salade César', price: 3500, category: 'Salades & Entrées', composants: 'Salade romaine, tomates cerises, oignons frits, poulet grillé, croûtons de pain, œufs mollets, parmesan en copeaux, sauce César (anchois, ail, parmesan, jaune d’œuf, huile d’olive)' },

  // VIANDES & POISSONS
  { id: 'vp1', name: 'Carpaccio de bœuf ou capitaine', price: 9000, category: 'Viandes & Poissons', composants: 'Fines tranches de bœuf ou capitaine mariné, huile d’olive, citron, parmesan (bœuf) ou aneth (capitaine), roquette, sel, poivre' },
  { id: 'vp2', name: 'Côte de bœuf', price: 8000, category: 'Viandes & Poissons', composants: 'Côte de bœuf grillée, frites croustillantes, salade verte, sauce beurre à l’ail (beurre fondu, ail persillé)' },
  { id: 'vp3', name: 'Pavé de bœuf', price: 9000, category: 'Viandes & Poissons', composants: 'Filet de bœuf en pavé, frites croustillantes, salade verte, sauce au poivre crémeuse (crème, poivre noir concassé, échalotes, fond de veau)' },
  { id: 'vp4', name: 'Côte de porc', price: 7000, category: 'Viandes & Poissons', composants: '2 côtes de porc grillées, frites maison' },
  { id: 'vp5', name: 'Poulet local braisé', price: 7000, category: 'Viandes & Poissons', composants: 'Poulet fermier braisé, frites fraîches maison, petite salade verte' },
  { id: 'vp6', name: 'Filet de capitaine en papillote', price: 9000, category: 'Viandes & Poissons', composants: 'Filet de capitaine, herbes fraîches (persil, ciboulette, aneth), cuit en papillote aluminium au feu de bois, légumes (carottes, courgettes, poivrons), pommes de terre grenaille' },
  { id: 'vp7', name: 'Fish & chips', price: 8000, category: 'Viandes & Poissons', composants: 'Filet de capitaine pané (farine, œuf, chapelure), frites maison, salade verte, sauce tartare' },
  { id: 'vp8', name: 'Cuisse de poulet grillée', price: 5000, category: 'Viandes & Poissons', composants: 'Cuisse de poulet, marinade (ail, thym, laurier, huile d’olive, paprika), cuisson au feu de bois, riz blanc, sauce à l’origan (origan frais, huile d’olive, citron, sel, poivre)' },
  { id: 'vp9', name: 'Filet de poulet crème basilic', price: 6000, category: 'Viandes & Poissons', composants: 'Filet de poulet, sauce crème (crème fraîche, basilic frais, ail, parmesan), spaghetti' },
  { id: 'vp10', name: 'Souris d\'agneau', price: 6000, category: 'Viandes & Poissons', composants: 'Souris d’agneau mijotée dans un bouillon de légumes (carottes, oignons, céleri, poireaux), herbes fraîches (romarin, thym, laurier), sauce brune (jus de cuisson lié), purée maison (pommes de terre, beurre, lait)' },
  { id: 'vp11', name: 'Cuisses de grenouilles', price: 6000, category: 'Viandes & Poissons', composants: '12 cuisses de grenouilles sautées au beurre, ail, persil, déglacées au jus de citron, servies avec salade verte' },
  { id: 'vp12', name: 'Jarret de porc', price: 6000, category: 'Viandes & Poissons', composants: 'Jarret de porc saisi et grillé au four de bois, frites maison, sauce tartare (mayonnaise, cornichons, câpres, herbes)' },

  // SUPPLÉMENTS
  { id: 'su1', name: 'Frites', price: 2500, category: 'Suppléments', composants: 'Frites maison' },
  { id: 'su2', name: 'Légumes sautés', price: 2500, category: 'Suppléments', composants: 'Légumes sautés (courgettes, poivrons, oignons)' },
  { id: 'su3', name: 'Aloco', price: 2500, category: 'Suppléments', composants: 'Aloco (banane plantain frite)' },
  { id: 'su4', name: 'Purée maison', price: 2500, category: 'Suppléments', composants: 'Purée maison (pommes de terre, beurre, lait)' },
  { id: 'su5', name: 'Pâtes', price: 2500, category: 'Suppléments', composants: 'Pâtes' },
  { id: 'su6', name: 'Riz', price: 2500, category: 'Suppléments', composants: 'Riz blanc' },

  // DESSERTS
  { id: 'd1', name: 'Tarte à la mangue', price: 4000, category: 'Desserts', composants: 'Tarte à la mangue (pâte sablée, crème pâtissière, mangues fraîches de saison), boule de glace vanille' },

  // VINS
  { id: 'v1', name: 'Bordeaux / Côtes du Rhône / Listel / Muscadet', price: 17500, category: 'Vins', composants: 'Bouteille au choix (rouge, blanc ou rosé)' },
  { id: 'v2', name: 'Côte du Rhône rouge', price: 10000, category: 'Vins', composants: 'Demi-bouteille de vin rouge Côte du Rhône' },
  { id: 'v3', name: 'Blanc', price: 10000, category: 'Vins', composants: 'Demi-bouteille de vin blanc' },
  { id: 'v4', name: 'Rosé', price: 10000, category: 'Vins', composants: 'Demi-bouteille de vin rosé' },
  { id: 'v5', name: 'Demi', price: 6000, category: 'Vins', composants: 'Vin en piquet (demi / 1/2) – rouge, blanc ou rosé' },
  { id: 'v6', name: 'Quart', price: 4000, category: 'Vins', composants: 'Vin en piquet (quart / 1/4) – rouge, blanc ou rosé' },
  { id: 'v7', name: 'Ballon', price: 3000, category: 'Vins', composants: 'Vin au verre (ballon) – rouge, blanc ou rosé' },

  // COCKTAILS
  { id: 'c1', name: 'Gin Fizz', price: 4000, category: 'Cocktails', composants: 'Gin, jus de citron vert, sucre de canne, eau gazeuse, glaçons' },
  { id: 'c2', name: 'Arkia', price: 5000, category: 'Cocktails', composants: 'Rhum blanc, jus de fruit de la passion, sirop de vanille, citron vert, glaçons' },
  { id: 'c3', name: 'Paloma', price: 4000, category: 'Cocktails', composants: 'Tequila, jus de pamplemousse rose, citron vert, pincée de sel, eau gazeuse, glaçons' },
  { id: 'c4', name: 'Caipirinha', price: 5000, category: 'Cocktails', composants: 'Cachaça, citron vert coupé en quartiers, sucre roux, glace pilée' },
  { id: 'c5', name: 'Spritz', price: 4000, category: 'Cocktails', composants: 'Aperol, Prosecco, eau gazeuse, rondelle d’orange, glaçons' },
  { id: 'c6', name: 'Aperol Spritz', price: 5000, category: 'Cocktails', composants: 'Aperol, Prosecco, eau gazeuse, orange, glaçons' },
  { id: 'c7', name: 'Mojito', price: 4000, category: 'Cocktails', composants: 'Rhum blanc, citron vert, menthe fraîche, sucre de canne, eau gazeuse, glace pilée' },
  { id: 'c8', name: 'Kir Royal', price: 5000, category: 'Cocktails', composants: 'Crème de cassis, champagne ou vin mousseux' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // BURGERS & FRITURES
  { id: 'rf1', name: 'Smash Burger', price: 5000, category: 'Burgers & Fritures', composants: 'Cheddar fondant, salade fraîche, sauce maison, frites', description: 'Cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf2', name: 'Double Smash', price: 7000, category: 'Burgers & Fritures', composants: 'Double steak, cheddar fondant, salade fraîche, sauce maison, frites', description: 'Cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf3', name: 'Chicken Burger', price: 6000, category: 'Burgers & Fritures', composants: 'Filet de poulet pané, cheddar fondant, salade fraîche, sauce maison, frites', description: 'Cheddar fondant, salade fraîche, sauce maison, frites' },
  { id: 'rf4', name: 'Tenders', price: 5000, category: 'Burgers & Fritures', composants: '5 pièces de poulet croustillantes, sauce maison, frites', description: '5 pièces croustillantes, sauce maison, frites' },
  { id: 'rf5', name: 'Wings Signature', price: 4000, category: 'Burgers & Fritures', composants: 'Wings de poulet laquées, sésame & herbes fraîches, frites', description: 'Wings laquées, sésame & herbes fraîches, frites' },

  // GRILL & TOUCHE AFRICAINE
  { id: 'rg1', name: 'Brochettes Grillées', price: 6000, category: 'Grill & Touche Africaine', composants: '3 brochettes de bœuf marinées, tomates, oignons, frites', description: '3 brochettes bœuf marinées, tomates, oignons, frites' },
  { id: 'rg2', name: 'Carpe Grillée', price: 7500, category: 'Grill & Touche Africaine', composants: 'Carpe entière grillée, sauce tomate/oignon, attiéké ou alloco', description: 'Carpe entière, sauce tomate/oignon, attiéké ou alloco' },

  // COCKTAILS
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
  { id: 'rc12', name: 'Cocktail Glitter', price: 5000, category: 'Cocktails', composants: 'Vodka, liqueur pailletée, jus de fruits, sirop de sucre' },
];
