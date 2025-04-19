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
      take: 6, // Fetch 6 sale properties
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
        title: true, // Added for better alt text
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
          if (error || !data?.signedUrl) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Signed URL error for ${property.images[0].url}:`, error?.message);
            }
          } else {
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
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
}

export const metadata = {
  title: 'Abiterra - Luxury Properties for Sale in Lagos, Nigeria',
  description:
    'Discover luxury properties for sale in Lagos, Nigeria. Browse our curated collection of verified homes with expert support.',
  keywords: 'luxury properties, real estate Lagos, homes for sale Nigeria, Abiterra',
  openGraph: {
    title: 'Abiterra - Luxury Properties for Sale in Lagos, Nigeria',
    description:
      'Find your dream home with Abiterra. Explore exclusive properties for sale in Lagos, Nigeria.',
    url: 'https://www.abiterra.com',
    images: [
      {
        url: 'https://www.abiterra.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Abiterra Luxury Properties',
      },
    ],
  },
};

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Abiterra',
    description: 'Find your perfect property for sale in Lagos, Nigeria. Browse our exclusive collection of verified properties.',
    url: 'https://www.abiterra.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.abiterra.com/logo.png',
      width: 200,
      height: 60,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'Nigeria',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-123-456-7890',
      contactType: 'Customer Service',
    },
    openingHours: 'Mo-Fr 09:00-18:00',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen">
        <section className="relative h-[600px]">
          <div className="absolute inset-0">
            <Image
              src="/hero_image.webp"
              alt="Luxury property in Lagos, Nigeria"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
              unoptimized // Ensure hero image loads correctly
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 h-full">
            <div className="flex flex-col justify-center h-full max-w-2xl">
              <h1 className="text-6xl font-bold text-white mb-6">Find Your Dream Home</h1>
              <p className="text-2xl text-white mb-8">Discover exceptional properties for sale</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                <Link href="/buy" className="w-full sm:w-auto">
                  <button className="w-full bg-teal-600 text-white rounded-xl text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-teal-700">
                    Browse Properties for Sale
                  </button>
                </Link>
                {/*  
               { <Link href='/rent' className="w-full sm:w-auto">
                  <button className="w-full bg-white text-teal-600 rounded-xl text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-gray-100">
                    View Rental Properties
                  </button>
                </Link>
                } */}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Featured Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <Image
                    src={property.image}
                    alt={`${property.title} in ${property.location}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    unoptimized // Fix Supabase image loading
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-teal-100 text-black px-3 py-1 rounded-full text-sm">
                        {property.type}
                      </span>
                      <div className="font-bold text-xl flex items-center">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{property.details}</p>
                    <p className="text-gray-500">{property.location}</p>
                    <Link href={`/buy/${property.id}`}>
                      <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
                        View Property Details
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/buy">
                <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200">
                  View All Properties
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">Thousands of verified properties for sale</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                <p className="text-gray-600">All properties are verified by our expert team</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600">Professional guidance throughout your journey</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}