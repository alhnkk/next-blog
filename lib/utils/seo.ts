import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const siteName = 'Jurnalize'
const siteDescription = 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.'

// Ana sayfa metadata
export const generateHomePageMetadata = (): Metadata => {
  return {
    title: 'Jurnalize - Kişisel Blog',
    description: siteDescription,
    keywords: ['blog', 'edebiyat', 'felsefe', 'psikoloji', 'günlük', 'yazı'],
    openGraph: {
      title: 'Jurnalize - Kişisel Blog',
      description: siteDescription,
      url: baseUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent('Jurnalize')}&description=${encodeURIComponent(siteDescription)}`,
          width: 1200,
          height: 630,
          alt: 'Jurnalize - Kişisel Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Jurnalize - Kişisel Blog',
      description: siteDescription,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent('Jurnalize')}&description=${encodeURIComponent(siteDescription)}`],
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

// Blog post metadata
export const generatePostMetadata = (post: {
  title: string
  excerpt?: string | null
  slug: string
  featuredImageUrl?: string | null
  author: {
    name: string
  }
  category?: {
    name: string
  } | null
  createdAt: Date
}): Metadata => {
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const description = post.excerpt || `${post.author.name} tarafından yazılan Jurnalize blog yazısı`
  const ogImage = post.featuredImageUrl || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(description)}`

  return {
    title: post.title,
    description,
    keywords: [post.category?.name || '', 'blog', 'yazı', post.author.name, 'Jurnalize'].filter(Boolean) as string[],
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName,
      locale: 'tr_TR',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name],
      section: post.category?.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      creator: '@alihankck',
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

// Kategori sayfası metadata
export const generateCategoryMetadata = (category: {
  name: string
  slug: string
  description?: string | null
}): Metadata => {
  const categoryUrl = `${baseUrl}/?category=${category.slug}`
  const description = category.description || `${category.name} kategorisindeki Jurnalize blog yazıları`

  return {
    title: `${category.name} Yazıları`,
    description,
    keywords: [category.name, 'kategori', 'blog', 'yazılar', 'Jurnalize'],
    openGraph: {
      title: `${category.name} Yazıları`,
      description,
      url: categoryUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${category.name} Yazıları`)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: `${category.name} Yazıları`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Yazıları`,
      description,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(`${category.name} Yazıları`)}&description=${encodeURIComponent(description)}`],
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

// Meta title'ı optimize et (60 karakter limiti)
export const optimizeTitle = (title: string, suffix = siteName): string => {
  const maxLength = 60 - suffix.length - 3 // " | " için 3 karakter
  if (title.length <= maxLength) {
    return `${title} | ${suffix}`
  }
  return `${title.substring(0, maxLength)}... | ${suffix}`
}

// Meta description'ı optimize et (160 karakter limiti)
export const optimizeDescription = (description: string): string => {
  if (description.length <= 160) {
    return description
  }
  return description.substring(0, 157) + '...'
}
