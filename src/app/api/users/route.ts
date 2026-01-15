import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';

/**
 * GET /api/users
 * Get all users
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(users);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return errorResponse('Email and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    // Create user (Note: In production, hash the password!)
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // TODO: Hash this in production!
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return successResponse(user, 'User created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
