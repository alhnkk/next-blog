import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Center Loading Spinner - tam ekran veya konteyner ortasında
interface CenterLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CenterLoading({ 
  message = "Yükleniyor...", 
  size = "md",
  className 
}: CenterLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="text-center">
        <Loader2 className={cn("animate-spin text-gray-400 mx-auto mb-2", sizeClasses[size])} />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}

// Inline Loading Spinner - küçük alanlar için
interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md";
  className?: string;
}

export function InlineLoading({ 
  message, 
  size = "sm",
  className 
}: InlineLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-gray-400", sizeClasses[size])} />
      {message && <span className="text-sm text-gray-500">{message}</span>}
    </div>
  );
}

// Button Loading Spinner - buton içinde kullanım için
interface ButtonLoadingProps {
  size?: "sm" | "md";
  className?: string;
}

export function ButtonLoading({ size = "sm", className }: ButtonLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5"
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

// Loading Card - kart/liste için loading state
interface LoadingCardProps {
  count?: number;
  className?: string;
}

export function LoadingCard({ count = 3, className }: LoadingCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Page Loading - sayfa yüklemesi için full-screen loading
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ 
  message = "Sayfa yükleniyor...",
  className 
}: PageLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center h-[calc(100vh-5rem)]", className)}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

// Table Loading - tablo verisi için
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableLoading({ rows = 5, columns = 4, className }: TableLoadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
