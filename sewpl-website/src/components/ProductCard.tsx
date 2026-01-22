'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  images: string[];
  price: string;
  inStock: boolean;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-slate-400 text-sm">
                {/* Placeholder for product image */}
                <svg className="w-16 h-16 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Product Image
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 text-xs font-medium bg-slate-800 text-white rounded-full">
                  Featured
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
              {product.shortDescription}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-slate-400'}`}>
                {product.inStock ? 'Available' : 'Made to Order'}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                View Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
