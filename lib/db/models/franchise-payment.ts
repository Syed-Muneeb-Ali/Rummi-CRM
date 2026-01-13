import mongoose, { Schema, Model } from "mongoose"
import type { IFranchisePayment } from "@/types/db"

const paymentBreakupSchema = new Schema({
  eRickshawFee: { type: Number, required: true },
  chargingPointFee: { type: Number, required: true },
  gpsSparesFee: { type: Number, required: true },
}, { _id: false })

const proofDocumentSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
}, { _id: false })

const franchisePaymentSchema = new Schema<IFranchisePayment>({
  franchiseDealId: { type: Schema.Types.ObjectId, ref: "FranchiseDeal", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["bank_transfer"], default: "bank_transfer" },
  bankTransferRef: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  breakup: { type: paymentBreakupSchema, required: true },
  status: { type: String, enum: ["pending", "verified", "flagged"], default: "pending" },
  verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  verifiedAt: { type: Date },
  flagReason: { type: String },
  proofDocument: proofDocumentSchema,
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
franchisePaymentSchema.index({ franchiseDealId: 1 })
franchisePaymentSchema.index({ status: 1, createdAt: -1 })
franchisePaymentSchema.index({ bankTransferRef: 1 })

const FranchisePayment: Model<IFranchisePayment> = mongoose.models.FranchisePayment || mongoose.model<IFranchisePayment>("FranchisePayment", franchisePaymentSchema)

export default FranchisePayment

