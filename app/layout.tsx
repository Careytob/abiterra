import type { Metadata } from "next";
import {Roboto} from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./NavBar";


//import Roboto font
const roboto = Roboto({
  subsets : ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
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
  title: "Abiterra Real Estate Platform",
  description: "Your go-to platform for buying and renting properties.",
  keywords: ["real estate", "buy home", "buy land", "rent property"],
  openGraph: {
    title: "Abiterra Real Estate Platform",
    description: "The best place to find your next home.",
    url: "https://www.abiterra.com",
    images: [
      {
        url: "/images/hero-image.jpg",
        width: 800,
        height: 600,
        alt: "Real Estate Hero Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      > <NavBar/>
      <main>
      {children}
      </main>
        
      </body>
    </html>
  );
}
