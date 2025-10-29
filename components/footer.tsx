import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
    return (
        <footer className="border-t py-8">
        <div className="flex items-center justify-center mx-auto px-4 text-center gap-x-6">
        <p className="text-muted-foreground text-sm">© 2024 Edebiyat & Sinema. Tüm hakları saklıdır.</p>
        <ThemeToggle />
        <Link href="/">
            <Image 
              src="/logo.jpeg" 
              width={30} 
              height={30} 
              alt="logo" 
              className="rounded-full"
              quality={75}
              sizes="30px"
            />
        </Link>
        </div>
      </footer>
    )
  }
  