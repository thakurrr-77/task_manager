import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Generate tokens
const generateAccessToken = (userId: number): string => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m' // Short-lived access token
    });
};

const generateRefreshToken = (userId: number): string => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d' // Long-lived refresh token
    });
};

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token to database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            accessToken
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token to database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            accessToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Refresh token
export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }

        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { userId: number };

        // Check if refresh token exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        // Generate new access token
        const accessToken = generateAccessToken(user.id);

        res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Refresh token expired' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// Logout
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Remove refresh token from database
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });

        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};
