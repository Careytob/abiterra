// app/admin/properties/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PropertyForm from '../../PropertyForm';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { image: true, feature: true },
  });

  if (!property) {
    notFound();
  }

  const initialData = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    location: property.location,
    price: property.price,
    type: property.type as 'SALE' | 'RENT',
    status: property.status as 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED',
    availability: property.availability ?? true,
    area: property.area ?? undefined,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    bq: property.bq,
    toilets: property.toilets,
    city: property.city,
    state: property.state,
    latitude: property.latitude ?? undefined,
    longitude: property.longitude ?? undefined,
    isfeatured: property.isfeatured ?? false,
    agentid: property.agentid,
    features: property.feature.map((f) => f.name),
    images: property.image.map((img) => ({
      id: img.id,
      url: img.url,
      filepath: img.filepath ?? '',
      imagetype: img.imagetype ?? 'other',
      ismain: img.ismain ?? false,
    })),
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit property</h1>
      <PropertyForm mode="edit" initialData={initialData} />
    </div>
  );
}
