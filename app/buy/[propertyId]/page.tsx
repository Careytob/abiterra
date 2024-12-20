'use client'
import React, { FormEvent } from 'react';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Castle, 
  SquareStack, 
  LogIn, 
  UserPlus,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define interfaces for type safety
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface AuthFormData {
  username: string;
  password: string;
}

interface PropertyData {
  id: string;
  title: string;
  price: string;
  location: string;
  description: string;
  images: string[];
  features: string[];
  specs: {
    beds: number;
    baths: number;
    area: string;
    type: string;
    built: number;
    parking: number;
  };
}

const PropertyDetailPreview = () => {
  // State definitions
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [showContactDialog, setShowContactDialog] = React.useState(false);
  
  const [authForm, setAuthForm] = React.useState<AuthFormData>({
    username: '',
    password: ''
  });

  const [contactForm, setContactForm] = React.useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  // Sample property data
  const property: PropertyData = {
    id: '1',
    title: 'Modern 3-Bedroom Apartment',
    price: '₦250,000,000',
    location: 'Lekki Phase 1, Lagos',
    description: 'Luxurious and spacious 3-bedroom apartment with modern finishes and excellent facilities. Features include a fully fitted kitchen, spacious living area, and stunning views.',
    images: [
      '/api/placeholder/800/500',
      '/api/placeholder/800/500',
      '/api/placeholder/800/500',
    ],
    features: [
      'Fully Fitted Kitchen',
      'Swimming Pool',
      'Gym',
      'Security',
      '24/7 Power Supply',
      'Parking Space'
    ],
    specs: {
      beds: 3,
      baths: 3,
      area: '200m²',
      type: 'Apartment',
      built: 2023,
      parking: 2
    }
  };

  // Check authentication on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  // Authentication handler
  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) return;

    setIsLoading(true);
    try {
      // Replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'example-token');
      setAuthForm({ username: '', password: '' });
      setShowAuthDialog(false);
      setShowContactDialog(true);
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Contact form submission handler
  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsLoading(true);
    try {
      // Replace with actual contact form submission logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setContactForm({ name: '', email: '', message: '' });
      setShowContactDialog(false);
    } catch (error) {
      console.error('Contact form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Contact button click handler
  const handleContactClick = () => {
    if (isAuthenticated) {
      setShowContactDialog(true);
    } else {
      setShowAuthDialog(true);
    }
  };

  // Image gallery navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pt-8 md:pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={property.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousImage}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2" size={18} />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-teal-600">{property.price}</div>
                <span className="text-gray-600">{property.specs.type}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
              <div className="flex items-center">
                <BedDouble className="mr-2 text-gray-400" />
                <span>{property.specs.beds} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="mr-2 text-gray-400" />
                <span>{property.specs.baths} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <SquareStack className="mr-2 text-gray-400" />
                <span>{property.specs.area}</span>
              </div>
              <div className="flex items-center">
                <Castle className="mr-2 text-gray-400" />
                <span>Built {property.specs.built}</span>
              </div>
            </div>

            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>

            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mr-2"></span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-24">
            <Button 
              onClick={handleContactClick}
              className="w-full bg-teal-600 hover:bg-teal-700 mb-4"
            >
              Contact Us
            </Button>
            
            {isAuthenticated && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isLoginMode ? 'Login to Contact Agent' : 'Sign Up to Contact Agent'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                disabled={isLoading}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isLoading}
              >
                {isLoginMode ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isLoginMode ? 'Login' : 'Sign Up'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsLoginMode(!isLoginMode)}
                disabled={isLoading}
              >
                Switch to {isLoginMode ? 'Sign Up' : 'Login'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                disabled={isLoading}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                disabled={isLoading}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                className="w-full p-3 border rounded-lg"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isLoading}
              >
                Send Message
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetailPreview;