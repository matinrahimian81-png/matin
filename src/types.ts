export interface ProductData {
  id: number;
  title: string;
  image: string; // Featured image
  images?: string[]; // Multiple images
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  quantity?: number; // Stock quantity
  description?: string;
  details?: string;
  category?: string;
  promo_type?: 'special' | 'recommended' | 'normal';
  hasFreeShipping?: boolean;
}

export interface CartItem extends ProductData {
  quantity: number;
}

export interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  button_pos_x?: number; // 0 to 100
  button_pos_y?: number; // 0 to 100
  button_width?: number; // width in %
  button_height?: number; // height in %
  button_scale?: number;
  product_id?: number | null;
  order_index: number;
}

export interface MenuLinkItem {
  id: string;
  title: string;
  productId: number | null;
}

export interface MenuColumn {
  id: string;
  title: string;
  items: MenuLinkItem[];
}

export interface Level2Category {
  id: string;
  title: string;
  icon?: string;
  useDefaultIcon: boolean;
  columns: MenuColumn[];
}

export interface MenuConfig {
  title: string;
  icon?: string;
  useDefaultIcon: boolean;
  categories: Level2Category[];
}
