import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { Toaster } from "@/components/ui/toaster";

// ✅ OPTIMIZED: Font configuration with display swap and preload
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap', // Immediately use fallback, swap when loaded
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
        {/* ✅ OPTIMIZED: Viewport meta tags for better mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* ✅ OPTIMIZED: Critical CSS preload strategy */}
        <link rel="preload" href="/fonts/global.css" as="style" />
        
        {/* Critical resources preload */}
        <link rel="preload" href="/logo.jpeg" as="image" type="image/jpeg" fetchPriority="high" />
        
        {/* ✅ OPTIMIZED: Preconnect to critical third-party resources */}
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Feed alternates */}
        <link rel="alternate" type="application/rss+xml" title="Jurnalize Blog RSS Feed" href="/rss.xml" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        
        {/* Performance: Prefetch DNS for analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <link rel="dns-prefetch" href="//www.googletagmanager.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
          </>
        )}
        
        {/* Google Analytics 4 - Lazy loaded with optimal strategy */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
              async
            />
            <Script
              id="google-analytics-config"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true,
                    anonymize_ip: true
                  });
                `,
              }}
              strategy="afterInteractive"
            />
          </>
        )}
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
