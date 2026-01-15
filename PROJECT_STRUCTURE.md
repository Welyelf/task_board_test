# Project Structure

Complete overview of the Task Manager application structure.

## Directory Structure

```
taskmanage/
│
├── prisma/                      # Prisma configuration
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Database seeding script
│
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/                         # Source code
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API Routes
│   │   │   ├── projects/      # Project endpoints
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts    # GET, PATCH, DELETE /api/projects/[id]
│   │   │   │   └── route.ts         # GET, POST /api/projects
│   │   │   │
│   │   │   ├── tasks/         # Task endpoints
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts    # GET, PATCH, DELETE /api/tasks/[id]
│   │   │   │   └── route.ts         # GET, POST /api/tasks
│   │   │   │
│   │   │   └── users/         # User endpoints
│   │   │       ├── [id]/
│   │   │       │   └── route.ts    # GET, PATCH, DELETE /api/users/[id]
│   │   │       └── route.ts         # GET, POST /api/users
│   │   │
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page
│   │
│   ├── lib/                   # Utility functions
│   │   ├── api-response.ts    # API response helpers
│   │   └── prisma.ts          # Prisma client singleton
│   │
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # Shared types and interfaces
│
├── .gitignore                 # Git ignore rules
├── API.md                     # API documentation
├── env.example                # Environment variables example
├── eslint.config.mjs          # ESLint configuration
├── next-env.d.ts              # Next.js TypeScript declarations
├── next.config.ts             # Next.js configuration
├── package.json               # Node dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── prisma.config.ts           # Prisma configuration
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Main documentation
├── SETUP.md                   # Setup instructions
└── tsconfig.json              # TypeScript configuration
```

## Key Files Explained

### Configuration Files

#### `package.json`
- Dependencies and dev dependencies
- NPM scripts for development, building, and database management
- Project metadata

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (`@/*` → `./src/*`)
- Include/exclude patterns

#### `next.config.ts`
- Next.js configuration
- Custom webpack config
- Environment variables

#### `prisma/schema.prisma`
- Database schema definition
- Models: User, Project, Task, Tag
- Relationships and indexes

#### `.env` (create this file)
- Environment variables
- Database connection string
- **Not tracked in git**

### Source Code

#### `src/lib/prisma.ts`
- Prisma Client singleton
- Prevents multiple instances in development
- Handles connection pooling

#### `src/lib/api-response.ts`
- Helper functions for consistent API responses
- Success and error response formatters
- Error handling utilities

#### `src/types/index.ts`
- TypeScript type definitions
- Prisma model exports
- Extended types with relations
- API request/response types

#### `src/app/api/*/route.ts`
- RESTful API route handlers
- CRUD operations
- Request validation
- Error handling

#### `src/app/layout.tsx`
- Root layout component
- Global metadata
- Font configuration
- Common UI structure

#### `src/app/page.tsx`
- Home page component
- Entry point of the application

## Database Schema

### Models

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
  projects  Project[]
}
```

#### Project
```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
  tasks       Task[]
}
```

#### Task
```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  projectId   String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  completedAt DateTime?
  user        User       @relation(fields: [userId], references: [id])
  project     Project?   @relation(fields: [projectId], references: [id])
  tags        Tag[]
}
```

#### Tag
```prisma
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  color     String?
  createdAt DateTime @default(now())
  tasks     Task[]
}
```

### Enums

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## API Routes

### Tasks API
- `GET /api/tasks` - List all tasks (with filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a single task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects API
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a single project
- `PATCH /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Users API
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get a single user
- `PATCH /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user

## NPM Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed sample data
```

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Development Workflow

1. **Make schema changes**: Edit `prisma/schema.prisma`
2. **Generate client**: Run `npm run db:generate`
3. **Update database**: Run `npm run db:push`
4. **Develop**: Run `npm run dev`
5. **View data**: Run `npm run db:studio`

## Best Practices

### Code Organization
- ✅ Separate API logic from UI components
- ✅ Use TypeScript for type safety
- ✅ Centralize API response formatting
- ✅ Use Prisma for database queries
- ✅ Keep route handlers focused and simple

### API Design
- ✅ RESTful conventions
- ✅ Consistent response format
- ✅ Proper HTTP status codes
- ✅ Input validation
- ✅ Error handling

### Database
- ✅ Use relations for data integrity
- ✅ Add indexes for performance
- ✅ Use enums for status fields
- ✅ Cascade deletes where appropriate
- ✅ Use cuid() for IDs

## Next Steps

1. **Authentication**: Add JWT or NextAuth.js
2. **Validation**: Add Zod for request validation
3. **Frontend**: Build React components
4. **Testing**: Add Jest and Playwright tests
5. **Deployment**: Deploy to Vercel
6. **Monitoring**: Add logging and error tracking

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
