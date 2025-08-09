import type { Metadata } from "next";
import { Geist, Geist_Mono, Gugi } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/toast-provider";
import { WebVitals } from "@/components/web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gugi = Gugi({
  variable: "--font-gugi",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Codeer - Free Online Compiler & Code Editor | IDE for Programming",
  description: "Free online compiler and code editor for Python, JavaScript, Java, C++, C, Go, Rust and 50+ programming languages. Write, run, test and debug code instantly in your browser. Best free IDE for coding practice, algorithms, and programming projects.",
  keywords: [
    "free online compiler", "online code editor", "online IDE", "free compiler",
    "code online", "programming online", "codeer", "coder", "coding platform",
    "run code online", "execute code", "test code", "debug code", "code runner",
    "python compiler", "javascript editor", "java compiler", "c++ compiler",
    "coding practice", "programming practice", "algorithm practice", "leetcode alternative",
    "programming challenges", "code challenges", "coding interview prep",
    "web IDE", "browser IDE", "instant code execution", "code playground",
    "programming tutorial", "learn programming", "code examples", "programming help",
    "free programming tools", "developer tools", "coding tools", "programming IDE",
    "online development environment", "code collaboration", "pair programming"
  ],
  authors: [{ name: "Codeer Team" }],
  creator: "Codeer",
  publisher: "Codeer",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  openGraph: {
    title: "Codeer - Free Online Compiler & Code Editor | Programming IDE",
    description: "Free online compiler supporting 50+ programming languages. Write, run, and debug code instantly in your browser. Perfect for coding practice, algorithms, and programming projects.",
    url: "https://codeer.org",
    siteName: "Codeer",
    images: [
      {
        url: "/odeer3.png",
        width: 1200,
        height: 630,
        alt: "Codeer - Free Online Compiler and Code Editor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codeer - Free Online Compiler & Code Editor",
    description: "Free online compiler supporting 50+ programming languages. Write, run, and debug code instantly in your browser.",
    images: ["/odeer3.png"],
    creator: "@codeer_org",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/odeer3.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/odeer3.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/odeer3.png?v=2" },
      { url: "/odeer3.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black" style={{ background: 'black' }}>
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="author" content="Codeer Team" />
        <meta name="copyright" content="Codeer" />
        <meta name="application-name" content="Codeer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Codeer" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://codeer.org" />

        {/* Comprehensive favicon setup with cache busting */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/odeer3.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/odeer3.png?v=2" />
        <link rel="apple-touch-icon" href="/odeer3.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/odeer3.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Gugi&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Gugi&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <link rel="preload" href="/odeer3.png" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Register Service Worker for better caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Codeer",
              "alternateName": ["Free Online Compiler", "Online Code Editor", "Online IDE"],
              "url": "https://codeer.org",
              "description": "Free online compiler and code editor supporting 50+ programming languages including Python, JavaScript, Java, C++, C, Go, Rust. Write, run, test and debug code instantly in your browser.",
              "applicationCategory": "DeveloperApplication",
              "applicationSubCategory": "IDE",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Online Code Compilation",
                "Multi-language Support",
                "Real-time Code Execution",
                "Code Debugging",
                "Syntax Highlighting",
                "Auto-completion",
                "Code Sharing",
                "Programming Practice"
              ],
              "programmingLanguage": [
                "Python", "JavaScript", "Java", "C++", "C", "Go", "Rust",
                "TypeScript", "PHP", "Ruby", "Swift", "Kotlin", "C#"
              ],
              "creator": {
                "@type": "Organization",
                "name": "Codeer"
              },
              "sameAs": [
                "https://github.com/siddu-k/codeeride"
              ]
            })
          }}
        />

        {/* Additional Schema for Software Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Codeer - Free Online Compiler",
              "description": "Free online compiler and IDE for programming. Supports Python, JavaScript, Java, C++, and 50+ languages. Perfect for coding practice, algorithm solving, and programming education.",
              "url": "https://codeer.org",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1000"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gugi.variable} antialiased bg-black`}
        style={{ background: 'black' }}
      >
        <WebVitals />
        <AuthProvider>
          <ToastProvider>
            <Providers>
              {children}
            </Providers>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
