"use client";

/**
 * SignupForm Component
 *
 * User registration form with email/password validation and purple theme.
 * Handles form state, validation, submission, and error display.
 *
 * Features:
 * - Real-time email validation (EmailStr regex)
 * - Password length validation (min 8 characters)
 * - Disabled submit button when form invalid
 * - Loading state during API call
 * - Lucide icons for visual enhancement
 * - Purple gradient styling matching homepage
 *
 * @see /specs/006-auth-integration/spec.md - FR-001, FR-003, FR-011, FR-012
 */

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react';
import { signup } from '@/services/authApi';
import { signupSuccess, signupError } from '@/utils/authAlerts';
import type { SignupFormData } from '@/types/auth';

/**
 * Email validation regex (EmailStr format)
 *
 * Validates: user@example.com
 * Rejects: invalid-email, @example.com, user@
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Minimum password length requirement
 */
const MIN_PASSWORD_LENGTH = 8;

/**
 * SignupForm Component
 *
 * Renders email/password form with validation and submission handling.
 *
 * @example
 * <SignupForm />
 */
export const SignupForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<SignupFormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SignupFormData, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    return '';
  };

  const getPasswordStrength = (password: string): { level: 'weak' | 'medium' | 'strong'; score: number } => {
    if (!password) return { level: 'weak', score: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: 'weak', score };
    if (score <= 4) return { level: 'medium', score };
    return { level: 'strong', score };
  };

  const isFormValid = (): boolean => {
    return !validateEmail(formData.email) && !validatePassword(formData.password);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof SignupFormData]) {
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
      await signup(formData.email, formData.password);
      await signupSuccess();
      const redirectTo = searchParams.get('redirect') || '/tasks';
      router.push(redirectTo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      signupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md" noValidate>
      {/* Decorative Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30 mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-sunset-800 mb-2">Create Account</h2>
        <p className="text-sunset-600 font-medium">Join us and start organizing your tasks</p>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-sunset-800">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-red-400" />
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
            <Lock className="h-5 w-5 text-red-400" />
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
            placeholder="Min 8 characters"
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

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-sunset-600 font-medium">Password strength</span>
              <span className={`font-bold ${
                strength.level === 'weak' ? 'text-red-600' :
                strength.level === 'medium' ? 'text-amber' :
                'text-green-600'
              }`}>
                {strength.level.toUpperCase()}
              </span>
            </div>
            <div className="flex space-x-1 h-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    level <= strength.score
                      ? level <= 2 ? 'bg-red-500' : level <= 4 ? 'bg-amber' : 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

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
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* Help Text */}
      <p className="text-xs text-sunset-600 text-center font-medium">
        Password must be at least {MIN_PASSWORD_LENGTH} characters long
      </p>
    </form>
  );
};

SignupForm.displayName = 'SignupForm';