export interface ProductData {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  hasFreeShipping?: boolean;
}

export interface CartItem extends ProductData {
  quantity: number;
}
