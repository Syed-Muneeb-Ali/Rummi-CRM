import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/db/models/attendance';
import { withPermission } from '@/lib/auth/api-helpers';

// GET /api/hr/attendance/[userId] - Get attendance history for specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();
      
      const { userId } = await params;

      const { searchParams } = new URL(request.url);

      // Filters
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const limit = parseInt(searchParams.get('limit') || '100', 10);

      // Build query
      const query: Record<string, unknown> = { userId };

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }

      // Fetch attendance records
      const attendance = await Attendance.find(query)
        .sort({ date: -1 })
        .limit(limit)
        .select('date loginTime')
        .lean();

      // Calculate stats
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const stats = {
        totalDays: attendance.length,
        thisMonth: attendance.filter((a) => {
          const [year, month] = a.date.split('-').map(Number);
          return year === currentYear && month === currentMonth + 1;
        }).length,
        thisYear: attendance.filter((a) => {
          const [year] = a.date.split('-').map(Number);
          return year === currentYear;
        }).length,
      };

      return NextResponse.json({
        success: true,
        attendance,
        stats,
      });
    } catch (error) {
      console.error('[GET /api/hr/attendance/[userId]] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user attendance. Please try again.' },
        { status: 500 }
      );
    }
  });
}
