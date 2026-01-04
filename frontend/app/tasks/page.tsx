/**
 * Tasks Page - Elegant Warm Sunset Theme
 *
 * Complete redesign with unique layout and warm colors.
 * Preserves all task management functionality and backend integration.
 */

'use client';

import React, { useState } from 'react';
import { Plus, ListTodo, Sparkles, ArrowLeft, Search, TrendingUp, CheckCircle2, Circle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TaskModal } from '@/components/tasks/TaskModal';
import { FilterDropdown } from '@/components/tasks/FilterDropdown';
import { TaskList, TaskListSummary } from '@/components/tasks/TaskList';
import { SortControls } from '@/components/tasks/SortControls';
import { TaskListSkeleton } from '@/components/shared/LoadingSkeleton';
import { useTasks } from '@/hooks/useTasks';
import { useFilters } from '@/hooks/useFilters';
import { useSort } from '@/hooks/useSort';
import type { Task, TaskStatus, Priority } from '@/types/task.types';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';


/**
 * Tasks page component
 */
export default function TasksPage() {
  const router = useRouter();
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters
  const {
    filterState,
    filteredTasks,
    activeFilterCount,
    toggleStatusFilter,
    togglePriorityFilter,
    setDueDateFilter,
    toggleTagFilter,
    clearAllFilters,
  } = useFilters(tasks);

  // Apply sorting to filtered tasks
  const {
    sortState,
    sortedTasks,
    setSortField,
    toggleDirection,
  } = useSort(filteredTasks);

  // Apply search
  const searchedTasks = sortedTasks.filter(task => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  /**
   * Handle create task
   */
  const handleCreateTask = async (taskData: Partial<Task>) => {
    await createTask({
      title: taskData.title!,
      description: taskData.description,
      due_date: undefined, // No due date
      tags: taskData.tags,
    });
    setShowCreateModal(false);
  };

  /**
   * Handle update task
   */
  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, {
      title: taskData.title!,
      description: taskData.description,
      due_date: undefined, // No due date
      tags: taskData.tags,
    });
    setEditingTask(null);
  };

  /**
   * Handle delete task
   */
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  /**
   * Handle toggle status
   */
  const handleToggleStatus = async (taskId: string) => {
    await toggleTaskStatus(taskId);
  };

  /**
   * Handle edit task
   */
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
    }
  };

  // Calculate stats
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const incompleteTasks = tasks.length - completedTasks;
  const urgentTasks = tasks.filter(t => t.priority === 'VERY_IMPORTANT' || t.priority === 'HIGH').length;

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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-br from-sunset-50 via-white to-sunset-100">
      {/* Subtle warm background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 107, 53, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Back Button and Create Task */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl text-sunset-600 hover:text-sunset-700 hover:bg-sunset-50 hover:border-sunset-400 transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            </button>
            
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                My Tasks
              </h1>
              <p className="text-sunset-600 text-sm mt-1 font-medium">
                Organize and accomplish your goals
              </p>
            </div>
          </div>

          {/* Right: Create Task Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-linear-to-r from-sunset-500 to-sunset-600 rounded-xl text-white font-bold shadow-lg shadow-sunset-500/40 hover:shadow-xl hover:shadow-sunset-500/50 hover:from-sunset-600 hover:to-sunset-700 active:scale-95 transition-all duration-200 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Task</span>
          </button>
        </motion.div>

        {/* Search Bar and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Search Bar - Larger, more prominent */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title, description, or tags..."
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-sunset-200 rounded-xl text-sunset-900 font-medium placeholder:text-sunset-400 focus:outline-none focus:ring-4 focus:ring-sunset-200 focus:border-sunset-500 hover:border-sunset-300 shadow-md transition-all duration-200"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <SortControls
              sortState={sortState}
              onSortFieldChange={setSortField}
              onToggleDirection={toggleDirection}
            />
          </div>
        </motion.div>

        {/* Task List - Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm border-2 border-sunset-200 rounded-2xl p-6 shadow-xl">
            {/* Task Count Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-sunset-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-sunset-400 to-sunset-500 rounded-lg shadow-md">
                  <ListTodo className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-sunset-800">
                    {searchQuery ? 'Search Results' : 'All Tasks'}
                  </h2>
                  <p className="text-sm text-sunset-600 font-medium">
                    {searchedTasks.length} {searchedTasks.length === 1 ? 'task' : 'tasks'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              </div>

              {/* Filter Button */}
              <FilterDropdown
                filters={{
                  status: filterState.status as TaskStatus[],
                  priority: filterState.priority as Priority[],
                  dueDate: 'all' as 'all' | 'overdue' | 'today' | 'this_week',
                }}
                onStatusChange={(status) => {
                  status.forEach(s => toggleStatusFilter(s));
                }}
                onPriorityChange={(priority) => {
                  priority.forEach(p => togglePriorityFilter(p));
                }}
                onDueDateChange={(dueDate) => {
                  console.log('Due date filter changed:', dueDate);
                }}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Task List */}
            {loading ? (
              <TaskListSkeleton count={5} />
            ) : (
              <TaskList
                tasks={searchedTasks}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                loading={false}
              />
            )}
          </div>
        </motion.div>

        {/* Stats Cards - Bottom, Elegant Design */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-sunset-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-sunset-600" />
              Task Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Total Tasks Card */}
              <div className="bg-linear-to-br from-white to-sunset-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-sunset-400 to-sunset-500 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200">
                    <ListTodo className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sunset-600 uppercase tracking-wide">Total Tasks</p>
                    <p className="text-4xl font-bold text-sunset-800 mt-1">{tasks.length}</p>
                  </div>
                </div>
                <p className="text-xs text-sunset-600 font-medium">All tasks in your list</p>
              </div>

              {/* Completed Tasks Card */}
              <div className="bg-linear-to-br from-white to-green-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200">
                    <CheckCircle2 className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Completed</p>
                    <p className="text-4xl font-bold text-green-800 mt-1">{completedTasks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">
                    {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Urgent Tasks Card */}
              <div className="bg-linear-to-br from-white to-red-50 border-2 border-red-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Flame className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-700 uppercase tracking-wide">High Priority</p>
                    <p className="text-4xl font-bold text-red-800 mt-1">{urgentTasks}</p>
                  </div>
                </div>
                <p className="text-xs text-red-600 font-medium">Urgent & important tasks</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Task Modals */}
        <TaskModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
        <TaskModal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          task={editingTask || undefined}
        />
      </div>
    </div>
  );
}