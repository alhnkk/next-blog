/**
 * Tarih ile ilgili yardımcı fonksiyonlar
 */

/**
 * Tarihi "X dakika/saat/gün önce" formatında gösterir
 * @param date - Date objesi veya ISO string
 * @returns Formatlanmış tarih string'i
 */
export function formatTimeAgo(date: Date | string): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Az önce";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}dk önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours}s önce`;
  } else if (diffInDays < 30) {
    return `${diffInDays}g önce`;
  } else {
    // 30 günden eskiyse normal tarih formatı
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Tarihi tam format olarak gösterir
 * @param date - Date objesi veya ISO string
 * @returns Formatlanmış tarih string'i (örn: "15 Eylül 2024")
 */
export function formatFullDate(date: Date | string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Tarihi kısa format olarak gösterir
 * @param date - Date objesi veya ISO string
 * @returns Formatlanmış tarih string'i (örn: "15.09.2024")
 */
export function formatShortDate(date: Date | string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('tr-TR');
}

/**
 * Comment objesi için tip tanımı
 */
interface CommentWithDates {
  createdAt: Date | string;
  updatedAt: Date | string;
  replies?: CommentWithDates[];
  [key: string]: unknown;
}

/**
 * Normalize edilmiş comment tipi
 */
interface NormalizedComment {
  createdAt: string;
  updatedAt: string;
  replies: NormalizedComment[];
  [key: string]: unknown;
}

/**
 * Tarihi ISO string'e dönüştürür (recursive olarak comment objeleri için)
 * @param comment - Comment objesi
 * @returns Formatlanmış comment objesi
 */
export function normalizeCommentDates(comment: CommentWithDates): NormalizedComment {
  return {
    ...comment,
    createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
    updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
    replies: comment.replies?.map((reply) => normalizeCommentDates(reply)) || []
  };
}

/**
 * Metni belirtilen uzunlukta keser ve "..." ekler
 * @param text - Kesilecek metin
 * @param maxLength - Maksimum uzunluk
 * @returns Kesilmiş metin
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
