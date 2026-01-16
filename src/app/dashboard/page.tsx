'use client';

import { useEffect, useState } from 'react';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Project } from '@prisma/client';

type BoardWithCount = Project & { _count: { tasks: number } };

export default function DashboardPage() {
  const [boards, setBoards] = useState<BoardWithCount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<BoardWithCount | null>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);

  // Fetch boards and tasks
  useEffect(() => {
    fetchBoards();
    fetchAllTasks();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setBoards(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (data.success) {
        setAllTasks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  // Create board
  const handleCreateBoard = async (boardData: {
    name: string;
    description: string;
    color: string;
  }) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boardData),
      });

      const data = await response.json();
      if (data.success) {
        setBoards([...boards, { ...data.data, _count: { tasks: 0 } }]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  // Delete board
  const handleDeleteBoard = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setBoardToDelete(board);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      const response = await fetch(`/api/projects/${boardToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setBoards(boards.filter((b) => b.id !== boardToDelete.id));
      }
    } catch (error) {
      console.error('Failed to delete board:', error);
    } finally {
      setBoardToDelete(null);
    }
  };

  const getDeleteMessage = () => {
    if (!boardToDelete) return '';
    const taskCount = boardToDelete._count?.tasks || 0;
    
    if (taskCount === 0) {
      return 'Are you sure you want to delete this board? This action cannot be undone.';
    } else if (taskCount === 1) {
      return `Are you sure you want to delete this board? It contains 1 task that will also be permanently deleted. This action cannot be undone.`;
    } else {
      return `Are you sure you want to delete this board? It contains ${taskCount} tasks that will also be permanently deleted. This action cannot be undone.`;
    }
  };

  // Analytics calculations
  const analytics = {
    totalTasks: allTasks.length,
    totalBoards: boards.length,
    todoTasks: allTasks.filter((t) => t.status === 'TODO').length,
    inProgressTasks: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    doneTasks: allTasks.filter((t) => t.status === 'DONE').length,
    completionRate: allTasks.length > 0 
      ? Math.round((allTasks.filter((t) => t.status === 'DONE').length / allTasks.length) * 100)
      : 0,
  };

  // Export functions
  const exportAsJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      boards: boards.map((board) => ({
        id: board.id,
        name: board.name,
        description: board.description,
        color: board.color,
        taskCount: board._count?.tasks || 0,
        createdAt: board.createdAt,
      })),
      tasks: allTasks,
      summary: analytics,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskmanager-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    // CSV headers
    const headers = [
      'Board Name',
      'Task Title',
      'Description',
      'Status',
      'Priority',
      'Due Date',
      'Created At',
      'Completed At',
    ];

    // CSV rows
    const rows = allTasks.map((task) => {
      const board = boards.find((b) => b.id === task.projectId);
      return [
        board?.name || 'N/A',
        task.title,
        task.description || '',
        task.status,
        task.priority,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        new Date(task.createdAt).toLocaleDateString(),
        task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '',
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskmanager-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                My Boards
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Manage your projects and tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors font-medium border border-zinc-300 dark:border-zinc-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={exportAsJSON}
                    className="w-full px-4 py-3 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-t-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export as JSON
                  </button>
                  <button
                    onClick={exportAsCSV}
                    className="w-full px-4 py-3 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-b-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export as CSV
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Board
              </button>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">
                {analytics.totalTasks}
              </div>
              <div className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Total Tasks</div>
            </div>

            {/* To Do Tasks */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                {analytics.todoTasks}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">To Do</div>
            </div>

            {/* In Progress Tasks */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-300">
                {analytics.inProgressTasks}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-400 font-medium">In Progress</div>
            </div>

            {/* Done Tasks */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-300">
                {analytics.doneTasks}
              </div>
              <div className="text-sm text-green-700 dark:text-green-400 font-medium">Completed</div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                {analytics.completionRate}%
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-400 font-medium">Completion</div>
            </div>
          </div>
        </div>
      </header>

      {/* Boards grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {boards.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              No boards yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Create your first board to start organizing your tasks
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create First Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={handleDeleteBoard} />
            ))}
          </div>
        )}
      </main>

      {/* Create board modal */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBoard}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setBoardToDelete(null);
        }}
        onConfirm={confirmDeleteBoard}
        title={`Delete "${boardToDelete?.name || 'Board'}"`}
        message={getDeleteMessage()}
        confirmText="Delete Board"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
