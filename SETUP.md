# Task Manager Setup Guide

This guide will help you set up the Task Manager application from scratch.

## Prerequisites

1. **Node.js 18+** installed on your system
2. **PostgreSQL** database (local or cloud)
   - Local: Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Cloud: Use services like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

### Option A: Local PostgreSQL

1. Start PostgreSQL service
2. Create a database:
```bash
createdb taskmanager
```

3. Create `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager?schema=public"
```

Replace `postgres`, `password`, and `5432` with your PostgreSQL username, password, and port.

### Option B: Cloud PostgreSQL (Recommended for Production)

1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/)
2. Copy the connection string
3. Create `.env` file:
```env
DATABASE_URL="your-connection-string-here"
```

## Step 3: Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

## Step 4: Push Database Schema

```bash
npm run db:push
```

This creates all the tables in your database based on the Prisma schema.

## Step 5: (Optional) Seed Sample Data

Create some sample data for testing:

```bash
npm run db:seed
```

## Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taskmanage/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── tasks/         # Task CRUD endpoints
│   │   │   ├── projects/      # Project CRUD endpoints
│   │   │   └── users/         # User CRUD endpoints
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── api-response.ts    # API response helpers
│   └── types/
│       └── index.ts           # TypeScript types
├── .env                       # Environment variables (not in git)
├── package.json
└── README.md
```

## Available API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a single task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a single project
- `PATCH /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get a single user
- `PATCH /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user

## Testing API Endpoints

### Using curl

Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123","name":"John Doe"}'
```

Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Task","description":"This is a test task","userId":"USER_ID_HERE","priority":"HIGH","status":"TODO"}'
```

Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

### Using Prisma Studio

Open Prisma Studio to visually manage your database:
```bash
npm run db:studio
```

This opens a web interface at [http://localhost:5555](http://localhost:5555) where you can view and edit data.

## Database Schema Overview

### User
- `id` - Unique identifier
- `email` - Email address (unique)
- `name` - User's name
- `password` - Password (should be hashed in production)
- `tasks` - One-to-many relation with tasks
- `projects` - One-to-many relation with projects

### Project
- `id` - Unique identifier
- `name` - Project name
- `description` - Project description
- `color` - UI color for the project
- `userId` - Foreign key to user
- `tasks` - One-to-many relation with tasks

### Task
- `id` - Unique identifier
- `title` - Task title
- `description` - Task description
- `status` - TODO, IN_PROGRESS, DONE, or CANCELLED
- `priority` - LOW, MEDIUM, HIGH, or URGENT
- `dueDate` - Optional due date
- `userId` - Foreign key to user
- `projectId` - Optional foreign key to project
- `completedAt` - Timestamp when task was completed
- `tags` - Many-to-many relation with tags

### Tag
- `id` - Unique identifier
- `name` - Tag name (unique)
- `color` - UI color for the tag
- `tasks` - Many-to-many relation with tasks

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed sample data
```

## Troubleshooting

### Database connection issues
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running (if using local database)
- Check firewall settings for cloud databases

### Prisma Client errors
- Run `npm run db:generate` to regenerate the client
- Delete `node_modules/.prisma` and run `npm install`

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` for proper configuration

## Next Steps

1. Implement authentication (JWT, NextAuth.js, etc.)
2. Add password hashing (bcrypt)
3. Create frontend UI components
4. Add data validation (Zod, Yup)
5. Implement real-time updates (WebSockets, Pusher)
6. Add testing (Jest, Playwright)
7. Deploy to Vercel/Netlify

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
