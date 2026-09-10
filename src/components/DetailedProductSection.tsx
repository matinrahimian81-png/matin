/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../data';
import { ProductData } from '../types';

export default function DetailedProductSection({ 
  products = [],
  onProductClick,
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}: { 
  products?: ProductData[];
  onProductClick?: (id: number) => void;
  onAddToCart?: (p: ProductData) => void;
  wishlist?: number[];
  onToggleWishlist?: (id: number) => void;
}) {
  if (products.length === 0) return null;
  
  // Filter and sort by newest products (highest id first), taking strictly the top 5
  const newestProducts = [...products]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5);

  if (newestProducts.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-10 border-b border-gray-100 pb-4 px-2">
        {newestProducts[0] && (
          <button 
            onClick={() => onProductClick?.(newestProducts[0].id)} 
            className="text-xs md:text-sm font-black text-blue-500 hover:text-blue-600 transition-colors"
          >
            مشاهده همه
          </button>
        )}
        <h2 className="text-lg md:text-2xl font-black text-gray-800">داغ‌ترین‌های متین‌کالا</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 px-1">
        {newestProducts.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            title={p.title}
            image={p.image}
            price={p.price}
            oldPrice={p.oldPrice}
            discountPercentage={p.discountPercentage}
            rating={p.rating}
            reviewCount={p.reviewCount}
            inStock={p.inStock}
            hasFreeShipping={p.hasFreeShipping}
            onProductClick={onProductClick}
            onAddToCart={() => onAddToCart?.(p)}
            isWishlisted={wishlist.includes(p.id)}
            onToggleWishlist={() => onToggleWishlist?.(p.id)}
          />
        ))}
      </div>
    </section>
  );
}
