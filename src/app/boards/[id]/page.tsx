'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal, { TaskFormData } from '@/components/CreateTaskModal';
import ConfirmModal from '@/components/ConfirmModal';
import { TaskWithRelations } from '@/types';
import { Project } from '@prisma/client';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<TaskWithRelations | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt');

  useEffect(() => {
    fetchBoard();
    fetchTasks();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/projects/${boardId}`);
      const data = await response.json();
      if (data.success) {
        setBoard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${boardId}`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          projectId: boardId,
          dueDate: taskData.dueDate || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (taskData: TaskFormData) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          dueDate: taskData.dueDate || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map((t) => (t.id === editingTask.id ? data.data : t)));
        setIsModalOpen(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter((t) => t.id !== taskToDelete));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map((t) => (t.id === taskId ? data.data : t)));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDragStart = (task: TaskWithRelations) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault(); // Allow drop
    setDragOverColumn(columnStatus);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Update status
    await handleStatusChange(draggedTask.id, newStatus);
    setDraggedTask(null);
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    
    // Apply sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        // createdAt (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Board not found
          </h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: board.color || '#6366f1' }}
                />
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {board.name}
                </h1>
              </div>
              {board.description && (
                <p className="text-zinc-600 dark:text-zinc-400 ml-4">
                  {board.description}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setDefaultStatus('TODO');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {taskStats.todo}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">To Do</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {taskStats.inProgress}
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">In Progress</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {taskStats.done}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Done</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="createdAt">Sort: Newest First</option>
                <option value="priority">Sort: Priority</option>
                <option value="dueDate">Sort: Due Date</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board - Trello Style */}
      <main className="h-[calc(100vh-280px)] overflow-x-auto py-6">
        <div className="flex gap-4 px-6 min-w-max h-full justify-center">
          {/* TODO Column */}
          <div 
            className={`flex flex-col w-80 h-full bg-zinc-100 dark:bg-zinc-900 rounded-lg transition-all ${
              dragOverColumn === 'TODO' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'TODO')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'TODO')}
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  To Do
                </h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full">
                  {taskStats.todo}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
              {filteredTasks.filter((t) => t.status === 'TODO').length === 0 ? (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setDefaultStatus('TODO');
                    setIsModalOpen(true);
                  }}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-sm"
                >
                  + Add a card
                </button>
              ) : (
                <>
                  {filteredTasks
                    .filter((t) => t.status === 'TODO')
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setDefaultStatus('TODO');
                      setIsModalOpen(true);
                    }}
                    className="w-full p-3 text-left text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    + Add a card
                  </button>
                </>
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div 
            className={`flex flex-col w-80 h-full bg-zinc-100 dark:bg-zinc-900 rounded-lg transition-all ${
              dragOverColumn === 'IN_PROGRESS' ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-black' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'IN_PROGRESS')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'IN_PROGRESS')}
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  In Progress
                </h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full">
                  {taskStats.inProgress}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
              {filteredTasks.filter((t) => t.status === 'IN_PROGRESS').length === 0 ? (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setDefaultStatus('IN_PROGRESS');
                    setIsModalOpen(true);
                  }}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-sm"
                >
                  + Add a card
                </button>
              ) : (
                <>
                  {filteredTasks
                    .filter((t) => t.status === 'IN_PROGRESS')
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setDefaultStatus('IN_PROGRESS');
                      setIsModalOpen(true);
                    }}
                    className="w-full p-3 text-left text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    + Add a card
                  </button>
                </>
              )}
            </div>
          </div>

          {/* DONE Column */}
          <div 
            className={`flex flex-col w-80 h-full bg-zinc-100 dark:bg-zinc-900 rounded-lg transition-all ${
              dragOverColumn === 'DONE' ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-black' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'DONE')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'DONE')}
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Done
                </h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full">
                  {taskStats.done}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
              {filteredTasks.filter((t) => t.status === 'DONE').length === 0 ? (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setDefaultStatus('DONE');
                    setIsModalOpen(true);
                  }}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-sm"
                >
                  + Add a card
                </button>
              ) : (
                <>
                  {filteredTasks
                    .filter((t) => t.status === 'DONE')
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setDefaultStatus('DONE');
                      setIsModalOpen(true);
                    }}
                    className="w-full p-3 text-left text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    + Add a card
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Task modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        mode={editingTask ? 'edit' : 'create'}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description || '',
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate
                  ? new Date(editingTask.dueDate).toISOString().split('T')[0]
                  : '',
              }
            : {
                title: '',
                description: '',
                status: defaultStatus,
                priority: 'MEDIUM',
                dueDate: '',
              }
        }
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
