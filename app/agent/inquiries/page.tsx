// app/agent/inquiries/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '@/app/components/Spinner';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdat: string;
  property: { id: string; title: string; slug: string } | null;
};

export default function AgentInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  async function setStatus(id: string, status: 'PENDING' | 'CONTACTED') {
    try {
      const res = await fetch(`/api/agent/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not update the inquiry');
      setInquiries((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? prev);
      router.refresh(); // refresh the "new" count in the header
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the inquiry');
    }
  }

  useEffect(() => {
    fetch('/api/agent/inquiries')
      .then((res) => res.json().then((json) => ({ res, json })))
      .then(({ res, json }) => {
        if (!res.ok) throw new Error(json.error || 'Failed to load inquiries');
        setInquiries(json.inquiries);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load inquiries'));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Inquiries</h1>
        <p className="text-sm text-zinc-500">Messages from buyers about your listings.</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {!inquiries && !error && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {inquiries && inquiries.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center text-zinc-500">
          No inquiries yet.
        </div>
      )}

      {inquiries && inquiries.length > 0 && (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-lg border bg-white p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900">{inquiry.name}</p>
                  <p className="text-sm text-zinc-500">
                    {inquiry.email} · {inquiry.phone}
                  </p>
                  {inquiry.property && (
                    <Link
                      href={`/buy/${inquiry.property.slug}`}
                      target="_blank"
                      className="text-sm text-teal-600 hover:underline"
                    >
                      {inquiry.property.title}
                    </Link>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    inquiry.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : inquiry.status === 'CONTACTED'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {inquiry.status === 'PENDING' ? 'NEW' : inquiry.status}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{inquiry.message}</p>
              <p className="mt-2 text-xs text-zinc-400">{new Date(inquiry.createdat).toLocaleString()}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.property?.title ?? 'your enquiry'}`)}`}
                  className="rounded-md border px-3 py-1 text-zinc-700 hover:bg-zinc-50"
                >
                  Reply by email
                </a>
                <a href={`tel:${inquiry.phone}`} className="rounded-md border px-3 py-1 text-zinc-700 hover:bg-zinc-50">
                  Call
                </a>
                {inquiry.status !== 'CONTACTED' ? (
                  <button
                    onClick={() => setStatus(inquiry.id, 'CONTACTED')}
                    className="rounded-md bg-teal-600 px-3 py-1 text-white hover:bg-teal-700"
                  >
                    Mark as contacted
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(inquiry.id, 'PENDING')}
                    className="rounded-md px-3 py-1 text-zinc-500 hover:bg-zinc-50"
                  >
                    Mark as new
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
