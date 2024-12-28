import Link from 'next/link';
import React from 'react'

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-10">
      {/* Hero Section */}
      <section className="bg-teal-800 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Reimagining Real Estate</h1>
          <p className="text-xl">Your trusted partner in finding the perfect property</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto text-gray-600">
            <p className="mb-6">
              Born from a vision to revolutionize the real estate experience, we set out to create a platform 
              that makes property transactions simpler, more transparent, and accessible to everyone.
            </p>
            <p className="mb-4">
              Our innovative approach combines cutting-edge technology with personalized service, ensuring 
              every client finds their ideal property - whether it's a first home, an investment in land, 
              or the perfect rental space.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-teal-800 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-teal-800 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Find Your Perfect Property?</h2>
          <p className="mb-8 text-gray-600 max-w-2xl mx-auto">
            Whether you're looking to buy, invest, or rent, we're here to help you every step of the way.
          </p>
          <Link  href="/contact" className="bg-teal-800 text-white py-3 px-8 rounded-md hover:bg-teal-900 transition duration-200 inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

const FEATURES = [
  {
    icon: "✓",
    title: "Verified Properties",
    description: "Every listing thoroughly vetted"
  },
  {
    icon: "⚡",
    title: "Fast Process",
    description: "Streamlined property transactions"
  },
  {
    icon: "💎",
    title: "Premium Service",
    description: "Personalized attention"
  },
  {
    icon: "🤝",
    title: "Trusted Partner",
    description: "Your interests come first"
  }
];

const VALUES = [
  {
    icon: "★",
    title: "Excellence",
    description: "We strive for excellence in every interaction and transaction"
  },
  {
    icon: "♥",
    title: "Trust",
    description: "Building lasting relationships through transparency and integrity"
  },
  {
    icon: "↗",
    title: "Innovation",
    description: "Continuously improving the real estate experience"
  }
];


export default AboutUsPage
