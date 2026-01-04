"use client";

/**
 * LoginForm Component
 *
 * User login form with email/password validation and purple theme.
 * Handles form state, validation, submission, and error display.
 *
 * Features:
 * - Real-time email validation (EmailStr regex)
 * - Password field with secure input
 * - Disabled submit button when form invalid
 * - Loading state during API call
 * - Lucide icons for visual enhancement
 * - Purple gradient styling matching homepage
 *
 * @see /specs/006-auth-integration/spec.md - FR-002, FR-004, FR-013, FR-014
 */

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import { login } from '@/services/authApi';
import { loginSuccess, loginError } from '@/utils/authAlerts';
import type { LoginFormData } from '@/types/auth';

/**
 * Email validation regex (EmailStr format)
 *
 * Validates: user@example.com
 * Rejects: invalid-email, @example.com, user@
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * LoginForm Component
 *
 * Renders email/password form with validation and submission handling.
 *
 * @example
 * <LoginForm />
 */
export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    return '';
  };

  const isFormValid = (): boolean => {
    return !validateEmail(formData.email) && !validatePassword(formData.password);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof LoginFormData]) {
      const error = name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      await loginSuccess();
      const redirectTo = searchParams.get('redirect') || '/tasks';
      router.push(redirectTo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      loginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md" noValidate>
      {/* Decorative Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30 mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-sunset-800 mb-2">Welcome Back</h2>
        <p className="text-sunset-600 font-medium">Sign in to continue your journey</p>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-sunset-800">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-sunset-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`
              block w-full pl-12 pr-4 py-3 rounded-xl font-medium
              bg-white/80 backdrop-blur-sm border-2
              focus:outline-none focus:ring-4 focus:ring-sunset-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-all duration-200
              placeholder:text-sunset-300
              ${touched.email && errors.email 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-sunset-300 focus:border-sunset-500 hover:border-sunset-400'}
            `}
            placeholder="you@example.com"
            required
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-bold text-sunset-800">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-sunset-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`
              block w-full pl-12 pr-12 py-3 rounded-xl font-medium
              bg-white/80 backdrop-blur-sm border-2
              focus:outline-none focus:ring-4 focus:ring-sunset-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-all duration-200
              placeholder:text-sunset-300
              ${touched.password && errors.password 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-sunset-300 focus:border-sunset-500 hover:border-sunset-400'}
            `}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-sunset-500 hover:text-sunset-700 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid()}
        className="
          w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl
          font-bold text-white text-lg
          bg-linear-to-r from-sunset-500 to-sunset-600
          hover:from-sunset-600 hover:to-sunset-700
          focus:outline-none focus:ring-4 focus:ring-sunset-300
          disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500
          shadow-lg shadow-sunset-500/40 hover:shadow-xl hover:shadow-sunset-500/50
          active:scale-95
          transition-all duration-200
        "
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Logging In...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            <span>Log In</span>
          </>
        )}
      </button>
    </form>
  );
};

LoginForm.displayName = 'LoginForm';