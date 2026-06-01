import type { ContentFileName } from './content-store';
import aboutContent from '@/data/about-content.json';
import company from '@/data/company.json';
import contactFormContent from '@/data/contact-form-content.json';
import contactPageContent from '@/data/contact-page-content.json';
import homeContent from '@/data/home-content.json';
import productsPageContent from '@/data/products-page-content.json';
import products from '@/data/products.json';
import servicesPageContent from '@/data/services-page-content.json';
import services from '@/data/services.json';
import siteGlobal from '@/data/site-global.json';

const schemas: Record<ContentFileName, unknown> = {
  'about-content.json': aboutContent,
  'company.json': company,
  'contact-form-content.json': contactFormContent,
  'contact-page-content.json': contactPageContent,
  'home-content.json': homeContent,
  'products-page-content.json': productsPageContent,
  'products.json': products,
  'services-page-content.json': servicesPageContent,
  'services.json': services,
  'site-global.json': siteGlobal,
};

function typeName(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isPrimitiveRecord(template: Record<string, unknown>) {
  const values = Object.values(template);
  return values.length > 0 && values.every((value) => !Array.isArray(value) && !isPlainObject(value));
}

function validateAgainstTemplate(value: unknown, template: unknown, path: string): string | null {
  const expectedType = typeName(template);
  const actualType = typeName(value);

  if (expectedType !== actualType) {
    return `${path} must be ${expectedType}, received ${actualType}`;
  }

  if (Array.isArray(template)) {
    if (template.length === 0 || !Array.isArray(value)) return null;
    const itemTemplate = template[0];
    for (let index = 0; index < value.length; index += 1) {
      const error = validateAgainstTemplate(value[index], itemTemplate, `${path}[${index}]`);
      if (error) return error;
    }
    return null;
  }

  if (!isPlainObject(template) || !isPlainObject(value)) {
    return null;
  }

  if (isPrimitiveRecord(template)) {
    const templateValue = Object.values(template)[0];
    for (const [key, item] of Object.entries(value)) {
      const error = validateAgainstTemplate(item, templateValue, `${path}.${key}`);
      if (error) return error;
    }
    return null;
  }

  for (const key of Object.keys(template)) {
    if (!(key in value)) {
      return `${path}.${key} is required`;
    }

    const error = validateAgainstTemplate(value[key], template[key], `${path}.${key}`);
    if (error) return error;
  }

  return null;
}

export function validateContentValue(fileName: ContentFileName, value: unknown) {
  return validateAgainstTemplate(value, schemas[fileName], fileName);
}
