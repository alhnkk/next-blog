// Content SEO analizi ve optimizasyon utilities

// Okuma süresini hesapla
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200 // Ortalama okuma hızı
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Word count hesapla
export const getWordCount = (content: string): number => {
  return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
}

// Excerpt oluştur (meta description için)
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  // HTML taglarını temizle
  const cleanContent = content.replace(/<[^>]*>/g, '').trim()
  
  if (cleanContent.length <= maxLength) {
    return cleanContent
  }
  
  // Son tam cümleyi bul
  const truncated = cleanContent.substring(0, maxLength)
  const lastSentence = truncated.lastIndexOf('.')
  
  if (lastSentence > maxLength * 0.7) {
    return cleanContent.substring(0, lastSentence + 1)
  }
  
  // Son kelimeyi bul
  const lastSpace = truncated.lastIndexOf(' ')
  return cleanContent.substring(0, lastSpace) + '...'
}

// Başlık yapısını analiz et (H1, H2, H3...)
export const analyzeHeadingStructure = (content: string) => {
  const headings = {
    h1: (content.match(/<h1[^>]*>/gi) || []).length,
    h2: (content.match(/<h2[^>]*>/gi) || []).length,
    h3: (content.match(/<h3[^>]*>/gi) || []).length,
    h4: (content.match(/<h4[^>]*>/gi) || []).length,
    h5: (content.match(/<h5[^>]*>/gi) || []).length,
    h6: (content.match(/<h6[^>]*>/gi) || []).length,
  }
  
  return {
    ...headings,
    total: Object.values(headings).reduce((sum, count) => sum + count, 0),
    hasH1: headings.h1 > 0,
    hasMultipleH1: headings.h1 > 1,
    hasHierarchy: headings.h2 > 0,
  }
}

// İç link analizi
export const analyzeInternalLinks = (content: string, baseUrl: string) => {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi
  const links: string[] = []
  let match
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1])
  }
  
  const internalLinks = links.filter(link => 
    link.startsWith('/') || link.startsWith(baseUrl)
  )
  
  const externalLinks = links.filter(link => 
    link.startsWith('http') && !link.startsWith(baseUrl)
  )
  
  return {
    total: links.length,
    internal: internalLinks.length,
    external: externalLinks.length,
    internalLinks,
    externalLinks,
  }
}

// Resim analizi
export const analyzeImages = (content: string) => {
  const imgRegex = /<img[^>]*>/gi
  const images = content.match(imgRegex) || []
  
  let withAlt = 0
  let withoutAlt = 0
  let withLazyLoading = 0
  
  images.forEach(img => {
    if (img.includes('alt=')) {
      withAlt++
    } else {
      withoutAlt++
    }
    
    if (img.includes('loading="lazy"')) {
      withLazyLoading++
    }
  })
  
  return {
    total: images.length,
    withAlt,
    withoutAlt,
    withLazyLoading,
    altCoverage: images.length > 0 ? (withAlt / images.length) * 100 : 100,
  }
}

// Keyword density analizi
export const analyzeKeywordDensity = (content: string, keyword: string) => {
  const cleanContent = content.replace(/<[^>]*>/g, '').toLowerCase()
  const words = cleanContent.split(/\s+/)
  const totalWords = words.length
  
  const keywordCount = cleanContent.split(keyword.toLowerCase()).length - 1
  const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
  
  return {
    keyword,
    count: keywordCount,
    density: Math.round(density * 100) / 100,
    totalWords,
    isOptimal: density >= 0.5 && density <= 3, // İdeal %0.5-3 arası
  }
}

// SEO score hesapla
export const calculateSEOScore = (
  title: string,
  content: string,
  excerpt?: string
) => {
  let score = 0
  const checks = []
  
  // Title kontrolü (50-60 karakter)
  if (title.length >= 30 && title.length <= 60) {
    score += 15
    checks.push({ name: 'Başlık uzunluğu', status: 'pass', points: 15 })
  } else {
    checks.push({ name: 'Başlık uzunluğu', status: 'fail', points: 0 })
  }
  
  // Meta description kontrolü
  if (excerpt && excerpt.length >= 120 && excerpt.length <= 160) {
    score += 15
    checks.push({ name: 'Meta açıklama', status: 'pass', points: 15 })
  } else {
    checks.push({ name: 'Meta açıklama', status: 'fail', points: 0 })
  }
  
  // İçerik uzunluğu (minimum 300 kelime)
  const wordCount = getWordCount(content)
  if (wordCount >= 300) {
    score += 20
    checks.push({ name: 'İçerik uzunluğu', status: 'pass', points: 20 })
  } else {
    checks.push({ name: 'İçerik uzunluğu', status: 'fail', points: 0 })
  }
  
  // Başlık yapısı
  const headings = analyzeHeadingStructure(content)
  if (headings.hasHierarchy && !headings.hasMultipleH1) {
    score += 15
    checks.push({ name: 'Başlık yapısı', status: 'pass', points: 15 })
  } else {
    checks.push({ name: 'Başlık yapısı', status: 'fail', points: 0 })
  }
  
  // Resim optimizasyonu
  const images = analyzeImages(content)
  if (images.total === 0 || images.altCoverage >= 80) {
    score += 10
    checks.push({ name: 'Resim optimizasyonu', status: 'pass', points: 10 })
  } else {
    checks.push({ name: 'Resim optimizasyonu', status: 'fail', points: 0 })
  }
  
  // İç linkler
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const links = analyzeInternalLinks(content, baseUrl)
  if (links.internal >= 1) {
    score += 10
    checks.push({ name: 'İç linkler', status: 'pass', points: 10 })
  } else {
    checks.push({ name: 'İç linkler', status: 'fail', points: 0 })
  }
  
  // Okuma süresi (2-15 dakika ideal)
  const readingTime = calculateReadingTime(content)
  if (readingTime >= 2 && readingTime <= 15) {
    score += 15
    checks.push({ name: 'Okuma süresi', status: 'pass', points: 15 })
  } else {
    checks.push({ name: 'Okuma süresi', status: 'fail', points: 0 })
  }
  
  return {
    score,
    maxScore: 100,
    percentage: Math.round((score / 100) * 100),
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    checks,
    recommendations: generateRecommendations(checks),
  }
}

// SEO önerileri oluştur
const generateRecommendations = (checks: { status: string; name: string; [key: string]: any }[]) => {
  const recommendations: string[] = []
  
  const failedChecks = checks.filter(check => check.status === 'fail')
  
  failedChecks.forEach(check => {
    switch (check.name) {
      case 'Başlık uzunluğu':
        recommendations.push('Başlığınızı 30-60 karakter arasında tutun')
        break
      case 'Meta açıklama':
        recommendations.push('Meta açıklamanızı 120-160 karakter arasında yazın')
        break
      case 'İçerik uzunluğu':
        recommendations.push('İçeriğinizi en az 300 kelime yapın')
        break
      case 'Başlık yapısı':
        recommendations.push('H2, H3 başlıkları kullanın ve tek H1 kullanın')
        break
      case 'Resim optimizasyonu':
        recommendations.push('Tüm resimlere alt text ekleyin')
        break
      case 'İç linkler':
        recommendations.push('İçeriğinizde en az 1 iç link kullanın')
        break
      case 'Okuma süresi':
        recommendations.push('İçeriğinizi 2-15 dakika arası okuma süresi için optimize edin')
        break
    }
  })
  
  return recommendations
}
