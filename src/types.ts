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
