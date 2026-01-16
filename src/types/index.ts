import { Task, Project, TaskStatus, Priority } from '@prisma/client';

// Export Prisma types
export type { Task, Project, TaskStatus, Priority };

// Extended types with relations
export type TaskWithRelations = Task & {
  project?: Project | null;
};

export type ProjectWithTasks = Project & {
  tasks?: Task[];
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Task creation/update types
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string | Date;
  projectId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string | Date | null;
  projectId?: string | null;
  completedAt?: string | Date | null;
}

// Project creation/update types
export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

// Filter types
export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  search?: string;
}
