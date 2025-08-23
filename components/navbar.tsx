import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";
import UserNav from "./user-nav";


const Navbar = async () => {

  return (
    <div className="flex items-center justify-between max-w-7xl mx-auto my-6">
      {/* Navbar */}
      <Link href="/" className="flex items-center gap-x-1">
        <Image
          src="/logo.jpeg"
          width={24}
          height={24}
          alt="logo"
          className="rounded-full"
        />
        <span className="text-lg">Jurnalize</span>
      </Link>
      <nav className="flex items-center gap-x-3   ">
        <Link href="/">Ana Sayfa</Link>
        <Link href="/contact">İletişim</Link>
        <ThemeToggle />

        <UserNav />
      </nav>
    </div>
  );
};

export default Navbar;
