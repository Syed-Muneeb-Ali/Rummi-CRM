import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Types } from "mongoose"
import connectDB from "@/lib/db/connection"
import FranchisePayment from "@/lib/db/models/franchise-payment"
import FranchiseDeal from "@/lib/db/models/franchise-deal"
import { withPermission } from "@/lib/auth/api-helpers"
import { logAudit } from "@/lib/auth/audit"

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("verify") }),
  z.object({ action: z.literal("flag"), flagReason: z.string().min(1, "Reason is required") }),
])

// PATCH /api/ho-sales/franchise-payments/[id] - Accounts verify/flag a payment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission("canVerifyFranchisePayments", async (session) => {
    try {
      await connectDB()
      const { id } = await params

      const body = await request.json()
      const data = patchSchema.parse(body)

      const payment = await FranchisePayment.findById(id)
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 })
      }

      const userId = new Types.ObjectId(session!.userId)

      if (data.action === "verify") {
        payment.status = "verified"
        payment.verifiedBy = userId
        payment.verifiedAt = new Date()
        await payment.save()

        const deal = await FranchiseDeal.findById(payment.franchiseDealId)
        if (deal && deal.stage === "payment_entered") {
          deal.stage = "verified"
          deal.stageHistory.push({ stage: "verified", changedAt: new Date(), changedBy: userId })
          await deal.save()
        }

        await logAudit({ userId, action: "verify", module: "franchise_payment", recordId: payment._id })
      } else {
        payment.status = "flagged"
        payment.flagReason = data.flagReason
        await payment.save()

        await logAudit({
          userId,
          action: "flag",
          module: "franchise_payment",
          recordId: payment._id,
          details: { flagReason: data.flagReason },
        })
      }

      const updated = await FranchisePayment.findById(id)
        .populate("franchiseDealId", "dealNumber buyerName")
        .populate("verifiedBy", "name empId")
        .lean()

      return NextResponse.json({ success: true, payment: updated })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues?.[0]?.message || "Validation error"
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("[PATCH /api/ho-sales/franchise-payments/[id]] Error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to update payment" },
        { status: 500 }
      )
    }
  })
}
