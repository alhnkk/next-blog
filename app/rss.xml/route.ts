import { getPublishedPostsForRSS } from "@/lib/actions/posts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const postsResult = await getPublishedPostsForRSS();
    
    if (!postsResult.success || !postsResult.data) {
      return new NextResponse("Feed alınamadı", { status: 500 });
    }

    const posts = postsResult.data;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // RSS XML içeriği oluştur
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Jurnalize Blog</title>
    <description>Güncel teknoloji, yazılım geliştirme ve kişisel deneyimler hakkında makaleler</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>tr-TR</language>
    <copyright>© ${new Date().getFullYear()} Jurnalize Blog</copyright>
    <managingEditor>info@jurnalize.com (Jurnalize)</managingEditor>
    <webMaster>info@jurnalize.com (Jurnalize)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.jpeg</url>
      <title>Jurnalize Blog</title>
      <link>${baseUrl}</link>
      <description>Jurnalize Blog Logo</description>
      <width>144</width>
      <height>144</height>
    </image>
    
    ${posts.map((post) => {
      // İçeriği temizle ve kısalt
      const cleanContent = post.content 
        ? post.content
            .replace(/<[^>]*>/g, '') // HTML etiketlerini kaldır
            .replace(/&nbsp;/g, ' ') // Non-breaking space'leri temizle
            .trim()
            .substring(0, 500) + '...'
        : post.excerpt || 'İçerik mevcut değil.';

      // Kategori bilgisi
      const category = post.category ? `<category>${post.category.name}</category>` : '';
      
      // Tag'leri kategori olarak ekle
      const tags = post.tags && post.tags.length > 0 
        ? post.tags.map(tag => `<category>${tag}</category>`).join('\n    ')
        : '';

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || cleanContent}]]></description>
      <content:encoded><![CDATA[${post.content || post.excerpt || cleanContent}]]></content:encoded>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>info@jurnalize.com (${post.author.name})</author>
      ${category}
      ${tags}
      ${post.featuredImageUrl ? `<enclosure url="${post.featuredImageUrl}" type="image/jpeg"/>` : ''}
    </item>`;
    }).join('')}
    
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 saat cache
      },
    });
    
  } catch (error) {
    console.error('RSS Feed hatası:', error);
    return new NextResponse("RSS Feed oluşturulamadı", { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // RSS feed her zaman güncel olsun
