import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Types } from 'mongoose';
import connectDB from '@/lib/db/connection';
import Franchise from '@/lib/db/models/franchise';
import User from '@/lib/db/models/user';
import { withPermission } from '@/lib/auth/api-helpers';

// Validation schemas
const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
});

const commissionTierSchema = z.object({
  minSales: z.number().min(0),
  maxSales: z.number().min(0),
  amountPerSale: z.number().positive(),
});

const commissionStructureSchema = z.object({
  type: z.enum(['tiered', 'flat']),
  tiers: z.array(commissionTierSchema).optional(),
  flatRate: z.number().optional(),
  inventoryTransferCommission: z.number().default(10),
});

const createFranchiseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  dealType: z.enum(['A', 'B', 'C']),
  ownerId: z.string().min(1, 'Owner is required'),
  address: addressSchema,
  commissionStructure: commissionStructureSchema.optional(),
});

// Generate unique franchise code
async function generateFranchiseCode(): Promise<string> {
  const count = await Franchise.countDocuments();
  const code = `FR${String(count + 1).padStart(4, '0')}`;
  
  // Check if code exists, increment if needed
  const existing = await Franchise.findOne({ franchiseCode: code });
  if (existing) {
    return `FR${String(count + 2).padStart(4, '0')}`;
  }
  
  return code;
}

// Get default commission structure based on deal type
function getDefaultCommissionStructure(dealType: 'A' | 'B' | 'C') {
  if (dealType === 'B') {
    return {
      type: 'flat' as const,
      flatRate: 9000,
      inventoryTransferCommission: 10,
    };
  }
  
  // Type A and C have tiered structure
  const tiers = dealType === 'A' 
    ? [
        { minSales: 1, maxSales: 10, amountPerSale: 7000 },
        { minSales: 11, maxSales: 15, amountPerSale: 6000 },
        { minSales: 16, maxSales: 20, amountPerSale: 5000 },
      ]
    : [
        { minSales: 1, maxSales: 10, amountPerSale: 6500 },
        { minSales: 11, maxSales: 15, amountPerSale: 5000 },
        { minSales: 16, maxSales: 20, amountPerSale: 4000 },
      ];

  return {
    type: 'tiered' as const,
    tiers,
    inventoryTransferCommission: 10,
  };
}

// POST /api/hr/franchises - Create new franchise
export async function POST(request: NextRequest) {
  return withPermission('canManageFranchises', async () => {
    try {
      await connectDB();

      const body = await request.json();
      const validatedData = createFranchiseSchema.parse(body);

      // Verify owner exists and is a valid user
      const owner = await User.findById(validatedData.ownerId);
      if (!owner) {
        return NextResponse.json({ error: 'Invalid owner ID' }, { status: 400 });
      }

      // Generate franchise code
      const franchiseCode = await generateFranchiseCode();

      // Get commission structure (use default if not provided)
      const commissionStructure = validatedData.commissionStructure || 
        getDefaultCommissionStructure(validatedData.dealType);

      // Create franchise
      const franchise = await Franchise.create({
        franchiseCode,
        name: validatedData.name,
        dealType: validatedData.dealType,
        ownerId: new Types.ObjectId(validatedData.ownerId),
        address: validatedData.address,
        commissionStructure,
        status: 'active',
        activatedAt: new Date(),
        // Note: dealId is required in schema but for direct creation we'll handle this
        // In production, franchises should be created from verified deals
        dealId: new Types.ObjectId(), // Placeholder - should come from actual deal
      });

      // Return created franchise with populated fields
      const createdFranchise = await Franchise.findById(franchise._id)
        .populate('ownerId', 'name empId email phone')
        .lean();

      return NextResponse.json({
        success: true,
        franchise: createdFranchise,
        message: 'Franchise created successfully',
      }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || 'Validation error';
        return NextResponse.json({ error: message }, { status: 400 });
      }

      console.error('[POST /api/hr/franchises] Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to create franchise' },
        { status: 500 }
      );
    }
  });
}

// GET /api/hr/franchises - List franchises with filtering
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
