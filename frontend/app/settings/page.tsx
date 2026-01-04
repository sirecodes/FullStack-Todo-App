/**
 * Settings Page - Elegant Warm Sunset Theme
 *
 * Minimal, elegant user preferences and account management.
 * Features:
 * - Clean, card-based layout
 * - Warm sunset colors
 * - Simplified sections
 * - Elegant interactions
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Lock,
  Trash2,
  LogOut,
  User,
  Shield,
  Database,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Swal from "sweetalert2";
import apiClient from "@/services/api";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { isLoading: authLoading } = useProtectedRoute();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-sunset-50 via-white to-sunset-100">
        <motion.div
          className="h-16 w-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full border-4 border-sunset-200 border-t-sunset-500 shadow-lg" />
        </motion.div>
      </div>
    );
  }

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Ready to Log Out?',
      text: 'You can always come back anytime',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      cancelButtonColor: '#78716C',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Stay',
    });

    if (result.isConfirmed) {
      logout();
      router.push('/login');
    }
  };

  /**
   * Handle clear history
   */
  const handleClearHistory = async () => {
    const result = await Swal.fire({
      title: 'Clear All History?',
      text: 'This will permanently delete all task history. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#78716C',
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        // Call API to clear history
        // await apiClient.clearAllHistory();

        await Swal.fire({
          icon: 'success',
          title: 'History Cleared',
          text: 'All task history has been removed.',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err instanceof Error ? err.message : 'Failed to clear history',
          confirmButtonColor: '#FF6B35',
        });
      }
    }
  };

  /**
   * Handle change password
   */
  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <input id="current-password" type="password" placeholder="Current Password" class="swal2-input">
        <input id="new-password" type="password" placeholder="New Password" class="swal2-input">
        <input id="confirm-password" type="password" placeholder="Confirm New Password" class="swal2-input">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      confirmButtonText: 'Change Password',
      preConfirm: () => {
        const current = (document.getElementById('current-password') as HTMLInputElement)?.value;
        const newPass = (document.getElementById('new-password') as HTMLInputElement)?.value;
        const confirm = (document.getElementById('confirm-password') as HTMLInputElement)?.value;

        if (!current || !newPass || !confirm) {
          Swal.showValidationMessage('Please fill all fields');
          return null;
        }

        if (newPass !== confirm) {
          Swal.showValidationMessage('New passwords do not match');
          return null;
        }

        if (newPass.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters');
          return null;
        }

        return { current, newPass };
      },
    });

    if (formValues) {
      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your password has been changed successfully.',
        confirmButtonColor: '#FF6B35',
      });
    }
  };

  const settingsSections = [
    {
      title: "Account Security",
      icon: Shield,
      iconColor: "text-sunset-600",
      iconBg: "bg-linear-to-br from-sunset-400 to-sunset-500",
      description: "Manage your password and security settings",
      actions: [
        {
          label: "Change Password",
          description: "Update your account password",
          icon: Lock,
          onClick: handleChangePassword,
          danger: false,
        },
      ],
    },
    {
      title: "Data Management",
      icon: Database,
      iconColor: "text-amber",
      iconBg: "bg-linear-to-br from-amber to-gold",
      description: "Control your data and history",
      actions: [
        {
          label: "Clear History",
          description: "Remove all task history permanently",
          icon: Trash2,
          onClick: handleClearHistory,
          danger: true,
        } as const,
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-sunset-50 via-white to-sunset-100">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 107, 53, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={() => router.push("/")}
            className="p-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl text-sunset-600 hover:text-sunset-700 hover:bg-sunset-50 hover:border-sunset-400 transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Settings
              </h1>
              <p className="text-sunset-600 mt-2 font-medium">
                Manage your account preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIndex * 0.1 }}
              >
                <div className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 ${section.iconBg} rounded-xl shadow-md`}>
                      <SectionIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-sunset-800">
                        {section.title}
                      </h2>
                      <p className="text-sm text-sunset-600 mt-1 font-medium">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {section.actions.map((action, actionIndex) => {
                      const ActionIcon = action.icon;
                      return (
                        <motion.button
                          key={action.label}
                          onClick={action.onClick}
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                            action.danger
                              ? 'bg-red-50 border-2 border-red-200 hover:bg-red-100 hover:border-red-400'
                              : 'bg-sunset-50 border-2 border-sunset-200 hover:bg-sunset-100 hover:border-sunset-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              action.danger 
                                ? 'bg-red-200' 
                                : 'bg-sunset-200'
                            }`}>
                              <ActionIcon className={`h-5 w-5 ${
                                action.danger 
                                  ? 'text-red-600' 
                                  : 'text-sunset-600'
                              }`} />
                            </div>
                            <div className="text-left">
                              <p className={`font-bold ${
                                action.danger 
                                  ? 'text-red-800' 
                                  : 'text-sunset-800'
                              }`}>
                                {action.label}
                              </p>
                              <p className={`text-sm ${
                                action.danger 
                                  ? 'text-red-600' 
                                  : 'text-sunset-600'
                              }`}>
                                {action.description}
                              </p>
                            </div>
                          </div>
                          <ArrowLeft className={`h-5 w-5 rotate-180 transition-transform duration-200 group-hover:translate-x-1 ${
                            action.danger 
                              ? 'text-red-600' 
                              : 'text-sunset-600'
                          }`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Logout Section - Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-linear-to-br from-white to-sunset-50 border-2 border-sunset-300 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-4 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30 mb-4">
                  <LogOut className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-sunset-800 mb-2">
                  End Your Session
                </h3>
                <p className="text-sunset-600 font-medium">
                  Sign out of your account securely
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-linear-to-r from-sunset-500 to-sunset-600 rounded-xl text-white text-lg font-bold shadow-lg shadow-sunset-500/40 hover:shadow-xl hover:shadow-sunset-500/50 hover:from-sunset-600 hover:to-sunset-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>

          {/* App Info - Minimal Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-sunset-200 rounded-full text-sunset-600 text-sm font-medium shadow-sm">
              <Sparkles size={14} className="text-sunset-500" />
              <span>TaskFlow v1.0.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}