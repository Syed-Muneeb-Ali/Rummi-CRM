import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Franchise from '@/lib/db/models/franchise';
import { withPermission } from '@/lib/auth/api-helpers';

// GET /api/hr/franchises - List franchises with filtering
// NOTE: Franchises are created via POST /api/hr/franchises/activate, driven by a
// verified FranchiseDeal reaching the "inventory_allocated" stage - not created here directly.
export async function GET(request: NextRequest) {
  return withPermission('canManageFranchises', async () => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);

      // Filters
      const search = searchParams.get('search');
      const dealType = searchParams.get('dealType');
      const status = searchParams.get('status');

      // Sorting
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';

      // Pagination
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const skip = (page - 1) * limit;

      // Build query
      const query: Record<string, unknown> = {};

      if (search) {
        query.$or = [
          { franchiseCode: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ];
      }

      if (dealType) query.dealType = dealType;
      if (status) query.status = status;

      // Build sort
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const [franchises, total] = await Promise.all([
        Franchise.find(query)
          .populate('ownerId', 'name empId email phone')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Franchise.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        franchises,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('[GET /api/hr/franchises] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch franchises' },
        { status: 500 }
      );
    }
  });
}
