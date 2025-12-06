import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import UserNav from "@/components/user-nav";
import { Footer } from "@/components/footer";

// Blog detay sayfası için transparan navbar
const TransparentNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-8 lg:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity duration-200"
          >
            <span className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
              jurnalize
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 font-medium text-white/90 hover:text-white transition-colors duration-200 group drop-shadow-md"
              >
                <span>Ana Sayfa</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-2 font-medium text-white/90 hover:text-white transition-colors duration-200 group drop-shadow-md"
              >
                <span>İletişim</span>
              </Link>
            </nav>
            <div className="[&_button]:text-white [&_button]:hover:bg-white/10">
              <ThemeToggle />
            </div>
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TransparentNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

