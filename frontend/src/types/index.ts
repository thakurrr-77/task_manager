export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'PENDING' | 'COMPLETED';
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
}

export interface TasksResponse {
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'PENDING' | 'COMPLETED';
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'COMPLETED';
}
