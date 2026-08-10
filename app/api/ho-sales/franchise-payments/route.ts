import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import FranchisePayment from "@/lib/db/models/franchise-payment"
import FranchiseDeal from "@/lib/db/models/franchise-deal"
import { withPermission } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"

const breakupSchema = z.object({
  eRickshawFee: z.number().min(0),
  chargingPointFee: z.number().min(0),
  gpsSparesFee: z.number().min(0),
})

const createPaymentSchema = z.object({
  franchiseDealId: z.string().min(1, "Franchise deal is required"),
  amount: z.number().positive("Amount must be positive"),
  bankTransferRef: z.string().min(1, "Bank transfer reference is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  breakup: breakupSchema,
  proofDocument: z.object({ fileUrl: z.string().url() }).optional(),
})

// POST /api/ho-sales/franchise-payments - FDM enters payment for a deal
export async function POST(request: NextRequest) {
  return withPermission("canCreateFranchiseDeals", async (session) => {
    try {
      await connectDB()

      const body = await request.json()
      const data = createPaymentSchema.parse(body)

      const deal = await FranchiseDeal.findById(data.franchiseDealId)
      if (!deal) {
        return NextResponse.json({ error: "Franchise deal not found" }, { status: 404 })
      }
      if (deal.stage !== "payment_pending") {
        return NextResponse.json(
          { error: `Deal must be in "payment_pending" stage, currently "${deal.stage}"` },
          { status: 400 }
        )
      }

      const userId = new Types.ObjectId(session!.userId)

      const payment = await FranchisePayment.create({
        franchiseDealId: deal._id,
        amount: data.amount,
        bankTransferRef: data.bankTransferRef,
        paymentDate: new Date(data.paymentDate),
        breakup: data.breakup,
        status: "pending",
        proofDocument: data.proofDocument
          ? { fileUrl: data.proofDocument.fileUrl, uploadedAt: new Date() }
          : undefined,
        createdBy: userId,
      })

      deal.stage = "payment_entered"
      deal.stageHistory.push({ stage: "payment_entered", changedAt: new Date(), changedBy: userId })
      await deal.save()

      await logAudit({
        userId,
        action: "create",
        module: "franchise_payment",
        recordId: payment._id,
      })

      return NextResponse.json(
        { success: true, payment, message: "Payment recorded successfully" },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[POST /api/ho-sales/franchise-payments] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to record payment" },
        { status: 500 }
      )
    }
  })
}

// GET /api/ho-sales/franchise-payments - Accounts verification queue
export async function GET(request: NextRequest) {
  return withPermission("canVerifyFranchisePayments", async () => {
    try {
      await connectDB()

      const { searchParams } = new URL(request.url)
      const status = searchParams.get("status") || "pending"
      const search = searchParams.get("search")

      const page = parseInt(searchParams.get("page") || "1", 10)
      const limit = parseInt(searchParams.get("limit") || "50", 10)
      const skip = (page - 1) * limit

      const query: Record<string, unknown> = {}
      if (status !== "all") query.status = status
      if (search) query.bankTransferRef = { $regex: search, $options: "i" }

      const [payments, total] = await Promise.all([
        FranchisePayment.find(query)
          .populate({
            path: "franchiseDealId",
            select: "dealNumber buyerName buyerPhone dealType fdmId",
            populate: { path: "fdmId", select: "name empId" },
          })
          .populate("verifiedBy", "name empId")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FranchisePayment.countDocuments(query),
      ])

      return NextResponse.json({
        success: true,
        payments,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    } catch (error) {
      console.error("[GET /api/ho-sales/franchise-payments] Error:", error)
      return NextResponse.json({ error: "Failed to fetch franchise payments" }, { status: 500 })
    }
  })
}
