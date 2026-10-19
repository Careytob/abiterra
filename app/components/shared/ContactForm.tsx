//app/components/shared/contactForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useSession } from 'next-auth/react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";  
import { Textarea } from "@/app/components/ui/textarea";
import { useToast } from "@/app/components/ui/use-toast";
import { DialogClose } from "@/app/components/ui/dialog";

// UUID validation regex
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

interface ContactFormProps {
  propertyId: string;
  onSubmitSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  phone: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ propertyId, onSubmitSuccess }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Validate propertyId as a UUID
      if (!propertyId || !isValidUUID(propertyId)) {
        throw new Error("Invalid property reference. Please try again later.");
      }

      const formData = {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone,
        propertyId,
      };

      const response = await fetch('/api/inquiry', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      
      try {
        const result = JSON.parse(responseText);
        
        if (!response.ok) {
          throw new Error(result.error || `Failed to submit (${response.status})`);
        }

        toast({
          title: "Success!",
          description: "Your inquiry has been sent successfully.",
        });

        setIsSuccess(true);
        reset();
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } catch (jsonError) {
        console.error("Response is not valid JSON:", responseText);
        setDebugInfo(responseText);
        throw new Error(`Server response error: ${response.status}`);
      }

    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send the inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-semibold mb-2">Thank you for your inquiry!</h3>
        <p className="text-gray-600 mb-4">We'll get back to you soon.</p>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {debugInfo && (
        <div className="bg-red-50 p-2 rounded border border-red-200 text-xs overflow-auto max-h-20">
          <p className="font-semibold">Debug Response:</p>
          <pre>{debugInfo}</pre>
        </div>
      )}

      <div>
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Your Name"
          readOnly={isSignedIn}
          className={`${isSignedIn ? 'bg-gray-50' : ''} ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
          })}
          type="email"
          placeholder="Your Email"
          readOnly={isSignedIn}
          className={`${isSignedIn ? 'bg-gray-50' : ''} ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Input
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^\+?[0-9\s\-]+$/,
              message: "Invalid phone number",
            },
          })}
          type="tel"
          placeholder="Your Phone Number"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <div>
        <Textarea
          {...register("message", { required: "Message is required" })}
          placeholder="Your Message"
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
      </div>

      <input type="hidden" name="debug-propertyId" value={propertyId} />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  );
};

export default ContactForm;
