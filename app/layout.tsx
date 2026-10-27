//app/layout.tsx
import "@radix-ui/themes/styles.css";
import { siteConfig, htmlLang, getMarketSettings } from "@/lib/site-config";
import { loadSiteConfig } from "@/lib/site-settings";
import SiteSettingsHydrator from "./components/SiteSettingsHydrator";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import { Theme } from "@radix-ui/themes";
import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";
import Footer from "./Footer";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/hero_image.webp",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/hero_image.webp"],
  },
  // Favicons come from app/icon.png and app/apple-icon.png (Next.js picks them up automatically).
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  await loadSiteConfig();

  return (
    <html lang={htmlLang()}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         
        <SiteSettingsHydrator settings={getMarketSettings()} />
        <AuthProvider>
          <Theme>
            <NavBar />
            <main className="flex-grow">
              {children}
              <Toaster position="top-center" richColors />
            </main>
            <Footer />
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}