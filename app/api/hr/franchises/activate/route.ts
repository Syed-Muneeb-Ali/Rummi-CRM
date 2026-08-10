import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import Franchise from "@/lib/db/models/franchise"
import FranchiseDeal from "@/lib/db/models/franchise-deal"
import FranchisePayment from "@/lib/db/models/franchise-payment"
import User from "@/lib/db/models/user"
import { withPermission } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"
import { generateFranchiseCode } from "@/lib/db/utils/id-generator"

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
})

const activateSchema = z.object({
  franchiseDealId: z.string().min(1, "Franchise deal is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  ownerId: z.string().min(1, "Owner is required"),
  address: addressSchema.optional(),
})

// POST /api/hr/franchises/activate - Turn a verified FranchiseDeal into an active Franchise
export async function POST(request: NextRequest) {
  return withPermission("canManageFranchises", async (session) => {
    try {
      await connectDB()

      const body = await request.json()
      const data = activateSchema.parse(body)

      const deal = await FranchiseDeal.findById(data.franchiseDealId)
      if (!deal) {
        return NextResponse.json({ error: "Franchise deal not found" }, { status: 404 })
      }
      if (deal.stage !== "inventory_allocated") {
        return NextResponse.json(
          { error: `Deal must be in "inventory_allocated" stage, currently "${deal.stage}"` },
          { status: 400 }
        )
      }
      if (deal.franchiseId) {
        return NextResponse.json({ error: "This deal has already been activated" }, { status: 400 })
      }
      if (!deal.dealType || !deal.commissionStructure) {
        return NextResponse.json({ error: "Deal is missing type/commission structure" }, { status: 400 })
      }
      if (!deal.documents?.signedTnC || !deal.documents?.rentAgreement) {
        return NextResponse.json(
          { error: "Signed T&C and rent agreement documents must be uploaded before activation" },
          { status: 400 }
        )
      }

      const verifiedPayment = await FranchisePayment.findOne({
        franchiseDealId: deal._id,
        status: "verified",
      })
      if (!verifiedPayment) {
        return NextResponse.json({ error: "Deal has no verified payment" }, { status: 400 })
      }

      const owner = await User.findById(data.ownerId)
      if (!owner) {
        return NextResponse.json({ error: "Invalid owner ID" }, { status: 400 })
      }

      const franchiseCode = await generateFranchiseCode()

      const franchise = await Franchise.create({
        franchiseCode,
        name: data.name,
        dealId: deal._id,
        dealType: deal.dealType,
        ownerId: new Types.ObjectId(data.ownerId),
        address: data.address || deal.buyerAddress,
        commissionStructure: {
          ...deal.commissionStructure,
          inventoryTransferCommission: deal.commissionStructure.inventoryTransferCommission ?? 10,
        },
        status: "active",
        activatedAt: new Date(),
      })

      const userId = new Types.ObjectId(session!.userId)

      deal.franchiseId = franchise._id
      deal.stage = "active"
      deal.stageHistory.push({ stage: "active", changedAt: new Date(), changedBy: userId })
      await deal.save()

      if (!owner.franchiseId) {
        owner.franchiseId = franchise._id
        await owner.save()
      }

      await logAudit({ userId, action: "activate", module: "franchise", recordId: franchise._id })

      const created = await Franchise.findById(franchise._id)
        .populate("ownerId", "name empId email phone")
        .lean()

      return NextResponse.json(
        { success: true, franchise: created, message: "Franchise activated successfully" },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[POST /api/hr/franchises/activate] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to activate franchise" },
        { status: 500 }
      )
    }
  })
}
