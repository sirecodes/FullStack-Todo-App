/**
 * History Page - Elegant Warm Sunset Theme
 *
 * Beautiful, minimal activity timeline with warm colors.
 * Preserves all history functionality and backend integration.
 */

"use client";

import React, { useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";
import { ArrowLeft, Clock, RefreshCw, Sparkles, Calendar, Activity } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";
import HistoryList from "@/components/history/HistoryList";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import apiClient from "@/services/api";

export default function HistoryPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useProtectedRoute();

  const {
    entries,
    loading,
    error,
    pagination,
    fetchHistory,
    clearError,
  } = useHistory();

  // Fetch first page on mount
  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchHistory(page);
  };

  const handleRefresh = () => {
    fetchHistory(pagination.page);
  };

  /**
   * Handle delete history entry
   */
  const handleDeleteEntry = async (historyId: string) => {
    try {
      await apiClient.deleteHistoryEntry(historyId);

      await Swal.fire({
        icon: 'success',
        title: 'Entry Removed',
        text: 'The history entry has been deleted.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });

      fetchHistory(pagination.page);
    } catch (err) {
      console.error('Error deleting history entry:', err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to delete history entry',
        confirmButtonColor: '#FF6B35',
      });
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sunset-50 via-white to-sunset-100">
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sunset-50 via-white to-sunset-100">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 107, 53, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with Back Button and Refresh */}
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

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl text-sunset-700 font-bold hover:bg-sunset-50 hover:border-sunset-400 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30">
              <Clock className="h-8 w-8 text-white" />
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
                Task History
              </h1>
              <p className="text-sunset-600 mt-2 font-medium flex items-center gap-2">
                <Activity size={16} />
                Track every action and change in your tasks
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && pagination.total_count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Total Events */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-sunset-400 to-sunset-500 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sunset-600 uppercase tracking-wide">Total Events</p>
                    <p className="text-3xl font-bold text-sunset-800 mt-1">{pagination.total_count}</p>
                  </div>
                </div>
                <p className="text-xs text-sunset-600 font-medium">All recorded activities</p>
              </div>

              {/* Current Page */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-amber to-gold rounded-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Activity size={20} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber uppercase tracking-wide">Page</p>
                    <p className="text-3xl font-bold text-sunset-800 mt-1">
                      {pagination.page}<span className="text-lg text-sunset-600">/{pagination.total_pages}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-sunset-600 font-medium">Current view position</p>
              </div>

              {/* Showing Count */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-coral to-sunset-400 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-coral uppercase tracking-wide">Showing</p>
                    <p className="text-3xl font-bold text-sunset-800 mt-1">{entries.length}</p>
                  </div>
                </div>
                <p className="text-xs text-sunset-600 font-medium">Events on this page</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  {error}
                </p>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex flex-col items-center">
              <motion.div
                className="h-16 w-16 mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-full w-full rounded-full border-4 border-sunset-200 border-t-sunset-600 shadow-lg" />
              </motion.div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #EA580C 0%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Loading Timeline
              </h3>
              <p className="text-sunset-600 font-medium">
                Gathering your activity history...
              </p>
            </div>
          </motion.div>
        )}

        {/* History List */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HistoryList
              entries={entries}
              pagination={pagination}
              onPageChange={handlePageChange}
              onDeleteEntry={handleDeleteEntry}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}