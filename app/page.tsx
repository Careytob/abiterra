
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const StructureData = {
    '@context' : 'https://schema.org',
    '@type' : 'RealEstateAgent',
    '@name' : 'Abiterra',
    '@description' : 'Find your perfect property for sale or rent. Browse our exclusive collection of properties in prime locations.',
    'url' : 'https://abiterra.com',
    'address' : {
      '@type' : 'PostalAddress',
      'addressLocality' : 'Lagos',
      'addressRegion' : 'Lagos',
      'addressCountry' : 'Nigeria'
    },
    'openingHours' : 'Mo - Fr 09:00 - 18:00'
  };

  const featuredProperties = [
    {
      type: 'For Sale',
      price: '₦250,000,000',
      details: '3 Beds • 2 Baths • 1,800 sqft',
      location: 'Downtown Area',
      image: '/api/placeholder/400/300'
    },
    {
      type: 'For Rent',
      price: '₦7,500,00/yr',
      details: '2 Beds • 2 Baths • 1,200 sqft',
      location: 'West Side',
      image: '/api/placeholder/400/300'
    },
    {
      type: 'For Sale',
      price: '₦230,000,000',
      details: '4 Beds • 3 Baths • 2,400 sqft',
      location: 'Suburban Area',
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="min-h-screen">
        {/* Hero Section with Property Background */}
      <section className="relative h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Link href=''>
            <Image src='/hero_image.webp' alt="Luxury Property" width={1920} height={1080} className="w-full h-full object-cover"/>
          </Link>
          
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
                <button className="w-full bg-teal-600 text-white rounded-lg text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-teal-700">
                  Browse Properties for Sale
                </button>
              </Link>
              <Link href='/rent' className="w-full sm:w-auto">
                <button className="w-full bg-white text-blue-600 rounded-lg text-sm font-bold py-4 px-4 md:px-8 md:text-lg md:font-normal hover:bg-gray-100">
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
                <img src={property.image} alt="Property" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {property.type}
                    </span>
                    <span className="font-bold text-xl">{property.price}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{property.details}</p>
                  <p className="text-gray-500">{property.location}</p>
                  <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
                    View Details
                  </button>
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

      {/* Value Propositions */}
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400">Your trusted partner in finding the perfect property.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Properties</h3>
              <ul className="space-y-2">
                <li><Link href="/buy" className="text-gray-400 hover:text-white">Houses for Sale</Link></li>
                <li><Link href="/rent" className="text-gray-400 hover:text-white">Apartments for Rent</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">New Developments</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Featured Listings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@abiterra.com</li>
                <li>+234 806 019 8071</li>
                <li>Lagos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white">Instagram</a>
                <a href="https://facebook.com/yourpage"
                target="_blank" 
                rel="noopener noreferrer"  
                className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};