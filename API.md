# API Documentation

Complete API reference for the Task Manager application.

## Base URL

```
http://localhost:3000/api
```

## Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data": any,      // Present on success
  "error": string,  // Present on error
  "message": string // Optional message
}
```

---

## Users API

### Get All Users

**GET** `/api/users`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create User

**POST** `/api/users`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "clx1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Single User

**GET** `/api/users/[id]`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "tasks": [...],
    "projects": [...]
  }
}
```

### Update User

**PATCH** `/api/users/[id]`

**Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

### Delete User

**DELETE** `/api/users/[id]`

---

## Projects API

### Get All Projects

**GET** `/api/projects`

**Query Parameters:**
- `userId` (optional) - Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx9876543210",
      "name": "Website Redesign",
      "description": "Complete overhaul of company website",
      "color": "#3B82F6",
      "userId": "clx1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "tasks": [...],
      "user": {...}
    }
  ]
}
```

### Create Project

**POST** `/api/projects`

**Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "color": "#3B82F6",
  "userId": "clx1234567890"
}
```

### Get Single Project

**GET** `/api/projects/[id]`

### Update Project

**PATCH** `/api/projects/[id]`

**Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "color": "#10B981"
}
```

### Delete Project

**DELETE** `/api/projects/[id]`

---

## Tasks API

### Get All Tasks

**GET** `/api/tasks`

**Query Parameters:**
- `status` (optional) - Filter by status (TODO, IN_PROGRESS, DONE, CANCELLED)
- `priority` (optional) - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `projectId` (optional) - Filter by project ID
- `userId` (optional) - Filter by user ID
- `search` (optional) - Search in title and description

**Examples:**
```
GET /api/tasks?status=TODO
GET /api/tasks?priority=HIGH&userId=clx1234567890
GET /api/tasks?search=design
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx5555555555",
      "title": "Design new homepage",
      "description": "Create mockups for the new homepage layout",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "userId": "clx1234567890",
      "projectId": "clx9876543210",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z",
      "completedAt": null,
      "project": {...},
      "user": {...},
      "tags": [...]
    }
  ]
}
```

### Create Task

**POST** `/api/tasks`

**Body:**
```json
{
  "title": "Design new homepage",
  "description": "Create mockups for the new homepage layout",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "userId": "clx1234567890",
  "projectId": "clx9876543210"
}
```

**Required Fields:**
- `title` (string)
- `userId` (string)

**Optional Fields:**
- `description` (string)
- `status` (enum: TODO, IN_PROGRESS, DONE, CANCELLED) - default: TODO
- `priority` (enum: LOW, MEDIUM, HIGH, URGENT) - default: MEDIUM
- `dueDate` (ISO date string)
- `projectId` (string)

### Get Single Task

**GET** `/api/tasks/[id]`

### Update Task

**PATCH** `/api/tasks/[id]`

**Body:**
```json
{
  "title": "Design new homepage - Updated",
  "status": "DONE",
  "priority": "URGENT",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "projectId": null
}
```

**Note:** When status is changed to "DONE", `completedAt` is automatically set to the current timestamp.

### Delete Task

**DELETE** `/api/tasks/[id]`

---

## Example Usage

### Using cURL

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123",
    "name": "Jane Doe"
  }'
```

**Create a project:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App",
    "description": "iOS and Android app",
    "color": "#10B981",
    "userId": "USER_ID_HERE"
  }'
```

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement login screen",
    "description": "Create UI for user authentication",
    "priority": "HIGH",
    "status": "TODO",
    "userId": "USER_ID_HERE",
    "projectId": "PROJECT_ID_HERE"
  }'
```

**Get all high priority tasks:**
```bash
curl "http://localhost:3000/api/tasks?priority=HIGH"
```

**Update a task:**
```bash
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE"
  }'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID_HERE
```

### Using JavaScript/TypeScript (fetch)

```typescript
// Create a task
const createTask = async () => {
  const response = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'New Task',
      description: 'Task description',
      priority: 'HIGH',
      userId: 'user-id-here',
    }),
  });
  
  const data = await response.json();
  console.log(data);
};

// Get all tasks
const getTasks = async () => {
  const response = await fetch('http://localhost:3000/api/tasks?status=TODO');
  const data = await response.json();
  console.log(data);
};

// Update task
const updateTask = async (taskId: string) => {
  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'DONE',
    }),
  });
  
  const data = await response.json();
  console.log(data);
};

// Delete task
const deleteTask = async (taskId: string) => {
  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

---

## Data Types

### TaskStatus
```typescript
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELLED = "CANCELLED"
}
```

### Priority
```typescript
enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}
```

---

## Tips

1. **Testing APIs**: Use tools like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

2. **Database Management**: Run `npm run db:studio` to open Prisma Studio and visually manage your data

3. **Sample Data**: Run `npm run db:seed` to populate the database with sample data for testing

4. **Authentication**: The current implementation doesn't include authentication. In production, add JWT tokens or session-based auth before deploying.
