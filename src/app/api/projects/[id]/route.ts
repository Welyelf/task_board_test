import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { UpdateProjectInput } from '@/types';

type Params = Promise<{ id: string }>;

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
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
    });

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse(project);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/projects/[id]
 * Update a project
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body: UpdateProjectInput = await request.json();

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return errorResponse('Project not found', 404);
    }

    // Prepare update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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

    return successResponse(project, 'Project updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return errorResponse('Project not found', 404);
    }

    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ id }, 'Project deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
