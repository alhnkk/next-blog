import Link from "next/link";


import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserNav from "@/components/user-nav";

const AdminNavbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between border-b">
      {/* Left */}
      <SidebarTrigger />
      {/* Right */}
      <div className="flex items-center gap-4">
        <Link href="/admin">Dashboard</Link>
        {/* THEME MENU */}
        <ThemeToggle />
        {/* USER MENU */}
        <UserNav />
      </div>
    </nav>
  );
};

export default AdminNavbar;
