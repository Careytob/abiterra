// app/admin/messages/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import Spinner from '@/app/components/Spinner';

type ContactMessage = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  inquiry: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = ['PENDING', 'REVIEWED', 'CONTACTED'];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load messages');
      setMessages(json.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const previous = messages;
    setMessages((prev) => prev?.map((m) => (m.id === id ? { ...m, status } : m)) ?? null);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch {
      setMessages(previous ?? null);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setMessages((prev) => prev?.filter((m) => m.id !== id) ?? null);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Contact messages</h1>
        <p className="text-sm text-zinc-500">General submissions from the site&rsquo;s Contact page.</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {!messages && !error && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {messages && messages.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center text-zinc-500">
          No messages yet.
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border bg-white p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900">
                    {m.firstName} {m.lastName}
                    <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600">
                      {m.inquiry}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-500">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={m.status}
                    onChange={(e) => updateStatus(m.id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(m.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{m.message}</p>
              <p className="mt-2 text-xs text-zinc-400">{new Date(m.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
