import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Fatma Nur & Salih · Düğün Davetiyesi",
  description:
    "Özel günler birlikte güzel. Şahin ve Kavuşkan Ailelerinin mutlu gününe sizleri davet etmekten onur duyarız. 28 Haziran — 4 Temmuz 2026.",
  openGraph: {
    title: "Fatma Nur & Salih · Düğün Davetiyesi",
    description: "Özel günler birlikte güzel.",
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        {/* Pre-warm TCP+TLS to the Sketchfab CDN so the 3D rings iframe
            starts streaming as soon as it mounts. */}
        <link rel="preconnect" href="https://sketchfab.com" />
        <link
          rel="preconnect"
          href="https://static.sketchfab.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://media.sketchfab.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://sketchfab.com" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
