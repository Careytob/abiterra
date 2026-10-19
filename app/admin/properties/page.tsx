// app/admin/properties/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import Spinner from '@/app/components/Spinner';

type AdminProperty = {
  id: string;
  title: string;
  slug: string;
  price: number;
  type: string;
  status: string;
  publishstatus: string;
  rejectionreason: string | null;
  city: string;
  state: string;
  isfeatured: boolean;
  agent: { id: string; name: string; email: string } | null;
  image: { id: string; url: string; ismain: boolean | null }[];
};

const currency = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const TABS = ['All', 'Pending', 'Published', 'Rejected'] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/properties');
      if (!res.ok) throw new Error('Failed to load properties');
      const json = await res.json();
      setProperties(json.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pendingCount = useMemo(
    () => properties?.filter((p) => p.publishstatus === 'PENDING').length ?? 0,
    [properties]
  );

  const filtered = useMemo(() => {
    if (!properties) return null;
    if (tab === 'All') return properties;
    return properties.filter((p) => p.publishstatus === tab.toUpperCase());
  }, [properties, tab]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
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

  const handleModerate = async (id: string, action: 'approve' | 'reject') => {
    let rejectionreason: string | undefined;
    if (action === 'reject') {
      rejectionreason = prompt('Reason for rejecting this listing (shown to the agent):') || undefined;
      if (rejectionreason === undefined) return; // cancelled
    }
    setModeratingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionreason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update listing');
      toast.success(action === 'approve' ? 'Listing published' : 'Listing rejected');
      setProperties(
        (prev) =>
          prev?.map((p) =>
            p.id === id
              ? { ...p, publishstatus: json.property.publishstatus, rejectionreason: json.property.rejectionreason }
              : p
          ) ?? null
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setModeratingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Properties</h1>
          <p className="text-sm text-zinc-500">
            {properties ? `${properties.length} listing${properties.length === 1 ? '' : 's'}` : 'Loading…'}
            {pendingCount > 0 && <span className="ml-2 text-amber-600">· {pendingCount} awaiting review</span>}
          </p>
        </div>
        <Link href="/admin/properties/new">
          <Button variant="teal">Add property</Button>
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1 text-sm ${
              tab === t ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {t}
            {t === 'Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {!properties && !error && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {filtered && filtered.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center text-zinc-500">
          {tab === 'All' ? 'No properties yet. Click "Add property" to create the first listing.' : `No ${tab.toLowerCase()} listings.`}
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((property) => {
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
                    {property.isfeatured && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {property.type} · ₦{currency.format(property.price)} · {property.city}, {property.state}
                    {property.agent && <> · Listed by {property.agent.name}</>}
                  </p>
                  {property.publishstatus === 'REJECTED' && property.rejectionreason && (
                    <p className="mt-1 text-sm text-red-600">Reason: {property.rejectionreason}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  {property.publishstatus === 'PENDING' && (
                    <>
                      <Button
                        variant="teal"
                        size="sm"
                        disabled={moderatingId === property.id}
                        onClick={() => handleModerate(property.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={moderatingId === property.id}
                        onClick={() => handleModerate(property.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Link href={`/admin/properties/${property.id}/edit`}>
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
