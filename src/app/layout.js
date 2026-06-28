import "./globals.css";

export const metadata = {
  title: "Naman Gupta's Portfolio",
  description: "Creative by design, editor by craft, dev by choice.",
  openGraph: {
    title: "Naman Gupta's Portfolio",
    description: "Creative by design, editor by craft, dev by choice.",
    url: "https://iamnamang.in",
    siteName: "Naman Gupta's Portfolio",
    type: "website",
  }
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G69D0FR7FL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-G69D0FR7FL');
          \`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Asynchronous load for Material Symbols icon font to prevent render blocking */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        </noscript>
      </head>
      <body className="text-on-background font-body-md w-full selection:bg-primary-container selection:text-on-background cursor-none" style={{ overflowX: 'clip' }}>
        <Script id="material-icons-css" strategy="afterInteractive">
          {`
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
            document.head.appendChild(link);
          `}
        </Script>
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
