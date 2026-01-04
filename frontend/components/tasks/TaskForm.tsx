/**
 * TaskForm Component - Elegant Warm Sunset Theme
 *
 * Form for creating and editing tasks with validation.
 *
 * Features:
 * - Title input (required, 1-200 chars)
 * - Description textarea (optional, max 2000 chars)
 * - Tags multi-select with autocomplete from standard categories
 * - Auto-priority classification on submit
 * - Validation with user-friendly error messages
 *
 * @module components/tasks/TaskForm
 */

'use client';

import React, { useState, FormEvent } from 'react';
import { Tag as TagIcon, Sparkles } from 'lucide-react';
import type { Task } from '@/types/task.types';
import { classifyPriority } from '@/lib/skills/priority-classification';
import { validateSingleTag, getAvailableTags } from '@/lib/skills/task-tagging';
import { TagChip } from './TagChip';
import { STANDARD_TAGS } from '@/utils/tagCategories';

/**
 * TaskForm props
 */
interface TaskFormProps {
  /** Optional task to edit (if undefined, creates new task) */
  task?: Task;
  /** Callback when task is submitted */
  onSubmit: (task: Task) => void;
  /** Optional callback when form is cancelled */
  onCancel?: () => void;
  /** Optional submit button text (default: "Create Task" or "Update Task") */
  submitLabel?: string;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * TaskForm component
 *
 * Handles task creation and editing with validation and auto-classification.
 *
 * @example
 * <TaskForm
 *   onSubmit={(task) => createTask(task)}
 * />
 * // Renders: Form for creating a new task
 *
 * <TaskForm
 *   task={existingTask}
 *   onSubmit={(task) => updateTask(task)}
 *   onCancel={() => setEditMode(false)}
 * />
 * // Renders: Form for editing existing task with cancel button
 *
 * @param props - Component props
 * @returns Task form element
 */
export function TaskForm({ task, onSubmit, onCancel, submitLabel, className = '' }: TaskFormProps): React.ReactElement {
  const isEditMode = !!task;

  // Form state
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    // Description validation
    if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Auto-classify priority (without due date)
    const priority = classifyPriority({
      title: trimmedTitle,
      dueDate: undefined,
    });

    // Create task object
    const newTask: Task = {
      id: task?.id || crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription || undefined,
      dueDate: undefined, // Always null - unique to our version
      priority,
      status: task?.status || 'NOT_STARTED',
      tags,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newTask);

    // Reset form if creating new task
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setTags([]);
      setErrors({});
    }
  };

  /**
   * Handle tag addition
   */
  const handleAddTag = (tag: string) => {
    const validation = validateSingleTag(tags, tag);

    if (!validation.valid) {
      setErrors({ ...errors, tags: validation.errors[0] });
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
    setShowTagSuggestions(false);
    setErrors({ ...errors, tags: '' });
  };

  /**
   * Handle tag removal
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setErrors({ ...errors, tags: '' });
  };

  /**
   * Get filtered tag suggestions based on input
   */
  const getTagSuggestions = (): string[] => {
    const availableTags = getAvailableTags(tags);

    if (!tagInput.trim()) {
      return availableTags;
    }

    const lowerInput = tagInput.toLowerCase();
    return availableTags.filter((tag) => tag.toLowerCase().includes(lowerInput));
  };

  const tagSuggestions = getTagSuggestions();

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-5 rounded-2xl bg-linear-to-br from-white via-sunset-50 to-sunset-100 p-8 shadow-xl border-2 border-sunset-200 ${className}`}
    >
      {/* Form Header */}
      <div className="flex items-center gap-3 pb-2 border-b-2 border-sunset-200">
        <div className="p-2 rounded-lg bg-linear-to-br from-sunset-400 to-sunset-500 shadow-md">
          <Sparkles className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold text-sunset-800">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-bold text-sunset-800 mb-2">
          Task Title <span className="text-sunset-600">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`
            w-full rounded-xl border-2 px-4 py-3 text-sm font-medium
            bg-white/80 backdrop-blur-sm
            transition-all duration-200
            placeholder:text-sunset-300
            ${errors.title 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-sunset-300 focus:border-sunset-500 focus:ring-4 focus:ring-sunset-100'
            }
            hover:border-sunset-400
            focus:outline-none
          `}
          maxLength={200}
        />
        {errors.title && (
          <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {errors.title}
          </p>
        )}
        <p className="mt-2 text-xs font-medium text-sunset-600">{title.length}/200 characters</p>
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="task-description" className="block text-sm font-bold text-sunset-800 mb-2">
          Description <span className="text-sunset-500 text-xs">(optional)</span>
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details, notes, or context..."
          rows={4}
          className={`
            w-full rounded-xl border-2 px-4 py-3 text-sm font-medium
            bg-white/80 backdrop-blur-sm
            transition-all duration-200
            placeholder:text-sunset-300
            resize-none
            ${errors.description 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-sunset-300 focus:border-sunset-500 focus:ring-4 focus:ring-sunset-100'
            }
            hover:border-sunset-400
            focus:outline-none
          `}
          maxLength={2000}
        />
        {errors.description && (
          <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {errors.description}
          </p>
        )}
        <p className="mt-2 text-xs font-medium text-sunset-600">{description.length}/2000 characters</p>
      </div>

      {/* Tags Section */}
      <div>
        <label htmlFor="task-tags" className="block text-sm font-bold text-sunset-800 mb-2">
          Tags <span className="text-sunset-500 text-xs">({tags.length}/5)</span>
        </label>

        {/* Display current tags */}
        {tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagChip key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
              ))}
            </div>
          </div>
        )}

        {/* Tag input with autocomplete */}
        {tags.length < 5 && (
          <div className="relative">
            <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-400" size={18} />
            <input
              id="task-tags"
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagSuggestions(true);
              }}
              onFocus={() => setShowTagSuggestions(true)}
              onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
              placeholder="Add tags (Work, Personal, etc.)"
              className="
                w-full rounded-xl border-2 border-sunset-300 pl-12 pr-4 py-3 text-sm font-medium
                bg-white/80 backdrop-blur-sm
                placeholder:text-sunset-300
                hover:border-sunset-400
                focus:border-sunset-500 focus:outline-none focus:ring-4 focus:ring-sunset-100
                transition-all duration-200
              "
            />

            {/* Tag suggestions dropdown */}
            {showTagSuggestions && tagSuggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border-2 border-sunset-200 bg-white shadow-2xl max-h-56 overflow-y-auto">
                {tagSuggestions.map((tag) => {
                  const tagInfo = STANDARD_TAGS.find((t) => t.name === tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="
                        w-full px-4 py-3 text-left
                        hover:bg-linear-to-r hover:from-sunset-50 hover:to-sunset-100
                        transition-all duration-150
                        flex items-center justify-between gap-3
                        border-b border-sunset-100 last:border-b-0
                        group
                      "
                    >
                      <span className="font-semibold text-sunset-800 group-hover:text-sunset-600">
                        {tag}
                      </span>
                      <span className="text-xs text-sunset-500 group-hover:text-sunset-600">
                        {tagInfo?.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {errors.tags && (
          <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {errors.tags}
          </p>
        )}
        <p className="mt-2 text-xs font-medium text-sunset-600">
          Organize with categories: Work, Personal, Shopping, Health, Finance, Learning, Urgent
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="
            flex-1 rounded-xl px-6 py-3 text-sm font-bold
            bg-linear-to-r from-sunset-500 to-sunset-600
            text-white shadow-lg
            hover:from-sunset-600 hover:to-sunset-700
            hover:shadow-xl hover:shadow-sunset-500/30
            active:scale-98
            focus:outline-none focus:ring-4 focus:ring-sunset-300
            transition-all duration-200
          "
        >
          {submitLabel || (isEditMode ? '✨ Update Task' : '✨ Create Task')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-xl border-2 border-sunset-300 bg-white/80 backdrop-blur-sm
              px-6 py-3 text-sm font-bold text-sunset-700
              hover:bg-sunset-50 hover:border-sunset-400
              active:scale-98
              focus:outline-none focus:ring-4 focus:ring-sunset-200
              transition-all duration-200
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;