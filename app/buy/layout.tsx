// app/buy/layout.tsx
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties for Sale | Abiterra - Find Your Dream Home',
  description: 'Browse a wide selection of verified properties for sale. Find houses, apartments, and land with Abiterra.',
  keywords: [
    'properties for sale Lagos',
    'houses for sale Nigeria',
    'apartments for sale Lagos',
    'buy property Lagos',
    'Lagos real estate market',
    'verified properties Nigeria',
    'luxury homes Lagos',
    'Abiterra properties',
    'real estate Lagos',
    'real estate Nigeria',
    'property listings Lagos',
    'buying property in Lagos',
    'real estate investment Lagos',
    'Lagos property market',
    'real estate listings Nigeria',
    'property for sale Nigeria',
    'real estate agents Lagos',
    'property investment Lagos',
    'Affordable homes',
    'Affordable apartments',
    'Luxury properties Lagos',
    'real estate agent in Nigeria',
    'real estate agent in Abuja'
  ],
  alternates: {
    canonical: 'https://abiterra.com/buy',
  },
  openGraph: {
    title: 'Properties for Sale | Abiterra',
    description: 'Browse verified properties for sale in Nigeria.',
    url: 'https://abiterra.com/buy',
    images: [
      {
        url: 'https://abiterra.com/og-image-buy.jpg',
        width: 1200,
        height: 630,
        alt: 'Properties for Sale on Abiterra',
      }
    ],
    type: 'website',
  },
};

export default function BuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}