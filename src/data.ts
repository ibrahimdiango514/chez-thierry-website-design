import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Margherita', price: 5000, category: 'Pizzas' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas' },
  { id: 'p3', name: 'Calzone', price: 7000, category: 'Pizzas' },
  { id: 'p4', name: 'Napolitaine', price: 7000, category: 'Pizzas' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas' },
  { id: 'p7', name: 'Orientale', price: 7000, category: 'Pizzas' },
  { id: 'p8', name: 'Bamakoise', price: 7000, category: 'Pizzas' },
  { id: 'p9', name: '5 Fromages', price: 8000, category: 'Pizzas' },
  { id: 'p10', name: 'Norvégienne', price: 8000, category: 'Pizzas' },
  { id: 'p11', name: '4 Saisons', price: 8000, category: 'Pizzas' },
  { id: 'p12', name: 'Arménienne', price: 8000, category: 'Pizzas' },
  { id: 'p13', name: 'Pepperoni halal', price: 7000, category: 'Pizzas' },

  // SALADES & ENTRÉES
  { id: 'se1', name: 'Salade de chèvre chaud', price: 3500, category: 'Salades & Entrées' },
  { id: 'se2', name: 'Salade du chef', price: 3500, category: 'Salades & Entrées' },
  { id: 'se3', name: 'Salade César', price: 3500, category: 'Salades & Entrées' },

  // VIANDES & POISSONS
  { id: 'vp1', name: 'Carpaccio de bœuf ou capitaine', price: 9000, category: 'Viandes & Poissons' },
  { id: 'vp2', name: 'Côte de bœuf', price: 8000, category: 'Viandes & Poissons' },
  { id: 'vp3', name: 'Pavé de bœuf', price: 9000, category: 'Viandes & Poissons' },
  { id: 'vp4', name: 'Côte de porc', price: 7000, category: 'Viandes & Poissons' },
  { id: 'vp5', name: 'Poulet local braisé', price: 7000, category: 'Viandes & Poissons' },
  { id: 'vp6', name: 'Filet de capitaine en papillote', price: 9000, category: 'Viandes & Poissons' },
  { id: 'vp7', name: 'Fish & chips', price: 8000, category: 'Viandes & Poissons' },
  { id: 'vp8', name: 'Cuisse de poulet grillée', price: 5000, category: 'Viandes & Poissons' },
  { id: 'vp9', name: 'Filet de poulet crème basilic', price: 6000, category: 'Viandes & Poissons' },
  { id: 'vp10', name: 'Souris d\'agneau', price: 6000, category: 'Viandes & Poissons' },
  { id: 'vp11', name: 'Cuisses de grenouilles', price: 6000, category: 'Viandes & Poissons' },
  { id: 'vp12', name: 'Jarret de porc', price: 6000, category: 'Viandes & Poissons' },

  // SUPPLÉMENTS
  { id: 'su1', name: 'Frites', price: 2500, category: 'Suppléments' },
  { id: 'su2', name: 'Légumes sautés', price: 2500, category: 'Suppléments' },
  { id: 'su3', name: 'Aloco', price: 2500, category: 'Suppléments' },
  { id: 'su4', name: 'Purée maison', price: 2500, category: 'Suppléments' },
  { id: 'su5', name: 'Pâtes', price: 2500, category: 'Suppléments' },
  { id: 'su6', name: 'Riz', price: 2500, category: 'Suppléments' },

  // DESSERTS
  { id: 'd1', name: 'Tarte à la mangue', price: 4000, category: 'Desserts' },

  // VINS
  { id: 'v1', name: 'Bordeaux / Côtes du Rhône / Listel / Muscadet', price: 17500, category: 'Vins' },
  { id: 'v2', name: 'Côte du Rhône rouge', price: 10000, category: 'Vins' },
  { id: 'v3', name: 'Blanc', price: 10000, category: 'Vins' },
  { id: 'v4', name: 'Rosé', price: 10000, category: 'Vins' },
  { id: 'v5', name: 'Demi', price: 6000, category: 'Vins' },
  { id: 'v6', name: 'Quart', price: 4000, category: 'Vins' },
  { id: 'v7', name: 'Ballon', price: 3000, category: 'Vins' },

  // COCKTAILS
  { id: 'c1', name: 'Gin Fizz', price: 4000, category: 'Cocktails' },
  { id: 'c2', name: 'Arkia', price: 5000, category: 'Cocktails' },
  { id: 'c3', name: 'Paloma', price: 4000, category: 'Cocktails' },
  { id: 'c4', name: 'Caipirinha', price: 5000, category: 'Cocktails' },
  { id: 'c5', name: 'Spritz', price: 4000, category: 'Cocktails' },
  { id: 'c6', name: 'Aperol Spritz', price: 5000, category: 'Cocktails' },
  { id: 'c7', name: 'Mojito', price: 4000, category: 'Cocktails' },
  { id: 'c8', name: 'Kir Royal', price: 5000, category: 'Cocktails' },
];

export const ROOFTOP_MENU: MenuItem[] = [
  // FOOD
  { id: 'rf1', name: 'Tenders', price: 5000, category: 'Food' },
  { id: 'rf2', name: 'Wings', price: 4000, category: 'Food' },
  { id: 'rf3', name: 'Smash Burger', price: 4500, category: 'Food' },
  { id: 'rf4', name: 'Double Smash', price: 7000, category: 'Food' },
  { id: 'rf5', name: 'Burger Chicken', price: 4000, category: 'Food' },
  { id: 'rf6', name: 'Brochettes boeuf', price: 6000, category: 'Food' },
  { id: 'rf7', name: 'Carpe grillée', price: 7000, category: 'Food' },

  // DRINKS - MOCKTAILS
  { id: 'rd1', name: 'Mocktail Palmier Fresh', price: 2500, category: 'Mocktails' },
  { id: 'rd2', name: 'Mocktail Blue Mango', price: 2500, category: 'Mocktails' },
  { id: 'rd3', name: 'Mocktail Piña Fresh', price: 2500, category: 'Mocktails' },
  { id: 'rd4', name: 'Mocktail Sunrise Gingembre', price: 2500, category: 'Mocktails' },
  { id: 'rd5', name: 'Mocktail Green Lemon', price: 2500, category: 'Mocktails' },

  // DRINKS - COCKTAILS
  { id: 'rd6', name: 'Cocktail Palmier Signature', price: 4000, category: 'Cocktails' },
  { id: 'rd7', name: 'Cocktail Blue Sunset', price: 4000, category: 'Cocktails' },
  { id: 'rd8', name: 'Cocktail Piña Colada', price: 4000, category: 'Cocktails' },
  { id: 'rd9', name: 'Cocktail Gingembre Sunrise', price: 4000, category: 'Cocktails' },
  { id: 'rd10', name: 'Cocktail Mint Vodka', price: 4000, category: 'Cocktails' },

  // SUGGESTIONS
  { id: 'rs1', name: 'Tasty Crousty', price: 6000, category: 'Suggestions' },
  { id: 'rs2', name: 'Cocktail Glitter', price: 5000, category: 'Suggestions' },
];
