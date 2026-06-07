'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  FileJson,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Package,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type ContentMap = Record<string, JsonValue>;
type AdminTab = 'pages' | 'products' | 'services' | 'company' | 'uploads' | 'advanced';

type UploadedMedia = {
  name: string;
  url: string;
  type: 'image' | 'video' | 'other';
  size: number;
  modifiedAt: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  price: string;
  inStock: boolean;
  featured?: boolean;
};

type LinkItem = {
  label: string;
  href: string;
};

type ProductsContent = {
  products: Product[];
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
  }[];
};

type ServiceProcess = {
  name: string;
  description: string;
};

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  mediaUrl?: string;
  icon: string;
  processes?: ServiceProcess[];
  'Machining Facilities'?: ServiceProcess[];
  capabilities?: string[];
};

type ServicesContent = {
  services: ServiceItem[];
  facility: {
    description: string;
    highlights: string[];
    images: {
      src: string;
      alt: string;
      caption: string;
    }[];
  };
};

type CompanyContent = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  founded: string;
  about: {
    mission: string;
    vision: string;
    values: { title: string; description: string }[];
    stats: { value: string; label: string }[];
  };
  contact: {
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    phone: string[];
    email: Record<string, string>;
    workingHours: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
    googleMapsEmbed: string;
    googleMapsLink: string;
  };
  social: Record<string, string>;
};

type HomeContent = {
  hero: Record<string, string>;
  servicesSection: Record<string, string>;
  featuredProductsSection: Record<string, string>;
  capabilitiesSection: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
    linkLabel: string;
    imagePlaceholder: string;
    mediaUrl: string;
    precisionValue: string;
    precisionLabel: string;
  };
  ctaSection: Record<string, string>;
};

type ProductsPageContent = {
  hero: Record<string, string>;
  filters: Record<string, string>;
  cards: Record<string, string>;
  detail: Record<string, string>;
};

type AboutContent = {
  hero: {
    eyebrow: string;
    titlePrefix: string;
    supportingText: string;
    imageLabel: string;
    mediaUrl: string;
  };
  missionSection: Record<string, string>;
  valuesSection: Record<string, string>;
  whyChooseUsSection: {
    eyebrow: string;
    title: string;
    imageLabel: string;
    mediaUrl: string;
    items: { title: string; description: string }[];
  };
  customersSection?: {
    title: string;
    customers: { name: string; logoUrl: string }[];
  };
};

type SiteGlobalContent = {
  metadata: Record<string, string>;
  branding: Record<string, string>;
  navigation: {
    mainLinks: LinkItem[];
    productsLabel: string;
    allProductsLabel: string;
    quoteButtonLabel: string;
  };
  footer: {
    quickLinksTitle: string;
    productsTitle: string;
    servicesTitle: string;
    contactTitle: string;
    productViewAllLabel: string;
    serviceLinks: LinkItem[];
    policyLinks: LinkItem[];
    copyrightText: string;
  };
  sharedLabels: Record<string, string>;
};

type ServicesPageContent = {
  hero: Record<string, string>;
  facilitySection: Record<string, string>;
  serviceSection: Record<string, string>;
};

type ContactPageContent = {
  hero: Record<string, string>;
  formSection: Record<string, string>;
  infoSection: Record<string, string>;
  departmentsSection: Record<string, string>;
  mapSection: Record<string, string>;
};

type ContactFormContent = {
  fields: Record<string, { label: string; placeholder: string; options?: string[] }>;
  statusMessages: Record<string, string>;
  buttons: Record<string, string>;
};

const FILE_LABELS: Record<string, string> = {
  'site-global.json': 'Global site settings',
  'home-content.json': 'Homepage',
  'products-page-content.json': 'Products page',
  'about-content.json': 'About page',
  'company.json': 'Company details',
  'products.json': 'Products and categories',
  'services.json': 'Services and facility',
  'services-page-content.json': 'Services page labels',
  'contact-page-content.json': 'Contact page',
  'contact-form-content.json': 'Contact form',
};

function isRecord(value: JsonValue): value is Record<string, JsonValue> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function uniqueObjectKey(items: Record<string, string>, base = 'New field') {
  if (!(base in items)) return base;
  let index = 2;
  while (`${base} ${index}` in items) index += 1;
  return `${base} ${index}`;
}

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function findMediaUsages(content: ContentMap, targetUrl: string) {
  const matches: string[] = [];

  function visit(value: JsonValue, path: string[]) {
    if (value === targetUrl) {
      matches.push(path.join(' > '));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...path, String(index + 1)]));
      return;
    }

    if (isRecord(value)) {
      Object.entries(value).forEach(([key, item]) => visit(item, [...path, key]));
    }
  }

  Object.entries(content).forEach(([fileName, value]) => visit(value, [FILE_LABELS[fileName] || fileName]));
  return matches;
}

function emptyCategory(index: number) {
  return {
    id: `category-${Date.now()}-${index}`,
    name: 'New Category',
    slug: `new-category-${Date.now()}-${index}`,
    description: '',
  };
}

function emptyService(index: number): ServiceItem {
  return {
    id: `service-${Date.now()}-${index}`,
    name: 'New Service',
    slug: `new-service-${Date.now()}-${index}`,
    shortDescription: '',
    description: '',
    mediaUrl: '',
    icon: 'cog',
    'Machining Facilities': [],
    capabilities: [],
  };
}

function setAtPath(root: JsonValue, path: (string | number)[], value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  const [head, ...tail] = path;

  if (Array.isArray(root)) {
    const next = [...root];
    next[Number(head)] = setAtPath(next[Number(head)], tail, value);
    return next;
  }

  if (isRecord(root)) {
    return {
      ...root,
      [String(head)]: setAtPath(root[String(head)], tail, value),
    };
  }

  return root;
}

function removeAtPath(root: JsonValue, path: (string | number)[]): JsonValue {
  if (path.length === 0) return root;
  const [head, ...tail] = path;

  if (Array.isArray(root)) {
    if (tail.length === 0) return root.filter((_, index) => index !== Number(head));
    const next = [...root];
    next[Number(head)] = removeAtPath(next[Number(head)], tail);
    return next;
  }

  if (isRecord(root)) {
    if (tail.length === 0) {
      const next = { ...root };
      delete next[String(head)];
      return next;
    }
    return {
      ...root,
      [String(head)]: removeAtPath(root[String(head)], tail),
    };
  }

  return root;
}

function getEmptyValue(type: string): JsonValue {
  if (type === 'array') return [];
  if (type === 'object') return {};
  if (type === 'boolean') return false;
  if (type === 'number') return 0;
  return '';
}

function JsonEditor({
  value,
  onChange,
  path = [],
  label = 'Content',
  removable = false,
  onRemove,
}: {
  value: JsonValue;
  onChange: (path: (string | number)[], value: JsonValue) => void;
  path?: (string | number)[];
  label?: string;
  removable?: boolean;
  onRemove?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(path.length > 2);
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState('text');

  if (Array.isArray(value)) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 font-medium text-slate-900">
            <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
            {label} <span className="text-sm font-normal text-slate-500">Array, {value.length} items</span>
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => onChange(path, [...value, ''])} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200">
              <Plus className="h-3 w-3" /> Add item
            </button>
            {removable && (
              <button type="button" onClick={onRemove} className="rounded-md p-1 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {!collapsed && (
          <div className="space-y-3">
            {value.map((item, index) => (
              <JsonEditor
                key={index}
                label={`Item ${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
                removable
                onRemove={() => onChange(path, removeAtPath(value, [index]))}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isRecord(value)) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 font-medium text-slate-900">
            <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
            {label} <span className="text-sm font-normal text-slate-500">Object</span>
          </button>
          {removable && (
            <button type="button" onClick={onRemove} className="rounded-md p-1 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        {!collapsed && (
          <div className="space-y-3">
            {Object.entries(value).map(([key, item]) => (
              <JsonEditor
                key={key}
                label={key}
                value={item}
                path={[...path, key]}
                onChange={onChange}
                removable
                onRemove={() => onChange(path, removeAtPath(value, [key]))}
              />
            ))}
            <div className="flex flex-col gap-2 rounded-lg bg-slate-50 p-3 sm:flex-row">
              <input value={newKey} onChange={(event) => setNewKey(event.target.value)} placeholder="New field name" className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <select value={newType} onChange={(event) => setNewType(event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
                <option value="object">Object</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!newKey.trim()) return;
                  onChange(path, { ...value, [newKey.trim()]: getEmptyValue(newType) });
                  setNewKey('');
                }}
                className="inline-flex items-center justify-center gap-1 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" /> Add field
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {removable && (
          <button type="button" onClick={onRemove} className="rounded-md p-1 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {typeof value === 'boolean' ? (
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
          Enabled
        </label>
      ) : typeof value === 'number' ? (
        <input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      ) : (
        <textarea value={value === null ? '' : String(value)} onChange={(event) => onChange(path, event.target.value)} rows={String(value ?? '').length > 90 ? 4 : 2} className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-relaxed" />
      )}
    </div>
  );
}

function TextListEditor({
  title,
  items,
  onChange,
  addLabel = 'Add item',
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <button type="button" onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input value={item} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyValueEditor({
  title,
  items,
  keyLabel,
  valueLabel,
  onChange,
}: {
  title: string;
  items: Record<string, string>;
  keyLabel: string;
  valueLabel: string;
  onChange: (items: Record<string, string>) => void;
}) {
  const idCounter = useRef(0);
  const initializedForItems = useRef(items);
  const [rows, setRows] = useState(() => Object.entries(items).map(([key, value], index) => ({
    id: `initial-${index}`,
    key,
    value,
  })));

  useEffect(() => {
    if (initializedForItems.current === items) return;
    initializedForItems.current = items;
    queueMicrotask(() => {
      setRows(Object.entries(items).map(([key, value], index) => ({
        id: `synced-${index}`,
        key,
        value,
      })));
    });
  }, [items]);

  function commit(nextRows: typeof rows) {
    const nextItems = Object.fromEntries(
      nextRows
        .map((row) => [row.key.trim(), row.value] as const)
        .filter(([key]) => key.length > 0),
    );
    initializedForItems.current = nextItems;
    onChange(nextItems);
  }

  function updateRows(updater: (current: typeof rows) => typeof rows) {
    const nextRows = updater(rows);
    setRows(nextRows);
    commit(nextRows);
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <button type="button" onClick={() => updateRows((current) => {
          const currentItems = Object.fromEntries(current.map((row) => [row.key, row.value]));
          return [...current, { id: `added-${Date.now()}-${idCounter.current++}`, key: uniqueObjectKey(currentItems), value: '' }];
        })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
          <Plus className="h-4 w-4" /> Add row
        </button>
      </div>
      <div className="space-y-3">
        {rows.map((row) => {
          const duplicateKey = row.key.trim().length > 0 && rows.some((item) => item.id !== row.id && item.key.trim() === row.key.trim());
          return (
          <div key={row.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <label className="block min-w-0 text-xs font-medium text-slate-500">
                {keyLabel}
                <input
                  value={row.key}
                  onChange={(event) => updateRows((current) => current.map((item) => item.id === row.id ? { ...item, key: event.target.value } : item))}
                  className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 ${duplicateKey ? 'border-red-300' : 'border-slate-300'}`}
                  placeholder={keyLabel}
                />
                {duplicateKey && <span className="mt-1 block text-xs text-red-600">Duplicate names overwrite each other. Rename this row.</span>}
              </label>
              <label className="block min-w-0 text-xs font-medium text-slate-500">
                {valueLabel}
                <input
                  value={row.value}
                  onChange={(event) => updateRows((current) => current.map((item) => item.id === row.id ? { ...item, value: event.target.value } : item))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder={valueLabel}
                />
              </label>
            </div>
            <button type="button" onClick={() => {
              const nextRows = rows.filter((item) => item.id !== row.id);
              setRows(nextRows);
              commit(nextRows);
            }} className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete row
            </button>
          </div>
        );
        })}
      </div>
    </div>
  );
}

function ProcessEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: ServiceProcess[];
  onChange: (items: ServiceProcess[]) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <button type="button" onClick={() => onChange([...items, { name: 'New item', description: '' }])} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <label className="block text-sm font-medium text-slate-700">Title<input value={item.name} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? { ...value, name: event.target.value } : value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
            <label className="mt-3 block text-sm font-medium text-slate-700">Description<textarea value={item.description} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? { ...value, description: event.target.value } : value))} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkListEditor({
  title,
  items,
  onChange,
  addLabel = 'Add link',
}: {
  title: string;
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <button type="button" onClick={() => onChange([...items, { label: 'New link', href: '/' }])} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1.5fr_auto]">
            <input value={item.label} onChange={(event) => onChange(items.map((link, itemIndex) => itemIndex === index ? { ...link, label: event.target.value } : link))} placeholder="Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={item.href} onChange={(event) => onChange(items.map((link, itemIndex) => itemIndex === index ? { ...link, href: event.target.value } : link))} placeholder="/path" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaField({
  label,
  value,
  media,
  uploading,
  onChange,
  onUpload,
  onRemove,
  onDeleteMedia,
  deletingMediaUrl = '',
  getUsageCount,
}: {
  label: string;
  value: string;
  media: UploadedMedia[];
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | undefined>;
  onRemove?: () => void;
  onDeleteMedia?: (item: UploadedMedia) => void;
  deletingMediaUrl?: string;
  getUsageCount?: (url: string) => number;
}) {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-semibold text-slate-950">{label}</h3>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload here
            <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const url = await onUpload(file);
              if (url) onChange(url);
              event.target.value = '';
            }} />
          </label>
          <button type="button" onClick={() => setShowLibrary((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {showLibrary ? 'Hide library' : 'Choose existing'}
          </button>
          <button type="button" onClick={() => onChange('')} disabled={!value} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            Clear field
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </div>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/photo.jpg" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      {showLibrary && media.length > 0 && (
        <div className="mt-3 grid max-h-80 gap-2 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <div key={item.url} className={`rounded-lg border p-2 text-xs ${value === item.url ? 'border-slate-900 bg-slate-100' : 'border-slate-200'}`}>
              <button type="button" onClick={() => onChange(item.url)} className="block w-full text-left">
                <span className="line-clamp-1 font-medium text-slate-900">{item.name}</span>
                <span className="mt-1 block break-all text-slate-500">{item.url}</span>
              </button>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {typeof getUsageCount === 'function' && getUsageCount(item.url) > 0 && (
                  <span className="text-amber-700">Used in {getUsageCount(item.url)} field(s)</span>
                )}
                {onDeleteMedia && (
                  <button type="button" onClick={() => onDeleteMedia(item)} disabled={deletingMediaUrl === item.url} className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">
                    {deletingMediaUrl === item.url ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete file
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [content, setContent] = useState<ContentMap>({});
  const [selectedFile, setSelectedFile] = useState('home-content.json');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [tab, setTab] = useState<AdminTab>('pages');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingMediaUrl, setDeletingMediaUrl] = useState('');

  const productsContent = content['products.json'] as ProductsContent | undefined;
  const selectedProduct = productsContent?.products.find((product) => product.id === selectedProductId) ?? productsContent?.products[0];
  const servicesContent = content['services.json'] as ServicesContent | undefined;
  const selectedService = servicesContent?.services.find((service) => service.id === selectedServiceId) ?? servicesContent?.services[0];
  const companyContent = content['company.json'] as CompanyContent | undefined;
  const homeContent = content['home-content.json'] as HomeContent | undefined;
  const productsPageContent = content['products-page-content.json'] as ProductsPageContent | undefined;
  const aboutContent = content['about-content.json'] as AboutContent | undefined;
  const siteGlobalContent = content['site-global.json'] as SiteGlobalContent | undefined;
  const servicesPageContent = content['services-page-content.json'] as ServicesPageContent | undefined;
  const contactPageContent = content['contact-page-content.json'] as ContactPageContent | undefined;
  const contactFormContent = content['contact-form-content.json'] as ContactFormContent | undefined;
  const aboutCustomersSection = aboutContent?.customersSection ?? {
    title: 'Our Customers',
    customers: [],
  };

  const selectedFileValue = content[selectedFile];
  const advancedFileOptions = files;

  async function loadAdminData() {
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    setFiles(data.files);
    setContent(data.content);
    const products = (data.content['products.json'] as ProductsContent | undefined)?.products ?? [];
    const services = (data.content['services.json'] as ServicesContent | undefined)?.services ?? [];
    setSelectedProductId((current) => current || products[0]?.id || '');
    setSelectedServiceId((current) => current || services[0]?.id || '');
    return data.content as ContentMap;
  }

  async function loadMedia() {
    const response = await fetch('/api/admin/media', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    setMedia(data.media);
  }

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          void loadAdminData();
          void loadMedia();
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginError('');
    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setLoginError('Invalid password');
      return;
    }

    setAuthenticated(true);
    setPassword('');
    await loadAdminData();
    await loadMedia();
  }

  async function logout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setAuthenticated(false);
  }

  async function saveFile(fileName: string, value: JsonValue) {
    setSaving(true);
    setStatus('');
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, value }),
    });

    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setStatus(data.error || 'Could not save changes');
      return;
    }

    const refreshedContent = await loadAdminData();
    if (refreshedContent && JSON.stringify(refreshedContent[fileName]) !== JSON.stringify(value)) {
      setStatus(`Saved ${FILE_LABELS[fileName] || fileName}, but the refreshed content did not match. Check Vercel Blob/cache setup before trusting the public page.`);
      return;
    }
    setStatus(`Saved ${FILE_LABELS[fileName] || fileName}. Public pages will use the updated content.`);
  }

  async function saveServicesContent() {
    if (!servicesContent) return;
    const cleanedServicesContent = {
      ...servicesContent,
      services: servicesContent.services.map((service) => {
        const { processes, ...rest } = service;
        return {
          ...rest,
          mediaUrl: '',
          'Machining Facilities': service['Machining Facilities'] ?? processes ?? [],
        };
      }),
      facility: {
        ...servicesContent.facility,
        images: servicesContent.facility.images
          .map((image) => ({
            src: image.src.trim(),
            alt: image.alt.trim(),
            caption: image.caption.trim(),
          }))
          .filter((image) => image.src),
      },
    };

    updateServices(cleanedServicesContent);
    await saveFile('services.json', cleanedServicesContent as unknown as JsonValue);
  }

  function updateSelectedFile(path: (string | number)[], value: JsonValue) {
    setContent((previous) => ({
      ...previous,
      [selectedFile]: setAtPath(previous[selectedFile], path, value),
    }));
  }

  function updateSelectedFileFor(fileName: string, value: unknown) {
    setContent((previous) => ({
      ...previous,
      [fileName]: value as JsonValue,
    }));
  }

  function updateProducts(nextProductsContent: ProductsContent) {
    setContent((previous) => ({
      ...previous,
      'products.json': nextProductsContent as unknown as JsonValue,
    }));
  }

  function updateProductsFromCurrent(updater: (current: ProductsContent) => ProductsContent) {
    setContent((previous) => {
      const current = previous['products.json'] as unknown as ProductsContent | undefined;
      if (!current) return previous;
      return {
        ...previous,
        'products.json': updater(current) as unknown as JsonValue,
      };
    });
  }

  function updateServices(nextServicesContent: ServicesContent) {
    setContent((previous) => ({
      ...previous,
      'services.json': nextServicesContent as unknown as JsonValue,
    }));
  }

  function updateServicesFromCurrent(updater: (current: ServicesContent) => ServicesContent) {
    setContent((previous) => {
      const current = previous['services.json'] as unknown as ServicesContent | undefined;
      if (!current) return previous;
      return {
        ...previous,
        'services.json': updater(current) as unknown as JsonValue,
      };
    });
  }

  function updateService(serviceId: string, patch: Partial<ServiceItem>) {
    if (!servicesContent) return;
    updateServices({
      ...servicesContent,
      services: servicesContent.services.map((service) => (service.id === serviceId ? { ...service, ...patch } : service)),
    });
  }

  function updateCompany(nextCompanyContent: CompanyContent) {
    setContent((previous) => ({
      ...previous,
      'company.json': nextCompanyContent as unknown as JsonValue,
    }));
  }

  function updateHome(nextHomeContent: HomeContent) {
    setContent((previous) => ({
      ...previous,
      'home-content.json': nextHomeContent as unknown as JsonValue,
    }));
  }

  function updateAbout(nextAboutContent: AboutContent) {
    setContent((previous) => ({
      ...previous,
      'about-content.json': nextAboutContent as unknown as JsonValue,
    }));
  }

  function updateProduct(productId: string, patch: Partial<Product>) {
    updateProductsFromCurrent((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)),
    }));
  }

  async function uploadFile(file: File, attachToProductId?: string) {
    setUploading(true);
    setStatus('');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
    const data = await response.json().catch(() => ({}));
    setUploading(false);

    if (!response.ok) {
      setStatus(data.error || 'Upload failed');
      return;
    }

    setMedia((previous) => [data.media, ...previous]);
    if (attachToProductId) {
      updateProductsFromCurrent((current) => ({
        ...current,
        products: current.products.map((product) => (
          product.id === attachToProductId ? { ...product, images: [...(product.images ?? []), data.media.url] } : product
        )),
      }));
      setStatus('Uploaded and attached media. Save products to publish it.');
      return data.media.url as string;
    }
    setStatus('Media uploaded');
    return data.media.url as string;
  }

  async function deleteMediaItem(item: UploadedMedia) {
    const usages = findMediaUsages(content, item.url);
    const warning = usages.length > 0
      ? `This media is used in ${usages.length} place(s):\n${usages.slice(0, 6).join('\n')}${usages.length > 6 ? '\n...' : ''}\n\nDeleting it may leave broken images/videos unless you replace those fields first. Delete anyway?`
      : `Delete ${item.name} from the media library?`;

    if (!window.confirm(warning)) return;

    setDeletingMediaUrl(item.url);
    setStatus('');
    const response = await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: item.url }),
    });
    const data = await response.json().catch(() => ({}));
    setDeletingMediaUrl('');

    if (!response.ok) {
      setStatus(data.error || 'Could not delete media');
      return;
    }

    setMedia((previous) => previous.filter((mediaItem) => mediaItem.url !== item.url));
    setStatus(`Deleted ${item.name}`);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-slate-950 pt-16 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-950 pt-16 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
          <form onSubmit={login} className="w-full rounded-xl border border-slate-800 bg-white p-6 text-slate-900 shadow-2xl">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="mt-2 text-sm text-slate-500">Use the admin password from the site environment.</p>
            <label className="mt-6 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" autoComplete="current-password" />
            {loginError && <p className="mt-3 text-sm font-medium text-red-600">{loginError}</p>}
            <button type="submit" className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800">Sign in</button>
            <p className="mt-4 text-xs text-slate-500">Default local password is admin123 until ADMIN_PASSWORD is set.</p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pt-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Website Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Edit site copy, products, categories, services, contact details, and uploaded media.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {status && <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{status}</span>}
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </section>

	      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	        <div className="mb-6 flex flex-wrap gap-2">
	          {[
	            ['pages', FileJson, 'Pages'],
	            ['products', Package, 'Products'],
	            ['services', FileJson, 'Services'],
	            ['company', FileJson, 'Company & Map'],
	            ['uploads', ImageIcon, 'Uploads'],
	            ['advanced', FileJson, 'Advanced JSON'],
	          ].map(([key, Icon, label]) => (
	            <button key={String(key)} onClick={() => setTab(key as AdminTab)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === key ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
	              <Icon className="h-4 w-4" /> {String(label)}
	            </button>
	          ))}
	        </div>

	        {tab === 'pages' && homeContent && aboutContent && productsPageContent && siteGlobalContent && servicesPageContent && contactPageContent && contactFormContent && (
            <div className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Global Navigation & Footer</h2>
                    <p className="text-sm text-slate-500">Branding, nav labels, footer labels, shared contact labels, and footer links.</p>
                  </div>
                  <button type="button" onClick={() => saveFile('site-global.json', siteGlobalContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save global settings
                  </button>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <KeyValueEditor title="Metadata" keyLabel="Field" valueLabel="Text" items={siteGlobalContent.metadata} onChange={(metadata) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, metadata })} />
                  <KeyValueEditor title="Branding" keyLabel="Field" valueLabel="Text" items={siteGlobalContent.branding} onChange={(branding) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, branding })} />
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-4 font-semibold text-slate-950">Navigation Labels</h3>
                    {['productsLabel', 'allProductsLabel', 'quoteButtonLabel'].map((key) => (
                      <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                        {key}
                        <input value={siteGlobalContent.navigation[key as keyof Omit<SiteGlobalContent['navigation'], 'mainLinks'>]} onChange={(event) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, navigation: { ...siteGlobalContent.navigation, [key]: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                      </label>
                    ))}
                  </div>
                  <LinkListEditor title="Main nav links" items={siteGlobalContent.navigation.mainLinks} onChange={(mainLinks) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, navigation: { ...siteGlobalContent.navigation, mainLinks } })} />
                  <KeyValueEditor title="Footer Labels" keyLabel="Field" valueLabel="Text" items={{
                    quickLinksTitle: siteGlobalContent.footer.quickLinksTitle,
                    productsTitle: siteGlobalContent.footer.productsTitle,
                    servicesTitle: siteGlobalContent.footer.servicesTitle,
                    contactTitle: siteGlobalContent.footer.contactTitle,
                    productViewAllLabel: siteGlobalContent.footer.productViewAllLabel,
                    copyrightText: siteGlobalContent.footer.copyrightText,
                  }} onChange={(footerLabels) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, footer: { ...siteGlobalContent.footer, ...footerLabels } })} />
                  <KeyValueEditor title="Shared Labels" keyLabel="Field" valueLabel="Text" items={siteGlobalContent.sharedLabels} onChange={(sharedLabels) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, sharedLabels })} />
                  <LinkListEditor title="Footer service links" items={siteGlobalContent.footer.serviceLinks} onChange={(serviceLinks) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, footer: { ...siteGlobalContent.footer, serviceLinks } })} />
                  <LinkListEditor title="Footer policy links" items={siteGlobalContent.footer.policyLinks} onChange={(policyLinks) => updateSelectedFileFor('site-global.json', { ...siteGlobalContent, footer: { ...siteGlobalContent.footer, policyLinks } })} />
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Products Page</h2>
                    <p className="text-sm text-slate-500">Hero copy, search/filter labels, and empty-state copy.</p>
                  </div>
                  <button type="button" onClick={() => saveFile('products-page-content.json', productsPageContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save products page
                  </button>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <KeyValueEditor title="Hero" keyLabel="Field" valueLabel="Text" items={productsPageContent.hero} onChange={(hero) => updateSelectedFileFor('products-page-content.json', { ...productsPageContent, hero })} />
                  <KeyValueEditor title="Filter Labels" keyLabel="Field" valueLabel="Text" items={productsPageContent.filters} onChange={(filters) => updateSelectedFileFor('products-page-content.json', { ...productsPageContent, filters })} />
                  <KeyValueEditor title="Product Card Labels" keyLabel="Field" valueLabel="Text" items={productsPageContent.cards} onChange={(cards) => updateSelectedFileFor('products-page-content.json', { ...productsPageContent, cards })} />
                  <KeyValueEditor title="Product Detail Labels" keyLabel="Field" valueLabel="Text" items={productsPageContent.detail} onChange={(detail) => updateSelectedFileFor('products-page-content.json', { ...productsPageContent, detail })} />
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Services Page Labels</h2>
                    <p className="text-sm text-slate-500">Services hero, facility section title, process title, and capability title.</p>
                  </div>
                  <button type="button" onClick={() => saveFile('services-page-content.json', servicesPageContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save services labels
                  </button>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <KeyValueEditor title="Hero" keyLabel="Field" valueLabel="Text" items={servicesPageContent.hero} onChange={(hero) => updateSelectedFileFor('services-page-content.json', { ...servicesPageContent, hero })} />
                  <KeyValueEditor title="Facility Section" keyLabel="Field" valueLabel="Text" items={servicesPageContent.facilitySection} onChange={(facilitySection) => updateSelectedFileFor('services-page-content.json', { ...servicesPageContent, facilitySection })} />
                  <KeyValueEditor title="Service Section" keyLabel="Field" valueLabel="Text" items={servicesPageContent.serviceSection} onChange={(serviceSection) => updateSelectedFileFor('services-page-content.json', { ...servicesPageContent, serviceSection })} />
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Contact Page & Form</h2>
                    <p className="text-sm text-slate-500">Contact page copy, form labels, subject options, status messages, and button labels.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => saveFile('contact-page-content.json', contactPageContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save contact page
                    </button>
                    <button type="button" onClick={() => saveFile('contact-form-content.json', contactFormContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save contact form
                    </button>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <KeyValueEditor title="Contact Hero" keyLabel="Field" valueLabel="Text" items={contactPageContent.hero} onChange={(hero) => updateSelectedFileFor('contact-page-content.json', { ...contactPageContent, hero })} />
                  <KeyValueEditor title="Contact Section Titles" keyLabel="Field" valueLabel="Text" items={{
                    formTitle: contactPageContent.formSection.title,
                    infoTitle: contactPageContent.infoSection.title,
                    departmentsTitle: contactPageContent.departmentsSection.title,
                    mapTitle: contactPageContent.mapSection.title,
                    mapPlaceholderTitle: contactPageContent.mapSection.placeholderTitle,
                    mapPlaceholderDescription: contactPageContent.mapSection.placeholderDescription,
                  }} onChange={(labels) => updateSelectedFileFor('contact-page-content.json', {
                    ...contactPageContent,
                    formSection: { title: labels.formTitle },
                    infoSection: { title: labels.infoTitle },
                    departmentsSection: { title: labels.departmentsTitle },
                    mapSection: {
                      title: labels.mapTitle,
                      placeholderTitle: labels.mapPlaceholderTitle,
                      placeholderDescription: labels.mapPlaceholderDescription,
                    },
                  })} />
                  <div className="rounded-lg border border-slate-200 p-4 lg:col-span-2">
                    <h3 className="mb-4 font-semibold text-slate-950">Form Fields</h3>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {Object.entries(contactFormContent.fields).map(([fieldKey, field]) => (
                        <div key={fieldKey} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <h4 className="mb-3 text-sm font-semibold capitalize text-slate-900">{fieldKey}</h4>
                          <label className="block text-sm font-medium text-slate-700">Label<input value={field.label} onChange={(event) => updateSelectedFileFor('contact-form-content.json', { ...contactFormContent, fields: { ...contactFormContent.fields, [fieldKey]: { ...field, label: event.target.value } } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                          <label className="mt-3 block text-sm font-medium text-slate-700">Placeholder<input value={field.placeholder} onChange={(event) => updateSelectedFileFor('contact-form-content.json', { ...contactFormContent, fields: { ...contactFormContent.fields, [fieldKey]: { ...field, placeholder: event.target.value } } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                          {field.options && (
                            <div className="mt-3">
                              <TextListEditor title="Subject options" items={field.options} onChange={(options) => updateSelectedFileFor('contact-form-content.json', { ...contactFormContent, fields: { ...contactFormContent.fields, [fieldKey]: { ...field, options } } })} addLabel="Add option" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <KeyValueEditor title="Form Status Messages" keyLabel="Field" valueLabel="Text" items={contactFormContent.statusMessages} onChange={(statusMessages) => updateSelectedFileFor('contact-form-content.json', { ...contactFormContent, statusMessages })} />
                  <KeyValueEditor title="Form Buttons" keyLabel="Field" valueLabel="Text" items={contactFormContent.buttons} onChange={(buttons) => updateSelectedFileFor('contact-form-content.json', { ...contactFormContent, buttons })} />
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Homepage</h2>
                    <p className="text-sm text-slate-500">Hero, section headings, capabilities list, media, and call-to-action.</p>
                  </div>
                  <button type="button" onClick={() => saveFile('home-content.json', homeContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save homepage
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-4 font-semibold text-slate-950">Hero</h3>
                    <div className="space-y-3">
                      {['badgePrefix', 'title', 'highlightedTitle', 'description', 'primaryButtonLabel', 'secondaryButtonLabel', 'imageLabel', 'imageCaption', 'certificationTitle', 'certificationDescription'].map((key) => (
                        <label key={key} className="block text-sm font-medium text-slate-700">
                          {key}
                          <textarea value={homeContent.hero[key] || ''} onChange={(event) => updateHome({ ...homeContent, hero: { ...homeContent.hero, [key]: event.target.value } })} rows={key === 'description' ? 4 : 1} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </label>
                      ))}
                      <MediaField label="Hero image/video" value={homeContent.hero.mediaUrl || ''} media={media} uploading={uploading} onUpload={uploadFile} onChange={(mediaUrl) => updateHome({ ...homeContent, hero: { ...homeContent.hero, mediaUrl } })} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <h3 className="mb-4 font-semibold text-slate-950">Services Section</h3>
                      {['eyebrow', 'title', 'description', 'cardLinkLabel'].map((key) => (
                        <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                          {key}
                          <input value={homeContent.servicesSection[key] || ''} onChange={(event) => updateHome({ ...homeContent, servicesSection: { ...homeContent.servicesSection, [key]: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </label>
                      ))}
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <h3 className="mb-4 font-semibold text-slate-950">Featured Products Section</h3>
                      {['eyebrow', 'title', 'viewAllLabel'].map((key) => (
                        <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                          {key}
                          <input value={homeContent.featuredProductsSection[key] || ''} onChange={(event) => updateHome({ ...homeContent, featuredProductsSection: { ...homeContent.featuredProductsSection, [key]: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-4 font-semibold text-slate-950">Capabilities Section</h3>
                    {['eyebrow', 'title', 'description', 'linkLabel', 'imagePlaceholder'].map((key) => (
                      <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                        {key}
                        <textarea value={String(homeContent.capabilitiesSection[key as keyof typeof homeContent.capabilitiesSection] || '')} onChange={(event) => updateHome({ ...homeContent, capabilitiesSection: { ...homeContent.capabilitiesSection, [key]: event.target.value } })} rows={key === 'description' ? 3 : 1} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                      </label>
                    ))}
                    <TextListEditor title="Capability items" items={homeContent.capabilitiesSection.items} onChange={(items) => updateHome({ ...homeContent, capabilitiesSection: { ...homeContent.capabilitiesSection, items } })} addLabel="Add capability" />
                    <div className="mt-4">
                      <MediaField label="Capabilities image/video" value={homeContent.capabilitiesSection.mediaUrl || ''} media={media} uploading={uploading} onUpload={uploadFile} onChange={(mediaUrl) => updateHome({ ...homeContent, capabilitiesSection: { ...homeContent.capabilitiesSection, mediaUrl } })} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-4 font-semibold text-slate-950">Call To Action</h3>
                    {['title', 'description', 'primaryButtonLabel'].map((key) => (
                      <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                        {key}
                        <textarea value={homeContent.ctaSection[key] || ''} onChange={(event) => updateHome({ ...homeContent, ctaSection: { ...homeContent.ctaSection, [key]: event.target.value } })} rows={key === 'description' ? 3 : 1} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">About Page</h2>
                    <p className="text-sm text-slate-500">Hero text, page media, section headings, and why-choose-us cards.</p>
                  </div>
                  <button type="button" onClick={() => saveFile('about-content.json', aboutContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save about page
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-4 font-semibold text-slate-950">Hero</h3>
                    {['eyebrow', 'titlePrefix', 'supportingText', 'imageLabel'].map((key) => (
                      <label key={key} className="mb-3 block text-sm font-medium text-slate-700">
                        {key}
                        <textarea value={aboutContent.hero[key as keyof typeof aboutContent.hero] || ''} onChange={(event) => updateAbout({ ...aboutContent, hero: { ...aboutContent.hero, [key]: event.target.value } })} rows={key === 'supportingText' ? 4 : 1} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                      </label>
                    ))}
                    <MediaField label="About hero image/video" value={aboutContent.hero.mediaUrl || ''} media={media} uploading={uploading} onUpload={uploadFile} onChange={(mediaUrl) => updateAbout({ ...aboutContent, hero: { ...aboutContent.hero, mediaUrl } })} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                  </div>

                  <div className="space-y-6">
                    <KeyValueEditor title="Mission/Vision Labels" keyLabel="Field" valueLabel="Text" items={aboutContent.missionSection} onChange={(missionSection) => updateAbout({ ...aboutContent, missionSection })} />
                    <KeyValueEditor title="Values Section Labels" keyLabel="Field" valueLabel="Text" items={aboutContent.valuesSection} onChange={(valuesSection) => updateAbout({ ...aboutContent, valuesSection })} />
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-4 font-semibold text-slate-950">Why Choose Us</h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {['eyebrow', 'title', 'imageLabel'].map((key) => (
                      <label key={key} className="block text-sm font-medium text-slate-700">
                        {key}
                        <input value={String(aboutContent.whyChooseUsSection[key as keyof typeof aboutContent.whyChooseUsSection] || '')} onChange={(event) => updateAbout({ ...aboutContent, whyChooseUsSection: { ...aboutContent.whyChooseUsSection, [key]: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <MediaField label="Why choose us image/video" value={aboutContent.whyChooseUsSection.mediaUrl || ''} media={media} uploading={uploading} onUpload={uploadFile} onChange={(mediaUrl) => updateAbout({ ...aboutContent, whyChooseUsSection: { ...aboutContent.whyChooseUsSection, mediaUrl } })} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                  </div>
                  <div className="mt-4">
                    <ProcessEditor title="Why choose us cards" items={aboutContent.whyChooseUsSection.items.map((item) => ({ name: item.title, description: item.description }))} onChange={(items) => updateAbout({ ...aboutContent, whyChooseUsSection: { ...aboutContent.whyChooseUsSection, items: items.map((item) => ({ title: item.name, description: item.description })) } })} />
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-slate-200 p-4">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-950">Customers Section</h3>
                    <button type="button" onClick={() => updateAbout({ ...aboutContent, customersSection: { ...aboutCustomersSection, customers: [...aboutCustomersSection.customers, { name: 'Company Logo', logoUrl: '' }] } })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                      <Plus className="h-4 w-4" /> Add customer
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Section title
                    <input value={aboutCustomersSection.title} onChange={(event) => updateAbout({ ...aboutContent, customersSection: { ...aboutCustomersSection, title: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </label>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {aboutCustomersSection.customers.map((customer, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-900">Customer {index + 1}</span>
                          <button type="button" onClick={() => updateAbout({ ...aboutContent, customersSection: { ...aboutCustomersSection, customers: aboutCustomersSection.customers.filter((_, itemIndex) => itemIndex !== index) } })} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <label className="block text-sm font-medium text-slate-700">
                          Name / placeholder text
                          <input value={customer.name} onChange={(event) => updateAbout({ ...aboutContent, customersSection: { ...aboutCustomersSection, customers: aboutCustomersSection.customers.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                        </label>
                        <div className="mt-3">
                          <MediaField label="Customer logo" value={customer.logoUrl} media={media} uploading={uploading} onUpload={uploadFile} onChange={(logoUrl) => updateAbout({ ...aboutContent, customersSection: { ...aboutCustomersSection, customers: aboutCustomersSection.customers.map((item, itemIndex) => itemIndex === index ? { ...item, logoUrl } : item) } })} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

	        {tab === 'advanced' && (
	          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
	            <aside className="rounded-xl border border-slate-200 bg-white p-3">
                <h2 className="mb-3 px-3 text-sm font-semibold text-slate-900">All Data Files</h2>
	              <div className="space-y-1">
	                {advancedFileOptions.map((file) => (
                  <button key={file} onClick={() => setSelectedFile(file)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${selectedFile === file ? 'bg-slate-900 font-medium text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
                    {FILE_LABELS[file] || file}
                  </button>
                ))}
              </div>
            </aside>
            <section className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{FILE_LABELS[selectedFile] || selectedFile}</h2>
                  <p className="text-sm text-slate-500">{selectedFile}</p>
                </div>
                <button type="button" onClick={() => saveFile(selectedFile, selectedFileValue)} disabled={saving || !selectedFileValue} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
                </button>
              </div>
              {selectedFileValue && <JsonEditor value={selectedFileValue} onChange={updateSelectedFile} label={FILE_LABELS[selectedFile] || selectedFile} />}
	            </section>
	          </div>
	        )}

        {tab === 'products' && productsContent && (
          <div className="space-y-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-amber-950">Products and categories save together</h2>
                  <p className="mt-1 text-sm text-amber-800">After editing products, featured status, images, or categories, click this button. Changes are not published until this save succeeds.</p>
                </div>
                <button type="button" onClick={() => saveFile('products.json', productsContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save products and categories
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-950">Products</h2>
                <button
                  type="button"
                  onClick={() => {
                    const id = `product-${Date.now()}`;
                    const product: Product = {
                      id,
                      name: 'New Product',
                      slug: `new-product-${Date.now()}`,
                      category: productsContent.categories[0]?.name || 'General',
                      shortDescription: '',
                      description: '',
                      specifications: {},
                      features: [],
                      images: [],
                      price: '',
                      inStock: true,
                      featured: false,
                    };
                    updateProducts({ ...productsContent, products: [...productsContent.products, product] });
                    setSelectedProductId(id);
                  }}
                  className="rounded-lg bg-slate-900 p-2 text-white"
                  title="Add product"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[70vh] space-y-2 overflow-auto pr-1">
                {productsContent.products.map((product) => (
                  <button key={product.id} onClick={() => setSelectedProductId(product.id)} className={`block w-full rounded-lg border px-3 py-3 text-left ${selectedProduct?.id === product.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-sm font-medium text-slate-900">{product.name}</span>
                      {product.featured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
	                <div>
	                  <h2 className="text-xl font-bold text-slate-950">Product Editor</h2>
	                  <p className="text-sm text-slate-500">Featured products appear on the homepage.</p>
	                </div>
	                <button type="button" onClick={() => saveFile('products.json', productsContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
	                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save all
	                </button>
              </div>

              {selectedProduct && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">Name<input value={selectedProduct.name} onChange={(event) => updateProduct(selectedProduct.id, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="block text-sm font-medium text-slate-700">Slug<input value={selectedProduct.slug} onChange={(event) => updateProduct(selectedProduct.id, { slug: slugify(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="block text-sm font-medium text-slate-700">Category<select value={selectedProduct.category} onChange={(event) => updateProduct(selectedProduct.id, { category: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">{productsContent.categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">Short description<textarea value={selectedProduct.shortDescription} onChange={(event) => updateProduct(selectedProduct.id, { shortDescription: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                  <label className="block text-sm font-medium text-slate-700">Full description<textarea value={selectedProduct.description} onChange={(event) => updateProduct(selectedProduct.id, { description: event.target.value })} rows={5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>

                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={Boolean(selectedProduct.featured)} onChange={(event) => updateProduct(selectedProduct.id, { featured: event.target.checked })} /> Featured on homepage</label>
                  </div>

	                  <div className="space-y-4">
                      {selectedProduct.images.map((image, index) => (
                        <MediaField
                          key={index}
                          label={`Product image/video ${index + 1}`}
                          value={image}
                          media={media}
	                          uploading={uploading}
	                          onUpload={uploadFile}
	                          onChange={(value) => updateProductsFromCurrent((current) => ({ ...current, products: current.products.map((product) => product.id === selectedProduct.id ? { ...product, images: product.images.map((item, itemIndex) => itemIndex === index ? value : item) } : product) }))}
                            onRemove={() => updateProductsFromCurrent((current) => ({ ...current, products: current.products.map((product) => product.id === selectedProduct.id ? { ...product, images: product.images.filter((_, itemIndex) => itemIndex !== index) } : product) }))}
                            onDeleteMedia={deleteMediaItem}
                            deletingMediaUrl={deletingMediaUrl}
                            getUsageCount={(url) => findMediaUsages(content, url).length}
	                        />
                      ))}
                      <button type="button" onClick={() => updateProductsFromCurrent((current) => ({ ...current, products: current.products.map((product) => product.id === selectedProduct.id ? { ...product, images: [...product.images, ''] } : product) }))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"><Plus className="h-4 w-4" /> Add another image/video</button>
                    </div>

	                  <div className="grid gap-4">
	                    <KeyValueEditor key={`specifications-${selectedProduct.id}`} title="Specifications" keyLabel="Specification" valueLabel="Value" items={selectedProduct.specifications} onChange={(specifications) => updateProduct(selectedProduct.id, { specifications })} />
	                    <TextListEditor title="Features" items={selectedProduct.features} onChange={(features) => updateProduct(selectedProduct.id, { features })} addLabel="Add feature" />
	                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
                    <button type="button" onClick={() => {
                      const duplicated = { ...clone(selectedProduct), id: `${selectedProduct.id}-copy-${Date.now()}`, name: `${selectedProduct.name} Copy`, slug: `${selectedProduct.slug}-copy-${Date.now()}` };
                      updateProducts({ ...productsContent, products: [...productsContent.products, duplicated] });
                      setSelectedProductId(duplicated.id);
                    }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"><Copy className="h-4 w-4" /> Duplicate</button>
                    <button type="button" onClick={() => {
                      const remaining = productsContent.products.filter((product) => product.id !== selectedProduct.id);
                      updateProducts({ ...productsContent, products: remaining });
                      setSelectedProductId(remaining[0]?.id || '');
                    }} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete product</button>
                  </div>

	                </div>
	              )}
	            </section>
	          </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Categories</h2>
                  <p className="text-sm text-slate-500">These control the product filter buttons and product category dropdown.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateProducts({ ...productsContent, categories: [...productsContent.categories, emptyCategory(productsContent.categories.length)] })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                    <Plus className="h-4 w-4" /> Add category
                  </button>
                  <button type="button" onClick={() => saveFile('products.json', productsContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save categories
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {productsContent.categories.map((category, index) => (
                  <div key={category.id || index} className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[1fr_1fr_1.5fr_auto]">
                    <label className="block text-sm font-medium text-slate-700">
                      Name
                      <input value={category.name} onChange={(event) => updateProducts({
                        ...productsContent,
                        categories: productsContent.categories.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item),
                      })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Slug
                      <input value={category.slug} onChange={(event) => updateProducts({
                        ...productsContent,
                        categories: productsContent.categories.map((item, itemIndex) => itemIndex === index ? { ...item, slug: slugify(event.target.value) } : item),
                      })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Description
                      <input value={category.description} onChange={(event) => updateProducts({
                        ...productsContent,
                        categories: productsContent.categories.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item),
                      })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                    <div className="flex items-end">
                      <button type="button" onClick={() => updateProducts({
                        ...productsContent,
                        categories: productsContent.categories.filter((_, itemIndex) => itemIndex !== index),
                      })} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'services' && servicesContent && (
          <div className="space-y-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-amber-950">Services save together</h2>
                  <p className="mt-1 text-sm text-amber-800">Edit service cards, service detail sections, capabilities, facility carousel photos, and highlights here. Click save after changing anything.</p>
                </div>
                <button type="button" onClick={saveServicesContent} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save services
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-slate-950">Service Cards</h2>
                  <button type="button" onClick={() => {
                    const service = emptyService(servicesContent.services.length);
                    updateServicesFromCurrent((current) => ({ ...current, services: [...current.services, service] }));
                    setSelectedServiceId(service.id);
                  }} className="rounded-lg bg-slate-900 p-2 text-white" title="Add service">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {servicesContent.services.map((service) => (
                    <button key={service.id} type="button" onClick={() => setSelectedServiceId(service.id)} className={`block w-full rounded-lg border px-3 py-3 text-left ${selectedService?.id === service.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <span className="line-clamp-1 text-sm font-medium text-slate-900">{service.name}</span>
                      <p className="mt-1 text-xs text-slate-500">/{service.slug}</p>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="rounded-xl border border-slate-200 bg-white p-5">
                {selectedService && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-950">Edit Service</h2>
                        <p className="text-sm text-slate-500">This controls the homepage service card and the services page section.</p>
                      </div>
                      <button type="button" onClick={saveServicesContent} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save service
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block text-sm font-medium text-slate-700">Name<input value={selectedService.name} onChange={(event) => updateService(selectedService.id, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                      <label className="block text-sm font-medium text-slate-700">Slug<input value={selectedService.slug} onChange={(event) => updateService(selectedService.id, { slug: slugify(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    </div>
                    <label className="block text-sm font-medium text-slate-700">Short description<textarea value={selectedService.shortDescription} onChange={(event) => updateService(selectedService.id, { shortDescription: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="block text-sm font-medium text-slate-700">Full description<textarea value={selectedService.description} onChange={(event) => updateService(selectedService.id, { description: event.target.value })} rows={5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>

	                    <div className="grid gap-4 md:grid-cols-2">
	                      <ProcessEditor title="Machining Facilities" items={selectedService['Machining Facilities'] ?? selectedService.processes ?? []} onChange={(items) => updateService(selectedService.id, { 'Machining Facilities': items })} />
	                      <TextListEditor title="Capabilities" items={selectedService.capabilities ?? []} onChange={(capabilities) => updateService(selectedService.id, { capabilities })} addLabel="Add capability" />
	                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
                      <button type="button" onClick={() => {
                        const duplicated = { ...clone(selectedService), id: `${selectedService.id}-copy-${Date.now()}`, name: `${selectedService.name} Copy`, slug: `${selectedService.slug}-copy-${Date.now()}` };
                        updateServicesFromCurrent((current) => ({ ...current, services: [...current.services, duplicated] }));
                        setSelectedServiceId(duplicated.id);
                      }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"><Copy className="h-4 w-4" /> Duplicate</button>
                      <button type="button" onClick={() => {
                        const remaining = servicesContent.services.filter((service) => service.id !== selectedService.id);
                        updateServicesFromCurrent((current) => ({ ...current, services: current.services.filter((service) => service.id !== selectedService.id) }));
                        setSelectedServiceId(remaining[0]?.id || '');
                      }} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete service</button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Facility Section</h2>
                  <p className="text-sm text-slate-500">Controls the facility carousel, highlights, and facility text on the services page.</p>
                </div>
                <button type="button" onClick={saveServicesContent} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save facility
                </button>
              </div>
              <label className="block text-sm font-medium text-slate-700">Facility description<textarea value={servicesContent.facility.description} onChange={(event) => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, description: event.target.value } }))} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
	              <div className="mt-5 grid gap-4 lg:grid-cols-2">
	                <TextListEditor title="Highlights" items={servicesContent.facility.highlights} onChange={(highlights) => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, highlights } }))} addLabel="Add highlight" />
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-950">Carousel images/videos</h3>
                      <button type="button" onClick={() => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, images: [...current.facility.images, { src: '', alt: '', caption: '' }] } }))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                        <Plus className="h-4 w-4" /> Add slide
                      </button>
                    </div>
                    <div className="space-y-4">
                      {servicesContent.facility.images.map((image, index) => (
                        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-3 flex justify-end">
                            <button type="button" onClick={() => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, images: current.facility.images.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <MediaField label={`Slide ${index + 1} media`} value={image.src} media={media} uploading={uploading} onUpload={uploadFile} onChange={(src) => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, images: current.facility.images.map((item, itemIndex) => itemIndex === index ? { ...item, src } : item) } }))} onDeleteMedia={deleteMediaItem} deletingMediaUrl={deletingMediaUrl} getUsageCount={(url) => findMediaUsages(content, url).length} />
                          <label className="mt-3 block text-sm font-medium text-slate-700">Alt text<input value={image.alt} onChange={(event) => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, images: current.facility.images.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item) } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                          <label className="mt-3 block text-sm font-medium text-slate-700">Caption<input value={image.caption} onChange={(event) => updateServicesFromCurrent((current) => ({ ...current, facility: { ...current.facility, images: current.facility.images.map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item) } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                        </div>
                      ))}
                    </div>
                  </div>
	              </div>
            </section>
          </div>
        )}

        {tab === 'company' && companyContent && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Company, Contact, and Google Map</h2>
                <p className="text-sm text-slate-500">This controls footer details, contact page details, map embed/link, stats, mission, vision, and social links.</p>
              </div>
              <button type="button" onClick={() => saveFile('company.json', companyContent as unknown as JsonValue)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save company
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">Company name<input value={companyContent.name} onChange={(event) => updateCompany({ ...companyContent, name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-slate-700">Founded year<input value={companyContent.founded} onChange={(event) => updateCompany({ ...companyContent, founded: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">Tagline<input value={companyContent.tagline} onChange={(event) => updateCompany({ ...companyContent, tagline: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">Description<textarea value={companyContent.description} onChange={(event) => updateCompany({ ...companyContent, description: event.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-4 font-semibold text-slate-950">Contact Details</h3>
                <div className="space-y-3">
                  {Object.entries(companyContent.contact.address).map(([key, value]) => (
                    <label key={key} className="block text-sm font-medium capitalize text-slate-700">{key}<input value={value} onChange={(event) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, address: { ...companyContent.contact.address, [key]: event.target.value } } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                  ))}
	                  <TextListEditor title="Phone numbers" items={companyContent.contact.phone} onChange={(phone) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, phone } })} addLabel="Add phone" />
	                  <KeyValueEditor title="Email addresses" keyLabel="Department" valueLabel="Email" items={companyContent.contact.email} onChange={(email) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, email } })} />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-4 font-semibold text-slate-950">Google Map</h3>
                <label className="block text-sm font-medium text-slate-700">Google Maps embed URL or iframe<textarea value={companyContent.contact.googleMapsEmbed} onChange={(event) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, googleMapsEmbed: event.target.value } })} rows={5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                <label className="mt-4 block text-sm font-medium text-slate-700">Google Maps link<input value={companyContent.contact.googleMapsLink} onChange={(event) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, googleMapsLink: event.target.value } })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
	                <KeyValueEditor title="Working hours" keyLabel="Day" valueLabel="Hours" items={companyContent.contact.workingHours} onChange={(workingHours) => updateCompany({ ...companyContent, contact: { ...companyContent.contact, workingHours: workingHours as CompanyContent['contact']['workingHours'] } })} />
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
	              <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-950">Stats</h3>
                    <button type="button" onClick={() => updateCompany({ ...companyContent, about: { ...companyContent.about, stats: [...companyContent.about.stats, { value: '', label: '' }] } })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                      <Plus className="h-4 w-4" /> Add stat
                    </button>
                  </div>
                  <div className="space-y-3">
                    {companyContent.about.stats.map((stat, index) => (
                      <div key={index} className="grid gap-2 md:grid-cols-[1fr_1.5fr_auto]">
                        <input value={stat.value} onChange={(event) => updateCompany({ ...companyContent, about: { ...companyContent.about, stats: companyContent.about.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) } })} placeholder="Value" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <input value={stat.label} onChange={(event) => updateCompany({ ...companyContent, about: { ...companyContent.about, stats: companyContent.about.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) } })} placeholder="Label" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="button" onClick={() => updateCompany({ ...companyContent, about: { ...companyContent.about, stats: companyContent.about.stats.filter((_, itemIndex) => itemIndex !== index) } })} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
	              <ProcessEditor title="Values" items={companyContent.about.values.map((value) => ({ name: value.title, description: value.description }))} onChange={(values) => updateCompany({ ...companyContent, about: { ...companyContent.about, values: values.map((value) => ({ title: value.name, description: value.description })) } })} />
              <label className="block text-sm font-medium text-slate-700">Mission<textarea value={companyContent.about.mission} onChange={(event) => updateCompany({ ...companyContent, about: { ...companyContent.about, mission: event.target.value } })} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-slate-700">Vision<textarea value={companyContent.about.vision} onChange={(event) => updateCompany({ ...companyContent, about: { ...companyContent.about, vision: event.target.value } })} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
	              <KeyValueEditor title="Social links" keyLabel="Platform" valueLabel="URL" items={companyContent.social} onChange={(social) => updateCompany({ ...companyContent, social })} />
            </div>
          </section>
        )}

        {tab === 'uploads' && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Media Library</h2>
                <p className="text-sm text-slate-500">Images max 10MB. Videos max 50MB. Allowed: JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload media
                <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden" onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) await uploadFile(file);
                  event.target.value = '';
                }} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <div key={item.url} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex aspect-video items-center justify-center bg-slate-100">
                    {item.type === 'image' ? <img src={item.url} alt={item.name} className="h-full w-full object-cover" /> : item.type === 'video' ? <video src={item.url} className="h-full w-full object-cover" controls /> : <FileJson className="h-10 w-10 text-slate-400" />}
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      {item.type === 'video' ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                      <span className="line-clamp-1">{item.name}</span>
                    </div>
                    <p className="text-xs text-slate-500">{formatBytes(item.size)}</p>
                    {findMediaUsages(content, item.url).length > 0 && (
                      <p className="text-xs text-amber-700">Used in {findMediaUsages(content, item.url).length} field(s)</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => navigator.clipboard.writeText(item.url)} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">
                        <Check className="h-3 w-3" /> Copy URL
                      </button>
                      <button type="button" onClick={() => deleteMediaItem(item)} disabled={deletingMediaUrl === item.url} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">
                        {deletingMediaUrl === item.url ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
