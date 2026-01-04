/**
 * TaskModal Component - Elegant Warm Sunset Theme
 *
 * Beautiful dialog for creating and editing tasks with warm elegant styling.
 *
 * Features:
 * - Warm gradient background with soft shadows
 * - Elegant form inputs with sunset colors
 * - Priority selection with warm color-coded badges
 * - Tag selection with elegant chips
 * - Animated entrance/exit
 * - Form validation with warm error states
 * - NO DUE DATE (unique to our version)
 *
 * @module components/tasks/TaskModal
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag as TagIcon, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task, Priority } from '@/types/task.types';
import { PRIORITY_LABELS } from '@/types/task.types';
import { STANDARD_TAGS } from '@/utils/tagCategories';
import { getPriorityColor, getPriorityBgColor } from '@/utils/priorityColors';

/**
 * TaskModal props
 */
interface TaskModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when task is submitted */
  onSubmit: (task: Partial<Task>) => Promise<void>;
  /** Task to edit (if editing) */
  task?: Task;
  /** Trigger button element */
  trigger?: React.ReactNode;
}

/**
 * Priority options with warm sunset colors
 */
const PRIORITY_CONFIG = {
  VERY_IMPORTANT: {
    label: 'Very Important',
    color: '#C2410C', // sunset-700
    bgColor: '#FED7AA', // sunset-200
    emoji: '🔥'
  },
  HIGH: {
    label: 'High',
    color: '#EA580C', // sunset-600
    bgColor: '#FFEDD5', // sunset-100
    emoji: '⚡'
  },
  MEDIUM: {
    label: 'Medium',
    color: '#FB923C', // sunset-400
    bgColor: '#FFF8F0', // sunset-50
    emoji: '⭐'
  },
  LOW: {
    label: 'Low',
    color: '#78716C', // warm gray
    bgColor: '#FFF8F0', // sunset-50
    emoji: '💫'
  },
};

/**
 * TaskModal component
 *
 * Renders an elegant modal for creating/editing tasks.
 *
 * @example
 * <TaskModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={handleCreate}
 * />
 *
 * @param props - Component props
 * @returns Task modal element
 */
export function TaskModal({ open, onClose, onSubmit, task, trigger }: TaskModalProps) {
  const isEditing = !!task;

  // Form state
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'MEDIUM');
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setSelectedTags(task.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setSelectedTags([]);
    }
    setError('');
  }, [task, open]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 200) {
      setError('Title must be less than 200 characters');
      return;
    }

    if (description.length > 1000) {
      setError('Description must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: undefined, // Always null - unique to our version
        tags: selectedTags,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Toggle tag selection
   */
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const content = (
    <DialogContent className="sm:max-w-150 bg-linear-to-br from-white via-sunset-50 to-sunset-100 backdrop-blur-xl border-2 border-sunset-300 shadow-[0_10px_80px_rgba(255,107,53,0.25)] rounded-2xl">
      <DialogHeader className="border-b-2 border-sunset-200 pb-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-sunset-400 to-sunset-600 shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <DialogTitle
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <DialogDescription className="text-sunset-600 font-medium mt-1">
              {isEditing ? 'Update task details below' : 'Fill in the details to create a new task'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5 mt-2">
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3.5 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm font-semibold shadow-sm"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Title input */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-bold text-sunset-800 flex items-center gap-1">
            Task Title <span className="text-sunset-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-900 font-medium placeholder:text-sunset-400 focus:outline-none focus:ring-4 focus:ring-sunset-200 focus:border-sunset-500 hover:border-sunset-400 shadow-sm transition-all duration-200"
            maxLength={200}
            required
          />
          <p className="text-xs text-sunset-600 font-semibold text-right">{title.length}/200</p>
        </div>

        {/* Description input */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold text-sunset-800">
            Description <span className="text-sunset-500 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, notes, or context..."
            rows={4}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-900 font-medium placeholder:text-sunset-400 focus:outline-none focus:ring-4 focus:ring-sunset-200 focus:border-sunset-500 hover:border-sunset-400 shadow-sm transition-all duration-200 resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-sunset-600 font-semibold text-right">{description.length}/1000</p>
        </div>

        {/* Priority select */}
        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-bold text-sunset-800">
            Priority Level
          </label>
          <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-800 font-semibold focus:ring-4 focus:ring-sunset-200 focus:border-sunset-500 hover:border-sunset-400 h-12 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-sunset-200 rounded-xl shadow-2xl">
              {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="text-sunset-800 font-semibold hover:bg-sunset-50 focus:bg-sunset-100 rounded-lg my-1 mx-1 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-lg">{config.emoji}</span>
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: config.color }}
                    />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags section */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-sunset-800 flex items-center gap-2">
            <TagIcon size={16} />
            Tags
            <span className="text-xs font-normal text-sunset-600">({selectedTags.length}/5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {STANDARD_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  disabled={!isSelected && selectedTags.length >= 5}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-linear-to-r from-sunset-400 to-sunset-500 text-white border-2 border-sunset-600 shadow-lg shadow-sunset-500/30 scale-105'
                      : 'bg-white/80 backdrop-blur-sm text-sunset-700 border-2 border-sunset-200 hover:bg-sunset-50 hover:border-sunset-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-sunset-50 rounded-xl border border-sunset-200">
              <span className="text-xs font-semibold text-sunset-700">Selected:</span>
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-sunset-600 border border-sunset-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t-2 border-sunset-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border-2 border-sunset-300 rounded-xl text-sunset-700 font-bold hover:bg-sunset-50 hover:border-sunset-400 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2.5 bg-linear-to-r from-sunset-500 to-sunset-600 rounded-xl text-white font-bold shadow-lg shadow-sunset-500/40 hover:shadow-xl hover:shadow-sunset-500/50 hover:from-sunset-600 hover:to-sunset-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                {isEditing ? 'Update Task' : 'Create Task'}
              </span>
            )}
          </button>
        </div>
      </form>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {content}
    </Dialog>
  );
}

export default TaskModal;