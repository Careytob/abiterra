// app/admin/inquiries/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
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

type PropertyOption = { id: string; title: string };

const STATUSES = ['PENDING', 'REVIEWED', 'CONTACTED'];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [error, setError] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [logging, setLogging] = useState(false);
  const [form, setForm] = useState({ propertyId: '', name: '', email: '', phone: '', message: '' });

  const load = async () => {
    try {
      const [inqRes, propRes] = await Promise.all([
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/properties'),
      ]);
      const inqJson = await inqRes.json();
      const propJson = await propRes.json();
      if (!inqRes.ok) throw new Error(inqJson.error || 'Failed to load inquiries');
      setInquiries(inqJson.inquiries);
      setProperties(
        (propJson.properties || []).map((p: { id: string; title: string }) => ({ id: p.id, title: p.title }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const previous = inquiries;
    setInquiries((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch {
      setInquiries(previous ?? null);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setInquiries((prev) => prev?.filter((i) => i.id !== id) ?? null);
      toast.success('Inquiry deleted');
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId) {
      toast.error('Choose a property');
      return;
    }
    setLogging(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to log inquiry');
      setInquiries((prev) => (prev ? [json.inquiry, ...prev] : [json.inquiry]));
      setForm({ propertyId: '', name: '', email: '', phone: '', message: '' });
      setShowLogForm(false);
      toast.success('Inquiry logged');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to log inquiry');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Property inquiries</h1>
          <p className="text-sm text-zinc-500">Messages sent from a property page — signed in or as a guest.</p>
        </div>
        <Button variant="teal" onClick={() => setShowLogForm((v) => !v)}>
          {showLogForm ? 'Cancel' : 'Log inquiry'}
        </Button>
      </div>

      {showLogForm && (
        <form onSubmit={handleLogSubmit} className="mb-6 space-y-3 rounded-lg border bg-white p-4">
          <p className="text-sm text-zinc-500">For a lead that came in by phone, WhatsApp, or in person.</p>
          <select
            value={form.propertyId}
            onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            required
          >
            <option value="">Select property…</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
            />
          </div>
          <Textarea
            placeholder="What did they ask about?"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            required
          />
          <Button type="submit" variant="teal" disabled={logging}>
            {logging ? 'Saving…' : 'Save inquiry'}
          </Button>
        </form>
      )}

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
                <div className="flex items-center gap-2">
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(inquiry.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{inquiry.message}</p>
              <p className="mt-2 text-xs text-zinc-400">{new Date(inquiry.createdat).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
