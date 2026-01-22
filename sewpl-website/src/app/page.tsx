'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Cog, Factory, Phone } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ServiceCard from '@/components/ServiceCard';
import AnimatedSection from '@/components/AnimatedSection';
import productsData from '@/data/products.json';
import servicesData from '@/data/services.json';
import companyData from '@/data/company.json';

const featuredProducts = productsData.products.filter(p => p.featured).slice(0, 4);

export default function Home() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-700 text-sm font-medium rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Trusted Since {companyData.founded}
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Precision Engineering <span className="text-slate-500">Solutions</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-slate-600 mb-8 max-w-xl">
                From CNC machining to custom machine manufacturing, we deliver excellence in every project. Your partner for quality, innovation, and reliability.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
                  Explore Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                  Get a Quote
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-slate-200">
                {companyData.about.stats.slice(0, 3).map((stat, index) => (
                  <div key={index}>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Factory className="w-24 h-24 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm">Hero Image</p>
                    <p className="text-xs text-slate-400">CNC Machine / Factory</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">ISO 9001:2015 Certified</p>
                      <p className="text-xs text-slate-500">Quality Management System</p>
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
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">What We Do</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">Our Services</h2>
              <p className="text-slate-600">Comprehensive engineering solutions tailored to your manufacturing needs</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {servicesData.services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Products</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Featured Machines</h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Our Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">Part Manufacturing Excellence</h2>
              <p className="text-slate-600 mb-8">Our state-of-the-art facility is equipped with advanced CNC machines and skilled professionals.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Turning', 'Milling', 'Drilling', 'Tapping', 'VMC Operations', 'CNC Lathe'].map((capability, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Cog className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="font-medium text-slate-700">{capability}</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="inline-flex items-center gap-2 mt-8 text-slate-800 font-medium hover:text-slate-600 transition-colors">
                Learn More About Our Services <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  <p className="text-slate-400">Manufacturing Process Image</p>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-slate-800 text-white p-6 rounded-xl shadow-xl max-w-xs">
                  <p className="text-2xl font-bold mb-1">±0.01mm</p>
                  <p className="text-slate-300 text-sm">Precision Tolerance</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
              <p className="text-slate-300 text-lg mb-8">Get in touch with our team to discuss your requirements. We offer competitive pricing and fast turnaround times.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                  <Phone className="w-4 h-4" /> Contact Us
                </Link>
                <a href={"tel:" + companyData.contact.phone[0]} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                  {companyData.contact.phone[0]}
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}