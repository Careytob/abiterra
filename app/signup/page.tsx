'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {signIn} from 'next-auth/react'
import Link from 'next/link';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'BUYER' | 'AGENT'>('BUYER');
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormInputs>();

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'text-red-500';
      case 2:
      case 3:
        return 'text-orange-500';
      case 4:
      case 5:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Medium';
      case 4:
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await axios.post('/api/signup', { ...data, accountType });
      console.log("Signup response:", response.data);

      await signIn('credentials',{
        redirect: false,
        email: data.email,
        password: data.password,
      }

      )

      router.push(accountType === 'AGENT' ? '/agent' : '/'); // Redirect to agent dashboard or homepage
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = checkPasswordStrength(watch("password") || "");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">I'm signing up as a</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('BUYER')}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    accountType === 'BUYER' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-zinc-600'
                  }`}
                >
                  Buyer / Renter
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('AGENT')}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    accountType === 'AGENT' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-zinc-600'
                  }`}
                >
                  Agent / Property owner
                </button>
              </div>
              {accountType === 'AGENT' && (
                <p className="mt-2 text-xs text-zinc-500">
                  Listings you submit are reviewed before they go live.
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
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
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter a secure password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {watch("password") && (
              <div className="space-y-2">
                <p className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}>
                  Password Strength: {getPasswordStrengthText(passwordStrength)}
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < passwordStrength
                          ? getPasswordStrengthColor(passwordStrength).replace('text-', 'bg-')
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <Button
              variant='teal'
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="32"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing Up...
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>
            <p className='text-sm'>Already have an account? <Link href='/login' className='text-blue-500'>Log In</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
