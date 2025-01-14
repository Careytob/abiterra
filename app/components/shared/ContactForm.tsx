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
  name: string;
  email: string;
  phone: string;
  message: string;
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
        ...data,
        propertyId: Number(propertyId),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      // Show success toast
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      });

      // Set success state
      setIsSuccess(true);
      
      // Reset form
      reset();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send the message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-semibold mb-2">Thank you for your message!</h3>
        <p className="text-gray-600 mb-4">We'll get back to you soon.</p>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Your Name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="Your Email"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone Field */}
      <div>
        <Input
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^\+?[0-9\s\-]+$/,
              message: "Invalid phone number",
            },
          })}
          type="tel"
          placeholder="Your Phone"
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
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;