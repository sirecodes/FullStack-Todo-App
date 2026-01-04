"use client";

/**
 * QuickActionCards Component - Elegant Warm Sunset Theme
 *
 * Completely redesigned with unique card layouts and warm aesthetics.
 * Features elegant hover effects, modern design, and warm gradients.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Define the shape of a quick action card
export interface QuickActionCard {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  color?: 'sunset' | 'gold' | 'coral' | 'amber';
}

export interface QuickActionCardsProps {
  cards: QuickActionCard[];
  className?: string;
}

/**
 * Color configurations for different card themes
 */
const colorConfigs = {
  sunset: {
    gradient: 'from-sunset-500 to-sunset-600',
    iconBg: 'from-sunset-400 to-sunset-500',
    hover: 'hover:shadow-sunset-500/40',
    border: 'border-sunset-300',
    text: 'text-sunset-700',
  },
  gold: {
    gradient: 'from-gold to-amber',
    iconBg: 'from-gold to-amber',
    hover: 'hover:shadow-amber/40',
    border: 'border-amber/30',
    text: 'text-amber',
  },
  coral: {
    gradient: 'from-coral to-sunset-400',
    iconBg: 'from-coral to-sunset-400',
    hover: 'hover:shadow-coral/40',
    border: 'border-coral/30',
    text: 'text-coral',
  },
  amber: {
    gradient: 'from-amber to-gold',
    iconBg: 'from-amber to-gold',
    hover: 'hover:shadow-amber/40',
    border: 'border-amber/30',
    text: 'text-amber',
  },
};

/**
 * QuickActionCards Component
 */
export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  cards,
  className
}) => {
  return (
    <section
      className={cn('w-full py-20 px-4 sm:px-6 lg:px-12 bg-linear-to-br from-sunset-50 via-white to-sunset-100', className)}
      aria-labelledby="quick-actions-title"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header - More Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sunset-100 to-sunset-200 border-2 border-sunset-300 rounded-full text-sunset-700 font-bold text-sm shadow-md mb-6">
            <Sparkles size={16} className="text-sunset-600" />
            <span>Explore Features</span>
          </div>
          
          <h2
            id="quick-actions-title"
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Get Started Quickly
          </h2>
          <p className="text-sunset-600 text-lg max-w-2xl mx-auto font-medium">
            Jump into your workflow with these powerful shortcuts
          </p>
        </motion.div>

        {/* Cards Grid - Staggered Layout */}
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const colors = colorConfigs[card.color || 'sunset'];
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <a
                    href={card.link}
                    target={card.target || '_self'}
                    rel={card.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="block h-full focus:outline-none focus:ring-4 focus:ring-sunset-300 rounded-2xl"
                    aria-label={`${card.title}: ${card.description}`}
                  >
                    {/* Card Container - Unique Design */}
                    <div className={cn(
                      'relative h-full flex flex-col p-8 rounded-2xl',
                      'bg-white/80 backdrop-blur-sm',
                      'border-2',
                      colors.border,
                      'shadow-lg',
                      colors.hover,
                      'hover:shadow-2xl',
                      'transition-all duration-300',
                      'overflow-hidden'
                    )}>
                      {/* Decorative corner accent */}
                      <div className={cn(
                        'absolute top-0 right-0 w-32 h-32 bg-linear-to-br',
                        colors.gradient,
                        'opacity-10 rounded-bl-full',
                        'group-hover:opacity-20 transition-opacity duration-300'
                      )} />

                      {/* Icon - Floating Style */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative z-10 mb-6"
                      >
                        <div className={cn(
                          'inline-flex p-4 rounded-2xl shadow-lg',
                          'bg-linear-to-br',
                          colors.iconBg,
                          'group-hover:shadow-xl transition-shadow duration-300'
                        )}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="relative z-10 flex-grow">
                        <h3 className="mb-3 text-2xl font-bold text-sunset-800">
                          {card.title}
                        </h3>

                        <p className="text-sunset-600 text-base leading-relaxed font-medium">
                          {card.description}
                        </p>
                      </div>

                      {/* CTA - Bottom Aligned */}
                      <div className="relative z-10 mt-6 flex items-center justify-between">
                        <span className={cn(
                          'inline-flex items-center gap-2 text-sm font-bold',
                          colors.text,
                          'group-hover:gap-3 transition-all duration-200'
                        )}>
                          <span>Explore</span>
                          <ArrowRight className="h-4 w-4" />
                        </span>

                        {/* Animated underline */}
                        <div className={cn(
                          'h-0.5 flex-grow ml-4 bg-linear-to-r',
                          colors.gradient,
                          'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                        )} />
                      </div>

                      {/* Hover glow effect */}
                      <div className={cn(
                        'absolute inset-0 bg-linear-to-br',
                        colors.gradient,
                        'opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl'
                      )} />
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Bottom CTA - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sunset-600 font-medium mb-4">
            Need help getting started?
          </p>
          <Link href="https://github.com/sirecodes/FullStack-Todo-App/blob/main/VERCEL_DEPLOYMENT_GUIDE.md">
            <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-700 font-bold hover:bg-sunset-50 hover:border-sunset-400 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
              View Documentation
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

QuickActionCards.displayName = 'QuickActionCards';