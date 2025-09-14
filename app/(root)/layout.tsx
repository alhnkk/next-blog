import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
}
