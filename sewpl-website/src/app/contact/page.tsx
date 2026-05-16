'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Users } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';
import companyData from '@/data/company.json';
import contactPageContent from '@/data/contact-page-content.json';
import siteGlobal from '@/data/site-global.json';
import { useContentData } from '@/hooks/useContentData';

function getMapEmbedSrc(embed: string) {
  const trimmed = embed.trim();
  if (!trimmed || trimmed.startsWith('<!--')) return '';
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  return srcMatch?.[1] || trimmed;
}

export default function ContactPage() {
  const content = useContentData({
    'company.json': companyData,
    'contact-page-content.json': contactPageContent,
    'site-global.json': siteGlobal,
  });
  const liveCompanyData = content['company.json'];
  const liveContactPageContent = content['contact-page-content.json'];
  const liveSiteGlobal = content['site-global.json'];
  const mapEmbedSrc = getMapEmbedSrc(liveCompanyData.contact.googleMapsEmbed);
  const departments = [
    { name: 'Sales', email: liveCompanyData.contact.email.sales, icon: Users },
    { name: 'Accounts', email: liveCompanyData.contact.email.accounts, icon: Users },
    { name: 'CEO Office', email: liveCompanyData.contact.email.ceo, icon: Users },
    { name: 'Services', email: liveCompanyData.contact.email.services, icon: Users },
    { name: 'Manufacturing', email: liveCompanyData.contact.email.manufacturing, icon: Users },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{liveContactPageContent.hero.eyebrow}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">{liveContactPageContent.hero.title}</h1>
            <p className="text-lg text-slate-600">{liveContactPageContent.hero.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{liveContactPageContent.formSection.title}</h2>
                <ContactForm />
              </AnimatedSection>
            </div>

            <div>
              <AnimatedSection delay={0.1}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{liveContactPageContent.infoSection.title}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{liveSiteGlobal.sharedLabels.address}</p>
                      <p className="text-slate-600 text-sm">
                        {liveCompanyData.contact.address.line1}<br />
                        {liveCompanyData.contact.address.line2}<br />
                        {liveCompanyData.contact.address.city}, {liveCompanyData.contact.address.state} {liveCompanyData.contact.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{liveSiteGlobal.sharedLabels.phone}</p>
                      {liveCompanyData.contact.phone.map((phone, index) => (
                        <a key={index} href={`tel:${phone}`} className="block text-slate-600 text-sm hover:text-slate-900">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{liveSiteGlobal.sharedLabels.email}</p>
                      <a href={`mailto:${liveCompanyData.contact.email.general}`} className="text-slate-600 text-sm hover:text-slate-900">
                        {liveCompanyData.contact.email.general}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{liveSiteGlobal.sharedLabels.workingHours}</p>
                      <p className="text-slate-600 text-sm">
                        Mon-Fri: {liveCompanyData.contact.workingHours.weekdays}<br />
                        Saturday: {liveCompanyData.contact.workingHours.saturday}<br />
                        Sunday: {liveCompanyData.contact.workingHours.sunday}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{liveContactPageContent.departmentsSection.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((department, index) => (
                <a key={index} href={`mailto:${department.email}`} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <department.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{department.name}</p>
                    <p className="text-sm text-slate-500">{department.email}</p>
                  </div>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{liveContactPageContent.mapSection.title}</h2>
            <div className="aspect-[21/9] bg-slate-200 rounded-2xl overflow-hidden">
              {mapEmbedSrc ? (
                <iframe
                  src={mapEmbedSrc}
                  title="Company location map"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <a href={liveCompanyData.contact.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex h-full items-center justify-center">
                  <div className="text-center text-slate-400">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>{liveContactPageContent.mapSection.placeholderTitle}</p>
                    <p className="text-sm">{liveContactPageContent.mapSection.placeholderDescription}</p>
                  </div>
                </a>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
