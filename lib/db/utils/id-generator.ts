import mongoose, { Schema, Model } from "mongoose"

// Counter model for auto-incrementing IDs
interface ICounter {
  _id: string
  seq: number
  lastMonth: string
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  lastMonth: { type: String, default: "" },
})

const Counter: Model<ICounter> = mongoose.models.Counter || mongoose.model<ICounter>("Counter", counterSchema)

/**
 * Generates an auto-incrementing ID in the format: PREFIX-YYYYMM-XXX
 * e.g., FD-202501-001, CD-202501-042, INV-202501-015
 * 
 * The counter resets each month.
 */
export async function generateId(prefix: string): Promise<string> {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`
  const counterId = `${prefix}_counter`
  
  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    [
      {
        $set: {
          seq: {
            $cond: {
              if: { $eq: ["$lastMonth", currentMonth] },
              then: { $add: ["$seq", 1] },
              else: 1,
            },
          },
          lastMonth: currentMonth,
        },
      },
    ],
    { new: true, upsert: true }
  )
  
  const sequenceNumber = String(counter.seq).padStart(3, "0")
  return `${prefix}-${currentMonth}-${sequenceNumber}`
}

// Convenience functions for specific ID types
export async function generateFranchiseDealId(): Promise<string> {
  return generateId("FD")
}

export async function generateCustomerDealId(): Promise<string> {
  return generateId("CD")
}

export async function generateInvoiceId(): Promise<string> {
  return generateId("INV")
}

export async function generateFranchiseCode(): Promise<string> {
  // Franchise code doesn't reset monthly, uses simple incrementing
  const counter = await Counter.findOneAndUpdate(
    { _id: "franchise_code" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  
  return `FR-${String(counter.seq).padStart(3, "0")}`
}

export async function generateEmpId(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: "emp_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  
  return `EMP-${String(counter.seq).padStart(4, "0")}`
}

export async function generateFreelancerId(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: "freelancer_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  
  return `FL-${String(counter.seq).padStart(4, "0")}`
}

export default {
  generateId,
  generateFranchiseDealId,
  generateCustomerDealId,
  generateInvoiceId,
  generateFranchiseCode,
  generateEmpId,
  generateFreelancerId,
}

