// İlgili post önerileri için utility fonksiyonları

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  tags: string[]
  categoryId?: number | null
  createdAt: Date
  author: {
    name: string
  }
}

// İlgili postları bul
export const findRelatedPosts = (
  currentPost: Post,
  allPosts: Post[],
  limit: number = 3
): Post[] => {
  // Mevcut postu çıkar
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id)
  
  if (otherPosts.length === 0) return []
  
  // İlişki skorları hesapla
  const scoredPosts = otherPosts.map(post => ({
    post,
    score: calculateRelatednessScore(currentPost, post)
  }))
  
  // Skora göre sırala ve limit kadar al
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post)
}

// İki post arasındaki ilişki skorunu hesapla
const calculateRelatednessScore = (post1: Post, post2: Post): number => {
  let score = 0
  
  // Aynı kategori (40 puan)
  if (post1.categoryId && post2.categoryId && post1.categoryId === post2.categoryId) {
    score += 40
  }
  
  // Ortak taglar (tag başına 10 puan, max 30)
  const commonTags = post1.tags.filter(tag => post2.tags.includes(tag))
  score += Math.min(commonTags.length * 10, 30)
  
  // Aynı yazar (20 puan)
  if (post1.author.name === post2.author.name) {
    score += 20
  }
  
  // Tarih yakınlığı (max 10 puan)
  const daysDiff = Math.abs(
    (post1.createdAt.getTime() - post2.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysDiff <= 30) {
    score += Math.max(0, 10 - (daysDiff / 3))
  }
  
  // Başlık benzerliği (max 20 puan)
  const titleSimilarity = calculateTitleSimilarity(post1.title, post2.title)
  score += titleSimilarity * 20
  
  return Math.round(score)
}

// Başlık benzerliği hesapla (basit keyword matching)
const calculateTitleSimilarity = (title1: string, title2: string): number => {
  const words1 = title1.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  const words2 = title2.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  
  if (words1.length === 0 || words2.length === 0) return 0
  
  const commonWords = words1.filter(word => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length)
}

// Kategori bazlı öneriler
export const getPostsByCategory = (
  categoryId: number | null,
  allPosts: Post[],
  excludeId: number,
  limit: number = 5
): Post[] => {
  if (!categoryId) return []
  
  return allPosts
    .filter(post => post.categoryId === categoryId && post.id !== excludeId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

// Tag bazlı öneriler
export const getPostsByTags = (
  tags: string[],
  allPosts: Post[],
  excludeId: number,
  limit: number = 5
): Post[] => {
  if (tags.length === 0) return []
  
  const scoredPosts = allPosts
    .filter(post => post.id !== excludeId)
    .map(post => ({
      post,
      commonTags: post.tags.filter(tag => tags.includes(tag)).length
    }))
    .filter(item => item.commonTags > 0)
    .sort((a, b) => b.commonTags - a.commonTags)
  
  return scoredPosts.slice(0, limit).map(item => item.post)
}

