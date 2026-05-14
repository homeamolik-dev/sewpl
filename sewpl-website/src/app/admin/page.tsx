'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
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
type AdminTab = 'content' | 'products' | 'media';

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

type ProductsContent = {
  products: Product[];
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
  }[];
};

const FILE_LABELS: Record<string, string> = {
  'site-global.json': 'Global site settings',
  'home-content.json': 'Homepage',
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

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [content, setContent] = useState<ContentMap>({});
  const [selectedFile, setSelectedFile] = useState('home-content.json');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [tab, setTab] = useState<AdminTab>('content');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const productsContent = content['products.json'] as ProductsContent | undefined;
  const selectedProduct = productsContent?.products.find((product) => product.id === selectedProductId) ?? productsContent?.products[0];

  const selectedFileValue = content[selectedFile];
  const fileOptions = useMemo(() => files.filter((file) => file !== 'products.json'), [files]);

  async function loadAdminData() {
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    setFiles(data.files);
    setContent(data.content);
    const products = (data.content['products.json'] as ProductsContent | undefined)?.products ?? [];
    setSelectedProductId((current) => current || products[0]?.id || '');
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

    setStatus(`Saved ${FILE_LABELS[fileName] || fileName}`);
  }

  function updateSelectedFile(path: (string | number)[], value: JsonValue) {
    setContent((previous) => ({
      ...previous,
      [selectedFile]: setAtPath(previous[selectedFile], path, value),
    }));
  }

  function updateProducts(nextProductsContent: ProductsContent) {
    setContent((previous) => ({
      ...previous,
      'products.json': nextProductsContent as unknown as JsonValue,
    }));
  }

  function updateProduct(productId: string, patch: Partial<Product>) {
    if (!productsContent) return;
    updateProducts({
      ...productsContent,
      products: productsContent.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)),
    });
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
    if (attachToProductId && productsContent) {
      const product = productsContent.products.find((item) => item.id === attachToProductId);
      updateProduct(attachToProductId, { images: [...(product?.images ?? []), data.media.url] });
      setStatus('Uploaded and attached media. Save products to publish it.');
      return;
    }
    setStatus('Media uploaded');
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
            ['content', FileJson, 'Content'],
            ['products', Package, 'Products'],
            ['media', ImageIcon, 'Media'],
          ].map(([key, Icon, label]) => (
            <button key={String(key)} onClick={() => setTab(key as AdminTab)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === key ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
              <Icon className="h-4 w-4" /> {String(label)}
            </button>
          ))}
        </div>

        {tab === 'content' && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="space-y-1">
                {fileOptions.map((file) => (
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
                      price: 'Contact for Quote',
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
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save products
                </button>
              </div>

              {selectedProduct && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">Name<input value={selectedProduct.name} onChange={(event) => updateProduct(selectedProduct.id, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="block text-sm font-medium text-slate-700">Slug<input value={selectedProduct.slug} onChange={(event) => updateProduct(selectedProduct.id, { slug: slugify(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="block text-sm font-medium text-slate-700">Category<select value={selectedProduct.category} onChange={(event) => updateProduct(selectedProduct.id, { category: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">{productsContent.categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label>
                    <label className="block text-sm font-medium text-slate-700">Price<input value={selectedProduct.price} onChange={(event) => updateProduct(selectedProduct.id, { price: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">Short description<textarea value={selectedProduct.shortDescription} onChange={(event) => updateProduct(selectedProduct.id, { shortDescription: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                  <label className="block text-sm font-medium text-slate-700">Full description<textarea value={selectedProduct.description} onChange={(event) => updateProduct(selectedProduct.id, { description: event.target.value })} rows={5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>

                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={Boolean(selectedProduct.featured)} onChange={(event) => updateProduct(selectedProduct.id, { featured: event.target.checked })} /> Featured on homepage</label>
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={selectedProduct.inStock} onChange={(event) => updateProduct(selectedProduct.id, { inStock: event.target.checked })} /> In stock</label>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-950">Images and videos</h3>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                        <Upload className="h-4 w-4" /> Upload and attach
                        <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0], selectedProduct.id)} />
                      </label>
                    </div>
                    <div className="space-y-2">
                      {selectedProduct.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="flex gap-2">
                          <input value={image} onChange={(event) => updateProduct(selectedProduct.id, { images: selectedProduct.images.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                          <button type="button" onClick={() => updateProduct(selectedProduct.id, { images: selectedProduct.images.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => updateProduct(selectedProduct.id, { images: [...selectedProduct.images, ''] })} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"><Plus className="h-4 w-4" /> Add media URL</button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <JsonEditor label="Specifications" value={selectedProduct.specifications as unknown as JsonValue} onChange={(path, value) => updateProduct(selectedProduct.id, { specifications: setAtPath(selectedProduct.specifications as unknown as JsonValue, path, value) as Record<string, string> })} />
                    <JsonEditor label="Features" value={selectedProduct.features as unknown as JsonValue} onChange={(path, value) => updateProduct(selectedProduct.id, { features: setAtPath(selectedProduct.features as unknown as JsonValue, path, value) as string[] })} />
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

                  <div className="border-t border-slate-200 pt-5">
                    <JsonEditor
                      label="Product categories"
                      value={productsContent.categories as unknown as JsonValue}
                      onChange={(path, value) => updateProducts({
                        ...productsContent,
                        categories: setAtPath(productsContent.categories as unknown as JsonValue, path, value) as ProductsContent['categories'],
                      })}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'media' && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Media Library</h2>
                <p className="text-sm text-slate-500">Images max 10MB. Videos max 50MB. Allowed: JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload media
                <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0])} />
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
                    <button type="button" onClick={() => navigator.clipboard.writeText(item.url)} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">
                      <Check className="h-3 w-3" /> Copy URL
                    </button>
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
