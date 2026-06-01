'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Cog, Factory, Phone } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ServiceCard from '@/components/ServiceCard';
import AnimatedSection from '@/components/AnimatedSection';
import EditableMedia from '@/components/EditableMedia';
import productsData from '@/data/products.json';
import servicesData from '@/data/services.json';
import companyData from '@/data/company.json';
import homeContent from '@/data/home-content.json';
import { useContentData } from '@/hooks/useContentData';

export default function Home() {
  const content = useContentData({
    'products.json': productsData,
    'services.json': servicesData,
    'company.json': companyData,
    'home-content.json': homeContent,
  });
  const liveProductsData = content['products.json'];
  const liveServicesData = content['services.json'];
  const liveCompanyData = content['company.json'];
  const liveHomeContent = content['home-content.json'];
  const featuredCount = Number(liveHomeContent.featuredProductsSection.featuredCount || 4);
  const featuredProducts = liveProductsData.products
    .filter((product) => product.featured)
    .slice(0, Number.isFinite(featuredCount) && featuredCount > 0 ? featuredCount : 4);

  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-700 text-sm font-medium rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {liveHomeContent.hero.badgePrefix} {liveCompanyData.founded}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-bold text-slate-900 leading-tight mb-6"
              >
                <span className="block text-2xl sm:whitespace-nowrap sm:text-[1.9rem] lg:text-[2.15rem]">{liveHomeContent.hero.title}</span>
                <span className="block text-2xl sm:text-3xl lg:text-[2.35rem] text-slate-500">{liveHomeContent.hero.highlightedTitle}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-600 mb-8 max-w-xl"
              >
                {liveHomeContent.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
                  {liveHomeContent.hero.primaryButtonLabel} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                  {liveHomeContent.hero.secondaryButtonLabel}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-slate-200"
              >
                {liveCompanyData.about.stats.slice(0, 3).map((stat, index) => (
                  <div key={index}>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
                {liveHomeContent.hero.mediaUrl ? (
                  <EditableMedia src={liveHomeContent.hero.mediaUrl} alt={liveHomeContent.hero.imageCaption || liveHomeContent.hero.imageLabel} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Factory className="w-24 h-24 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm">{liveHomeContent.hero.imageLabel}</p>
                    <p className="text-xs text-slate-400">{liveHomeContent.hero.imageCaption}</p>
                  </div>
                </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{liveHomeContent.hero.certificationTitle}</p>
                      <p className="text-xs text-slate-500">{liveHomeContent.hero.certificationDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveHomeContent.servicesSection.eyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">{liveHomeContent.servicesSection.title}</h2>
              <p className="text-slate-600">{liveHomeContent.servicesSection.description}</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {liveServicesData.services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} linkLabel={liveHomeContent.servicesSection.cardLinkLabel || 'Learn More'} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveHomeContent.featuredProductsSection.eyebrow}</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{liveHomeContent.featuredProductsSection.title}</h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                {liveHomeContent.featuredProductsSection.viewAllLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} viewDetailsLabel={liveHomeContent.featuredProductsSection.viewDetailsLabel || 'View Details'} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveHomeContent.capabilitiesSection.eyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">{liveHomeContent.capabilitiesSection.title}</h2>
              <p className="text-slate-600 mb-8">{liveHomeContent.capabilitiesSection.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {liveHomeContent.capabilitiesSection.items.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Cog className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="font-medium text-slate-700">{capability}</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="inline-flex items-center gap-2 mt-8 text-slate-800 font-medium hover:text-slate-600 transition-colors">
                {liveHomeContent.capabilitiesSection.linkLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  {liveHomeContent.capabilitiesSection.mediaUrl ? (
                    <EditableMedia src={liveHomeContent.capabilitiesSection.mediaUrl} alt={liveHomeContent.capabilitiesSection.imagePlaceholder} />
                  ) : (
                    <p className="text-slate-400">{liveHomeContent.capabilitiesSection.imagePlaceholder}</p>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{liveHomeContent.ctaSection.title}</h2>
              <p className="text-slate-300 text-lg mb-8">{liveHomeContent.ctaSection.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                  <Phone className="w-4 h-4" /> {liveHomeContent.ctaSection.primaryButtonLabel}
                </Link>
                <a href={`tel:${liveCompanyData.contact.phone[0]}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                  {liveCompanyData.contact.phone[0]}
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
