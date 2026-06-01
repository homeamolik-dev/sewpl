'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import EditableMedia from '@/components/EditableMedia';
import companyData from '@/data/company.json';
import aboutContent from '@/data/about-content.json';
import { useContentData } from '@/hooks/useContentData';

const valueIcons = {
  Quality: Award,
  Innovation: Target,
  Integrity: CheckCircle,
  'Customer Focus': Users,
};

export default function AboutPage() {
  const content = useContentData({
    'company.json': companyData,
    'about-content.json': aboutContent,
  });
  const liveCompanyData = content['company.json'];
  const liveAboutContent = content['about-content.json'];
  const customersSection = liveAboutContent.customersSection ?? {
    title: 'Our Customers',
    customers: [],
  };

  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveAboutContent.hero.eyebrow}</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">
                {liveAboutContent.hero.titlePrefix} {liveCompanyData.founded}
              </h1>
              <p className="text-lg text-slate-600 mb-6">{liveCompanyData.description}</p>
              <p className="text-slate-500">{liveAboutContent.hero.supportingText}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden relative">
                {liveAboutContent.hero.mediaUrl ? (
                  <EditableMedia src={liveAboutContent.hero.mediaUrl} alt={liveAboutContent.hero.imageLabel} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm">{liveAboutContent.hero.imageLabel}</p>
                  </div>
                </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {liveCompanyData.about.stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-slate-500">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-slate-50 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{liveAboutContent.missionSection.missionTitle}</h2>
                <p className="text-slate-600 leading-relaxed">{liveCompanyData.about.mission}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-slate-50 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{liveAboutContent.missionSection.visionTitle}</h2>
                <p className="text-slate-600 leading-relaxed">{liveCompanyData.about.vision}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveAboutContent.valuesSection.eyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">{liveAboutContent.valuesSection.title}</h2>
              <p className="text-slate-600">{liveAboutContent.valuesSection.description}</p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveCompanyData.about.values.map((value, index) => {
              const Icon = valueIcons[value.title as keyof typeof valueIcons] || Award;
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-500 text-sm">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
                {liveAboutContent.whyChooseUsSection.mediaUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white p-8">
                    <EditableMedia src={liveAboutContent.whyChooseUsSection.mediaUrl} alt={liveAboutContent.whyChooseUsSection.imageLabel} className="max-h-full max-w-full object-contain" videoClassName="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="text-sm">{liveAboutContent.whyChooseUsSection.imageLabel}</p>
                  </div>
                </div>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveAboutContent.whyChooseUsSection.eyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">{liveAboutContent.whyChooseUsSection.title}</h2>

              <div className="space-y-4">
                {liveAboutContent.whyChooseUsSection.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-center text-2xl font-bold text-slate-900 mb-8">{customersSection.title}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {customersSection.customers.map((customer, index) => (
                <div key={`${customer.name}-${index}`} className="flex aspect-[5/3] items-center justify-center rounded-lg border border-slate-300 bg-blue-50 p-3 text-center text-sm font-medium text-slate-900">
                  {customer.logoUrl ? (
                    <EditableMedia src={customer.logoUrl} alt={customer.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span>{customer.name}</span>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
