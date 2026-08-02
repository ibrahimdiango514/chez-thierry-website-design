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
