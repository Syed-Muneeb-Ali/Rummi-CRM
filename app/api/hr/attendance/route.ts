import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/db/models/attendance';
import { withPermission } from '@/lib/auth/api-helpers';

// GET /api/hr/attendance - Get all attendance records with filters
export async function GET(request: NextRequest) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);

      // Filters
      const userId = searchParams.get('userId');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      // Pagination
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '25', 10);
      const skip = (page - 1) * limit;

      // Build query
      const query: any = {};

      if (userId) query.userId = userId;

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }

      // Execute query
      const [attendance, total] = await Promise.all([
        Attendance.find(query)
          .populate('userId', 'empId name email')
          .sort({ date: -1, loginTime: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Attendance.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        attendance,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('[GET /api/hr/attendance] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendance records. Please try again.' },
        { status: 500 }
      );
    }
  });
}
