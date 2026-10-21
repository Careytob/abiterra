// app/privacy-policy/page.tsx
//
// TEMPLATE — NOT LEGAL ADVICE. This is a generic starting point that reads its
// names and contact details from lib/site-config.ts. Before launching a real
// site, have it reviewed against the laws that apply to YOU (e.g. GDPR / UK
// GDPR, CCPA/CPRA, or your local data-protection law) and update the date below.
import { siteConfig } from '@/lib/site-config';

const LAST_UPDATED = 'January 1, 2026'; // <- update when you edit this page

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Learn how ${siteConfig.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPolicy() {
  const { name, url, legal, contact } = siteConfig;
  const contactLine = contact.email ? (
    <a href={`mailto:${contact.email}`} className="text-teal-600 hover:underline">{contact.email}</a>
  ) : (
    <a href="/contact" className="text-teal-600 hover:underline">our contact page</a>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gray-50 pt-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
            <p><strong>Last Updated:</strong> {LAST_UPDATED}</p>
            <p>
              This Privacy Policy explains how {legal.entity} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses and protects
              personal information when you use {name} at <a href={url} className="text-teal-600 hover:underline">{url}</a> (the &quot;Website&quot;).
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-5">
              <li><strong>Enquiries:</strong> your name, email address, phone number and message when you contact a listing agent or us.</li>
              <li><strong>Accounts:</strong> name, email address, password (stored hashed) and account type if you register as a buyer or agent.</li>
              <li><strong>Listings:</strong> property details, photos and contact details that agents or owners submit.</li>
              <li><strong>Technical data:</strong> IP address, browser type, device information and pages visited, collected through server logs and error monitoring.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5">
              <li>To pass your enquiry to the relevant listing agent or owner and respond to you.</li>
              <li>To create and secure your account and moderate listings.</li>
              <li>To operate, maintain, debug and improve the Website.</li>
              <li>To comply with legal obligations and prevent fraud or abuse.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">3. Sharing</h2>
            <p>
              When you send an enquiry about a property, your details are shared with the agent or owner of that listing.
              We also use service providers (for example hosting, database and file storage, email delivery and error monitoring)
              who process data on our behalf. We do not sell your personal information.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
            <p>
              We use cookies that are necessary for sign-in sessions and security. If you add analytics or advertising tools,
              update this section and any required consent banner.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">5. Retention and Security</h2>
            <p>
              We keep personal data only as long as needed for the purposes above or as required by law. We use reasonable technical and
              organisational safeguards, but no system is completely secure.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>
              Depending on where you live (for example under the GDPR, UK GDPR or CCPA/CPRA), you may have the right to access, correct,
              delete or export your personal data, to object to or restrict certain processing, and to withdraw consent. To exercise
              these rights contact us via {contactLine}. We will respond within the time required by applicable law.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">7. International Transfers</h2>
            <p>
              Our service providers may process data in countries other than your own. Where required, we rely on appropriate safeguards for such transfers.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. The latest version will always be available on this page.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>Questions about this policy: {contactLine}.</p>
            {contact.address && <p>Address: {contact.address}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
