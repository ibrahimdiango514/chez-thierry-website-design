export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  composants?: string;
  /**
   * Chemin de l'image du plat (ex: "/images/menu/restaurant/marguerita.jpg").
   * Si le fichier n'existe pas encore, un placeholder élégant est affiché.
   * Il suffit de déposer la photo au bon endroit dans public/images/menu/... pour qu'elle apparaisse.
   */
  image?: string;
  /** Disponibilité / conditions de service (ex: "uniquement les dimanches") */
  availability?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  section?: SectionType;
}

/**
 * Catégorie de la section « Plat du jour » affichée sur la page d'accueil :
 * - 'semaine' : du lundi au vendredi
 * - 'weekend' : samedi et dimanche
 */
export type DailyDishPeriod = 'semaine' | 'weekend';

/**
 * Plat du jour (semaine / weekend).
 * Affiché sans photo : uniquement le nom du plat et une courte description.
 */
export interface DailyDish {
  id: string;
  /** Jour concerné (ex: "Lundi", "Samedi") */
  day: string;
  /** Nom du plat (ex: "Poulet local braisé") */
  name: string;
  /** Courte description du plat (une phrase) */
  description: string;
  /**
   * Prix du plat en F CFA (issu de la carte du restaurant).
   * Utilisé dans le message WhatsApp de commande.
   * Si absent, le message est envoyé sans prix.
   */
  price?: number;
  image?: string;
}

/** Cours d'un menu déjeuner */
export type DejeunerCourse = 'entree' | 'plat' | 'dessert';

/**
 * Journée du menu Déjeuner (entrée / plat / dessert).
 * Si `platSeul` est renseigné, la journée se commande uniquement à la carte (pas de formule).
 */
export interface DejeunerJour {
  id: string;
  /** Jour concerné (ex: "Mardi") */
  day: string;
  /** Photo fidèle du menu (chemin public) */
  image: string;
  entree?: string;
  plat?: string;
  dessert?: string;
  platSeul?: { name: string; description: string; price: number };
}

/** Formule déjeuner choisissable (combinaison de cours) */
export interface DejeunerFormule {
  id: string;
  name: string;
  price: number;
  courses: DejeunerCourse[];
}

export interface MenuFormula {
  id: string;
  name: string;
  price: number;
  description: string;
  details?: string;
}

export interface PauseGourmandeDessert {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  emoji?: string;
}

export interface PauseGourmandeFormula {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface PauseGourmandeSupplement {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface AperoPlanche {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  emoji?: string;
  highlighted?: boolean;
}

export type OrderMode = 'sur_place' | 'emporter' | 'livraison';
export type SectionType = 'restaurant' | 'rooftop';

export interface OrderDetails {
  section: SectionType;
  mode: OrderMode;
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string;
}
