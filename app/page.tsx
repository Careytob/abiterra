import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

async function getFeaturedProperties() {
  try {
    const [saleProperties, rentProperties] = await Promise.all([
      prisma.property.findMany({
        take: 3,
        where: {
          availability: true,
          type: 'SALE'
        },
        include: {
          images: {
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.property.findMany({
        take: 3,
        where: {
          availability: true,
          type: 'RENT'
        },
        include: {
          images: {
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    const allProperties = [...saleProperties, ...rentProperties];
    
    return allProperties.map(property => ({
      id: property.id,
      type: property.type === 'SALE' ? 'For Sale' : 'For Rent',
      price: formatPrice(property.price, property.type),
      details: `${property.bedrooms} Beds • ${property.bathrooms} Baths • ${property.toilets} Toilets • ${property.area} sqft${property.bq ? ` • ${property.bq} BQ` : ''}`,
      location: `${property.city}, ${property.state}`,
      image: property.images[0]?.url || '/placeholder-property.jpg'
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

function formatPrice(price: number, type: string) {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const formattedPrice = formatter.format(price);
  return type === 'For Rent' ? `${formattedPrice}/yr` : formattedPrice;
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  const StructureData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@name': 'Abiterra',
    '@description': 'Find your perfect property for sale or rent. Browse our exclusive collection of properties in prime locations.',
    'url': 'https://abiterra.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Lagos',
      'addressRegion': 'Lagos',
      'addressCountry': 'Nigeria'
    },
    'openingHours': 'Mo - Fr 09:00 - 18:00'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section remains the same */}
      <section className="relative h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
        <Image src='/hero_image.webp' alt="Luxury Property" width={1920} height={1080} className="w-full h-full object-cover"/>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 h-full">
          <div className="flex flex-col justify-center h-full max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-2xl text-white mb-8">
              Discover exceptional properties for sale and rent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
              <Link href='/buy' className="w-full sm:w-auto">
                <button className="w-full bg-teal-600 text-white rounded-xl text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-teal-700">
                  Browse Properties for Sale
                </button>
              </Link>
              <Link href='/rent' className="w-full sm:w-auto">
                <button className="w-full bg-white text-teal-600 rounded-xl text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-gray-100">
                  View Rental Properties
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Image 
                  src={property.image} 
                  alt="Property" 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-teal-100 text-black px-3 py-1 rounded-full text-sm">
                      {property.type}
                    </span>
                    <span className="font-bold text-xl">{property.price}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{property.details}</p>
                  <p className="text-gray-500">{property.location}</p>
                  <Link href={`/buy/${property.id}`}>
                    <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200">
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Value Propositions section remains the same */}
     <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of verified properties for sale and rent</p>
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
    </div>
  );
}