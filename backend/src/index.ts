import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(ao => origin.startsWith(ao))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Task Manager API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
