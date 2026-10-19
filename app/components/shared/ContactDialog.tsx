'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import ContactForm from './ContactForm';

// UUID validation regex
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const ContactDialog = ({ propertyId }: { propertyId: string }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidPropertyId, setIsValidPropertyId] = useState<boolean | null>(null);

  // Validate propertyId as a UUID when component mounts or propertyId changes
  useEffect(() => {
    setIsValidPropertyId(Boolean(propertyId) && isValidUUID(propertyId));
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

          {isValidPropertyId === true ? (
            <ContactForm 
              propertyId={propertyId} 
              onSubmitSuccess={handleSubmitSuccess}
            />
          ) : isValidPropertyId === false ? (
            <div className="text-center py-4">
              <p className="text-red-500">Unable to process this property request.</p>
              <p className="text-sm text-gray-500 mt-2">Please try again later or contact support.</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
