# Task Management System

A modern, professional task management application built with Next.js, React, TypeScript, and PostgreSQL.

![Task Manager](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue?style=for-the-badge&logo=postgresql)

## Features

✨ **Multiple Boards** - Organize your work with multiple project boards  
📋 **Task Management** - Create, update, delete, and track tasks  
🎨 **Modern UI** - Beautiful, responsive design with dark mode support  
⚡ **Real-time Updates** - Instant feedback and updates  
🏷️ **Priority System** - Low, Medium, High, and Urgent priorities  
📊 **Status Tracking** - Todo, In Progress, Done, and Cancelled  
📅 **Due Dates** - Set and track task deadlines  
🎯 **Filtering** - Filter tasks by status  

## Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

1. **Clone or navigate to the project:**

```bash
cd taskmanage
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Example for local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager?schema=public"
```

**Example for cloud (Neon, Supabase, Railway):**
```env
DATABASE_URL="postgresql://user:password@your-host.com:5432/taskmanager"
```

4. **Generate Prisma Client:**

```bash
npm run db:generate
```

5. **Push database schema:**

```bash
npm run db:push
```

6. **Seed sample data (optional):**

```bash
npm run db:seed
```

7. **Start development server:**

```bash
npm run dev
```

8. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
taskmanage/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── tasks/         # Task CRUD endpoints
│   │   │   ├── projects/      # Project CRUD endpoints
│   │   │   └── users/         # User CRUD endpoints
│   │   ├── boards/[id]/       # Board detail page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── BoardCard.tsx      # Board card component
│   │   ├── TaskCard.tsx       # Task card component
│   │   ├── CreateBoardModal.tsx
│   │   └── CreateTaskModal.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── api-response.ts    # API helpers
│   └── types/
│       └── index.ts           # TypeScript types
├── .env                       # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (supports filtering)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a single task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects (Boards)

- `GET /api/projects` - Get all boards
- `POST /api/projects` - Create a new board
- `GET /api/projects/[id]` - Get a single board
- `PATCH /api/projects/[id]` - Update a board
- `DELETE /api/projects/[id]` - Delete a board

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get a single user
- `PATCH /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user

## Available Scripts

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

## Database Schema

### User
- Unique ID (CUID)
- Email (unique)
- Name
- Password
- Created/Updated timestamps

### Project (Board)
- Unique ID (CUID)
- Name
- Description
- Color
- User ID (foreign key)
- Created/Updated timestamps

### Task
- Unique ID (CUID)
- Title
- Description
- Status (TODO, IN_PROGRESS, DONE, CANCELLED)
- Priority (LOW, MEDIUM, HIGH, URGENT)
- Due Date
- User ID (foreign key)
- Project ID (foreign key, optional)
- Completed At timestamp
- Created/Updated timestamps

### Tag
- Unique ID (CUID)
- Name (unique)
- Color
- Many-to-many relationship with tasks

## Usage Guide

### Creating a Board

1. Go to the Dashboard page
2. Click "New Board" button
3. Enter board name, description, and choose a color
4. Click "Create Board"

### Creating Tasks

1. Click on a board to open it
2. Click "New Task" button
3. Fill in task details (title, description, status, priority, due date)
4. Click "Create Task"

### Managing Tasks

- **Edit**: Click the three-dot menu on a task and select "Edit Task"
- **Delete**: Click the three-dot menu and select "Delete Task"
- **Change Status**: Use the quick action buttons in the task menu
- **Filter**: Use the filter buttons at the top of the board page

## Development

### Using Prisma Studio

Open the Prisma Studio web interface to visually manage your database:

```bash
npm run db:studio
```

This opens [http://localhost:5555](http://localhost:5555)

### Testing API Endpoints

Example using curl:

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","password":"password123"}'

# Create a board
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"My Board","description":"Description","color":"#6366f1","userId":"USER_ID"}'

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Details","status":"TODO","priority":"HIGH","userId":"USER_ID","projectId":"PROJECT_ID"}'
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (DATABASE_URL)
4. Deploy!

### Database Options

- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (Free tier available)
- **[Supabase](https://supabase.com/)** - PostgreSQL with auth & storage (Free tier)
- **[Railway](https://railway.app/)** - PostgreSQL hosting (Free tier)

## Future Enhancements

- [ ] User authentication (JWT, NextAuth.js)
- [ ] Password hashing (bcrypt)
- [ ] Real-time collaboration
- [ ] File attachments
- [ ] Comments on tasks
- [ ] Activity log
- [ ] Email notifications
- [ ] Mobile app
- [ ] Drag & drop task reordering
- [ ] Custom tags

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js, React, TypeScript, and PostgreSQL
