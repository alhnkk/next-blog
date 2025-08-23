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
      </body>
    </html>
  );
}
