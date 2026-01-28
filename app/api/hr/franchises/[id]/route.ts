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

const updateFranchiseSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  ownerId: z.string().optional(),
  address: addressSchema.optional(),
  commissionStructure: commissionStructureSchema.optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

// GET /api/hr/franchises/[id] - Get franchise details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageFranchises', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const franchise = await Franchise.findById(id)
        .populate('ownerId', 'name empId email phone')
        .populate('dealId', 'dealNumber buyerName stage')
        .lean();

      if (!franchise) {
        return NextResponse.json({ error: 'Franchise not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        franchise,
      });
    } catch (error) {
      console.error('[GET /api/hr/franchises/[id]] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch franchise details' },
        { status: 500 }
      );
    }
  });
}

// PUT /api/hr/franchises/[id] - Update franchise details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageFranchises', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const body = await request.json();
      const validatedData = updateFranchiseSchema.parse(body);

      // Find franchise
      const franchise = await Franchise.findById(id);
      if (!franchise) {
        return NextResponse.json({ error: 'Franchise not found' }, { status: 404 });
      }

      // Verify owner if changed
      if (validatedData.ownerId) {
        const owner = await User.findById(validatedData.ownerId);
        if (!owner) {
          return NextResponse.json({ error: 'Invalid owner ID' }, { status: 400 });
        }
        franchise.ownerId = new Types.ObjectId(validatedData.ownerId);
      }

      // Update fields
      if (validatedData.name) franchise.name = validatedData.name;
      if (validatedData.address) franchise.address = validatedData.address;
      if (validatedData.commissionStructure) {
        franchise.commissionStructure = validatedData.commissionStructure;
      }
      if (validatedData.status) franchise.status = validatedData.status;

      await franchise.save();

      // Fetch updated franchise with populated fields
      const updatedFranchise = await Franchise.findById(id)
        .populate('ownerId', 'name empId email phone')
        .lean();

      return NextResponse.json({
        success: true,
        franchise: updatedFranchise,
        message: 'Franchise updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || 'Validation error';
        return NextResponse.json({ error: message }, { status: 400 });
      }

      console.error('[PUT /api/hr/franchises/[id]] Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update franchise' },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/hr/franchises/[id] - Suspend franchise (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission('canManageFranchises', async () => {
    try {
      await connectDB();
      const { id } = await params;

      const franchise = await Franchise.findById(id);
      if (!franchise) {
        return NextResponse.json({ error: 'Franchise not found' }, { status: 404 });
      }

      // Set franchise status to suspended
      franchise.status = 'suspended';
      await franchise.save();

      return NextResponse.json({
        success: true,
        message: 'Franchise suspended successfully',
      });
    } catch (error) {
      console.error('[DELETE /api/hr/franchises/[id]] Error:', error);
      return NextResponse.json(
        { error: 'Failed to suspend franchise' },
        { status: 500 }
      );
    }
  });
}
