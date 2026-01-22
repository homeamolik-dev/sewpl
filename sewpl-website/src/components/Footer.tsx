import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';
import companyData from '@/data/company.json';
import productsData from '@/data/products.json';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ],
  products: productsData.categories.slice(0, 4).map(cat => ({
    name: cat.name,
    href: `/products?category=${cat.slug}`
  })),
  services: [
    { name: 'Part Manufacturing', href: '/services#part-manufacturing' },
    { name: 'Machine Manufacturing', href: '/services#machine-manufacturing' },
    { name: 'Maintenance & Support', href: '/services#maintenance-support' },
  ],
};

const socialIcons = {
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">S</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight">SEWPL</p>
                <p className="text-xs text-slate-400 leading-tight">Engineering Works</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              {companyData.tagline}. Delivering precision engineering solutions since {companyData.founded}.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {Object.entries(companyData.social).map(([key, url]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return Icon ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${companyData.contact.email.general}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{companyData.contact.email.general}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${companyData.contact.phone[0]}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{companyData.contact.phone[0]}</span>
                </a>
              </li>
              <li>
                <a
                  href={companyData.contact.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {companyData.contact.address.line1}<br />
                    {companyData.contact.address.city}, {companyData.contact.address.state}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {companyData.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
