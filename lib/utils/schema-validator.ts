// Schema markup validation utility

interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  type: string;
}

// JSON-LD schema'yı validate et
export const validateSchema = (schema: any): SchemaValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let type = 'Unknown';

  try {
    // Temel JSON yapısı kontrolü
    if (!schema || typeof schema !== 'object') {
      errors.push('Schema must be a valid JSON object');
      return { isValid: false, errors, warnings, type };
    }

    // @context kontrolü
    if (!schema['@context']) {
      errors.push('Missing @context property');
    } else if (schema['@context'] !== 'https://schema.org') {
      warnings.push('Context should be https://schema.org for best compatibility');
    }

    // @type kontrolü
    if (!schema['@type']) {
      errors.push('Missing @type property');
    } else {
      type = schema['@type'];
    }

    // Schema tipine göre özel validasyonlar
    switch (schema['@type']) {
      case 'Article':
        validateArticleSchema(schema, errors, warnings);
        break;
      case 'WebSite':
        validateWebSiteSchema(schema, errors, warnings);
        break;
      case 'Organization':
        validateOrganizationSchema(schema, errors, warnings);
        break;
      case 'BreadcrumbList':
        validateBreadcrumbSchema(schema, errors, warnings);
        break;
      case 'Blog':
        validateBlogSchema(schema, errors, warnings);
        break;
      default:
        warnings.push(`Schema type ${schema['@type']} validation not implemented`);
    }

  } catch (error) {
    errors.push(`JSON parsing error: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    type
  };
};

// Article schema validation
const validateArticleSchema = (schema: any, errors: string[], warnings: string[]) => {
  // Zorunlu alanlar
  if (!schema.headline) {
    errors.push('Article: Missing headline property');
  } else if (schema.headline.length > 110) {
    warnings.push('Article: Headline should be under 110 characters');
  }

  if (!schema.description) {
    warnings.push('Article: Missing description property');
  } else if (schema.description.length > 160) {
    warnings.push('Article: Description should be under 160 characters');
  }

  if (!schema.author) {
    errors.push('Article: Missing author property');
  } else if (!schema.author.name) {
    errors.push('Article: Author must have a name');
  }

  if (!schema.publisher) {
    errors.push('Article: Missing publisher property');
  }

  if (!schema.datePublished) {
    errors.push('Article: Missing datePublished property');
  } else if (!isValidDate(schema.datePublished)) {
    errors.push('Article: Invalid datePublished format');
  }

  if (!schema.mainEntityOfPage) {
    warnings.push('Article: Missing mainEntityOfPage property');
  }

  // Resim kontrolü
  if (schema.image) {
    validateImageSchema(schema.image, errors, warnings, 'Article');
  } else {
    warnings.push('Article: Missing image property (recommended for rich results)');
  }
};

// WebSite schema validation
const validateWebSiteSchema = (schema: any, errors: string[], warnings: string[]) => {
  if (!schema.name) {
    errors.push('WebSite: Missing name property');
  }

  if (!schema.url) {
    errors.push('WebSite: Missing url property');
  } else if (!isValidURL(schema.url)) {
    errors.push('WebSite: Invalid URL format');
  }

  if (schema.potentialAction) {
    if (!schema.potentialAction.target) {
      errors.push('WebSite: SearchAction missing target');
    }
    if (!schema.potentialAction['query-input']) {
      errors.push('WebSite: SearchAction missing query-input');
    }
  }
};

// Organization schema validation
const validateOrganizationSchema = (schema: any, errors: string[], warnings: string[]) => {
  if (!schema.name) {
    errors.push('Organization: Missing name property');
  }

  if (!schema.url) {
    errors.push('Organization: Missing url property');
  } else if (!isValidURL(schema.url)) {
    errors.push('Organization: Invalid URL format');
  }

  if (schema.logo && !isValidURL(schema.logo.url)) {
    errors.push('Organization: Invalid logo URL');
  }

  if (schema.sameAs) {
    if (!Array.isArray(schema.sameAs)) {
      warnings.push('Organization: sameAs should be an array');
    } else {
      schema.sameAs.forEach((url: string, index: number) => {
        if (!isValidURL(url)) {
          errors.push(`Organization: Invalid sameAs URL at index ${index}`);
        }
      });
    }
  }
};

// Breadcrumb schema validation
const validateBreadcrumbSchema = (schema: any, errors: string[], warnings: string[]) => {
  if (!schema.itemListElement) {
    errors.push('BreadcrumbList: Missing itemListElement property');
    return;
  }

  if (!Array.isArray(schema.itemListElement)) {
    errors.push('BreadcrumbList: itemListElement must be an array');
    return;
  }

  schema.itemListElement.forEach((item: any, index: number) => {
    if (!item.position) {
      errors.push(`BreadcrumbList: Item ${index} missing position`);
    }
    if (!item.name) {
      errors.push(`BreadcrumbList: Item ${index} missing name`);
    }
    if (!item.item && index < schema.itemListElement.length - 1) {
      warnings.push(`BreadcrumbList: Item ${index} missing item URL (not required for last item)`);
    }
  });
};

// Blog schema validation
const validateBlogSchema = (schema: any, errors: string[], warnings: string[]) => {
  if (!schema.name) {
    errors.push('Blog: Missing name property');
  }

  if (!schema.description) {
    warnings.push('Blog: Missing description property');
  }

  if (!schema.url) {
    errors.push('Blog: Missing url property');
  } else if (!isValidURL(schema.url)) {
    errors.push('Blog: Invalid URL format');
  }

  if (!schema.author) {
    errors.push('Blog: Missing author property');
  }

  if (!schema.publisher) {
    errors.push('Blog: Missing publisher property');
  }
};

// Image schema validation
const validateImageSchema = (image: any, errors: string[], warnings: string[], context: string) => {
  if (typeof image === 'string') {
    if (!isValidURL(image)) {
      errors.push(`${context}: Invalid image URL`);
    }
  } else if (typeof image === 'object') {
    if (!image.url) {
      errors.push(`${context}: Image missing url property`);
    } else if (!isValidURL(image.url)) {
      errors.push(`${context}: Invalid image URL`);
    }

    if (image.width && (image.width < 696 || image.width > 1920)) {
      warnings.push(`${context}: Image width should be between 696-1920px for optimal display`);
    }

    if (image.height && (image.height < 362 || image.height > 1080)) {
      warnings.push(`${context}: Image height should be between 362-1080px for optimal display`);
    }
  }
};

// Helper functions
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Tüm sayfadaki schema'ları validate et
export const validatePageSchemas = (schemas: any[]): {
  overallValid: boolean;
  results: SchemaValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    warnings: number;
  };
} => {
  const results = schemas.map(schema => validateSchema(schema));
  
  const summary = {
    total: results.length,
    valid: results.filter(r => r.isValid).length,
    invalid: results.filter(r => !r.isValid).length,
    warnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
  };

  return {
    overallValid: summary.invalid === 0,
    results,
    summary
  };
};

// SEO schema önerileri
export const generateSchemaRecommendations = (schemas: any[]): string[] => {
  const recommendations: string[] = [];
  const schemaTypes = schemas.map(s => s['@type']).filter(Boolean);

  // Temel schema'lar eksik mi?
  if (!schemaTypes.includes('WebSite')) {
    recommendations.push('WebSite schema ekleyin (site arama özelliği için)');
  }

  if (!schemaTypes.includes('Organization')) {
    recommendations.push('Organization schema ekleyin (brand tanınırlığı için)');
  }

  // Blog sayfası için
  if (schemaTypes.includes('Article') && !schemaTypes.includes('BreadcrumbList')) {
    recommendations.push('BreadcrumbList schema ekleyin (navigasyon için)');
  }

  // İçerik sayfaları için
  if (schemaTypes.length === 0) {
    recommendations.push('En az bir schema markup ekleyin (SEO için kritik)');
  }

  return recommendations;
};
