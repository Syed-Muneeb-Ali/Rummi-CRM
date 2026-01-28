import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Types } from 'mongoose';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import Role from '@/lib/db/models/role';
import Franchise from '@/lib/db/models/franchise';
import Session from '@/lib/db/models/session';
import { withPermission } from '@/lib/auth/api-helpers';

// Validation schema for update
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits').optional(),
  roleId: z.string().optional(),
  franchiseId: z.string().optional().nullable(),
  baseSalary: z.coerce.number().positive().optional(),
  effectiveFrom: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// GET /api/hr/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const user = await User.findById(id)
        .select('-passwordHash')
        .populate('roleId', 'name displayName permissions')
        .populate('franchiseId', 'name franchiseCode address')
        .lean();

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('[GET /api/hr/users/[id]] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user details. Please try again.' },
        { status: 500 }
      );
    }
  });
}

// PUT /api/hr/users/[id] - Update user details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const body = await request.json();
      const validatedData = updateUserSchema.parse(body);

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if new email/phone conflicts with other users
      if (validatedData.email || validatedData.phone) {
        const orConditions: Array<{ email?: string; phone?: string }> = [];
        
        if (validatedData.email) {
          orConditions.push({ email: validatedData.email });
        }
        if (validatedData.phone) {
          orConditions.push({ phone: validatedData.phone });
        }

        const conflictingUser = await User.findOne({
          _id: { $ne: id },
          $or: orConditions,
        });
        if (conflictingUser) {
          return NextResponse.json(
            { error: 'User with this email or phone already exists' },
            { status: 400 }
          );
        }
      }

      // Verify role if changed
      if (validatedData.roleId) {
        const role = await Role.findById(validatedData.roleId);
        if (!role) {
          return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
        }
        user.roleId = new Types.ObjectId(validatedData.roleId);
      }

      // Verify franchise if changed
      if (validatedData.franchiseId !== undefined) {
        if (validatedData.franchiseId) {
          const franchise = await Franchise.findById(validatedData.franchiseId);
          if (!franchise) {
            return NextResponse.json({ error: 'Invalid franchise ID' }, { status: 400 });
          }
          user.franchiseId = new Types.ObjectId(validatedData.franchiseId);
        } else {
          user.franchiseId = undefined;
        }
      }

      // Update basic fields
      if (validatedData.name) user.name = validatedData.name;
      if (validatedData.email) user.email = validatedData.email;
      if (validatedData.phone) user.phone = validatedData.phone;
      if (validatedData.status) user.status = validatedData.status;

      // Update salary if changed
      if (validatedData.baseSalary && validatedData.effectiveFrom) {
        user.salary = {
          baseSalary: validatedData.baseSalary,
          effectiveFrom: new Date(validatedData.effectiveFrom),
        };
      }

      await user.save();

      // Fetch updated user with populated fields
      const updatedUser = await User.findById(id)
        .select('-passwordHash')
        .populate('roleId', 'name displayName')
        .populate('franchiseId', 'name franchiseCode')
        .lean();

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || 'Validation error';
        return NextResponse.json({ error: message }, { status: 400 });
      }

      console.error('[PUT /api/hr/users/[id]] Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update user. Please try again.' },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/hr/users/[id] - Deactivate user (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Set user status to inactive
      user.status = 'inactive';
      await user.save();

      // Invalidate all active sessions for this user
      await Session.deleteMany({ userId: id });

      return NextResponse.json({
        success: true,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      console.error('[DELETE /api/hr/users/[id]] Error:', error);
      return NextResponse.json(
        { error: 'Failed to deactivate user. Please try again.' },
        { status: 500 }
      );
    }
  });
}
