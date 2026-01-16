'use client';

import { TaskWithRelations } from '@/types';
import { useState } from 'react';

interface TaskCardProps {
  task: TaskWithRelations;
  onEdit?: (task: TaskWithRelations) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: string) => void;
  onDragStart?: (task: TaskWithRelations) => void;
  isDragging?: boolean;
}

const statusColors = {
  TODO: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const priorityColors = {
  LOW: 'text-zinc-500',
  MEDIUM: 'text-blue-500',
  HIGH: 'text-orange-500',
  URGENT: 'text-red-500',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onDragStart, isDragging }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(task);
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className={`group bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Task title */}
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Status and Priority badges */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                statusColors[task.status]
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
            <span className={`flex items-center gap-1 text-xs font-medium ${priorityColors[task.priority]}`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a.75.75 0 01.75.75v7.5h7.5a.75.75 0 010 1.5h-7.5v7.5a.75.75 0 01-1.5 0v-7.5h-7.5a.75.75 0 010-1.5h7.5v-7.5A.75.75 0 0110 2z" />
              </svg>
              {task.priority}
            </span>
          </div>

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    Edit Task
                  </button>
                )}
                {onStatusChange && (
                  <>
                    <button
                      onClick={() => {
                        onStatusChange(task.id, 'IN_PROGRESS');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => {
                        onStatusChange(task.id, 'DONE');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Mark Complete
                    </button>
                  </>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete Task
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
