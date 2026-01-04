"use client";

/**
 * HeroSection Component - Elegant Warm Sunset Theme
 *
 * Completely redesigned hero with warm, inviting aesthetics.
 * Features elegant animations, warm gradients, and modern design.
 */

import React from "react";
import { motion } from "framer-motion";
import { useResponsive } from "@/hooks/useResponsive";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import type { HeroSectionProps } from "@/types/components";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Link from "next/link";

/**
 * Default props for HeroSection
 */
const defaultProps: Required<Omit<HeroSectionProps, "backgroundImage" | "theme">> = {
  headline: "Welcome to Your Dashboard",
  description:
    "Streamline your workflow with our powerful, intuitive platform. Manage tasks, track progress, and collaborate seamlessly—all in one place.",
  ctaText: "Get Started",
  ctaLink: "/features",
};

/**
 * Feature highlights for the hero section
 */
const features = [
  { icon: CheckCircle2, text: "Smart Task Management", color: "text-green-600" },
  { icon: TrendingUp, text: "Progress Tracking", color: "text-sunset-600" },
  { icon: Zap, text: "Instant Sync", color: "text-amber" },
];

/**
 * HeroSection Component
 */
export const HeroSection: React.FC<Partial<HeroSectionProps>> = (props) => {
  const { headline, description, ctaText, ctaLink, backgroundImage } = {
    ...defaultProps,
    ...props,
  };

  const { isMobile } = useResponsive();

  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-16 md:px-8 lg:px-12"
      role="banner"
    >
      {/* Elegant warm gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-sunset-50 to-sunset-100" />
      
      {/* Decorative warm blobs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-linear-to-br from-sunset-300 to-sunset-400 rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-linear-to-br from-gold to-coral rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 107, 53, 0.3) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Text content */}
          <motion.div
            variants={staggerContainer}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sunset-100 to-sunset-200 border-2 border-sunset-300 rounded-full text-sunset-700 font-bold text-sm shadow-md"
            >
              <Sparkles size={16} className="text-sunset-600" />
              <span>Your productivity companion</span>
            </motion.div>

            {/* Headline - Split into lines for dramatic effect */}
            <motion.div variants={fadeInUp} className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #FF6B35 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Achieve More,
                </span>
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFB627 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Stress Less
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-sunset-700 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium"
            >
              {description}
            </motion.p>

            {/* Feature pills */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl shadow-md hover:shadow-lg hover:border-sunset-400 transition-all duration-200"
                >
                  <feature.icon size={18} className={feature.color} />
                  <span className="text-sm font-bold text-sunset-800">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <button
                onClick={() => {
                  if (ctaLink) {
                    window.location.href = ctaLink;
                  }
                }}
                className="group px-8 py-4 bg-linear-to-r from-sunset-500 to-sunset-600 rounded-xl text-white text-lg font-bold shadow-xl shadow-sunset-500/40 hover:shadow-2xl hover:shadow-sunset-500/50 hover:from-sunset-600 hover:to-sunset-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <Link href="https://github.com/sirecodes/FullStack-Todo-App/blob/main/backend/DEPLOYMENT-GUIDE.md">
                <button
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-700 text-lg font-bold hover:bg-sunset-50 hover:border-sunset-400 active:scale-95 transition-all duration-200"
                  >
                  Learn More
                </button>
                </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            {/* Floating card mockup */}
            <div className="relative">
              {/* Main card */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 bg-white/80 backdrop-blur-xl border-2 border-sunset-300 rounded-3xl p-8 shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Mock task items */}
                  {[
                    { title: "Complete project proposal", status: "done", color: "green" },
                    { title: "Review design mockups", status: "progress", color: "sunset" },
                    { title: "Team meeting at 3 PM", status: "pending", color: "gray" },
                  ].map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.15 }}
                      className="flex items-center gap-4 p-4 bg-linear-to-r from-sunset-50 to-white rounded-xl border border-sunset-200"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        task.status === "done" 
                          ? "bg-green-500 border-green-600" 
                          : task.status === "progress"
                          ? "bg-sunset-400 border-sunset-600"
                          : "border-gray-300"
                      }`}>
                        {task.status === "done" && (
                          <CheckCircle2 size={12} className="text-white" />
                        )}
                      </div>
                      <span className={`flex-1 font-semibold ${
                        task.status === "done" ? "line-through text-gray-500" : "text-sunset-800"
                      }`}>
                        {task.title}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating accent cards */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [2, 5, 2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-8 -right-8 bg-linear-to-br from-gold to-amber rounded-2xl p-6 shadow-xl border-2 border-sunset-300"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">12</p>
                  <p className="text-sm font-semibold text-sunset-100">Tasks Done</p>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [-2, -5, -2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-6 -left-6 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl p-6 shadow-xl border-2 border-sunset-700"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-sm font-semibold text-sunset-100">Completion</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,64 C360,96 720,32 1080,64 C1440,96 1440,120 1440,120 L0,120 Z"
            fill="url(#gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#FFB627" />
              <stop offset="100%" stopColor="#FF8C42" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.section>
  );
};

HeroSection.displayName = "HeroSection";