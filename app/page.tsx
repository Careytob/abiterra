// app/page.tsx
import Link from 'next/link';
import { siteConfig, formatPrice, formatArea, inRegion, absoluteUrl } from '@/lib/site-config';
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
        publishstatus: 'PUBLISHED',
      },
      select: {
        id: true,
        slug: true,
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
        image: {
          where: {
            OR: [
              { ismain: true },
              { filepath: { contains: 'front-1', mode: 'insensitive' } },
            ],
          },
          orderBy: [
            { ismain: 'desc' },
            { filepath: 'desc' },
          ],
          take: 1,
          select: {
            filepath: true, // Use filepath instead of url
          },
        },
      },
      orderBy: {
        createdat: 'desc',
      },
    });

    const formattedProperties = await Promise.all(
      saleProperties.map(async (property) => {
        let imageUrl = '/images/fallback.webp'; // Updated fallback

        if (property.image[0]?.filepath) {
          try {
            let cleanPath = property.image[0].filepath;
            // Ensure path is relative to bucket
            if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
            if (!cleanPath.startsWith('images/properties/')) {
              cleanPath = `images/properties/${cleanPath}`;
            }

            const { data, error } = await supabase.storage
              .from('properties')
              .createSignedUrl(cleanPath, 31536000);

            if (error) {
              console.warn(`[HomePage] Failed to generate signed URL for property ${property.id}: ${error.message}`);
            } else if (data?.signedUrl) {
              imageUrl = data.signedUrl;
            }
          } catch (err) {
            console.error(`[HomePage] Error processing image for property ${property.id}:`, err);
          }
        }

        return {
          id: property.id,
          slug: property.slug,
          type: 'For Sale',
          price: property.price,
          title: property.title,
          details: [
            `${property.bedrooms} Beds`,
            `${property.bathrooms} Baths`,
            ...(siteConfig.features.showToilets ? [`${property.toilets} Toilets`] : []),
            formatArea(property.area, 'N/A'),
            ...(siteConfig.features.showBQ && property.bq ? [`${property.bq} BQ`] : []),
          ].join(' • '),
          location: `${property.city}, ${property.state}`,
          image: imageUrl,
          propertyType: property.type,
        };
      })
    );

    return formattedProperties;
  } catch (error) {
    console.error('[HomePage] Error fetching properties:', error);
    return [];
  }
}

export const revalidate = 300; // 5 min, so a transient DB error or fresh seed doesn't stay cached for long

export const metadata = {
  title: `${siteConfig.name} - Properties for Sale${inRegion()}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} - Properties for Sale${inRegion()}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: absoluteUrl('/hero_image.webp'),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Properties for Sale${inRegion()}`,
    description: siteConfig.description,
    images: [absoluteUrl('/hero_image.webp')],
  },
};

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    ...(siteConfig.countryCode
      ? { address: { '@type': 'PostalAddress', addressCountry: siteConfig.countryCode } }
      : {}),
    ...(siteConfig.contact.phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.contact.phone,
            contactType: 'customer service',
            availableLanguage: 'English',
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
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
            <img
              src="/hero_image.webp"
              alt={`${siteConfig.name} featured property`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                {siteConfig.tagline}
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
                {siteConfig.features.rentals && (
                  <Link href="/rent" className="w-full sm:w-auto">
                    <button className="w-full border-2 border-white text-white hover:bg-white/10 rounded-xl py-3 px-6 text-lg transition-colors">
                      Browse Rentals
                    </button>
                  </Link>
                )}
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
                    <img
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                      href={`/buy/${property.slug}`}
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
                  description: 'Browse listings from trusted agents and owners',
                },
                {
                  icon: '✓',
                  title: 'Verified Listings',
                  description: 'Every listing is reviewed before it goes live',
                },
                {
                  icon: '💼',
                  title: 'Expert Support',
                  description: 'Enquire directly with the listing agent',
                },
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

        {/* For agents & owners */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-teal-700 rounded-2xl px-6 py-12 sm:px-12 text-white">
              <h2 className="text-3xl font-bold mb-3">Are you an agent or property owner?</h2>
              <p className="text-teal-50 text-lg mb-8 max-w-2xl">
                List your properties on {siteConfig.name} and receive enquiries directly. Every listing is
                reviewed by our team before it goes live.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[
                  { step: '1', title: 'Create an agent account', text: 'Sign up in a minute, no fees to get started.' },
                  { step: '2', title: 'Submit your listing', text: 'Add details and photos from your dashboard.' },
                  { step: '3', title: 'Get approved & get enquiries', text: 'Once approved, buyers contact you directly.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white text-teal-700 font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-teal-50 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/signup?type=agent">
                <button className="bg-white text-teal-700 hover:bg-teal-50 font-semibold rounded-xl py-3 px-6 transition-colors">
                  List Your Property
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}