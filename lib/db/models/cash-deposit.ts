import mongoose, { Schema, Model } from "mongoose"
import type { ICashDeposit } from "@/types/db"

const depositSlipSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const cashDepositSchema = new Schema<ICashDeposit>({
  invoiceId: { type: Schema.Types.ObjectId, ref: "ErickshawInvoice", required: true, unique: true },
  customerDealId: { type: Schema.Types.ObjectId, ref: "CustomerDeal", required: true },
  salespersonId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
  amount: { type: Number, required: true },
  deadlineAt: { type: Date, required: true },
  depositSlip: depositSlipSchema,
  status: { 
    type: String, 
    enum: ["pending_upload", "uploaded", "verified", "flagged"], 
    default: "pending_upload" 
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  verifiedAt: { type: Date },
  flagReason: { type: String },
  isOverdue: { type: Boolean, default: false },
}, {
  timestamps: true,
})

// Indexes
cashDepositSchema.index({ salespersonId: 1, status: 1 })
cashDepositSchema.index({ status: 1, deadlineAt: 1 })
cashDepositSchema.index({ isOverdue: 1, status: 1 })

const CashDeposit: Model<ICashDeposit> = mongoose.models.CashDeposit || mongoose.model<ICashDeposit>("CashDeposit", cashDepositSchema)

export default CashDeposit

