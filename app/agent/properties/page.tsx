// app/agent/properties/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/site-config';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import Spinner from '@/app/components/Spinner';

type AgentProperty = {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  publishstatus: string;
  rejectionreason: string | null;
  city: string;
  state: string;
  image: { id: string; url: string; ismain: boolean | null }[];
};


const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<AgentProperty[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/agent/properties');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load properties');
      setProperties(json.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/agent/properties/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete property');
      toast.success('Property deleted');
      setProperties((prev) => prev?.filter((p) => p.id !== id) ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">My listings</h1>
          <p className="text-sm text-zinc-500">
            New listings and edits to published ones are reviewed before they go live.
          </p>
        </div>
        <Link href="/agent/properties/new">
          <Button variant="teal">Add property</Button>
        </Link>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {!properties && !error && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {properties && properties.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center text-zinc-500">
          You haven&rsquo;t listed any properties yet.
        </div>
      )}

      {properties && properties.length > 0 && (
        <div className="space-y-3">
          {properties.map((property) => {
            const mainImage = property.image.find((i) => i.ismain) ?? property.image[0];
            return (
              <div key={property.id} className="flex items-start gap-4 rounded-lg border bg-white p-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                  {mainImage ? (
                    <Image src={mainImage.url} alt={property.title} fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-900">{property.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[property.publishstatus] || 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {property.publishstatus}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {property.type} · {formatPrice(property.price)} · {property.city}, {property.state}
                  </p>
                  {property.publishstatus === 'REJECTED' && property.rejectionreason && (
                    <p className="mt-1 text-sm text-red-600">Reason: {property.rejectionreason}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/agent/properties/${property.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === property.id}
                    onClick={() => handleDelete(property.id, property.title)}
                  >
                    {deletingId === property.id ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
