import { Metadata } from 'next'
import { generateExcerpt } from './content-seo'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const siteName = 'Jurnalize'
const siteDescription = 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.'

// Ana sayfa metadata
export const generateHomePageMetadata = (): Metadata => {
  const optimizedDescription = optimizeDescription(siteDescription)
  
  return {
    title: 'Jurnalize - Kişisel Blog',
    description: optimizedDescription,
    keywords: ['blog', 'edebiyat', 'felsefe', 'psikoloji', 'günlük', 'yazı'],
    openGraph: {
      title: 'Jurnalize - Kişisel Blog',
      description: optimizedDescription,
      url: baseUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent('Jurnalize')}&description=${encodeURIComponent(optimizedDescription)}`,
          width: 1200,
          height: 630,
          alt: 'Jurnalize - Kişisel Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Jurnalize - Kişisel Blog',
      description: optimizedDescription,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent('Jurnalize')}&description=${encodeURIComponent(optimizedDescription)}`],
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
  content?: string | null
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
  
  // Title optimizasyonu (60 karakter limiti)
  const optimizedTitle = optimizeTitle(post.title)
  
  // Description optimizasyonu (160 karakter limiti)
  let description = post.excerpt
  if (!description && post.content) {
    // Eğer excerpt yoksa content'ten otomatik oluştur
    description = generateExcerpt(post.content, 160)
  }
  if (!description) {
    description = `${post.author.name} tarafından yazılan Jurnalize blog yazısı`
  }
  const optimizedDescription = optimizeDescription(description)
  
  const ogImage = post.featuredImageUrl || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(optimizedDescription)}`

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: [post.category?.name || '', 'blog', 'yazı', post.author.name, 'Jurnalize'].filter(Boolean) as string[],
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
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
      title: optimizedTitle,
      description: optimizedDescription,
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
  _count?: {
    posts: number
  }
}): Metadata => {
  const categoryUrl = `${baseUrl}/?category=${category.slug}`
  
  // SEO dostu description oluştur
  let description = category.description;
  if (!description) {
    const postCount = category._count?.posts || 0;
    if (postCount > 0) {
      description = `${category.name} kategorisinde ${postCount} adet blog yazısı. Jurnalize'da ${category.name.toLowerCase()} konusundaki makaleler ve düşünceler.`;
    } else {
      description = `${category.name} kategorisindeki Jurnalize blog yazıları. ${category.name.toLowerCase()} konusunda yazılan makaleler ve düşünceler.`;
    }
  }
  
  // Title ve description optimizasyonu
  const optimizedTitle = optimizeTitle(`${category.name} Yazıları`)
  const optimizedDescription = optimizeDescription(description)

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: [category.name, 'kategori', 'blog', 'yazılar', 'Jurnalize'],
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: categoryUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${category.name} Yazıları`)}&description=${encodeURIComponent(optimizedDescription)}`,
          width: 1200,
          height: 630,
          alt: `${category.name} Yazıları`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(`${category.name} Yazıları`)}&description=${encodeURIComponent(optimizedDescription)}`],
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

// Tag sayfası metadata
export const generateTagMetadata = (tag: string, postCount?: number): Metadata => {
  const tagUrl = `${baseUrl}/?tag=${encodeURIComponent(tag)}`
  const description = postCount 
    ? `${tag} etiketi ile ilgili ${postCount} gönderi. Jurnalize'da ${tag} konusundaki yazıları keşfedin.`
    : `${tag} etiketi ile ilgili yazılar. Jurnalize'da ${tag} konusundaki blog gönderilerini okuyun.`
  
  // Title ve description optimizasyonu
  const optimizedTitle = optimizeTitle(`${tag} Etiketli Yazılar`)
  const optimizedDescription = optimizeDescription(description)

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: [tag, 'etiket', 'blog', 'yazılar', 'Jurnalize'],
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: tagUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${tag} Etiketli Yazılar`)}&description=${encodeURIComponent(optimizedDescription)}`,
          width: 1200,
          height: 630,
          alt: `${tag} Etiketli Yazılar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(`${tag} Etiketli Yazılar`)}&description=${encodeURIComponent(optimizedDescription)}`],
    },
    alternates: {
      canonical: tagUrl,
    },
  }
}

// Arama sayfası metadata
export const generateSearchPageMetadata = (query: string, category?: string, tag?: string): Metadata => {
  let title = 'Arama'
  let description = 'Jurnalize blog\'unda arama yapın.'
  
  if (query) {
    title = `"${query}" Arama Sonuçları`
    description = `"${query}" için Jurnalize blog'unda arama sonuçları.`
    
    if (category) {
      description += ` ${category} kategorisinde filtre uygulandı.`
    }
    
    if (tag) {
      description += ` ${tag} etiketi ile sınırlandırıldı.`
    }
  }
  
  // Title ve description optimizasyonu
  const optimizedTitle = optimizeTitle(title)
  const optimizedDescription = optimizeDescription(description)
  
  const searchUrl = `${baseUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: ['arama', 'blog', 'ara', 'bul', 'Jurnalize', query].filter(Boolean) as string[],
    robots: {
      index: false, // Arama sayfalarını index'leme
      follow: true,
    },
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: searchUrl,
      siteName,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(optimizedDescription)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      creator: '@alihankck',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(optimizedDescription)}`],
    },
    alternates: {
      canonical: searchUrl,
    },
  }
}