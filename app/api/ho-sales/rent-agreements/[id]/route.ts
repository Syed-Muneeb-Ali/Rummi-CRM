import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import RentAgreement from "@/lib/db/models/rent-agreement"
import { withPermission } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"

const editSchema = z.object({
  landlordName: z.string().min(1).optional(),
  landlordPhone: z.string().regex(/^[0-9]{10}$/).optional(),
  landlordEmail: z.string().email().optional().or(z.literal("")),
  monthlyRent: z.number().positive().optional(),
  securityDeposit: z.number().min(0).optional(),
  annualIncrementPercent: z.number().min(0).optional(),
  renewalTerms: z.string().optional(),
  paidBy: z.enum(["company", "franchise_owner"]).optional(),
})

const renewSchema = z.object({
  action: z.literal("renew"),
  fileUrl: z.string().url(),
  validFrom: z.string().min(1),
  validTo: z.string().min(1),
  agreementEndDate: z.string().min(1),
})

const patchSchema = z.union([renewSchema, editSchema])

// PATCH /api/ho-sales/rent-agreements/[id] - Edit details or upload a renewal
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission("canManageFranchises", async (session) => {
    try {
      await connectDB()
      const { id } = await params

      const body = await request.json()
      const data = patchSchema.parse(body)

      const agreement = await RentAgreement.findById(id)
      if (!agreement) {
        return NextResponse.json({ error: "Rent agreement not found" }, { status: 404 })
      }

      const userId = new Types.ObjectId(session!.userId)

      if ("action" in data && data.action === "renew") {
        agreement.renewedDocuments = agreement.renewedDocuments || []
        agreement.renewedDocuments.push({
          fileUrl: data.fileUrl,
          uploadedAt: new Date(),
          uploadedBy: userId,
          validFrom: new Date(data.validFrom),
          validTo: new Date(data.validTo),
        })
        agreement.agreementEndDate = new Date(data.agreementEndDate)
        agreement.status = "renewed"
        await logAudit({ userId, action: "renew", module: "rent_agreement", recordId: agreement._id })
      } else {
        Object.assign(agreement, data)
        await logAudit({ userId, action: "update", module: "rent_agreement", recordId: agreement._id })
      }

      await agreement.save()

      const updated = await RentAgreement.findById(id)
        .populate("franchiseId", "name franchiseCode")
        .lean()

      return NextResponse.json({ success: true, agreement: updated })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[PATCH /api/ho-sales/rent-agreements/[id]] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to update rent agreement" },
        { status: 500 }
      )
    }
  })
}
