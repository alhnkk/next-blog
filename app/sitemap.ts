import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/actions/posts'
import { getCategories } from '@/lib/actions/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Ana sayfalar
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Blog postları
  try {
    const postsResult = await getPublishedPosts()
    if (postsResult.success && postsResult.data) {
      const postUrls = postsResult.data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
      routes.push(...postUrls)
    }
  } catch (error) {
    console.error('Error generating post sitemaps:', error)
  }

  // Kategoriler
  try {
    const categoriesResult = await getCategories()
    if (categoriesResult.success && categoriesResult.data) {
      const categoryUrls = categoriesResult.data.map((category) => ({
        url: `${baseUrl}/?category=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
      routes.push(...categoryUrls)
    }
  } catch (error) {
    console.error('Error generating category sitemaps:', error)
  }

  return routes
}
