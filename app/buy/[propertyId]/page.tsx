import prisma from '@/prisma/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'


interface Props {
  params: {propertyId: string}
}

const PropertyDetailPage = async ({params}: Props) => {
  const propertyId = parseInt(params.propertyId,10);
  if (isNaN(propertyId)) {
    notFound();
  }




  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(params.propertyId),
    },
    select: {
      images: true,
      title: true,
      description: true,
      location: true,
      features: {
        select: {
          name: true,
        },
      },
    },
  })
  if(!property) {
    notFound();
  }

  return (
    <div className='pt-20'>
      <h1>Property Detail</h1>
      {property.images.map((image) => (
        <Image key={image.id} src={image.url} alt={property.title} width={400} height={300} />
      ))}
      <p>{property.title}</p>
      <p>{property.description}</p>
      <p>{property.location}</p>
      {property.features && (
        property.features.length > 0 ? (
          <p>{property.features.map((feature) => feature.name).join(', ')}</p>
        ) : (
          <p>no features listed</p>
        )
      )}
    </div>
  )
}

export default PropertyDetailPage
