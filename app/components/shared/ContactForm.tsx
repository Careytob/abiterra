'use client';

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";  
import { Textarea } from "@/app/components/ui/textarea";
import { useToast } from "@/app/components/ui/use-toast";
import { DialogClose } from "@/app/components/ui/dialog";

interface ContactFormProps {
  propertyId: number;
}

interface FormData {
  message: string;
  phone: string;
  propertyId: number;  
}

const ContactForm: React.FC<ContactFormProps> = ({ propertyId }) => {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        message: data.message,
        phone: data.phone, // ✅ Now sending phone number
        propertyId: Number(propertyId),
      };

      const response = await fetch('/api/inquiry', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit');
      }

      toast({
        title: "Success!",
        description: "Your inquiry has been sent successfully.",
      });

      setIsSuccess(true);
      reset();

    } catch (error: any) {
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
      {/* Phone Field */}
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

      {/* Message Field */}
      <div>
        <Textarea
          {...register("message", { required: "Message is required" })}
          placeholder="Your Message"
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
      </div>

      {/* Submit Button */}
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
