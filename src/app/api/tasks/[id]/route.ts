import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { UpdateTaskInput } from '@/types';

type Params = Promise<{ id: string }>;

/**
 * GET /api/tasks/[id]
 * Get a single task by ID
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
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

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    return successResponse(task);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update a task
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body: UpdateTaskInput = await request.json();

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return errorResponse('Task not found', 404);
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Set completedAt when status changes to DONE
      if (body.status === 'DONE') {
        updateData.completedAt = new Date();
      } else if (existingTask.status === 'DONE') {
        updateData.completedAt = null;
      }
    }
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.projectId !== undefined) updateData.projectId = body.projectId;
    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
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

    return successResponse(task, 'Task updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return errorResponse('Task not found', 404);
    }

    await prisma.task.delete({
      where: { id },
    });

    return successResponse({ id }, 'Task deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
