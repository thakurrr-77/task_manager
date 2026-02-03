import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get all tasks with pagination, filtering, and search
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Filtering
        const status = req.query.status as TaskStatus | undefined;

        // Searching
        const search = req.query.search as string | undefined;

        // Build where clause
        const where: any = {
            userId
        };

        if (status && (status === 'PENDING' || status === 'COMPLETED')) {
            where.status = status;
        }

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            };
        }

        // Get tasks with pagination
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.task.count({ where })
        ]);

        res.json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Get single task
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId  
            }
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json(task);
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

// Create task
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { title, description, status } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                status: status || 'PENDING',
                userId
            }
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Update task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId;
        const { id } = req.params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId
            }
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const { title, description, status } = req.body;

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status })
            }
        });

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId
            }
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        await prisma.task.delete({
            where: { id: taskId }
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

// Toggle task status
export const toggleTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId
            }
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Toggle status
        const newStatus = existingTask.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

        const task = await prisma.task.update({
            where: { id: taskId },
            data: { status: newStatus }
        });

        res.json({
            message: 'Task status toggled successfully',
            task
        });
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({ error: 'Failed to toggle task status' });
    }
};
