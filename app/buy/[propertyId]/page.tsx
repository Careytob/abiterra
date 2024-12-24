import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone } from 'lucide-react';
import { ContactDialog } from './ContactDialog';

interface Props {
  params: { propertyId: string };
}

const PropertyDetailPage = async ({ params }: Props) => {
  // Await params before using its properties
  const { propertyId } = await params; // This should be awaited

  // Parse and validate propertyId
  const parsedPropertyId = parseInt(propertyId, 10);
  if (isNaN(parsedPropertyId) || parsedPropertyId < 1) {
    notFound(); // Redirect to 404 if invalid
  }

  // Fetch property details
  const property = await prisma.property.findUnique({
    where: { id: parsedPropertyId },
    select: {
      id: true,
      images: true,
      title: true,
      description: true,
      location: true,
      features: { select: { name: true } },
    },
  });

  if (!property) {
    notFound(); // Redirect to 404 if property not found
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Main Image */}
      <div className="relative h-96 w-full">
        {property.images[0] && (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <p className="text-lg">{property.location}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.images.slice(1).map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={property.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              {property.features && property.features.length > 0 ? (
                <div className="space-y-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No features listed</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Dialog */}
          <ContactDialog propertyId={property.id.toString()} />

          {/* Quick Contact */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">agent@example.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
