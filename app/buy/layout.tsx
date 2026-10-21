// app/buy/layout.tsx
import { type Metadata } from 'next';
import { siteConfig, absoluteUrl, inRegion } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Properties for Sale${inRegion()} | ${siteConfig.name}`,
  description: `Browse verified properties for sale${inRegion()}. Find houses, apartments and land on ${siteConfig.name}.`,
  alternates: {
    canonical: absoluteUrl('/buy'),
  },
  openGraph: {
    title: `Properties for Sale | ${siteConfig.name}`,
    description: `Browse verified properties for sale${inRegion()}.`,
    url: absoluteUrl('/buy'),
    images: [
      {
        url: absoluteUrl('/hero_image.webp'),
        width: 1200,
        height: 630,
        alt: `Properties for sale on ${siteConfig.name}`,
      },
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
