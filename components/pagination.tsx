import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: URLSearchParams;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // URL parametrelerini koruyarak sayfa linkini oluştur
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  };

  // Gösterilecek sayfa numaralarını hesapla
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 2; // Mevcut sayfanın her iki yanında gösterilecek sayfa sayısı

    // Her zaman ilk sayfayı göster
    pages.push(1);

    // İlk sayfa ile mevcut sayfa arasında boşluk varsa ellipsis ekle
    if (currentPage - delta > 2) {
      pages.push("ellipsis");
    }

    // Mevcut sayfanın çevresindeki sayfaları göster
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Mevcut sayfa ile son sayfa arasında boşluk varsa ellipsis ekle
    if (currentPage + delta < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Her zaman son sayfayı göster (eğer 1'den büyükse)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="Sayfalama navigasyonu"
    >
      {/* Önceki sayfa */}
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)} className="inline-flex">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Önceki sayfa</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
          <span className="sr-only">Önceki sayfa</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Sayfa numaraları */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Daha fazla sayfa</span>
            </div>
          );
        }

        const isCurrentPage = page === currentPage;

        return (
          <Link key={page} href={createPageUrl(page)} className="inline-flex">
            <Button
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 p-0 ${
                isCurrentPage
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {page}
            </Button>
          </Link>
        );
      })}

      {/* Sonraki sayfa */}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)} className="inline-flex">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Sonraki sayfa</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
          <span className="sr-only">Sonraki sayfa</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

// Sayfalama bilgi komponenti
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = "",
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {totalItems > 0 ? (
        <>
          <span className="font-medium">{startItem}</span> -{" "}
          <span className="font-medium">{endItem}</span> arası{" "}
          <span className="font-medium">{totalItems}</span> sonuçtan gösteriliyor
        </>
      ) : (
        "Sonuç bulunamadı"
      )}
    </div>
  );
}

// Mobil için basit sayfalama
interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: URLSearchParams;
  className?: string;
}

export function MobilePagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
  className = "",
}: MobilePaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Önceki */}
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Önceki
        </Button>
      )}

      {/* Sayfa bilgisi */}
      <span className="text-sm text-muted-foreground">
        Sayfa {currentPage} / {totalPages}
      </span>

      {/* Sonraki */}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
          Sonraki
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
