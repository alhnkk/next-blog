import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı - 404 | Jurnalize",
  description: "Aradığınız sayfa bulunamadı. Ana sayfaya dönebilir veya geri gidebilirsiniz.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 px-4">
        {/* 404 */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/80">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Sayfa Bulunamadı
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground">
          <Link href="/contact" className="text-primary hover:underline">
            İletişim
          </Link>
          {" "}sayfasından yardım alabilirsiniz.
        </p>
      </div>
    </div>
  );
}
