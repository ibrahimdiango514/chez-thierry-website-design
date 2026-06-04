export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  composants?: string;
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
