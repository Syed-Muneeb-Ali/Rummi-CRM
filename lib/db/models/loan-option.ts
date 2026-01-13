import mongoose, { Schema, Model } from "mongoose"
import type { ILoanOption } from "@/types/db"

const loanOptionSchema = new Schema<ILoanOption>({
  financerName: { type: String, required: true },
  name: { type: String, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  processingFee: { type: Number, required: true },
  processingFeeType: { type: String, enum: ["fixed", "percentage"], required: true },
  requiredDocuments: [{ type: String }],
  minDownpayment: { type: Number },
  maxLoanAmount: { type: Number },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
loanOptionSchema.index({ financerName: 1, status: 1 })
loanOptionSchema.index({ status: 1 })

const LoanOption: Model<ILoanOption> = mongoose.models.LoanOption || mongoose.model<ILoanOption>("LoanOption", loanOptionSchema)

export default LoanOption

