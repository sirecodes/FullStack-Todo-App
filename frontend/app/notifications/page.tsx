/**
 * Notifications Page - Elegant Warm Sunset Theme
 *
 * Beautiful, minimal notifications display with warm colors.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, CheckCheck, Inbox, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import apiClient from '@/services/api';

interface Notification {
  id: string;
  task_id: string;
  message: string;
  priority: string;
  created_at: string;
  read_at: string | null;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNotifications(filter === 'unread');
      setNotifications(response.notifications);
      setUnreadCount(response.unread_count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Notifications',
        text: err instanceof Error ? err.message : 'Failed to fetch notifications',
        confirmButtonColor: '#FF6B35',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      Swal.fire({
        icon: 'success',
        title: 'All Marked as Read',
        text: 'All notifications have been marked as read.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_at;
    if (filter === 'read') return !!n.read_at;
    return true;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sunset-50 via-white to-sunset-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 107, 53, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={() => router.push('/')}
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
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-2xl shadow-lg shadow-sunset-500/30">
              <Bell className="h-8 w-8 text-white" />
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
                Notifications
              </h1>
              <p className="text-sunset-600 mt-2 font-medium">
                Stay updated on your important tasks
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-sunset-800">{filteredNotifications.length}</span>
                  <span className="text-sm font-medium text-sunset-600">
                    {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <div className="px-3 py-1 bg-linear-to-r from-sunset-400 to-sunset-500 rounded-full text-white text-xs font-bold shadow-md">
                    {unreadCount} unread
                  </div>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-sunset-600 bg-sunset-50 border-2 border-sunset-200 rounded-xl hover:bg-sunset-100 hover:border-sunset-400 transition-all duration-200"
                >
                  <CheckCheck size={16} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-sunset-200 shadow-md"
        >
          {(['all', 'unread', 'read'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-linear-to-r from-sunset-500 to-sunset-600 text-white shadow-md'
                  : 'text-sunset-700 hover:bg-sunset-50'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sunset-300 border-t-sunset-600 mb-4" />
              <p className="text-sm text-sunset-600 font-medium">Loading notifications...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm border-2 border-sunset-200 p-16 rounded-2xl shadow-lg text-center"
          >
            <Inbox size={80} className="mx-auto text-sunset-300 mb-6" />
            <h3 className="text-2xl font-bold text-sunset-800 mb-3">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-sunset-600 font-medium max-w-md mx-auto">
              {filter === 'all'
                ? "You'll receive notifications for VERY IMPORTANT tasks due within 6 hours."
                : `Switch to "All" to see all notifications.`}
            </p>
          </motion.div>
        )}

        {/* Notifications List */}
        {!loading && filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {filteredNotifications.map((notification, index) => {
              const isUnread = !notification.read_at;
              const isVeryImportant = notification.priority === 'VERY_IMPORTANT';

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  onClick={() => isUnread && markAsRead(notification.id)}
                  className={`group cursor-pointer transition-all duration-200 ${
                    isUnread ? 'hover:scale-[1.01]' : ''
                  }`}
                >
                  <div className={`p-5 rounded-xl border-2 shadow-md transition-all ${
                    isUnread
                      ? 'bg-white/90 backdrop-blur-sm border-sunset-300 hover:border-sunset-500 hover:shadow-lg'
                      : 'bg-gray-50/80 backdrop-blur-sm border-gray-200 opacity-70'
                  } ${isVeryImportant && isUnread ? 'ring-2 ring-sunset-400' : ''}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl shadow-md ${
                        isVeryImportant 
                          ? 'bg-linear-to-br from-sunset-400 to-sunset-500' 
                          : 'bg-linear-to-br from-gray-300 to-gray-400'
                      }`}>
                        <Bell size={20} className="text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-2 leading-relaxed ${
                          isUnread
                            ? 'text-sunset-900 font-bold'
                            : 'text-gray-600 font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-sunset-600 font-medium">
                          <Clock size={14} />
                          <span>{formatTime(notification.created_at)}</span>
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {isUnread && (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-3 h-3 bg-linear-to-br from-sunset-500 to-sunset-600 rounded-full shadow-md" />
                          <span className="text-xs font-bold text-sunset-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Mark read
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}