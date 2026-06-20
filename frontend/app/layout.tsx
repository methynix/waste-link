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

export const metadata: Metadata = {
  title: "Mali — Taka ni mali",
  description:
    "Request a waste pickup, sell recyclables, and get paid on your phone. Tanzania.",
  manifest: "/manifest.json",
  applicationName: "Mali",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mali" },
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
