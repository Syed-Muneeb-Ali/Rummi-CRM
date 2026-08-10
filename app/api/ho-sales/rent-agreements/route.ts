import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import RentAgreement from "@/lib/db/models/rent-agreement"
import { withPermission } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
})

const createRentAgreementSchema = z.object({
  franchiseId: z.string().min(1, "Franchise is required"),
  landlordName: z.string().min(1, "Landlord name is required"),
  landlordPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  landlordEmail: z.string().email().optional().or(z.literal("")),
  landlordAddress: z.string().optional(),
  propertyAddress: addressSchema,
  propertySize: z.string().optional(),
  monthlyRent: z.number().positive("Monthly rent must be positive"),
  securityDeposit: z.number().min(0).optional(),
  agreementStartDate: z.string().min(1, "Start date is required"),
  agreementEndDate: z.string().min(1, "End date is required"),
  annualIncrementPercent: z.number().min(0),
  renewalTerms: z.string().optional(),
  paidBy: z.enum(["company", "franchise_owner"]),
  agreementDocument: z.object({ fileUrl: z.string().url() }).optional(),
})

// POST /api/ho-sales/rent-agreements - Create a rent agreement record
export async function POST(request: NextRequest) {
  return withPermission("canManageFranchises", async (session) => {
    try {
      await connectDB()

      const body = await request.json()
      const data = createRentAgreementSchema.parse(body)

      const userId = new Types.ObjectId(session!.userId)

      const agreement = await RentAgreement.create({
        franchiseId: data.franchiseId,
        landlordName: data.landlordName,
        landlordPhone: data.landlordPhone,
        landlordEmail: data.landlordEmail || undefined,
        landlordAddress: data.landlordAddress,
        propertyAddress: data.propertyAddress,
        propertySize: data.propertySize,
        monthlyRent: data.monthlyRent,
        securityDeposit: data.securityDeposit,
        agreementStartDate: new Date(data.agreementStartDate),
        agreementEndDate: new Date(data.agreementEndDate),
        annualIncrementPercent: data.annualIncrementPercent,
        renewalTerms: data.renewalTerms,
        paidBy: data.paidBy,
        agreementDocument: data.agreementDocument
          ? { fileUrl: data.agreementDocument.fileUrl, uploadedAt: new Date(), uploadedBy: userId }
          : undefined,
        status: "active",
        createdBy: userId,
      })

      await logAudit({ userId, action: "create", module: "rent_agreement", recordId: agreement._id })

      return NextResponse.json(
        { success: true, agreement, message: "Rent agreement created successfully" },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[POST /api/ho-sales/rent-agreements] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create rent agreement" },
        { status: 500 }
      )
    }
  })
}

// GET /api/ho-sales/rent-agreements - List rent agreements with expiry/due highlights
export async function GET(request: NextRequest) {
  return withPermission("canManageFranchises", async () => {
    try {
      await connectDB()

      const { searchParams } = new URL(request.url)
      const franchiseId = searchParams.get("franchiseId")
      const status = searchParams.get("status")
      const expiringWithinDays = searchParams.get("expiringWithinDays")

      const query: Record<string, unknown> = {}
      if (franchiseId) query.franchiseId = franchiseId
      if (status) query.status = status
      if (expiringWithinDays) {
        const days = parseInt(expiringWithinDays, 10)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() + days)
        query.agreementEndDate = { $lte: cutoff }
        query.status = "active"
      }

      const agreements = await RentAgreement.find(query)
        .populate("franchiseId", "name franchiseCode")
        .sort({ agreementEndDate: 1 })
        .lean()

      return NextResponse.json({ success: true, agreements })
    } catch (error) {
      console.error("[GET /api/ho-sales/rent-agreements] Error:", error)
      return NextResponse.json({ error: "Failed to fetch rent agreements" }, { status: 500 })
    }
  })
}
