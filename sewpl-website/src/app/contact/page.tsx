'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Users } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';
import companyData from '@/data/company.json';

const departments = [
  { name: 'Sales', email: companyData.contact.email.sales, icon: Users },
  { name: 'Accounts', email: companyData.contact.email.accounts, icon: Users },
  { name: 'CEO Office', email: companyData.contact.email.ceo, icon: Users },
  { name: 'Services', email: companyData.contact.email.services, icon: Users },
  { name: 'Manufacturing', email: companyData.contact.email.manufacturing, icon: Users },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Contact Us</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-6">Get in Touch</h1>
            <p className="text-lg text-slate-600">Have a question or need a quote? We are here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                <ContactForm />
              </AnimatedSection>
            </div>

            <div>
              <AnimatedSection delay={0.1}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Address</p>
                      <p className="text-slate-600 text-sm">
                        {companyData.contact.address.line1}<br />
                        {companyData.contact.address.line2}<br />
                        {companyData.contact.address.city}, {companyData.contact.address.state} {companyData.contact.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      {companyData.contact.phone.map((phone, i) => (
                        <a key={i} href={`tel:${phone}`} className="block text-slate-600 text-sm hover:text-slate-900">{phone}</a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <a href={`mailto:${companyData.contact.email.general}`} className="text-slate-600 text-sm hover:text-slate-900">{companyData.contact.email.general}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Working Hours</p>
                      <p className="text-slate-600 text-sm">
                        Mon-Fri: {companyData.contact.workingHours.weekdays}<br />
                        Saturday: {companyData.contact.workingHours.saturday}<br />
                        Sunday: {companyData.contact.workingHours.sunday}
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
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Department Contacts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <a key={index} href={`mailto:${dept.email}`} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <dept.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{dept.name}</p>
                    <p className="text-sm text-slate-500">{dept.email}</p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Location</h2>
            <div className="aspect-[21/9] bg-slate-200 rounded-2xl flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Google Maps Embed</p>
                <p className="text-sm">Replace with actual embed code</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}