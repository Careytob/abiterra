// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import 'leaflet/dist/leaflet.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getFeaturedProperties() {
  try {
    const saleProperties = await prisma.property.findMany({
      take: 6,
      where: {
        availability: true,
        type: 'SALE',
      },
      select: {
        id: true,
        type: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        toilets: true,
        area: true,
        bq: true,
        city: true,
        state: true,
        title: true,
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return await Promise.all(
      saleProperties.map(async (property) => {
        let imageUrl = '/placeholder-property.jpg';
        if (property.images[0]?.url) {
          const { data, error } = await supabase.storage
            .from('properties')
            .createSignedUrl(property.images[0].url, 7200);
          if (!error && data?.signedUrl) {
            imageUrl = data.signedUrl;
          }
        }

        return {
          id: property.id,
          type: 'For Sale',
          price: property.price,
          title: property.title,
          details: `${property.bedrooms} Beds • ${property.bathrooms} Baths • ${property.toilets} Toilets • ${
            property.area !== null ? `${property.area} sqft` : 'NA'
          }${property.bq ? ` • ${property.bq} BQ` : ''}`,
          location: `${property.city}, ${property.state}`,
          image: imageUrl,
          propertyType: property.type,
        };
      })
    );
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
}

export const metadata = {
  title: 'Abiterra - Luxury Properties for Sale in Lagos, Nigeria',
  description: 'Discover luxury properties for sale in Lagos, Nigeria. Browse our curated collection of verified homes.',
  keywords: 'luxury properties, real estate Lagos, homes for sale Nigeria, Abiterra',
  alternates: {
    canonical: 'https://abiterra.com',
  },
  openGraph: {
    title: 'Abiterra - Luxury Properties for Sale in Lagos, Nigeria',
    description: 'Find your dream home with Abiterra. Explore exclusive properties for sale in Lagos, Nigeria.',
    url: 'https://abiterra.com',
    images: [
      {
        url: 'https://abiterra.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Abiterra Luxury Properties',
      },
    ],
    siteName: 'Abiterra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abiterra - Luxury Properties for Sale in Lagos, Nigeria',
    description: 'Find your dream home with Abiterra',
    images: ['https://abiterra.com/og-image.jpg'],
  },
};

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Abiterra',
    description: 'Find your perfect property for sale in Lagos, Nigeria',
    url: 'https://abiterra.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://abiterra.com/logo.png',
      width: 200,
      height: 60,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2341234567890',
      contactType: 'customer service',
      areaServed: 'NG',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://facebook.com/abiterra',
      'https://twitter.com/abiterra',
      'https://instagram.com/abiterra',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[600px]">
          <div className="absolute inset-0">
            <Image
              src="/hero_image.webp"
              alt="Luxury property in Lagos, Nigeria"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Find Your Dream Home
              </h1>
              <p className="text-xl sm:text-2xl text-white mb-8">
                Discover exceptional properties for sale
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/buy" className="w-full sm:w-auto">
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 px-6 text-lg transition-colors">
                    Browse Properties for Sale
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Featured Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <article key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-teal-100 text-black px-3 py-1 rounded-full text-sm">
                        {property.type}
                      </span>
                      <div className="font-bold text-xl">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-2">{property.details}</p>
                    <p className="text-gray-500 mb-4">{property.location}</p>
                    <Link 
                      href={`/buy/${property.id}`}
                      className="block text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/buy">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg transition-colors">
                  View All Properties
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🏠',
                  title: 'Wide Selection',
                  description: 'Thousands of verified properties for sale'
                },
                {
                  icon: '✓',
                  title: 'Verified Listings',
                  description: 'All properties are verified by our expert team'
                },
                {
                  icon: '💼',
                  title: 'Expert Support',
                  description: 'Professional guidance throughout your journey'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}