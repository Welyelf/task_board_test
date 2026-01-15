# Task Manager

A modern, full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud - see [SETUP.md](SETUP.md) for detailed instructions)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
```

3. **Set up the database:**
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Create database tables
npm run db:seed      # (Optional) Add sample data
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[API.md](API.md)** - Complete API documentation and examples

## 🎯 Features

✅ Full-stack TypeScript application  
✅ RESTful API with CRUD operations  
✅ PostgreSQL database with Prisma ORM  
✅ Type-safe database access  
✅ Project organization for tasks  
✅ Task priorities and status tracking  
✅ Tags for categorization  
✅ Due dates and completion tracking  
✅ User management

## Project Structure

```
taskmanage/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes (backend)
│   │   └── ...         # Pages and layouts
│   ├── components/     # React components
│   ├── lib/           # Utilities and database client
│   └── types/         # TypeScript type definitions
├── .env               # Environment variables (not in git)
├── package.json
└── tsconfig.json
```

## Features

- ✅ Full-stack TypeScript
- ✅ Type-safe database access with Prisma
- ✅ Server-side rendering with Next.js
- ✅ Modern UI with Tailwind CSS
- ✅ PostgreSQL database

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
