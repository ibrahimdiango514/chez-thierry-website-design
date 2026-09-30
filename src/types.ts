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
