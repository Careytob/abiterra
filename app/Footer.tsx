//app/Footer.tsx
import Link from 'next/link';
import React from 'react';
import { siteConfig, inRegion } from '@/lib/site-config';

const Footer = () => {
  const { contact, social, features } = siteConfig;
  const socials = [
    { label: 'Instagram', href: social.instagram },
    { label: 'Facebook', href: social.facebook },
    { label: 'Twitter', href: social.twitter },
  ].filter((s) => s.href);

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-400">
              {siteConfig.name} is your trusted partner in finding the perfect property{inRegion()}.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Properties</h3>
            <ul className="space-y-2">
              <li><Link href="/buy" className="text-gray-400 hover:text-white">Houses for Sale</Link></li>
              {features.rentals && (
                <li><Link href="/rent" className="text-gray-400 hover:text-white">Apartments for Rent</Link></li>
              )}
              <li><Link href="/buy?featured=true" className="text-gray-400 hover:text-white">Featured Listings</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              {contact.email && (
                <li>Email: <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
              )}
              {contact.phone && <li>Phone: {contact.phone}</li>}
              {contact.address && <li>Address: {contact.address}</li>}
              {!contact.email && !contact.phone && !contact.address && (
                <li><Link href="/contact" className="hover:text-white">Send us a message</Link></li>
              )}
            </ul>
          </div>
          {socials.length > 0 && (
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex justify-center sm:justify-start space-x-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <ul className="flex flex-wrap justify-center space-x-4 mb-4 text-gray-400">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms and Conditions</Link></li>
          </ul>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
