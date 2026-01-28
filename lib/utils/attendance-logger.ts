import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/db/models/attendance';

/**
 * Records attendance for user's first login of the day
 * Called automatically on successful login
 */
export async function logAttendance(userId: string): Promise<void> {
  try {
    await connectDB();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if attendance already exists for today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today,
    });

    if (existingAttendance) {
      // Already logged in today, skip
      return;
    }

    // Create new attendance record
    await Attendance.create({
      userId,
      date: today,
      loginTime: new Date(),
    });
  } catch (error) {
    // Log error but don't fail login if attendance logging fails
    console.error('Failed to log attendance:', error);
  }
}
