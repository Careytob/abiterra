import NavBar from '../NavBar';
import Footer from '../Footer';

export const metadata = {
  title: 'Terms and Conditions | Abiterra',
  description: 'Understand the terms governing your use of the Abiterra website and services.',
};

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow bg-gray-50 mt-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
            <p><strong>Effective Date:</strong> May 1, 2025</p>
            <p><strong>Last Updated:</strong> May 1, 2025</p>
            <p>Welcome to <a href="https://abiterra.com" className="text-teal-600 hover:underline">abiterra.com</a> ("Website"). By accessing or using our Website, you agree to be bound by the following Terms and Conditions ("Terms"). If you do not agree, please do not use the Website.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>The Website is operated by Abiterra, a licensed real estate agent in Nigeria, solely managed by a single agent. We source properties for sale or rent from property developers, owners, and other licensed agents, and list them on the Website after personally visiting and photographing each property. Abiterra does not own the properties listed; we act as an intermediary, facilitating transactions between buyers or renters and property owners or their agents until completion. We typically earn a 5% commission on the agreed sale or 10% commission on the agreed rental amount from the buyer or renter. In cases where we directly represent the seller, both the buyer and seller each pay a 5% commission (totaling 10%). Commissions may be shared with other agents when properties are sourced from them. To contact us regarding a property, you must sign up with your personal details.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
            <p>To use the Website and contact us, you must:</p>
            <ul className="list-disc pl-5">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate, complete, and truthful information during signup</li>
              <li>Comply with all applicable laws and these Terms</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">3. Account Management</h2>
            <p>When you sign up, you are responsible for maintaining the confidentiality of your account information. We may suspend or delete your account if you:</p>
            <ul className="list-disc pl-5">
              <li>Provide false or misleading information</li>
              <li>Engage in fraudulent or unlawful activities</li>
              <li>Violate these Terms</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">4. Use of Website</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5">
              <li>Use the Website for any unlawful or unauthorized purpose</li>
              <li>Misrepresent your identity or contact details</li>
              <li>Attempt to gain unauthorized access to our systems or data</li>
              <li>Interfere with the Website’s functionality (e.g., through hacking or automated scripts)</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">5. Property Listings</h2>
            <p>We strive to provide accurate property listings by personally visiting properties, taking photographs, and verifying details with property owners, developers, or other agents. However:</p>
            <ul className="list-disc pl-5">
              <li>Property availability, pricing, and details may change without notice due to factors beyond our control, such as owner decisions or market conditions.</li>
              <li>While we exercise due diligence in verifying information, we are not liable for errors, omissions, or inaccuracies resulting from incorrect or outdated information provided by property owners, developers, or other agents.</li>
              <li>Photographs are taken by us but are for illustrative purposes and may not reflect the current state of the property.</li>
              <li>You are responsible for independently verifying all property details with the owner or their agent before entering into any agreement.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">6. Transactions</h2>
            <p>Abiterra facilitates property transactions by connecting buyers or renters with property owners or their agents, assisting with inquiries, property viewings, negotiations, and other steps until the transaction is complete. Any agreements, contracts, or transactions are solely between you and the property owner or their agent. We are not a party to such agreements and are not responsible for their terms, fulfillment, or any disputes arising from them. Our role is limited to facilitating the transaction process. Buyers typically pay a 5% commission, as outlined in the Commissions section, with no additional fees unless explicitly stated.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">7. Commissions</h2>
            <p>We earn a 5% commission on the agreed sale or 10% commission on the agreed rental amount from the buyer or renter for each completed transaction. In cases where we directly represent the seller (i.e., the seller entrusts us to sell their property), both the buyer and seller each pay a 5% commission, totaling 10% of the agreed amount. In cases where properties are sourced from other licensed agents, we may share a portion of the commission with them. These commissions are separate from the agreed transaction amount and do not affect the sale or rental price between you and the property owner or their agent.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
            <p>All content on the Website, including text, images, photographs, designs, and logos, is the property of Abiterra or its licensors and is protected by copyright and other laws. You may not reproduce, distribute, or use any content without prior written permission. User-generated content (e.g., inquiries) remains your property, but you grant us a non-exclusive license to use it for responding to your requests and facilitating transactions.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Abiterra is not liable for any direct, indirect, incidental, or consequential damages arising from:</p>
            <ul className="list-disc pl-5">
              <li>Your use of the Website</li>
              <li>Reliance on property information provided by owners, developers, or other agents</li>
              <li>Website unavailability, errors, or inaccuracies beyond our reasonable control</li>
              <li>Any transactions, agreements, or disputes between you and property owners or their agents, including disputes over commission payments</li>
            </ul>
            <p>The Website is provided "as is" without warranties of any kind.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the Website at our sole discretion, particularly if you violate these Terms or engage in activities that harm the Website or other users.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">11. Dispute Resolution</h2>
            <p>Any disputes arising from these Terms or your use of the Website will be resolved through binding arbitration in Lagos, Nigeria, in accordance with the rules of the Nigerian Arbitration and Conciliation Act. You agree to waive any right to a jury trial or class action.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">13. Changes to These Terms</h2>
            <p>We may modify these Terms at any time. Updates will be posted on this page, and significant changes may be communicated via a website banner or email. Continued use of the Website after changes constitutes your acceptance of the revised Terms.</p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">14. Contact Us</h2>
            <p>For questions or concerns about these Terms or our services, please contact:</p>
            <p>Email: <a href="mailto:contact@abiterra.com" className="text-teal-600 hover:underline">contact@abiterra.com</a></p>
            <p>Address: 123 Property Lane, Lagos, Nigeria</p>
          </div>
        </section>
      </main>
    </div>
  );
}