/**
 * Türkçe karakterleri destekleyen slug oluşturma fonksiyonu
 * @param text - Slug'a dönüştürülecek metin
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };

  return text
    .toLowerCase()
    // Türkçe karakterleri dönüştür
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (match) => turkishMap[match] || match)
    // Sadece harf, rakam, boşluk ve tire karakterlerini tut
    .replace(/[^a-z0-9\s-]/g, '')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Birden fazla tireyi tek tire yap
    .replace(/-+/g, '-')
    // Başındaki ve sonundaki tireleri temizle
    .replace(/^-+|-+$/g, '')
    .trim();
}

/**
 * Slug'ın geçerli olup olmadığını kontrol eder
 * @param slug - Kontrol edilecek slug
 * @returns Slug geçerli mi?
 */
export function isValidSlug(slug: string): boolean {
  // Slug sadece küçük harf, rakam ve tire içermeli
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && !slug.startsWith('-') && !slug.endsWith('-');
}