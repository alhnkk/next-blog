const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Website Schema
export const generateWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alihan Küçükkaya',
    description: 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Person',
      name: 'Alihan Küçükkaya',
      url: baseUrl,
    },
  }
}

// Organization Schema (Personal Blog)
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alihan Küçükkaya',
    url: baseUrl,
    description: 'Edebiyat, felsefe ve psikoloji alanlarında yazan blog yazarı',
    sameAs: [
      // Sosyal medya hesaplarınızı buraya ekleyebilirsiniz
      // 'https://twitter.com/jurnalize',
      // 'https://instagram.com/jurnalize',
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': baseUrl,
    },
  }
}

// Helper: Tarihi ISO string'e çevir (Date veya string kabul eder)
const toISOString = (date: Date | string): string => {
  if (typeof date === 'string') return new Date(date).toISOString();
  return date.toISOString();
};

// Article Schema (Blog Posts için)
export const generateArticleSchema = (post: {
  title: string
  excerpt?: string | null
  slug: string
  createdAt: Date | string
  updatedAt?: Date | string | null
  author: {
    name: string
    image?: string | null
  }
  category?: {
    name: string
    slug: string
  } | null
  featuredImageUrl?: string | null
}) => {
  const articleUrl = `${baseUrl}/blog/${post.slug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    url: articleUrl,
    datePublished: toISOString(post.createdAt),
    dateModified: toISOString(post.updatedAt || post.createdAt),
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: baseUrl,
      ...(post.author.image && { image: post.author.image }),
    },
    publisher: {
      '@type': 'Person',
      name: 'Alihan Küçükkaya',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    ...(post.featuredImageUrl && {
      image: {
        '@type': 'ImageObject',
        url: post.featuredImageUrl,
        width: 1200,
        height: 630,
      },
    }),
    ...(post.category && {
      articleSection: post.category.name,
      about: {
        '@type': 'Thing',
        name: post.category.name,
        url: `${baseUrl}/?category=${post.category.slug}`,
      },
    }),
  }
}

// BreadcrumbList Schema
export const generateBreadcrumbSchema = (items: Array<{
  name: string
  url: string
}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } 
}

// Blog Schema (Homepage için)
export const generateBlogSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Alihan Küçükkaya',
    description: 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: 'Alihan Küçükkaya',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Alihan Küçükkaya',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': baseUrl,
    },
  }
}
