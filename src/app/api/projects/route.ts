import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { CreateProjectInput } from '@/types';

/**
 * GET /api/projects
 * Get all projects
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const filters: any = {};
    if (userId) filters.userId = userId;

    const projects = await prisma.project.findMany({
      where: filters,
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
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

    return successResponse(projects);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectInput = await request.json();

    // Validate required fields
    if (!body.name || !body.userId) {
      return errorResponse('Name and userId are required', 400);
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
        userId: body.userId,
      },
      include: {
        tasks: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(project, 'Project created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
