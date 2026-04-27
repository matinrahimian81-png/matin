/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../data';
import { ProductData } from '../types';

export default function DetailedProductSection({ 
  onProductClick,
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}: { 
  onProductClick?: (id: number) => void;
  onAddToCart?: (p: ProductData) => void;
  wishlist?: number[];
  onToggleWishlist?: (id: number) => void;
}) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
        <button onClick={() => onProductClick?.(ALL_PRODUCTS[0].id)} className="text-sm font-black text-blue-500 hover:text-blue-600 transition-colors">مشاهده همه</button>
        <h2 className="text-2xl font-black text-gray-800">داغ‌ترین‌های دیجی‌کالا</h2>
      </div>
      <div className="flex flex-wrap justify-center lg:justify-end gap-6">
        {ALL_PRODUCTS.slice(0, 5).map((p) => (
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
