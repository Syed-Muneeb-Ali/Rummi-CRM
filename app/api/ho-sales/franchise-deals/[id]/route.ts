import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import FranchiseDeal from "@/lib/db/models/franchise-deal"
import { withAuth } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"
import { getFranchiseDealTypeConfig } from "@/lib/constants/franchise-deal-types"
import type { SessionUser } from "@/lib/auth/session"

// GET /api/ho-sales/franchise-deals/[id] - Deal detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (session) => {
    if (!session!.permissions.canManageFranchiseLeads && !session!.permissions.canVerifyFranchisePayments && !session!.permissions.canManageFranchises) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    try {
      await connectDB()
      const { id } = await params

      const deal = await FranchiseDeal.findById(id)
        .populate("fdmId", "name empId")
        .populate("franchiseId", "name franchiseCode")
        .populate("followUps.createdBy", "name empId")
        .populate("stageHistory.changedBy", "name empId")
        .lean()

      if (!deal) {
        return NextResponse.json({ error: "Franchise deal not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, deal })
    } catch (error) {
      console.error("[GET /api/ho-sales/franchise-deals/[id]] Error:", error)
      return NextResponse.json({ error: "Failed to fetch franchise deal" }, { status: 500 })
    }
  })
}

const followUpAction = z.object({
  action: z.literal("logFollowUp"),
  notes: z.string().min(1, "Notes are required"),
  nextActionDate: z.string().optional(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional(),
})

const convertToDealAction = z.object({
  action: z.literal("convertToDeal"),
  dealType: z.enum(["A", "B", "C"]),
  buyerPan: z.string().min(1, "PAN is required"),
  buyerAadhaar: z.string().min(1, "Aadhaar is required"),
  responsibilitiesAcknowledged: z.literal(true, {
    message: "Responsibilities must be acknowledged",
  }),
})

const uploadDocumentsAction = z.object({
  action: z.literal("uploadDocuments"),
  signedTnC: z.object({ fileUrl: z.string().url() }).optional(),
  rentAgreement: z.object({ fileUrl: z.string().url() }).optional(),
})

const advanceStageAction = z.object({
  action: z.literal("advanceStage"),
  targetStage: z.enum(["hr_setup", "inventory_allocated"]),
  notes: z.string().optional(),
})

const markLostAction = z.object({
  action: z.literal("markLost"),
  lostReason: z.string().min(1, "Reason is required"),
})

const patchSchema = z.discriminatedUnion("action", [
  followUpAction,
  convertToDealAction,
  uploadDocumentsAction,
  advanceStageAction,
  markLostAction,
])

const STAGE_ORDER = [
  "prospect",
  "interested",
  "negotiation",
  "payment_pending",
  "payment_entered",
  "verified",
  "documents_uploaded",
  "hr_setup",
  "inventory_allocated",
  "active",
] as const

function requirePermission(session: SessionUser, permission: keyof SessionUser["permissions"]) {
  if (!session.permissions[permission]) {
    throw new Error("Forbidden")
  }
}

// PATCH /api/ho-sales/franchise-deals/[id] - Action-based stage/lifecycle mutations
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (session) => {
    try {
      await connectDB()
      const { id } = await params

      const body = await request.json()
      const data = patchSchema.parse(body)

      const deal = await FranchiseDeal.findById(id)
      if (!deal) {
        return NextResponse.json({ error: "Franchise deal not found" }, { status: 404 })
      }

      const userId = new Types.ObjectId(session!.userId)

      switch (data.action) {
        case "logFollowUp": {
          requirePermission(session!, "canManageFranchiseLeads")
          deal.followUps.push({
            date: new Date(),
            notes: data.notes,
            nextActionDate: data.nextActionDate ? new Date(data.nextActionDate) : undefined,
            createdBy: userId,
          })
          if (data.interestLevel) deal.interestLevel = data.interestLevel
          if (deal.stage === "prospect") {
            deal.stage = "interested"
            deal.stageHistory.push({ stage: "interested", changedAt: new Date(), changedBy: userId })
          }
          break
        }

        case "convertToDeal": {
          requirePermission(session!, "canCreateFranchiseDeals")
          if (!STAGE_ORDER.slice(0, 3).includes(deal.stage as typeof STAGE_ORDER[number])) {
            return NextResponse.json(
              { error: `Cannot convert a deal in stage "${deal.stage}" to a deal` },
              { status: 400 }
            )
          }
          const config = getFranchiseDealTypeConfig(data.dealType)
          deal.dealType = data.dealType
          deal.buyerPan = data.buyerPan
          deal.buyerAadhaar = data.buyerAadhaar
          deal.responsibilitiesAcknowledged = true
          deal.feeStructure = config.feeStructure
          deal.includedAssets = config.includedAssets
          deal.commissionStructure = config.commissionStructure
          deal.stage = "payment_pending"
          deal.stageHistory.push({ stage: "payment_pending", changedAt: new Date(), changedBy: userId })
          break
        }

        case "uploadDocuments": {
          requirePermission(session!, "canCreateFranchiseDeals")
          if (!deal.documents) deal.documents = {}
          if (data.signedTnC) {
            deal.documents.signedTnC = { fileUrl: data.signedTnC.fileUrl, uploadedAt: new Date(), uploadedBy: userId }
          }
          if (data.rentAgreement) {
            deal.documents.rentAgreement = { fileUrl: data.rentAgreement.fileUrl, uploadedAt: new Date(), uploadedBy: userId }
          }
          if (deal.stage === "verified" && deal.documents.signedTnC && deal.documents.rentAgreement) {
            deal.stage = "documents_uploaded"
            deal.stageHistory.push({ stage: "documents_uploaded", changedAt: new Date(), changedBy: userId })
          }
          break
        }

        case "advanceStage": {
          requirePermission(session!, "canManageFranchises")
          const currentIndex = STAGE_ORDER.indexOf(deal.stage as typeof STAGE_ORDER[number])
          const targetIndex = STAGE_ORDER.indexOf(data.targetStage)
          if (targetIndex !== currentIndex + 1) {
            return NextResponse.json(
              { error: `Cannot advance from "${deal.stage}" to "${data.targetStage}"` },
              { status: 400 }
            )
          }
          deal.stage = data.targetStage
          deal.stageHistory.push({ stage: data.targetStage, changedAt: new Date(), changedBy: userId, notes: data.notes })
          break
        }

        case "markLost": {
          requirePermission(session!, "canManageFranchiseLeads")
          deal.stage = "lost"
          deal.lostReason = data.lostReason
          deal.stageHistory.push({ stage: "lost", changedAt: new Date(), changedBy: userId, notes: data.lostReason })
          break
        }
      }

      await deal.save()

      await logAudit({
        userId,
        action: data.action,
        module: "franchise_deal",
        recordId: deal._id,
      })

      const updated = await FranchiseDeal.findById(id)
        .populate("fdmId", "name empId")
        .populate("franchiseId", "name franchiseCode")
        .lean()

      return NextResponse.json({ success: true, deal: updated })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }
      if (error instanceof Error && error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
      }

      console.error("[PATCH /api/ho-sales/franchise-deals/[id]] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to update franchise deal" },
        { status: 500 }
      )
    }
  })
}
