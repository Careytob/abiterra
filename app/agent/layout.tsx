// app/agent/layout.tsx
import { getServerSession } from 'next-auth';
import { siteConfig } from '@/lib/site-config';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import AdminSignOutButton from '../admin/AdminSignOutButton';

export const metadata = {
  title: `Agent Dashboard · ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  // middleware.ts already blocks non-agents from reaching this layout, but
  // we check again here so the page is still safe if middleware is ever
  // disabled or its matcher changed.
  const session = await getServerSession(authOptions);
  if (!session?.user || !['AGENT', 'ADMIN'].includes(session.user.role)) {
    redirect('/login?callbackUrl=/agent');
  }

  // Number of new (unhandled) enquiries on this agent's listings, shown as a badge.
  const newInquiries = await prisma.inquiry
    .count({ where: { status: 'PENDING', property: { listedby: session.user.id } } })
    .catch(() => 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-28">{/* pt-28 clears the fixed site menu (~103px) */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/agent/properties" className="text-lg font-semibold text-zinc-900">
              My Listings
            </Link>
            <nav className="flex items-center gap-4 text-sm text-zinc-600">
              <Link href="/agent/properties" className="hover:text-teal-600">
                Properties
              </Link>
              <Link href="/agent/inquiries" className="hover:text-teal-600">
                Inquiries
                {newInquiries > 0 && (
                  <span className="ml-1.5 rounded-full bg-teal-600 px-1.5 py-0.5 text-xs font-medium text-white">
                    {newInquiries}
                  </span>
                )}
              </Link>
              <Link href="/" className="hover:text-teal-600">
                View site
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600">
            <span>{session.user.email}</span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
