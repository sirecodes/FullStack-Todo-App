/**
 * ============================================================================
 * FRONTEND: authApi.ts - Set cookies from frontend
 * ============================================================================
 */

import type { AuthResponse, LogoutResponse, User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Helper function to set cookie from frontend
 * This ensures the cookie has the correct domain (.vercel.app)
 */
function setCookie(name: string, value: string, days: number = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  // Set cookie with correct domain and security flags
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;Secure`;
  
  console.log('✅ Cookie set:', name);
}

/**
 * Helper function to delete cookie
 */
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log('✅ Cookie deleted:', name);
}

/**
 * Sign up new user
 */
export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Still include for any backend cookies
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Signup failed. Please try again.';
    throw new Error(errorMessage);
  }

  // ✅ Frontend sets the cookie (correct domain automatically)
  if (data.token) {
    setCookie('auth_token', data.token, 30); // 30 days
    localStorage.setItem('auth_token', data.token); // Also store as backup
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
    console.log('✅ User signed up and token stored');
  }

  return data as AuthResponse;
}

/**
 * Log in existing user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Login failed. Please try again.';
    throw new Error(errorMessage);
  }

  // ✅ Frontend sets the cookie (correct domain automatically)
  if (data.token) {
    setCookie('auth_token', data.token, 30); // 30 days
    localStorage.setItem('auth_token', data.token); // Also store as backup
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
    console.log('✅ User logged in and token stored');
  }

  return data as AuthResponse;
}

/**
 * Log out current user
 */
export async function logout(): Promise<LogoutResponse> {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.detail || 'Logout failed. Please try again.';
      throw new Error(errorMessage);
    }

    return data as LogoutResponse;
  } finally {
    // ✅ Always clear client-side storage (even if backend call fails)
    deleteCookie('auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('✅ User logged out and token cleared');
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Session validation failed.';
    throw new Error(errorMessage);
  }

  return data as User;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to get token from cookie
 */
export function getTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}