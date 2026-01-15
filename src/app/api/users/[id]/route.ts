import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';

type Params = Promise<{ id: string }>;

/**
 * GET /api/users/[id]
 * Get a single user by ID
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        projects: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/users/[id]
 * Update a user
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse('User not found', 404);
    }

    // Prepare update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) {
      // Check if email is already taken
      const emailExists = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (emailExists && emailExists.id !== id) {
        return errorResponse('Email already in use', 409);
      }
      updateData.email = body.email;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(user, 'User updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse('User not found', 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ id }, 'User deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
