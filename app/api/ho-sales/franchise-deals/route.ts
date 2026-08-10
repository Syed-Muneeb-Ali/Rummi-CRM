import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/db/connection"
import FranchiseDeal from "@/lib/db/models/franchise-deal"
import { withPermission } from "@/lib/auth/api-helpers"
import { generateFranchiseDealId } from "@/lib/db/utils/id-generator"
import { logAudit } from "@/lib/auth/audit"
import { Types } from "mongoose"

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
})

const createLeadSchema = z.object({
  buyerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  buyerPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  buyerEmail: z.string().email().optional().or(z.literal("")),
  buyerAddress: addressSchema,
  locationInterest: z.string().min(1, "Location interest is required"),
  source: z.enum(["walk_in", "referral", "campaign", "website", "other"]),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional(),
})

// POST /api/ho-sales/franchise-deals - Create a franchise prospect (lead)
export async function POST(request: NextRequest) {
  return withPermission("canManageFranchiseLeads", async (session) => {
    try {
      await connectDB()

      const body = await request.json()
      const data = createLeadSchema.parse(body)

      const dealNumber = await generateFranchiseDealId()

      const deal = await FranchiseDeal.create({
        dealNumber,
        buyerName: data.buyerName,
        buyerPhone: data.buyerPhone,
        buyerEmail: data.buyerEmail || undefined,
        buyerAddress: data.buyerAddress,
        locationInterest: data.locationInterest,
        source: data.source,
        interestLevel: data.interestLevel,
        stage: "prospect",
        fdmId: new Types.ObjectId(session!.userId),
        followUps: [],
        stageHistory: [
          {
            stage: "prospect",
            changedAt: new Date(),
            changedBy: new Types.ObjectId(session!.userId),
          },
        ],
      })

      await logAudit({
        userId: new Types.ObjectId(session!.userId),
        action: "create",
        module: "franchise_deal",
        recordId: deal._id,
      })

      return NextResponse.json(
        { success: true, deal, message: "Franchise lead created successfully" },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[POST /api/ho-sales/franchise-deals] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create franchise lead" },
        { status: 500 }
      )
    }
  })
}

const LEAD_STAGES = ["prospect", "interested", "negotiation"]
const DEAL_STAGES = [
  "payment_pending",
  "payment_entered",
  "verified",
  "documents_uploaded",
  "hr_setup",
  "inventory_allocated",
  "active",
  "lost",
]

// GET /api/ho-sales/franchise-deals - List franchise leads/deals with filtering
export async function GET(request: NextRequest) {
  return withPermission("canManageFranchiseLeads", async (session) => {
    try {
      await connectDB()

      const { searchParams } = new URL(request.url)

      const search = searchParams.get("search")
      const stage = searchParams.get("stage")
      const scope = searchParams.get("scope") // "leads" | "deals"
      const fdmId = searchParams.get("fdmId")

      const sortBy = searchParams.get("sortBy") || "createdAt"
      const sortOrder = searchParams.get("sortOrder") || "desc"

      const page = parseInt(searchParams.get("page") || "1", 10)
      const limit = parseInt(searchParams.get("limit") || "50", 10)
      const skip = (page - 1) * limit

      const query: Record<string, unknown> = {}

      if (search) {
        query.$or = [
          { dealNumber: { $regex: search, $options: "i" } },
          { buyerName: { $regex: search, $options: "i" } },
          { buyerPhone: { $regex: search, $options: "i" } },
        ]
      }

      if (stage) {
        query.stage = stage
      } else if (scope === "leads") {
        query.stage = { $in: LEAD_STAGES }
      } else if (scope === "deals") {
        query.stage = { $in: DEAL_STAGES }
      }

      if (fdmId) query.fdmId = fdmId

      // FDM without cross-franchise visibility only sees their own deals
      if (!session!.permissions.canViewAllFranchises && !fdmId) {
        query.fdmId = session!.userId
      }

      const sort: Record<string, 1 | -1> = {}
      sort[sortBy] = sortOrder === "asc" ? 1 : -1

      const [deals, total] = await Promise.all([
        FranchiseDeal.find(query)
          .populate("fdmId", "name empId")
          .populate("franchiseId", "name franchiseCode")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        FranchiseDeal.countDocuments(query),
      ])

      return NextResponse.json({
        success: true,
        deals,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    } catch (error) {
      console.error("[GET /api/ho-sales/franchise-deals] Error:", error)
      return NextResponse.json({ error: "Failed to fetch franchise deals" }, { status: 500 })
    }
  })
}
