'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task, TasksResponse, CreateTaskData, UpdateTaskData } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const params: any = { page, limit: 10 };

            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }

            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await api.get<TasksResponse>('/tasks', { params });
            setTasks(response.data.tasks);
            setTotalPages(response.data.pagination.totalPages);
            setTotal(response.data.pagination.total);
        } catch {
            toast.error('Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    }, [user, page, statusFilter, searchQuery]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreateTask = async (data: CreateTaskData) => {
        try {
            await api.post('/tasks', data);
            toast.success('Task created successfully');
            setShowCreateModal(false);
            fetchTasks();
        } catch {
            toast.error('Failed to create task');
        }
    };

    const handleUpdateTask = async (id: number, data: UpdateTaskData) => {
        try {
            await api.patch(`/tasks/${id}`, data);
            toast.success('Task updated successfully');
            setShowEditModal(false);
            setEditingTask(null);
            fetchTasks();
        } catch {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const handleToggleTask = async (id: number) => {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            toast.success('Task status updated');
            fetchTasks();
        } catch {
            toast.error('Failed to update task status');
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Task Manager
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Welcome back, {user.name}!
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="btn-secondary text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter('ALL')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'ALL'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                All ({total})
                            </button>
                            <button
                                onClick={() => setStatusFilter('PENDING')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'PENDING'
                                    ? 'bg-yellow-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setStatusFilter('COMPLETED')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'COMPLETED'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Completed
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary w-full sm:w-auto"
                        >
                            + New Task
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input flex-1"
                        />
                    </div>
                </div>

                {/* Tasks List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {searchQuery || statusFilter !== 'ALL'
                                ? 'Try adjusting your filters'
                                : 'Create your first task to get started'}
                        </p>
                        {!searchQuery && statusFilter === 'ALL' && (
                            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                                Create Task
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onEdit={(task) => {
                                    setEditingTask(task);
                                    setShowEditModal(true);
                                }}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Create Task Modal */}
            {showCreateModal && (
                <TaskModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateTask}
                />
            )}

            {/* Edit Task Modal */}
            {showEditModal && editingTask && (
                <TaskModal
                    task={editingTask}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingTask(null);
                    }}
                    onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
                />
            )}
        </div>
    );
}

// Task Card Component
function TaskCard({
    task,
    onToggle,
    onEdit,
    onDelete,
}: {
    task: Task;
    onToggle: (id: number) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="card p-6 animate-fadeIn hover:scale-[1.01] transition-transform">
            <div className="flex items-start gap-4">
                <button
                    onClick={() => onToggle(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${task.status === 'COMPLETED'
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                        }`}
                >
                    {task.status === 'COMPLETED' && (
                        <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-lg font-semibold mb-1 ${task.status === 'COMPLETED'
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-slate-100'
                            }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className={`px-2 py-1 rounded-full ${task.status === 'COMPLETED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                            {task.status}
                        </span>
                        <span>•</span>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit task"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete task"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Task Modal Component
function TaskModal({
    task,
    onClose,
    onSubmit,
}: {
    task?: Task;
    onClose: () => void;
    onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
}) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState<'PENDING' | 'COMPLETED'>(task?.status || 'PENDING');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                title,
                description: description || undefined,
                status,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="card max-w-md w-full p-6 animate-slideIn">
                <h2 className="text-2xl font-bold mb-4">
                    {task ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            className="input"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="input min-h-[100px]"
                            placeholder="Enter task description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            className="input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'PENDING' | 'COMPLETED')}
                            disabled={isSubmitting}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
