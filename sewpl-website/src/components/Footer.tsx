'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import companyData from '@/data/company.json';
import productsData from '@/data/products.json';
import siteGlobal from '@/data/site-global.json';
import { useContentData } from '@/hooks/useContentData';

const socialIcons = {
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
};

export default function Footer() {
  const content = useContentData({
    'company.json': companyData,
    'products.json': productsData,
    'site-global.json': siteGlobal,
  });
  const liveCompanyData = content['company.json'];
  const liveProductsData = content['products.json'];
  const liveSiteGlobal = content['site-global.json'];
  const footerLinks = {
    company: liveSiteGlobal.navigation.mainLinks
      .filter((link) => link.href !== '/')
      .map((link) => ({
        name: link.label,
        href: link.href,
      })),
    products: liveProductsData.categories.slice(0, 4).map((cat) => ({
      name: cat.name,
      href: `/products?category=${cat.slug}`,
    })),
    services: liveSiteGlobal.footer.serviceLinks.map((link) => ({
      name: link.label,
      href: link.href,
    })),
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">{liveSiteGlobal.branding.logoLetter}</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight">{liveSiteGlobal.branding.shortName}</p>
                <p className="text-xs text-slate-400 leading-tight">{liveSiteGlobal.branding.logoSubtitle}</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              {liveCompanyData.tagline}. {liveSiteGlobal.branding.footerSummary} {liveCompanyData.founded}.
            </p>

            <div className="flex gap-3">
              {Object.entries(liveCompanyData.social).map(([key, url]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons] || Globe;
                return url ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{liveSiteGlobal.footer.quickLinksTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{liveSiteGlobal.footer.productsTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white text-sm transition-colors">
                  {liveSiteGlobal.footer.productViewAllLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{liveSiteGlobal.footer.servicesTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{liveSiteGlobal.footer.contactTitle}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${liveCompanyData.contact.email.general}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{liveCompanyData.contact.email.general}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${liveCompanyData.contact.phone[0]}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{liveCompanyData.contact.phone[0]}</span>
                </a>
              </li>
              <li>
                <a
                  href={liveCompanyData.contact.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {liveCompanyData.contact.address.line1}<br />
                    {liveCompanyData.contact.address.city}, {liveCompanyData.contact.address.state}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            Copyright {new Date().getFullYear()} {liveCompanyData.name}. {liveSiteGlobal.footer.copyrightText}
          </p>
          <div className="flex gap-6">
            {liveSiteGlobal.footer.policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-500 hover:text-white text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
