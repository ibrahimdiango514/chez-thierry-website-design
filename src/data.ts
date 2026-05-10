import { MenuItem } from './types';

export const RESTAURANT_MENU: MenuItem[] = [
  // PIZZAS
  { id: 'p1', name: 'Marguerita', price: 5000, category: 'Pizzas' },
  { id: 'p2', name: 'Reine', price: 7000, category: 'Pizzas' },
  { id: 'p3', name: 'Calzone', price: 7000, category: 'Pizzas' },
  { id: 'p4', name: 'Napolitaine', price: 7000, category: 'Pizzas' },
  { id: 'p5', name: 'Bolognaise', price: 7000, category: 'Pizzas' },
  { id: 'p6', name: 'Végétarienne', price: 7000, category: 'Pizzas' },
  { id: 'p7', name: 'Orientale', price: 7000, category: 'Pizzas' },
  { id: 'p8', name: 'Pepperoni halal', price: 7000, category: 'Pizzas' },
  { id: 'p9', name: 'Bamakoise', price: 8000, category: 'Pizzas' },
  { id: 'p10', name: '5 Fromages', price: 8000, category: 'Pizzas' },
  { id: 'p11', name: 'Norvégienne', price: 8000, category: 'Pizzas' },
  { id: 'p12', name: '4 saisons', price: 8000, category: 'Pizzas' },
  { id: 'p13', name: 'Arménienne', price: 8000, category: 'Pizzas' },

  // ENTRÉES & PLATS
  { id: 'ep1', name: 'Salade de chèvre chaud', price: 3000, category: 'Entrées & Plats' },
  { id: 'ep2', name: 'Flamiche poireaux', price: 3500, category: 'Entrées & Plats' },
  { id: 'ep3', name: 'Salade César', price: 4000, category: 'Entrées & Plats' },
  { id: 'ep4', name: 'Spaghetti bolognaise', price: 4000, category: 'Entrées & Plats' },
  { id: 'ep5', name: 'Galette bretonne', price: 8000, category: 'Entrées & Plats' },
  { id: 'ep6', name: 'Demi-magret de canard', price: 10000, category: 'Entrées & Plats' },
  { id: 'ep7', name: 'Côte de boeuf', price: 9000, category: 'Entrées & Plats' },
  { id: 'ep8', name: 'Pavé de boeuf', price: 8000, category: 'Entrées & Plats' },
  { id: 'ep9', name: 'Côte de porc', price: 6000, category: 'Entrées & Plats' },
  { id: 'ep10', name: 'Poulet braisé', price: 7000, category: 'Entrées & Plats' },
  { id: 'ep11', name: 'Fish & chips', price: 8000, category: 'Entrées & Plats' },
  { id: 'ep12', name: 'Souris d’agneau', price: 9000, category: 'Entrées & Plats' },
  { id: 'ep13', name: 'Cuisses de grenouilles', price: 6000, category: 'Entrées & Plats' },
  { id: 'ep14', name: 'Jarret de porc', price: 10000, category: 'Entrées & Plats' },
  { id: 'ep15', name: 'Pêche aux aromates', price: 9000, category: 'Entrées & Plats' },

  // DESSERTS
  { id: 'd1', name: 'Tarte tatin', price: 4000, category: 'Desserts' },
  { id: 'd2', name: 'Mousse chocolat', price: 3000, category: 'Desserts' },
  { id: 'd3', name: 'Crêpe Suzette', price: 5000, category: 'Desserts' },
  { id: 'd4', name: 'Coulant chocolat', price: 3500, category: 'Desserts' },
  { id: 'd5', name: 'Crêpe sucre', price: 2000, category: 'Desserts' },
  { id: 'd6', name: 'Crêpe chocolat', price: 2500, category: 'Desserts' },
  { id: 'd7', name: 'Coupe Colonel', price: 5000, category: 'Desserts' },

  // BOISSONS
  { id: 'b1', name: 'Soda', price: 1000, category: 'Boissons' },
  { id: 'b2', name: 'Coca', price: 2000, category: 'Boissons' },
  { id: 'b3', name: 'Jus', price: 2000, category: 'Boissons' },
  { id: 'b4', name: 'Cocktail jus', price: 2500, category: 'Boissons' },
  { id: 'b5', name: 'Bière 1L', price: 6000, category: 'Boissons' },
  { id: 'b6', name: 'Bière 50cl', price: 3000, category: 'Boissons' },
  { id: 'b7', name: 'Bière 25cl', price: 2000, category: 'Boissons' },
  { id: 'b8', name: 'Bière Bouteille', price: 2000, category: 'Boissons' },
  { id: 'b9', name: 'Apéritifs', price: 3000, category: 'Boissons' },
  { id: 'b10', name: 'Digestifs', price: 5000, category: 'Boissons' },

  // VINS
  { id: 'v1', name: 'Vin Bordeaux / Rhône / Listel / Muscadet', price: 17500, category: 'Vins' },
  { id: 'v2', name: 'Vin Blanc sec (Chardonnay, Aligoté)', price: 22500, category: 'Vins' },
  { id: 'v3', name: 'Vin Demi-bouteille', price: 10000, category: 'Vins' },
  { id: 'v4', name: 'Vin Demi verre', price: 6000, category: 'Vins' },
  { id: 'v5', name: 'Vin Quart', price: 4000, category: 'Vins' },
  { id: 'v6', name: 'Vin Ballon', price: 3000, category: 'Vins' },

  // COCKTAILS
  { id: 'c1', name: 'Marguerita Cocktail', price: 6000, category: 'Cocktails' },
  { id: 'c2', name: 'Gin-fizz', price: 5000, category: 'Cocktails' },
  { id: 'c3', name: 'Ti Punch', price: 5000, category: 'Cocktails' },
  { id: 'c4', name: 'Caipirinha', price: 5000, category: 'Cocktails' },
  { id: 'c5', name: 'Spritz', price: 5000, category: 'Cocktails' },
  { id: 'c6', name: 'Mojito', price: 5000, category: 'Cocktails' },
  { id: 'c7', name: 'Kir', price: 5000, category: 'Cocktails' },
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
