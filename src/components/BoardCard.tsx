'use client';

import Link from 'next/link';
import { Project } from '@prisma/client';
import { useState } from 'react';

interface BoardCardProps {
  board: Project & { _count?: { tasks: number } };
  onDelete?: (boardId: string) => void;
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
  const taskCount = board._count?.tasks || 0;
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(board.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Color indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: board.color || '#6366f1' }}
      />

      {/* Delete button */}
      {onDelete && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete Board
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <Link href={`/boards/${board.id}`} className="block p-6">
        {/* Board name */}
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {board.name}
        </h3>

        {/* Description */}
        {board.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
            {board.description}
          </p>
        )}

        {/* Task count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
          <svg
            className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
}
