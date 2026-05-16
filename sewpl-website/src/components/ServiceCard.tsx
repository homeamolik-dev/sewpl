'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cog, Factory, Wrench, ArrowRight } from 'lucide-react';
import EditableMedia from './EditableMedia';

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  icon: string;
  mediaUrl?: string;
}

interface ServiceCardProps {
  service: Service;
  index?: number;
}

const iconMap = {
  cog: Cog,
  factory: Factory,
  wrench: Wrench,
};

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const Icon = iconMap[service.icon as keyof typeof iconMap] || Cog;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/services#${service.slug}`} className="group block h-full">
        <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
          {service.mediaUrl ? (
            <div className="-m-6 mb-5 aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100">
              <EditableMedia src={service.mediaUrl} alt={service.name} />
            </div>
          ) : (
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-800 transition-colors">
              <Icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
            </div>
          )}

          {/* Content */}
          <h3 className="font-semibold text-lg text-slate-900 mb-2">
            {service.name}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-3">
            {service.shortDescription}
          </p>

          {/* Link */}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
