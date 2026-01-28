import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import Session from '@/lib/db/models/session';
import { withPermission } from '@/lib/auth/api-helpers';
import { hashPassword } from '@/lib/auth/password';

// Validation schema
const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// POST /api/hr/users/[id]/reset-password - Reset user password
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const body = await request.json();
      const { newPassword } = resetPasswordSchema.parse(body);

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      user.passwordHash = passwordHash;
      await user.save();

      // Invalidate all existing sessions for this user
      await Session.deleteMany({ userId: id });

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully. User must login again.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || 'Validation error';
        return NextResponse.json({ error: message }, { status: 400 });
      }

      console.error('[POST /api/hr/users/[id]/reset-password] Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to reset password. Please try again.' },
        { status: 500 }
      );
    }
  });
}
