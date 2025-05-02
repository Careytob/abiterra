//app/Footer.tsx
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-400">Your trusted partner in finding the perfect property.</p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Properties</h3>
            <ul className="space-y-2">
              <li><Link href="/buy" className="text-gray-400 hover:text-white">Houses for Sale</Link></li>
              <li><Link href="/rent" className="text-gray-400 hover:text-white">Apartments for Rent</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">New Developments</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Featured Listings</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>contact@abiterra.com</li>
              
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://instagram.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white">Instagram</a>
              <a href="https://facebook.com/yourpage"
                target="_blank" 
                rel="noopener noreferrer"  
                className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer