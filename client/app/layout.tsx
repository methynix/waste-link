import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/components/LanguageProvider";
import AuthProvider from "@/components/AuthProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--body",
  display: "swap",
});

const SITE_URL = "https://wastelink.methynix.com";
const SITE_DESCRIPTION =
  "WasteLink connects waste generators with collectors and recyclers across Tanzania. Request a waste pickup, sell recyclables, and get paid on your phone.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WasteLink — Taka ni mali | Waste collection & recycling in Tanzania",
    template: "%s | WasteLink",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "waste collection Tanzania",
    "recycling Tanzania",
    "taka",
    "ukusanyaji taka",
    "kuchakata taka",
    "waste pickup Dar es Salaam",
    "sell recyclables Tanzania",
    "WasteLink",
    "Methynix",
  ],
  authors: [{ name: "Methynix Software", url: "https://methynix.com" }],
  creator: "Methynix Software",
  publisher: "Methynix Software",
  manifest: "/manifest.json",
  applicationName: "WasteLink",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "WasteLink" },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "WasteLink",
    title: "WasteLink — Taka ni mali",
    description: SITE_DESCRIPTION,
    locale: "sw_TZ",
    alternateLocale: "en_US",
    images: [
      { url: "/icons/icon-512.png", width: 512, height: 512, alt: "WasteLink" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WasteLink — Taka ni mali",
    description: SITE_DESCRIPTION,
    images: ["/icons/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D47A1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
