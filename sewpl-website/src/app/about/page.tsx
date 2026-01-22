'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import companyData from '@/data/company.json';

const valueIcons = {
  Quality: Award,
  Innovation: Target,
  Integrity: CheckCircle,
  'Customer Focus': Users,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">About Us</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">
                Engineering Excellence Since {companyData.founded}
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                {companyData.description}
              </p>
              <p className="text-slate-500">
                We pride ourselves on delivering precision engineering solutions that help our clients
                achieve their manufacturing goals. Our team combines decades of experience with
                cutting-edge technology to provide exceptional results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm">Company Facility Image</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyData.about.stats.map((stat, index) => (
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

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-slate-50 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed">
                  {companyData.about.mission}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-slate-50 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed">
                  {companyData.about.vision}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Our Values</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
                What Drives Us
              </h2>
              <p className="text-slate-600">
                Our core values guide every decision we make and every project we undertake
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyData.about.values.map((value, index) => {
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

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="text-sm">Quality Certification Image</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">
                Your Trusted Engineering Partner
              </h2>

              <div className="space-y-4">
                {[
                  { title: 'Experienced Team', desc: 'Skilled professionals with decades of combined experience in precision engineering.' },
                  { title: 'Modern Equipment', desc: 'State-of-the-art CNC machines and quality inspection equipment.' },
                  { title: 'Quality Assurance', desc: 'Rigorous quality control processes ensuring consistent, reliable results.' },
                  { title: 'On-Time Delivery', desc: 'Committed to meeting deadlines without compromising on quality.' },
                  { title: 'Competitive Pricing', desc: 'Fair pricing with transparent quotations and no hidden costs.' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
