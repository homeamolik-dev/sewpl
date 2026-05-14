'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.json';
import { useContentData } from '@/hooks/useContentData';

function getButtonClass(isActive: boolean): string {
  return 'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + 
    (isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200');
}


function ProductsContent() {
  const content = useContentData({ 'products.json': productsData });
  const liveProductsData = content['products.json'];
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return liveProductsData.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
                             liveProductsData.categories.find(c => c.slug === selectedCategory)?.name === product.category;
      return matchesSearch && matchesCategory;
    });
  }, [liveProductsData, searchTerm, selectedCategory]);

  return (
    <>
      <section className="py-12 bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg">
              <Filter className="w-5 h-5" /> Filters
            </button>
            <div className="hidden sm:flex gap-2 flex-wrap">
              <button onClick={() => setSelectedCategory('all')} className={getButtonClass(selectedCategory === 'all')}>All</button>
              {liveProductsData.categories.map(category => (
                <button key={category.id} onClick={() => setSelectedCategory(category.slug)} className={getButtonClass(selectedCategory === category.slug)}>{category.name}</button>
              ))}
            </div>
          </div>
          {showFilters && (
            <div className="sm:hidden mt-4 flex gap-2 flex-wrap">
              <button onClick={() => setSelectedCategory('all')} className={getButtonClass(selectedCategory === 'all')}>All</button>
              {liveProductsData.categories.map(category => (
                <button key={category.id} onClick={() => setSelectedCategory(category.slug)} className={getButtonClass(selectedCategory === category.slug)}>{category.name}</button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-12 bg-slate-50 min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-slate-600">Showing {filteredProducts.length} products</p>
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
                <X className="w-4 h-4" /> Clear filter
              </button>
            )}
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (<ProductCard key={product.id} product={product} index={index} />))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-4 text-slate-800 font-medium hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProductsLoading() {
  return (
    <section className="py-12 bg-slate-50 min-h-[50vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Our Products</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">Industrial Machines</h1>
            <p className="text-lg text-slate-600">Explore our range of precision CNC machines and industrial equipment.</p>
          </motion.div>
        </div>
      </section>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
