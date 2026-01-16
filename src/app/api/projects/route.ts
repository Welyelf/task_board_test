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
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
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
    if (!body.name) {
      return errorResponse('Name is required', 400);
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
      },
      include: {
        tasks: true,
      },
    });

    return successResponse(project, 'Project created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
