import "./globals.css";

export const metadata = {
  title: "Naman Gupta's Portfolio",
  description: "Creative by design, editor by craft, dev by choice.",
};

import InteractiveBackground from "@/components/InteractiveBackground";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" style={{ overflowX: 'clip' }}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Hanken+Grotesk:wght@400;500&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
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
