import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import Role from '@/lib/db/models/role';
import Franchise from '@/lib/db/models/franchise';
import { withPermission } from '@/lib/auth/api-helpers';
import { hashPassword } from '@/lib/auth/password';
import { generateEmpId } from '@/lib/utils/empid-generator';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  roleId: z.string(),
  locationType: z.enum(['ho', 'franchise']),
  franchiseId: z.string().optional(),
  baseSalary: z.coerce.number().positive(),
  effectiveFrom: z.string().min(1, 'Effective date is required'),
  password: z.string().min(8),
});

// POST /api/hr/users - Create new user
export async function POST(request: NextRequest) {
  return withPermission('canManageUsers', async (session) => {
    try {
      await connectDB();

      const body = await request.json();
      const validatedData = createUserSchema.parse(body);

      // Check if email or phone already exists
      const existingUser = await User.findOne({
        $or: [{ email: validatedData.email }, { phone: validatedData.phone }],
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email or phone already exists' },
          { status: 400 }
        );
      }

      // Verify role exists
      const role = await Role.findById(validatedData.roleId);
      if (!role) {
        return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
      }

      // If franchise location, verify franchise exists
      if (validatedData.locationType === 'franchise') {
        if (!validatedData.franchiseId) {
          return NextResponse.json(
            { error: 'Franchise ID is required for franchise location' },
            { status: 400 }
          );
        }

        const franchise = await Franchise.findById(validatedData.franchiseId);
        if (!franchise) {
          return NextResponse.json({ error: 'Invalid franchise ID' }, { status: 400 });
        }
      }

      // Generate empId
      const empId = await generateEmpId(validatedData.locationType);

      // Hash password
      const passwordHash = await hashPassword(validatedData.password);

      // Create user
      const user = await User.create({
        empId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        passwordHash,
        roleId: validatedData.roleId,
        franchiseId: validatedData.franchiseId || undefined,
        locationType: validatedData.locationType,
        salary: {
          baseSalary: validatedData.baseSalary,
          effectiveFrom: new Date(validatedData.effectiveFrom),
        },
        status: 'active',
        createdBy: session?.userId,
      });

      // Return user without password hash
      const userResponse = await User.findById(user._id)
        .select('-passwordHash')
        .populate('roleId', 'name displayName')
        .populate('franchiseId', 'name franchiseCode')
        .lean();

      return NextResponse.json(
        {
          success: true,
          user: userResponse,
          message: 'User created successfully',
        },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues || [];
        const message = issues[0]?.message || 'Validation error';
        return NextResponse.json({ error: message }, { status: 400 });
      }

      console.error('[POST /api/hr/users] Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to create user. Please try again.' },
        { status: 500 }
      );
    }
  });
}

// GET /api/hr/users - List users with filtering, sorting, pagination
export async function GET(request: NextRequest) {
  return withPermission('canManageUsers', async () => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);

      // Filters
      const search = searchParams.get('search');
      const roleId = searchParams.get('roleId');
      const locationType = searchParams.get('locationType');
      const franchiseId = searchParams.get('franchiseId');
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
          { empId: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      if (roleId) query.roleId = roleId;
      if (locationType) query.locationType = locationType;
      if (franchiseId) query.franchiseId = franchiseId;
      if (status) query.status = status;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .populate('roleId', 'name displayName')
          .populate('franchiseId', 'name franchiseCode')
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('[GET /api/hr/users] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users. Please try again.' },
        { status: 500 }
      );
    }
  });
}
