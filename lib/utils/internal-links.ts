// İç link stratejisi için utility fonksiyonları

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  name: string;
  count: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
}

// İçerikteki tag ve kategori kelimelerini link haline getir
export const enhanceContentWithInternalLinks = (
  content: string,
  categories: Category[],
  popularTags: Tag[],
  relatedPosts: Post[],
  currentPostId: number
): string => {
  let enhancedContent = content;

  // Kategori linklerini ekle (sadece ilk geçişini link yap)
  const linkedCategories = new Set<string>();
  categories.forEach(category => {
    if (!linkedCategories.has(category.name.toLowerCase())) {
      const regex = new RegExp(`\\b${escapeRegExp(category.name)}\\b`, 'gi');
      const matches = enhancedContent.match(regex);
      
      if (matches && matches.length > 0) {
        // Sadece ilk geçişini linkle
        enhancedContent = enhancedContent.replace(regex, (match, offset) => {
          // Zaten link içinde mi kontrol et
          const beforeMatch = enhancedContent.substring(0, offset);
          const openLinks = (beforeMatch.match(/<a[^>]*>/g) || []).length;
          const closeLinks = (beforeMatch.match(/<\/a>/g) || []).length;
          
          if (openLinks > closeLinks) {
            return match; // Zaten bir link içinde
          }
          
          linkedCategories.add(category.name.toLowerCase());
          return `<a href="/?category=${category.slug}" class="internal-link font-medium text-primary hover:underline" title="${category.name} kategorisindeki yazılar">${match}</a>`;
        });
      }
    }
  });

  // Popüler tag linklerini ekle (en popüler 5 tag için)
  const linkedTags = new Set<string>();
  popularTags.slice(0, 5).forEach(tag => {
    if (!linkedTags.has(tag.name.toLowerCase())) {
      const regex = new RegExp(`\\b${escapeRegExp(tag.name)}\\b`, 'gi');
      const matches = enhancedContent.match(regex);
      
      if (matches && matches.length > 0) {
        enhancedContent = enhancedContent.replace(regex, (match, offset) => {
          const beforeMatch = enhancedContent.substring(0, offset);
          const openLinks = (beforeMatch.match(/<a[^>]*>/g) || []).length;
          const closeLinks = (beforeMatch.match(/<\/a>/g) || []).length;
          
          if (openLinks > closeLinks) {
            return match;
          }
          
          linkedTags.add(tag.name.toLowerCase());
          return `<a href="/?tag=${encodeURIComponent(tag.name)}" class="internal-link text-primary hover:underline" title="#${tag.name} etiketli yazılar">${match}</a>`;
        });
      }
    }
  });

  // İlgili post başlıklarını link haline getir
  const linkedPosts = new Set<number>();
  relatedPosts.forEach(post => {
    if (post.id !== currentPostId && !linkedPosts.has(post.id)) {
      const regex = new RegExp(`\\b${escapeRegExp(post.title)}\\b`, 'gi');
      const matches = enhancedContent.match(regex);
      
      if (matches && matches.length > 0) {
        enhancedContent = enhancedContent.replace(regex, (match, offset) => {
          const beforeMatch = enhancedContent.substring(0, offset);
          const openLinks = (beforeMatch.match(/<a[^>]*>/g) || []).length;
          const closeLinks = (beforeMatch.match(/<\/a>/g) || []).length;
          
          if (openLinks > closeLinks) {
            return match;
          }
          
          linkedPosts.add(post.id);
          return `<a href="/blog/${post.slug}" class="internal-link font-medium text-primary hover:underline" title="${post.title}">${match}</a>`;
        });
      }
    }
  });

  return enhancedContent;
};

// RegExp için güvenli escape
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// İçerikteki iç link yoğunluğunu analiz et
export const analyzeInternalLinkDensity = (content: string): {
  totalWords: number;
  internalLinks: number;
  density: number;
  isOptimal: boolean;
} => {
  // HTML taglarını temizle ve kelime sayısını hesapla
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;

  // İç linkleri say
  const internalLinkMatches = content.match(/<a[^>]*class="[^"]*internal-link[^"]*"[^>]*>/g) || [];
  const internalLinks = internalLinkMatches.length;

  // Yoğunluk hesapla (her 100 kelimede kaç link)
  const density = totalWords > 0 ? (internalLinks / totalWords) * 100 : 0;

  // Optimal yoğunluk: %1-3 arası (her 33-100 kelimede 1 link)
  const isOptimal = density >= 1 && density <= 3;

  return {
    totalWords,
    internalLinks,
    density: Math.round(density * 100) / 100,
    isOptimal
  };
};

// Anchor text çeşitliliğini kontrol et
export const analyzeAnchorTextVariety = (content: string): {
  anchorTexts: string[];
  uniqueTexts: number;
  duplicates: Record<string, number>;
  hasGoodVariety: boolean;
} => {
  const anchorMatches = content.match(/<a[^>]*class="[^"]*internal-link[^"]*"[^>]*>([^<]+)<\/a>/g) || [];
  const anchorTexts = anchorMatches.map(match => {
    const textMatch = match.match(/>([^<]+)</);
    return textMatch ? textMatch[1].trim() : '';
  }).filter(text => text.length > 0);

  const uniqueTexts = new Set(anchorTexts).size;
  
  // Tekrarlanan anchor text'leri say
  const duplicates: Record<string, number> = {};
  anchorTexts.forEach(text => {
    duplicates[text] = (duplicates[text] || 0) + 1;
  });

  // Sadece tekrarlayanları filtrele
  Object.keys(duplicates).forEach(key => {
    if (duplicates[key] === 1) {
      delete duplicates[key];
    }
  });

  // İyi çeşitlilik: tekrar eden anchor text sayısı toplam linklerin %30'undan az
  const duplicateCount = Object.values(duplicates).reduce((sum, count) => sum + count, 0);
  const hasGoodVariety = anchorTexts.length === 0 || (duplicateCount / anchorTexts.length) < 0.3;

  return {
    anchorTexts,
    uniqueTexts,
    duplicates,
    hasGoodVariety
  };
};

// Linklenebilir anahtar kelimeleri öner
export const suggestInternalLinkOpportunities = (
  content: string,
  categories: Category[],
  popularTags: Tag[],
  relatedPosts: Post[]
): {
  categoryOpportunities: Array<{ category: Category; mentions: number }>;
  tagOpportunities: Array<{ tag: Tag; mentions: number }>;
  postOpportunities: Array<{ post: Post; mentions: number }>;
} => {
  const cleanContent = content.toLowerCase();

  // Kategori fırsatları
  const categoryOpportunities = categories.map(category => ({
    category,
    mentions: (cleanContent.match(new RegExp(`\\b${escapeRegExp(category.name.toLowerCase())}\\b`, 'g')) || []).length
  })).filter(opp => opp.mentions > 0);

  // Tag fırsatları
  const tagOpportunities = popularTags.map(tag => ({
    tag,
    mentions: (cleanContent.match(new RegExp(`\\b${escapeRegExp(tag.name.toLowerCase())}\\b`, 'g')) || []).length
  })).filter(opp => opp.mentions > 0);

  // Post fırsatları
  const postOpportunities = relatedPosts.map(post => ({
    post,
    mentions: (cleanContent.match(new RegExp(`\\b${escapeRegExp(post.title.toLowerCase())}\\b`, 'g')) || []).length
  })).filter(opp => opp.mentions > 0);

  return {
    categoryOpportunities: categoryOpportunities.sort((a, b) => b.mentions - a.mentions),
    tagOpportunities: tagOpportunities.sort((a, b) => b.mentions - a.mentions),
    postOpportunities: postOpportunities.sort((a, b) => b.mentions - a.mentions)
  };
};
