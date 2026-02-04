# Frontend - Task Management System

## Features

- ✅ User authentication (login/register)
- ✅ JWT token management with automatic refresh
- ✅ Task dashboard with CRUD operations
- ✅ Filtering by status (All, Pending, Completed)
- ✅ Search functionality
- ✅ Pagination
- ✅ Responsive design (mobile & desktop)
- ✅ Toast notifications
- ✅ Dark mode support
- ✅ Beautiful UI with animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── context/              # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities
│   └── api.ts           # Axios instance with interceptors
└── types/               # TypeScript types
    └── index.ts         # Type definitions
```

## Pages

### Home (`/`)
- Landing page with features overview
- Links to login and register

### Login (`/login`)
- Email and password authentication
- Redirects to dashboard on success

### Register (`/register`)
- User registration form
- Password confirmation
- Redirects to dashboard on success

### Dashboard (`/dashboard`)
- Protected route (requires authentication)
- Task list with filtering and search
- Create, edit, delete, and toggle tasks
- Pagination support

## Features in Detail

### Authentication
- JWT-based authentication
- Access token stored in localStorage
- Refresh token stored in HTTP-only cookie
- Automatic token refresh on expiry
- Logout functionality

### Task Management
- Create tasks with title, description, and status
- Edit existing tasks
- Delete tasks with confirmation
- Toggle task status (Pending ↔ Completed)
- Filter tasks by status
- Search tasks by title
- Paginated task list

### UI/UX
- Responsive design for all screen sizes
- Dark mode support (follows system preference)
- Smooth animations and transitions
- Loading states
- Toast notifications for user feedback
- Empty states with helpful messages

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)
