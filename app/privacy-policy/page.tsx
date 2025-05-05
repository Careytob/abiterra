import NavBar from '../NavBar';
import Footer from '../Footer';

export const metadata = {
  title: 'Privacy Policy | Abiterra',
  description: 'Learn how Abiterra collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow bg-gray-50 mt-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
            <p><strong>Effective Date:</strong> May 1, 2025</p>
            <p><strong>Last Updated:</strong> May 1, 2025</p>
            <p>This Privacy Policy explains how Abiterra ("we", "us", or "our") collects, uses, and protects the personal information of users on our website <a href="https://abiterra.com" className="text-teal-600 hover:underline">abiterra.com</a> ("Website"). In Nigeria, we comply with the Nigeria Data Protection Act (NDPA) 2023. By using the Website, you consent to the practices described herein.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect personal information when you sign up to contact us regarding a property, including:</p>
            <ul className="list-disc pl-5">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
            </ul>
            <p>We may also collect anonymous, non-identifying data, such as:</p>
            <ul className="list-disc pl-5">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Usage behavior (e.g., pages visited, time spent) via cookies and analytics tools</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>Your personal information is used to:</p>
            <ul className="list-disc pl-5">
              <li>Respond to your inquiries about properties</li>
              <li>Provide updates on property listings and related services</li>
              <li>Enhance and personalize your experience on the Website</li>
              <li>Analyze Website usage to improve our services</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
            <p>We may share your personal information with:</p>
            <ul className="list-disc pl-5">
              <li>Service providers (e.g., hosting providers, email delivery services) who assist in operating the Website, bound by confidentiality agreements</li>
              <li>Legal authorities, if required by law or to protect our rights, safety, or property</li>
              <li>Third-party analytics providers (e.g., Google Analytics) for anonymous usage data</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">4. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to enhance site performance, analyze usage, and personalize content. You can manage cookie preferences through your browser settings or our cookie consent tool (if applicable).</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. For example, contact details are kept until you request deletion or the related inquiry is resolved.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
            <p>We implement reasonable technical and organizational measures to protect your data, such as encryption and secure servers. However, no system is completely secure, and we cannot guarantee absolute security.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you have certain rights regarding your personal data:</p>
            <ul className="list-disc pl-5">
              <li><strong>In Nigeria (under the Nigeria Data Protection Act 2023):</strong> You may have the right to access, rectify, delete, restrict, or object to the processing of your data, request data portability, withdraw consent, or lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
              <li><strong>In the EU (under GDPR):</strong> You may have the right to access, rectify, erase, restrict, or object to processing, data portability, and withdraw consent.</li>
              <li><strong>In California (under CCPA):</strong> You may have the right to access, delete, or opt-out of the sale of your personal information.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:contact@abiterra.com" className="text-teal-600 hover:underline">contact@abiterra.com</a>. For Nigerian residents, you may also contact the NDPC at <a href="mailto:info@ndpc.gov.ng" className="text-teal-600 hover:underline">info@ndpc.gov.ng</a>. We will respond within 30 days or as required by law.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">8. International Users</h2>
            <p>The Website is hosted in the United States. If you access it from another country, your data may be transferred internationally, subject to applicable data protection laws, including the NDPA for Nigerian residents.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Updates will be posted on this page, and significant changes may be communicated via a website banner or email notification.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>For questions or concerns about this Privacy Policy or to exercise your data rights, please contact our Data Protection Contact Point:</p>
            <p>Email: <a href="mailto:contact@abiterra.com" className="text-teal-600 hover:underline">contact@abiterra.com</a></p>
            <p>Address: 123 Property Lane, Lagos, Nigeria</p>
          </div>
        </section>
      </main>
    </div>
  );
}