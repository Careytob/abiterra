'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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

export const ContactDialog = ({
  propertyId,
  ownerId = null,
}: {
  propertyId: string;
  /** User id of the agent who listed this property (if any). */
  ownerId?: string | null;
}) => {
  const { data: session } = useSession();
  const isOwner = Boolean(ownerId && session?.user?.id === ownerId);
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

  // Agents don't enquire about their own listings.
  if (isOwner) {
    return (
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
        <p className="font-medium">This is your listing.</p>
        <p className="mt-1">
          Buyer enquiries appear in your{' '}
          <Link href="/agent/inquiries" className="font-medium underline">
            Inquiries inbox
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Dialog onOpenChange={handleDialogClose}>
        <DialogTrigger asChild className='bg-teal-600 text-white hover:bg-teal-800 transition duration-300 ease-in-out'>
          <Button className="w-full py-6 text-lg">
            <Mail className="w-5 h-5 mr-2" />
            Contact Agent
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px]">
          {!isSubmitted && (
            <DialogHeader>
              <DialogTitle>Contact the agent</DialogTitle>
              <p className="text-sm text-gray-500">
                Your message goes to the agent who listed this property.
              </p>
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
