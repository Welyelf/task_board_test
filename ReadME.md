# Task Manager Application

A modern, feature-rich task management application built with Next.js, TypeScript, PostgreSQL, and Prisma. Organize your work with boards and tasks, featuring drag-and-drop functionality, analytics, and data export capabilities.

![Task Manager](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

## ✨ Features

### Core Features
- 📋 **Multiple Boards** - Create and manage multiple project boards
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- 🎯 **Kanban Board** - Visual board with TODO, IN_PROGRESS, and DONE columns
- 🖱️ **Drag & Drop** - Easily move tasks between columns
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode support
- 🔍 **Filter & Sort** - Filter by status and sort by date/priority
- 📊 **Analytics Dashboard** - Real-time insights into your productivity
- 📥 **Data Export** - Export all data as JSON or CSV

### Additional Features
- ⚡ Real-time updates (no page refresh needed)
- 🎨 Customizable board colors
- 📱 Fully responsive (works on all devices)
- 🌙 Dark mode support
- ⚠️ Smart delete confirmations
- 🔒 Cascade delete protection

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18.17.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **PostgreSQL** (v12 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

4. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

---

## 📦 Step-by-Step Setup

### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd taskmanage

# Or download and extract the ZIP file, then navigate to the folder
cd taskmanage
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16.1.1
- React 19
- Prisma 7.2.0
- TypeScript 5
- Tailwind CSS
- And all other dependencies

### 3. Set Up the Database

#### 3.1 Create PostgreSQL Database

Open your PostgreSQL terminal or pgAdmin and create a new database:

```sql
CREATE DATABASE tasks;
```

Or use the command line:

```bash
# Windows (Command Prompt)
psql -U postgres
CREATE DATABASE tasks;
\q

# Mac/Linux
psql -U postgres
CREATE DATABASE tasks;
\q
```

#### 3.2 Configure Environment Variables

1. Copy the example environment file:

```bash
# Windows (Command Prompt)
copy env.example .env

# Mac/Linux/Git Bash
cp env.example .env
```

2. Open `.env` file and update the database connection:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/tasks?schema=public"
```

**Replace:**
- `USERNAME` - Your PostgreSQL username (default: `postgres`)
- `PASSWORD` - Your PostgreSQL password

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/tasks?schema=public"
```

#### 3.3 Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables (projects, tasks)
- Set up relationships and indexes
- Generate Prisma Client

#### 3.4 Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run the Application

#### Development Mode

```bash
npm run dev
```

The application will start on: **http://localhost:3000**

#### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

---

## 🌐 Accessing the Application

Once the server is running, open your browser and navigate to:

```
http://localhost:3000
```

You should see the Task Manager homepage with:
- A "Go to Dashboard" button
- Feature highlights
- Modern, responsive design

---

## 📖 Usage Guide

### Creating Your First Board

1. Navigate to the **Dashboard** (`/dashboard`)
2. Click the **"New Board"** button
3. Enter board details:
   - Board name (required)
   - Description (optional)
   - Choose a color
4. Click **"Create Board"**

### Managing Tasks

1. Click on any board to open it
2. Click **"New Task"** or **"+ Add a card"** in any column
3. Fill in task details:
   - Title (required)
   - Description (optional)
   - Status (TODO, IN_PROGRESS, DONE)
   - Priority (LOW, MEDIUM, HIGH, URGENT)
   - Due date (optional)
4. **Drag and drop** tasks between columns to change status
5. Use **filters** to show specific statuses
6. Use **sort** to order by date, priority, or due date

### Viewing Analytics

On the Dashboard, you'll see:
- **Total Tasks** - Count of all tasks
- **To Do** - Tasks not started
- **In Progress** - Tasks being worked on
- **Completed** - Finished tasks
- **Completion Rate** - Percentage completed

### Exporting Data

1. Go to the Dashboard
2. Hover over **"Export Data"** button
3. Choose format:
   - **Export as JSON** - Complete data backup
   - **Export as CSV** - Spreadsheet format

---

## 🗂️ Project Structure

```
taskmanage/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data (optional)
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── projects/     # Board endpoints
│   │   │   └── tasks/        # Task endpoints
│   │   ├── boards/[id]/      # Board detail page
│   │   ├── dashboard/        # Dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/           # React components
│   │   ├── BoardCard.tsx
│   │   ├── TaskCard.tsx
│   │   ├── CreateBoardModal.tsx
│   │   ├── CreateTaskModal.tsx
│   │   └── ConfirmModal.tsx
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts        # Prisma client
│   │   └── api-response.ts  # API helpers
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build           # Build for production
npm start              # Start production server

# Database
npx prisma migrate dev  # Create and apply migrations
npx prisma generate     # Generate Prisma Client
npx prisma studio      # Open Prisma Studio (database GUI)
npx prisma db push     # Push schema changes without migrations

# Code Quality
npm run lint           # Run ESLint
```

---

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** "Can't reach database server"

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc (look for PostgreSQL)
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check your `.env` DATABASE_URL
3. Verify database exists: `psql -U postgres -l`
4. Test connection: `psql -U postgres -d tasks`

### Port Already in Use

**Problem:** "Port 3000 is already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Issues

**Problem:** "Prisma Client not found"

**Solution:**
```bash
npx prisma generate
```

### Migration Errors

**Problem:** Migration fails

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name fix_schema
```

---

## 🌟 API Endpoints

### Boards (Projects)
- `GET /api/projects` - Get all boards
- `POST /api/projects` - Create board
- `GET /api/projects/[id]` - Get single board with tasks
- `PATCH /api/projects/[id]` - Update board
- `DELETE /api/projects/[id]` - Delete board (cascades to tasks)

### Tasks
- `GET /api/tasks` - Get all tasks (supports filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get single task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

---

## 🎨 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5
- **Database:** PostgreSQL
- **ORM:** Prisma 7.2.0
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** Custom React components
- **Icons:** Heroicons (SVG)

---

## 📝 Database Schema

### Project (Board)
- `id` - Unique identifier
- `name` - Board name
- `description` - Optional description
- `color` - Hex color code
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Task
- `id` - Unique identifier
- `title` - Task title
- `description` - Optional description
- `status` - TODO | IN_PROGRESS | DONE
- `priority` - LOW | MEDIUM | HIGH | URGENT
- `dueDate` - Optional due date
- `completedAt` - Completion timestamp
- `projectId` - Foreign key to Project
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

**Relationships:**
- One Project has many Tasks
- One Task belongs to one Project
- Cascade delete: Deleting a Project deletes all its Tasks

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` (use a cloud PostgreSQL provider)
4. Deploy!

### Other Platforms

The application can be deployed to:
- Railway
- Render
- Heroku
- DigitalOcean
- Any platform supporting Node.js + PostgreSQL

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the error messages
3. Verify all prerequisites are installed
4. Check database connection and credentials

---

## 🎉 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Enjoy managing your tasks! 🚀**
