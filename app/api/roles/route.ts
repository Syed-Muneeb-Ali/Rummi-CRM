import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Role from '@/lib/db/models/role';
import { withPermission } from '@/lib/auth/api-helpers';

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();

      const roles = await Role.find({})
        .select('_id name displayName description permissions')
        .sort({ name: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        roles,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: 500 }
      );
    }
  });
}
