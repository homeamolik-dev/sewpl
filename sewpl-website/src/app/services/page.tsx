'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import FacilityCarousel from '@/components/FacilityCarousel';
import servicesData from '@/data/services.json';

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Our Services</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">Engineering Solutions</h1>
            <p className="text-lg text-slate-600">Comprehensive precision engineering services to meet all your manufacturing needs.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Facility</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{servicesData.facility.description}</p>
            </div>
            <FacilityCarousel images={servicesData.facility.images} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {servicesData.facility.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{highlight}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {servicesData.services.map((service, index) => (
        <section key={service.id} id={service.slug} className={index % 2 === 0 ? 'py-20 bg-slate-50' : 'py-20 bg-white'}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.name}</h2>
                <p className="text-slate-600 mb-8">{service.description}</p>

                {service.processes && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Processes</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.processes.map((process, pIndex) => (
                        <div key={pIndex} className="bg-white border border-slate-200 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">{process.name}</h4>
                          <p className="text-sm text-slate-500">{process.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {service.capabilities && (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.capabilities.map((cap, cIndex) => (
                        <span key={cIndex} className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-full">{cap}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      ))}
    </>
  );
}