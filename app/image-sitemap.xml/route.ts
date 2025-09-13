import { getPosts } from '@/lib/actions/posts'

const baseUrl = 'https://jurnalize.com' // Replace with your actual domain

export async function GET() {
  const postsResult = await getPosts()
  const posts = postsResult.success ? postsResult.data : []

  const imageUrls = posts
    .filter(post => post.featuredImageUrl) // Only posts with featured images
    .map(post => ({
      url: post.featuredImageUrl,
      title: post.featuredImageAlt || post.title,
      caption: post.excerpt || post.title,
      location: `${baseUrl}/blog/${post.slug}`
    }))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.map(img => `  <url>
    <loc>${img.location}</loc>
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
