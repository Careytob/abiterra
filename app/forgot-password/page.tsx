'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('If an account exists with this email, you will receive password reset instructions.');
      } else {
        setIsSuccess(false);
        setMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row container">
      {/* Image Section - Hidden on small screens, visible on large screens */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center bg-white md:mt-4 lg:mt-0">
        <div className="relative w-full max-w-4xl h-[600px]">
          <Image 
            src='/images/login-image.jpeg' 
            alt="Luxury Property" 
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-4 py-8 lg:p-12 bg-white pt-24">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl lg:text-3xl font-bold text-center">Forgot Password</CardTitle>
            <p className="text-center text-gray-600 mt-2 text-sm">
              Enter your email to receive password reset instructions
            </p>
          </CardHeader>
          <CardContent>
            {message && (
              <p className={`mb-4 text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'} text-center`}>
                {message}
              </p>
            )}

            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format"
                      }
                    })}
                    className="w-full"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <Button
                  variant='teal'
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center text-sm mt-4">
                  Remember your password? 
                  <Link href='/login' className='text-blue-600 ml-1 hover:underline'>
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  asChild
                >
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;