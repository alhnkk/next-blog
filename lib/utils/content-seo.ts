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

