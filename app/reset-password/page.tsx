
//app/reset-password/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Updated import path
import { Input } from '@/components/ui/input'; // Updated import path
import { Button } from '@/components/ui/button'; // Updated import path
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

const ResetPasswordContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormInputs>();
  const password = watch('password', '');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setMessage('Invalid or missing reset token');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsValidToken(true);
        } else {
          setMessage(result.error || 'Invalid or expired token');
        }
      } catch (error) {
        setMessage('An error occurred while validating the token');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Your password has been reset successfully!');
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Validating reset token...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row container">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center bg-white md:mt-4 lg:mt-0">
        <div className="relative w-full max-w-4xl h-[600px]">
          <Image
            src="/images/login-image.jpeg"
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
            <CardTitle className="text-2xl lg:text-3xl font-bold text-center">Reset Password</CardTitle>
            <p className="text-center text-gray-600 mt-2 text-sm">
              Create a new password for your account
            </p>
          </CardHeader>
          <CardContent>
            {message && (
              <p className={`mb-4 text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'} text-center`}>
                {message}
              </p>
            )}

            {isValidToken && !isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message:
                            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        },
                      })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button variant="default" type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700">
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            ) : isSuccess ? (
              <div className="text-center">
                <p className="mb-4">Your password has been reset successfully!</p>
                <Button variant="default" className="mt-4 bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="/login">Login with New Password</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">This password reset link is invalid or has expired.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/forgot-password">Request New Reset Link</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the component in Suspense
const ResetPasswordPage = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;