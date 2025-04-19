'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import ContactForm from './ContactForm';
import Link from 'next/link';

export const ContactDialog = ({ propertyId }: { propertyId: string }) => {
  const { status, data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    // Reset the form state when dialog is closed
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
              <DialogDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
          )}
          
          {status === 'authenticated' ? (
            <ContactForm 
              propertyId={parseInt(propertyId, 10)} 
              onSubmitSuccess={handleSubmitSuccess}
            />
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