import "./globals.css";

export const metadata = {
  title: "Naman Gupta's Portfolio",
  description: "Creative by design, editor by craft, dev by choice.",
  metadataBase: new URL("https://iamnamang.in"),
  openGraph: {
    title: "Naman Gupta's Portfolio",
    description: "Creative by design, editor by craft, dev by choice.",
    url: "https://iamnamang.in",
    siteName: "Naman Gupta's Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Gupta's Portfolio",
    description: "Creative by design, editor by craft, dev by choice.",
  },
};

import InteractiveBackground from "@/components/InteractiveBackground";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Anton, Hanken_Grotesk, Space_Mono } from 'next/font/google'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

import LenisProvider from "@/components/LenisProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`light ${anton.variable} ${hankenGrotesk.variable} ${spaceMono.variable}`} style={{ overflowX: 'clip' }}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G69D0FR7FL" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-G69D0FR7FL');
          `}
        </Script>

      </head>
      <body className="text-on-background font-body-md w-full selection:bg-primary-container selection:text-on-background cursor-none" style={{ overflowX: 'clip' }}>
        {/* Load Material Symbols asynchronously — single non-blocking load */}
        <Script id="material-icons-css" strategy="afterInteractive">
          {`
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
            document.head.appendChild(link);
          `}
        </Script>
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        </noscript>
        <LenisProvider>
          <InteractiveBackground />
          {children}
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
