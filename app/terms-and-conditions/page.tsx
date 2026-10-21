// app/terms-and-conditions/page.tsx
//
// TEMPLATE — NOT LEGAL ADVICE. This is a generic starting point that reads its
// names and contact details from lib/site-config.ts. Before launching a real
// site, have it reviewed by a qualified lawyer for your jurisdiction and add
// any commission / fee terms that apply to YOUR business model.
import { siteConfig } from '@/lib/site-config';

const LAST_UPDATED = 'January 1, 2026'; // <- update when you edit this page

export const metadata = {
  title: `Terms and Conditions | ${siteConfig.name}`,
  description: `The terms governing your use of the ${siteConfig.name} website and services.`,
};

export default function TermsAndConditions() {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
            <p><strong>Last Updated:</strong> {LAST_UPDATED}</p>
            <p>
              Welcome to {name} (<a href={url} className="text-teal-600 hover:underline">{url}</a>, the &quot;Website&quot;), operated by {legal.entity}.
              By using the Website you agree to these Terms. If you do not agree, please do not use it.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">1. What We Do</h2>
            <p>
              {name} is an online marketplace where property agents and owners publish listings and visitors can browse them and send enquiries.
              Unless stated otherwise, we are not the owner or seller of listed properties and are not a party to any transaction between you
              and a listing agent or owner.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">2. Eligibility and Accounts</h2>
            <p>
              You must be at least 18 years old to create an account. You are responsible for keeping your login details confidential and for
              activity under your account. Information you provide must be accurate and up to date.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">3. Listings</h2>
            <p>Agents and owners who submit listings agree that:</p>
            <ul className="list-disc pl-5">
              <li>they have the legal right and authority to advertise the property;</li>
              <li>all details, prices and photos are accurate, current and not misleading;</li>
              <li>they hold any licence or registration their local law requires to act as an agent;</li>
              <li>listings may be reviewed, edited, rejected or removed by us at our discretion.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">4. Enquiries and Transactions</h2>
            <p>
              Enquiries are passed to the relevant agent or owner. Any agreement, viewing, payment or contract is solely between you and
              that party. We do not verify every listing in detail and do not guarantee the availability, condition, legal title or price of any
              property. Always carry out your own due diligence and seek independent professional advice before paying money or signing documents.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">5. Acceptable Use</h2>
            <p>
              You agree not to post unlawful, fraudulent or misleading content, to scrape or interfere with the Website, or to attempt to gain
              unauthorised access to accounts or systems.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The Website&apos;s design, software and branding belong to {legal.entity} or its licensors. Content you submit remains yours, but you
              grant us a non-exclusive licence to display and use it for operating the Website.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">7. Disclaimers and Limitation of Liability</h2>
            <p>
              The Website is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by law, {legal.entity} is not liable for
              indirect or consequential loss, for reliance on listing information, or for disputes between users, agents and owners.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p>We may suspend or end access to the Website if these Terms are breached or if needed to protect the Website or other users.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
            <p>These Terms are governed by the laws of {legal.governingLaw}, without regard to conflict-of-law rules.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">10. Changes</h2>
            <p>We may update these Terms from time to time. Continued use of the Website after changes means you accept the revised Terms.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">11. Contact</h2>
            <p>Questions about these Terms: {contactLine}.</p>
            {contact.address && <p>Address: {contact.address}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
