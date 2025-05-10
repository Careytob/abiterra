'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import ContactForm from './ContactForm';
import Link from 'next/link';

// UUID validation regex
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const ContactDialog = ({ propertyId }: { propertyId: string }) => {
  const { status, data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidPropertyId, setIsValidPropertyId] = useState<boolean | null>(null);

  // Validate propertyId as a UUID when component mounts or propertyId changes
  useEffect(() => {
    if (!propertyId) {
      console.error("PropertyId is missing or empty");
      setIsValidPropertyId(false);
      return;
    }

    if (isValidUUID(propertyId)) {
      console.log("PropertyId is valid UUID:", propertyId);
      setIsValidPropertyId(true);
    } else {
      console.error("Invalid propertyId (not a UUID):", propertyId);
      setIsValidPropertyId(false);
    }
  }, [propertyId]);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) setIsSubmitted(false);
  };

  return (
    <>
      <Dialog onOpenChange={handleDialogClose}>
        <DialogTrigger asChild className='bg-teal-600 text-white hover:bg-teal-800 transition duration-300 ease-in-out'>
          <Button className="w-full py-6 text-lg">
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px]">
          {!isSubmitted && (
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
            </DialogHeader>
          )}

          {/* Show debug info if propertyId is invalid */}
          {isValidPropertyId === false && status === 'authenticated' && (
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200 text-xs mb-4">
              <p className="font-semibold">Debug:</p>
              <p>Invalid property ID: {propertyId}</p>
            </div>
          )}

          {status === 'authenticated' ? (
            isValidPropertyId === true ? (
              <ContactForm 
                propertyId={propertyId} 
                onSubmitSuccess={handleSubmitSuccess}
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-red-500">Unable to process this property request.</p>
                <p className="text-sm text-gray-500 mt-2">Please try again later or contact support.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-gray-600">
                Please log in or sign up to contact us.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/api/auth/signin">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="teal" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};