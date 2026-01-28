import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Franchise from '@/lib/db/models/franchise';
import { withPermission } from '@/lib/auth/api-helpers';

// GET /api/franchises - Get all franchises
export async function GET(request: NextRequest) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();

      const franchises = await Franchise.find({ status: 'active' })
        .select('_id name franchiseCode address dealType status')
        .populate('ownerId', 'name empId')
        .sort({ name: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        franchises,
      });
    } catch (error) {
      console.error('Error fetching franchises:', error);
      return NextResponse.json(
        { error: 'Failed to fetch franchises' },
        { status: 500 }
      );
    }
  });
}
