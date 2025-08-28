import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <main>
            <Navbar />
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
