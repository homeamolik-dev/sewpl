import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import { readContentFile } from '@/lib/content-store';

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  price: string;
  inStock: boolean;
  featured?: boolean;
};

type ProductsContent = {
  products: Product[];
};

type CompanyContent = {
  contact: {
    phone: string[];
  };
};

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const productsData = await readContentFile<ProductsContent>('products.json');
  return productsData.products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productsData = await readContentFile<ProductsContent>('products.json');
  const companyData = await readContentFile<CompanyContent>('company.json');
  const product = productsData.products.find(p => p.slug === slug);
  const primaryMedia = product?.images.find(Boolean);
  const isVideo = primaryMedia ? /\.(mp4|webm|mov)$/i.test(primaryMedia) : false;

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {primaryMedia ? (
                isVideo ? (
                  <video src={primaryMedia} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={primaryMedia} alt={product.name} className="h-full w-full object-cover" />
                )
              ) : (
                <p className="text-slate-400">Product Image</p>
              )}
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-4">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-lg text-slate-600 mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {product.inStock ? 'In Stock' : 'Made to Order'}
                </span>
                <span className="text-lg font-semibold text-slate-900">{product.price}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
                  Request Quote
                </Link>
                <a href={`tel:${companyData.contact.phone[0]}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                  <Phone className="w-4 h-4" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={key} className={`flex justify-between p-4 ${index !== Object.keys(product.specifications).length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <span className="text-slate-600">{key}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
