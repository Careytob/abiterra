import "@radix-ui/themes/styles.css";
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
  metadataBase: new URL("https://www.abiterra.com"),
  title: "Abiterra Real Estate Platform",
  description: "Your trusted platform for buying, renting, and investing in properties in Lagos, Nigeria.",
  keywords: [
    "real estate",
    "buy home",
    "buy land",
    "rent property",
    "Lagos real estate",
    "Nigeria property",
    "buying property in Lagos",
    "Lagos homes for sale",
    "rentals in Nigeria",
    "Lagos property investment"
  ],
  alternates: {
    canonical: "https://www.abiterra.com"
  },
  openGraph: {
    title: "Abiterra Real Estate Platform",
    description: "Find your dream home or investment property in Lagos, Nigeria.",
    url: "https://www.abiterra.com",
    type: "website",
    images: [
      {
        url: "/images/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lagos Real Estate - Abiterra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abiterra Real Estate Platform",
    description: "Find your dream home or investment property in Lagos, Nigeria.",
    images: ["/images/hero-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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