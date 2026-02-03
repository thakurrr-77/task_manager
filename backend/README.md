# Backend API - Task Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials and secrets

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```
POST /auth/refresh
Cookie: refreshToken=<token>
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>
```

### Tasks (All require authentication)

#### Get All Tasks
```
GET /tasks?page=1&limit=10&status=PENDING&search=title
Authorization: Bearer <access_token>
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (PENDING or COMPLETED)
- `search` (optional): Search by title

#### Get Single Task
```
GET /tasks/:id
Authorization: Bearer <access_token>
```

#### Create Task
```
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description (optional)",
  "status": "PENDING"
}
```

#### Update Task
```
PATCH /tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "COMPLETED"
}
```

#### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <access_token>
```

#### Toggle Task Status
```
PATCH /tasks/:id/toggle
Authorization: Bearer <access_token>
```

## Database Schema

### User
- id (UUID)
- email (String, unique)
- password (String, hashed)
- name (String)
- refreshToken (String, nullable)
- createdAt (DateTime)
- updatedAt (DateTime)

### Task
- id (UUID)
- title (String)
- description (String, nullable)
- status (Enum: PENDING, COMPLETED)
- userId (UUID, foreign key)
- createdAt (DateTime)
- updatedAt (DateTime)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
