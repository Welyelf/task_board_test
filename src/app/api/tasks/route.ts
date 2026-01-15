import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { CreateTaskInput, TaskFilters } from '@/types';

/**
 * GET /api/tasks
 * Get all tasks with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build filters from query params
    const filters: any = {};
    
    const status = searchParams.get('status');
    if (status) filters.status = status;
    
    const priority = searchParams.get('priority');
    if (priority) filters.priority = priority;
    
    const projectId = searchParams.get('projectId');
    if (projectId) filters.projectId = projectId;
    
    const userId = searchParams.get('userId');
    if (userId) filters.userId = userId;
    
    const search = searchParams.get('search');
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      include: {
        project: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(tasks);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    // Validate required fields
    if (!body.title || !body.userId) {
      return errorResponse('Title and userId are required', 400);
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId: body.userId,
        projectId: body.projectId,
      },
      include: {
        project: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(task, 'Task created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
