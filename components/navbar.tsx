import Image from "next/image";
import Link from "next/link";
import { Mail, Home } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";
import UserNav from "./user-nav";

const Navbar = async () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity duration-200"
          >
            <div className="relative flex-shrink-0">
              <Image
                src="/logo.jpeg"
                width={32}
                height={32}
                alt="Jurnalize"
                className="rounded-full ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-200"
                priority={true}
                quality={75}
                sizes="32px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight">Jurnalize</span>
              <span className="text-xs text-muted-foreground">Blog</span>
            </div>
          </Link>

         

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 group"
            >
              <Home className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>Ana Sayfa</span>
            </Link>
            
            <Link 
              href="/contact" 
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 group"
            >
              <Mail className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>İletişim</span>
            </Link>
          </nav>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
