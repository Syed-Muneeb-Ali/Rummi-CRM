import connectDB  from '@/lib/db/connection';
import { User } from '@/lib/db/models';

/**
 * Generates next available empId based on location type
 * Format: HO001, HO002... for Head Office
 *         FR001, FR002... for Franchise employees
 */
export async function generateEmpId(locationType: 'ho' | 'franchise'): Promise<string> {
  await connectDB();

  const prefix = locationType === 'ho' ? 'HO' : 'FR';

  // Find the last empId with this prefix
  const lastUser = await User.findOne({
    empId: { $regex: `^${prefix}` },
  })
    .sort({ empId: -1 })
    .select('empId')
    .lean();

  if (!lastUser) {
    return `${prefix}001`;
  }

  // Extract number and increment
  const lastNumber = parseInt(lastUser.empId.substring(2), 10);
  const nextNumber = lastNumber + 1;

  // Pad with zeros (minimum 3 digits)
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
}
