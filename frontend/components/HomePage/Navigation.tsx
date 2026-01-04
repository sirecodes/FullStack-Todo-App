/**
 * Navigation Component - Elegant Warm Sunset Theme
 *
 * Completely redesigned header with warm colors and modern aesthetics.
 * Features elegant hover effects, smooth animations, and warm gradients.
 *
 * Usage:
 * <Navigation />
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, ListTodo, History, Sparkles, LogOut, BellIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navigationLinks: NavLink[] = [
  { label: 'Home', href: '/', icon: Home, color: 'sunset-500' },
  { label: 'Tasks', href: '/tasks', icon: ListTodo, color: 'sunset-600' },
  { label: 'History', href: '/history', icon: History, color: 'amber' },
  { label: 'Notifications', href: '/notifications', icon: BellIcon, color: 'gold' },
];

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b-2 border-sunset-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand - More Elegant */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Animated glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-sunset-400 to-sunset-600 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Icon container */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sunset-500 to-sunset-600 shadow-lg shadow-sunset-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-sunset-700 to-sunset-500 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-xs font-semibold text-sunset-600">
                Elegant & Simple
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Pill Style */}
          <div className="hidden items-center space-x-2 md:flex">
            <div className="flex items-center bg-sunset-50 rounded-2xl p-1.5 border-2 border-sunset-200 shadow-md">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'relative flex items-center space-x-2 rounded-xl px-4 py-2.5',
                        'text-sunset-700 font-bold text-sm transition-all duration-200',
                        'hover:bg-white hover:shadow-md'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button - Elegant Style */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogoutButton variant="icon-only" />
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Toggle - Elegant Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center rounded-xl p-3 bg-sunset-100 border-2 border-sunset-300 text-sunset-700 hover:bg-sunset-200 transition-colors shadow-md"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Elegant Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t-2 border-sunset-200 bg-linear-to-br from-white to-sunset-50 backdrop-blur-xl md:hidden shadow-xl"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-2">
                {navigationLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ x: 8, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            'flex items-center space-x-4 rounded-xl px-5 py-4',
                            'bg-white/80 backdrop-blur-sm border-2 border-sunset-200',
                            'text-sunset-700 font-bold transition-all duration-200',
                            'hover:bg-sunset-100 hover:border-sunset-400 hover:shadow-lg'
                          )}
                        >
                          <div className="p-2 rounded-lg bg-linear-to-br from-sunset-400 to-sunset-500 shadow-md">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-base">{link.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Logout Button - mobile view */}
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigationLinks.length * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogoutButton
                      variant="with-text"
                      className="w-full flex items-center space-x-4 rounded-xl px-5 py-4 bg-white/80 backdrop-blur-sm border-2 border-red-300 hover:bg-red-50 hover:border-red-400"
                    />
                  </motion.div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

Navigation.displayName = 'Navigation';