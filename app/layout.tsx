import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: {
    default: "Jurnalize - Kişisel Blog",
    template: "%s | Jurnalize"
  },      
  description: "Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.",
  keywords: ["blog", "edebiyat", "felsefe", "psikoloji", "günlük"],
  authors: [{ name: "Jurnalize" }],
  creator: "Alihan Küçükkaya",
  publisher: "Alihan Küçükkaya",
  formatDetection: {    
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'Alihan Küçükkaya',
    title: 'Jurnalize - Kişisel Blog',
    description: 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.',
    images: [
      {
        url: '/api/og?title=Alihan%20Küçükkaya&description=Kişisel%20blogumda%20edebiyat%2C%20felsefe%2C%20psikoloji%20yazılarımı%20paylaşıyorum.',
        width: 1200,
        height: 630,
        alt: 'Alihan Küçükkaya - Kişisel Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alihan Küçükkaya - Kişisel Blog',
    description: 'Kişisel blogumda edebiyat, felsefe, psikoloji yazılarımı paylaşıyorum.',
    creator: '@alihankck',
    images: ['/api/og?title=Alihan%20Küçükkaya&description=Kişisel%20blogumda%20edebiyat%2C%20felsefe%2C%20psikoloji%20yazılarımı%20paylaşıyorum.'],
  },
  robots: { 
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preload" href="/logo.jpeg" as="image" type="image/jpeg" />
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <main>{children}</main>
            <Toaster />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
