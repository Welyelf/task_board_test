# Architecture Decisions

This document explains the technical decisions made in building the Task Manager application.

---

## 1. Technology Choices

### Why Next.js 16 with App Router?

**Chosen:** Next.js 16 with App Router (not Pages Router)

**Reasons:**
- **App Router is the future** - Next.js is moving away from Pages Router, App Router is the recommended approach
- **Server Components by default** - Better performance with less JavaScript sent to client
- **Improved routing** - File-system based routing with layouts and nested routes
- **API Routes co-located** - API endpoints live in the same `app/` directory structure
- **TypeScript support** - Excellent TypeScript integration out of the box

**Trade-offs:**
- Steeper learning curve than Pages Router
- Some third-party libraries still catching up
- More verbose file structure

### Why PostgreSQL?

**Chosen:** PostgreSQL (not MySQL, MongoDB, or SQLite)

**Reasons:**
- **Relational data** - Tasks and Boards have clear relationships (one-to-many)
- **ACID compliance** - Need reliable transactions for data integrity
- **Powerful features** - Support for complex queries, indexes, and constraints
- **Production-ready** - Industry standard, used by major companies
- **Prisma compatibility** - Excellent ORM support

**Why NOT NoSQL (MongoDB)?**
- Our data is highly relational (boards → tasks)
- Need foreign keys and cascade deletes
- Schema validation is important

**Why NOT SQLite?**
- SQLite is file-based, not suitable for production
- No concurrent write support
- We need a real database server

### Why Prisma ORM?

**Chosen:** Prisma (not Drizzle, TypeORM, or raw SQL)

**Reasons:**
- **Type-safe queries** - Auto-generated TypeScript types from schema
- **Great DX** - Intuitive API, migrations, and Prisma Studio
- **Migration system** - Easy to version control database changes
- **Performance** - Optimized queries with connection pooling
- **Active development** - Well-maintained, modern tooling

### Why Tailwind CSS?

**Chosen:** Tailwind CSS (not CSS Modules, Styled Components, or plain CSS)

**Reasons:**
- **Utility-first** - Fast development with pre-built classes
- **No CSS files** - Styles co-located with components
- **Responsive by default** - Mobile-first breakpoints
- **Dark mode support** - Built-in dark mode utilities
- **Small bundle size** - Purges unused styles in production
- **Consistency** - Design system built into utility classes

**Trade-offs:**
- Can make JSX look cluttered
- Learning curve for utility class names
- Requires PostCSS configuration

---

## 2. Data Structure Design

### Database Schema

```
┌─────────────┐
│   Project   │
│  (Board)    │
├─────────────┤
│ id          │──┐
│ name        │  │
│ description │  │
│ color       │  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
                 │ One-to-Many
                 │
                 │
┌─────────────┐  │
│    Task     │  │
├─────────────┤  │
│ id          │  │
│ title       │  │
│ description │  │
│ status      │  │
│ priority    │  │
│ dueDate     │  │
│ completedAt │  │
│ projectId   │──┘ (Foreign Key)
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

### Why This Design?

**Project Table:**
- **Simple structure** - Only essential fields (no over-engineering)
- **Color field** - Allows visual customization of boards
- **Timestamps** - Track when boards were created/modified

**Task Table:**
- **Status enum** - Enforces valid values (TODO, IN_PROGRESS, DONE)
- **Priority enum** - Structured priority levels (LOW, MEDIUM, HIGH, URGENT)
- **Optional fields** - Description and dueDate are nullable for flexibility
- **completedAt** - Automatically set when status changes to DONE

**Why Foreign Key (projectId)?**
- **Data integrity** - Can't create orphaned tasks
- **Cascade delete** - When board deleted, all tasks automatically deleted
- **Query efficiency** - Indexed for fast lookups

### What Happens When You Delete a Board?

**Cascade Delete Strategy:**

```typescript
project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
```

**Behavior:**
1. User clicks "Delete Board"
2. Confirmation modal shows: "Board has X tasks that will be deleted"
3. If confirmed, API deletes board
4. PostgreSQL automatically deletes all associated tasks
5. Frontend removes board from list immediately

**Why Cascade Delete?**
- ✅ **Data integrity** - No orphaned tasks in database
- ✅ **User clarity** - Clear warning of consequences
- ✅ **Simplicity** - One API call handles everything
- ✅ **Clean database** - No manual cleanup needed

**Alternative Considered:**
- **Prevent deletion** if board has tasks - Rejected because:
  - Forces users to manually delete all tasks first
  - Poor UX (many clicks)
  - Users may want to delete entire project quickly

---

## 3. API Design

### RESTful API Structure

**Endpoints:**

```
Projects (Boards):
├── GET    /api/projects           → List all boards
├── POST   /api/projects           → Create board
├── GET    /api/projects/[id]      → Get board with tasks
├── PATCH  /api/projects/[id]      → Update board
└── DELETE /api/projects/[id]      → Delete board

Tasks:
├── GET    /api/tasks              → List all tasks (with filters)
├── POST   /api/tasks              → Create task
├── GET    /api/tasks/[id]         → Get single task
├── PATCH  /api/tasks/[id]         → Update task
└── DELETE /api/tasks/[id]         → Delete task
```

### Why This Structure?

**RESTful Principles:**
- **Resource-based URLs** - `/projects` and `/tasks` represent resources
- **HTTP methods match actions** - GET (read), POST (create), PATCH (update), DELETE (delete)
- **Hierarchical** - `/projects/[id]` for specific resources
- **Predictable** - Standard REST conventions

**Why PATCH instead of PUT?**
- PATCH allows partial updates (only send changed fields)
- PUT requires sending entire object
- More efficient for our use case

**Why Separate Task Endpoints?**
- Tasks can be managed independently of boards
- Allows filtering/sorting across all boards
- Better separation of concerns

### API Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

**Why This Format?**
- **Consistent structure** - Frontend always knows what to expect
- **Success flag** - Easy boolean check
- **Separate error/message** - Technical vs user-friendly messages
- **Status codes** - HTTP codes (200, 201, 400, 404, 500) plus JSON

### Data Validation

**Server-side validation:**
```typescript
if (!body.name) {
  return errorResponse('Name is required', 400);
}
```

**Why Server-side?**
- ✅ **Security** - Can't trust client-side validation
- ✅ **Consistency** - Single source of truth
- ✅ **Error handling** - Proper HTTP status codes

---

## 4. Frontend Organization

### File Structure

```
src/app/
├── api/                    # API routes (server)
│   ├── projects/
│   │   ├── route.ts        # GET, POST /api/projects
│   │   └── [id]/route.ts   # GET, PATCH, DELETE /api/projects/[id]
│   └── tasks/
│       ├── route.ts        # GET, POST /api/tasks
│       └── [id]/route.ts   # GET, PATCH, DELETE /api/tasks/[id]
├── boards/[id]/            # Dynamic route
│   └── page.tsx            # Board detail page
├── dashboard/
│   └── page.tsx            # Dashboard page
├── layout.tsx              # Root layout
├── page.tsx                # Homepage
└── globals.css             # Global styles

src/components/
├── BoardCard.tsx           # Board list item
├── TaskCard.tsx            # Task item with drag-and-drop
├── CreateBoardModal.tsx    # Modal for creating boards
├── CreateTaskModal.tsx     # Modal for creating/editing tasks
└── ConfirmModal.tsx        # Reusable confirmation dialog

src/lib/
├── prisma.ts               # Prisma client singleton
└── api-response.ts         # API response helpers

src/types/
└── index.ts                # TypeScript type definitions
```

### State Management

**Approach:** React useState (no Redux, Zustand, or Context)

**Why Local State?**
- ✅ **Simple application** - No need for global state complexity
- ✅ **Component isolation** - Each page manages its own data
- ✅ **Server as source of truth** - Always fetch fresh data from API
- ✅ **No prop drilling** - Pages are self-contained

**State Location:**

```typescript
// Dashboard Page State
const [boards, setBoards] = useState([]);        // Board list
const [isModalOpen, setIsModalOpen] = useState(false);

// Board Detail Page State
const [board, setBoard] = useState(null);        // Current board
const [tasks, setTasks] = useState([]);          // Task list
const [draggedTask, setDraggedTask] = useState(null);  // Drag state
const [filterStatus, setFilterStatus] = useState('ALL');
const [sortBy, setSortBy] = useState('createdAt');
```

**Why No Redux?**
- Application is small enough
- No shared state between routes
- Each page fetches its own data
- Would add unnecessary complexity

### Component Design

**Component Hierarchy:**

```
Dashboard Page
├── Header (inline)
├── Analytics Cards (inline)
└── Board Grid
    └── BoardCard (reusable component)
        └── Delete Menu

Board Detail Page
├── Header (inline)
├── Stats Cards (inline)
├── Filter/Sort Controls (inline)
└── Kanban Columns (inline)
    └── TaskCard (reusable component)
        └── Edit/Delete Menu

Modals (reusable)
├── CreateBoardModal
├── CreateTaskModal
└── ConfirmModal
```

**Why This Structure?**
- **Reusable components** - Only extract when truly reusable (BoardCard, TaskCard, Modals)
- **Inline components** - Keep layout-specific code in page files
- **Composition** - Pass callbacks for actions (onDelete, onEdit)
- **Single responsibility** - Each component has one job

### Routing

**App Router Structure:**

```
/                           → Homepage (landing)
/dashboard                  → Board list
/boards/[id]               → Board detail (Kanban view)
/api/projects              → API endpoints
/api/tasks                 → API endpoints
```

**Why This Routing?**
- **Clear hierarchy** - `/dashboard` → `/boards/[id]` makes sense
- **Dynamic routes** - `[id]` parameter for board detail
- **Separation** - API routes separated from pages
- **SEO-friendly** - Descriptive URLs

**Navigation:**
```typescript
// Push navigation
router.push('/dashboard');

// Link component
<Link href={`/boards/${board.id}`}>
```

---

## 5. What Would I Change?

### Improvements with More Time

#### 1. State Management (Priority: High)
**Current:** Local useState in each page
**Better:** React Query / TanStack Query

**Why?**
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states built-in

**Implementation:**
```typescript
const { data: boards, isLoading } = useQuery({
  queryKey: ['boards'],
  queryFn: fetchBoards,
});
```

#### 2. Form Validation (Priority: High)
**Current:** Basic client-side validation
**Better:** React Hook Form + Zod

**Why?**
- Type-safe validation schemas
- Better error messages
- Reusable validation logic

**Example:**
```typescript
const schema = z.object({
  title: z.string().min(1, "Title required"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});
```

#### 3. Testing (Priority: Critical)
**Current:** Manual testing only
**Better:** Automated test suite

**What's Missing:**
- Unit tests for API endpoints (Jest)
- Component tests (React Testing Library)
- E2E tests (Playwright)
- API integration tests

**Example:**
```typescript
describe('Task API', () => {
  it('should create a task', async () => {
    const task = await createTask({ title: 'Test' });
    expect(task.status).toBe('TODO');
  });
});
```

#### 4. Error Handling (Priority: Medium)
**Current:** Console.log errors
**Better:** Toast notifications

**Why?**
- User feedback
- Better UX
- Error recovery

**Library:** react-hot-toast or sonner

#### 5. Optimistic Updates (Priority: Medium)
**Current:** Wait for API response, then update UI
**Better:** Update UI immediately, rollback on error

**Example:**
```typescript
// Optimistic update
setTasks([newTask, ...tasks]);

// Then call API
const response = await createTask(newTask);

// Rollback on error
if (!response.success) {
  setTasks(tasks);
}
```

### Known Problems

#### 1. No Loading States
**Problem:** Page shows stale data while fetching
**Impact:** Medium - Can be confusing for users
**Fix:** Add skeleton loaders with `loading.tsx` files

#### 2. No Error Boundaries
**Problem:** Crashes show white screen
**Impact:** High - Bad user experience
**Fix:** Add React Error Boundaries

#### 3. No Authentication
**Problem:** Single-user application only
**Impact:** High - Can't be used by multiple people
**Fix:** Add NextAuth.js with session management

#### 4. No Real-time Updates
**Problem:** Changes don't sync across tabs/windows
**Impact:** Low - Not critical for single-user
**Fix:** WebSockets or polling

#### 5. No Data Pagination
**Problem:** Loads all tasks at once
**Impact:** Low now, High with many tasks
**Fix:** Implement cursor-based pagination

### Production Differences

**What's Missing for Production:**

#### Security
- [ ] Authentication & authorization
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input sanitization (XSS protection)
- [ ] SQL injection protection (Prisma handles this)
- [ ] Environment variable validation

#### Performance
- [ ] Database connection pooling
- [ ] Redis caching layer
- [ ] Image optimization
- [ ] Code splitting
- [ ] CDN for static assets
- [ ] Lazy loading

#### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Logging (Winston, Pino)
- [ ] Uptime monitoring

#### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in CI
- [ ] Database backups
- [ ] Staging environment
- [ ] Environment-specific configs
- [ ] Docker containers

#### User Experience
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Accessibility (ARIA labels)
- [ ] Mobile app version

---

## Summary

### Good Decisions
✅ Next.js App Router - Modern, performant  
✅ PostgreSQL + Prisma - Type-safe, relational  
✅ Tailwind CSS - Fast development  
✅ Simple state management - No over-engineering  
✅ RESTful API - Standard, predictable  

### Would Change
⚠️ Add React Query - Better data fetching  
⚠️ Add testing - Automated quality assurance  
⚠️ Better error handling - Toast notifications  
⚠️ Add authentication - Multi-user support  
⚠️ Implement real-time updates - Better collaboration  

### Overall
The architecture is **solid for a prototype/MVP**. It's simple, maintainable, and follows best practices. With the additions mentioned above, it would be **production-ready** for a real application.
