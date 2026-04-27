/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Flame, BadgePercent, LayoutGrid, Clock, MapPin, Search, User, ShoppingCart, Menu, ChevronLeft } from 'lucide-react';

export const CATEGORIES = [
  { id: 1, title: 'دیجی‌کالا جت', icon: <Flame className="w-6 h-6 text-pink-500" /> },
  { id: 2, title: 'دیجی‌پی', icon: <BadgePercent className="w-6 h-6 text-blue-500" /> },
  { id: 3, title: 'حراج استثنایی', icon: <Flame className="w-6 h-6 text-red-500" /> },
  { id: 4, title: 'سوپرمارکت', icon: <ShoppingBag className="w-6 h-6 text-green-500" /> },
  { id: 5, title: 'ماموریت دیجی‌کالا', icon: <LayoutGrid className="w-6 h-6 text-purple-500" /> },
  { id: 6, title: 'پیشنهادهای دیجی‌کالا', icon: <BadgePercent className="w-6 h-6 text-orange-500" /> },
];

export const INCREDIBLE_PRODUCTS = [
  {
    id: 1,
    title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra',
    price: 68500000,
    oldPrice: 72000000,
    discount: 5,
    image: 'https://picsum.photos/seed/s24/200/200',
  },
  {
    id: 2,
    title: 'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook',
    price: 24500000,
    oldPrice: 28000000,
    discount: 12,
    image: 'https://picsum.photos/seed/asus/200/200',
  },
  {
    id: 3,
    title: 'هدفون بی‌سیم اپل مدل AirPods Pro 2',
    price: 11200000,
    oldPrice: 13500000,
    discount: 17,
    image: 'https://picsum.photos/seed/airpods/200/200',
  },
  {
    id: 4,
    title: 'ساعت هوشمند شیائومی مدل Redmi Watch 3',
    price: 3200000,
    oldPrice: 4000000,
    discount: 20,
    image: 'https://picsum.photos/seed/watch/200/200',
  },
  {
    id: 5,
    title: 'اسپیکر قابل حمل جی بی ال مدل Flip 6',
    price: 5400000,
    oldPrice: 6200000,
    discount: 13,
    image: 'https://picsum.photos/seed/jbl/200/200',
  },
];

export const MAIN_CATEGORIES = [
  { id: 1, name: 'موبایل', icon: '📱' },
  { id: 2, name: 'کالای دیجیتال', icon: '💻' },
  { id: 3, name: 'خانه و آشپزخانه', icon: '🏠' },
  { id: 4, name: 'لوازم خانگی برقی', icon: '🔌' },
  { id: 5, name: 'مد و پوشاک', icon: '👕' },
  { id: 6, name: 'آرایشی بهداشتی', icon: '💄' },
  { id: 7, name: 'تجهیزات صنعتی', icon: '🛠️' },
  { id: 8, name: 'سلامت و پزشکی', icon: '🩺' },
];
