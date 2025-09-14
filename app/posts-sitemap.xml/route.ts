import { getPublishedPosts } from '@/lib/actions/posts'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  try {
    const postsResult = await getPublishedPosts()
    
    if (!postsResult.success || !postsResult.data) {
      return new Response('Posts not found', { status: 404 })
    }

    const posts = postsResult.data

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts.map((post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${(post.updatedAt || post.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${post.featuredImageUrl ? `<image:image>
      <image:loc>${post.featuredImageUrl}</image:loc>
      <image:title>${post.title}</image:title>
      ${post.featuredImageAlt ? `<image:caption>${post.featuredImageAlt}</image:caption>` : ''}
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating posts sitemap:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
