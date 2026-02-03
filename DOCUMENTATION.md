# 📋 Task Management System - Complete Documentation

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [Setup Instructions](#setup-instructions)
9. [Testing Guide](#testing-guide)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

A full-stack Task Management System built with Node.js, TypeScript, Next.js, and PostgreSQL. The application provides secure user authentication and complete CRUD operations for task management with advanced features like pagination, filtering, and search.

### Key Highlights

- ✅ **Full-Stack TypeScript**: Both frontend and backend use TypeScript
- ✅ **Secure Authentication**: JWT-based with access and refresh tokens
- ✅ **Modern UI**: Responsive design with dark mode support
- ✅ **RESTful API**: Well-structured API with proper error handling
- ✅ **Database ORM**: Prisma for type-safe database operations
- ✅ **Production Ready**: Proper validation, error handling, and security

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Next.js        │────────▶│  Express API    │────────▶│  PostgreSQL     │
│  Frontend       │  HTTP   │  Backend        │  Prisma │  Database       │
│                 │◀────────│                 │◀────────│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Project Structure

```
earnest_noida_assignment/
├── backend/                 # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   └── index.ts        # App entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js pages (App Router)
│   │   ├── context/       # React contexts
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── .env.local
│   ├── package.json
│   └── tsconfig.json
│
├── README.md              # Project overview
├── QUICKSTART.md          # Setup guide
└── DOCUMENTATION.md       # This file
```

---

## ✨ Features

### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Access token (15 minutes) for API requests
- Refresh token (7 days) for token renewal
- Password hashing with bcrypt (10 rounds)
- Automatic token refresh on expiry
- Secure logout

### Task Management
- Create tasks with title, description, and status
- View all tasks with pagination
- Update task details
- Delete tasks
- Toggle task status (Pending ↔ Completed)
- Filter tasks by status
- Search tasks by title
- Pagination (10 tasks per page)

### User Interface
- Responsive design (mobile, tablet, desktop)
- Dark mode support (system preference)
- Smooth animations and transitions
- Toast notifications
- Loading states
- Empty states
- Form validation
- Error handling

---

## 🛠️ Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express | Web framework |
| TypeScript | Type safety |
| Prisma | ORM for database |
| PostgreSQL | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| express-validator | Input validation |
| cookie-parser | Cookie handling |
| cors | Cross-origin requests |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| React Context | State management |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "jwt-token"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "jwt-token"
}
```

#### 3. Refresh Token
```http
POST /auth/refresh
Cookie: refreshToken=<token>
```

**Response (200 OK):**
```json
{
  "accessToken": "new-jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### 4. Logout
```http
POST /auth/logout
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

### Task Endpoints

All task endpoints require authentication via `Authorization: Bearer <access-token>` header.

#### 1. Get All Tasks
```http
GET /tasks?page=1&limit=10&status=PENDING&search=title
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): PENDING or COMPLETED
- `search` (optional): Search by title

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "PENDING",
      "userId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### 2. Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Task description",
  "status": "PENDING",
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 3. Create Task
```http
POST /tasks
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description (optional)",
  "status": "PENDING"
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "New task",
    "description": "Task description",
    "status": "PENDING",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Update Task
```http
PATCH /tasks/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "COMPLETED"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "uuid",
    "title": "Updated title",
    "description": "Updated description",
    "status": "COMPLETED",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 5. Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

#### 6. Toggle Task Status
```http
PATCH /tasks/:id/toggle
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "message": "Task status toggled successfully",
  "task": {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "status": "COMPLETED",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Access token required"
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 🗄️ Database Schema

### User Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | String | UNIQUE, NOT NULL |
| password | String | NOT NULL (hashed) |
| name | String | NOT NULL |
| refreshToken | String | NULLABLE |
| createdAt | DateTime | DEFAULT NOW() |
| updatedAt | DateTime | AUTO UPDATE |

### Task Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | String | NOT NULL |
| description | String | NULLABLE |
| status | Enum | DEFAULT 'PENDING' |
| userId | UUID | FOREIGN KEY → User.id |
| createdAt | DateTime | DEFAULT NOW() |
| updatedAt | DateTime | AUTO UPDATE |

**Indexes:**
- `userId` (for faster user task queries)
- `status` (for filtering)

**Relationships:**
- User → Tasks (One to Many)
- Task → User (Many to One, CASCADE DELETE)

---

## 🔐 Authentication Flow

### Registration Flow
1. User submits registration form
2. Backend validates input
3. Password is hashed with bcrypt
4. User is created in database
5. Access and refresh tokens are generated
6. Refresh token saved to database and sent as HTTP-only cookie
7. Access token returned to client
8. Client stores access token in localStorage

### Login Flow
1. User submits login credentials
2. Backend validates email and password
3. Password is compared with hashed password
4. Access and refresh tokens are generated
5. Refresh token saved to database and sent as HTTP-only cookie
6. Access token returned to client
7. Client stores access token in localStorage

### Token Refresh Flow
1. Client makes API request with expired access token
2. Backend returns 401 Unauthorized
3. Client automatically calls /auth/refresh with refresh token cookie
4. Backend validates refresh token
5. New access token is generated and returned
6. Client retries original request with new access token

### Logout Flow
1. User clicks logout
2. Client calls /auth/logout with access token
3. Backend removes refresh token from database
4. Client clears access token from localStorage
5. User is redirected to login page

---

## 🚀 Setup Instructions

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

**Quick Setup:**

1. **Database**: Create PostgreSQL database named `taskmanager`
2. **Backend**: 
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🧪 Testing Guide

### Manual Testing

#### Test Authentication
1. Register a new user
2. Login with credentials
3. Verify access token is stored
4. Logout and verify token is cleared

#### Test Task CRUD
1. Create a new task
2. View task in list
3. Edit task details
4. Toggle task status
5. Delete task

#### Test Filtering & Search
1. Create multiple tasks with different statuses
2. Filter by PENDING status
3. Filter by COMPLETED status
4. Search by task title
5. Test pagination with 10+ tasks

### API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"Test Task","description":"Test Description","status":"PENDING"}'
```

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables:
   ```
   DATABASE_URL=<production-database-url>
   JWT_ACCESS_SECRET=<strong-random-secret>
   JWT_REFRESH_SECRET=<strong-random-secret>
   NODE_ENV=production
   FRONTEND_URL=<frontend-production-url>
   ```

2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

3. Build and start:
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment (Vercel)

1. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=<backend-production-url>
   ```

2. Deploy:
   ```bash
   npm run build
   ```

### Database (PostgreSQL)

Use managed PostgreSQL services:
- **Heroku Postgres**
- **Railway**
- **Supabase**
- **AWS RDS**

---

## 📝 Notes

- **Security**: Change JWT secrets before production
- **CORS**: Update CORS settings for production domains
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Consider adding rate limiting for API endpoints
- **Logging**: Implement proper logging for production

---

## 👨‍💻 Development

**Backend Development:**
```bash
cd backend
npm run dev          # Start with hot reload
npm run prisma:studio # Open database GUI
```

**Frontend Development:**
```bash
cd frontend
npm run dev          # Start with hot reload
npm run lint         # Run linter
```

---

## 📄 License

This project is created for educational purposes as part of a Software Engineering Assessment.

---

**Built with ❤️ using TypeScript, Next.js, and Node.js**
