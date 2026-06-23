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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`light ${anton.variable} ${hankenGrotesk.variable} ${spaceMono.variable}`} style={{ overflowX: 'clip' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-background font-body-md w-full selection:bg-primary-container selection:text-on-background cursor-none" style={{ overflowX: 'clip' }}>
        <InteractiveBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
