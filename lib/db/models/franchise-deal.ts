import mongoose, { Schema, Model } from "mongoose"
import type { IFranchiseDeal } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false })

const followUpSchema = new Schema({
  date: { type: Date, required: true },
  notes: { type: String, required: true },
  nextActionDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const feeStructureSchema = new Schema({
  eRickshawFee: { type: Number, required: true },
  chargingPointFee: { type: Number, required: true },
  gpsSparesFee: { type: Number, required: true },
  totalFee: { type: Number, required: true },
}, { _id: false })

const includedAssetsSchema = new Schema({
  eRickshawCount: { type: Number, required: true },
  chargingPointCount: { type: Number, required: true },
  gpsUnits: { type: Number, required: true },
  sparesValue: { type: Number, required: true },
}, { _id: false })

const commissionTierSchema = new Schema({
  minSales: { type: Number, required: true },
  maxSales: { type: Number, required: true },
  amountPerSale: { type: Number, required: true },
}, { _id: false })

const commissionStructureSchema = new Schema({
  type: { type: String, enum: ["tiered", "flat"], required: true },
  tiers: [commissionTierSchema],
  flatRate: { type: Number },
}, { _id: false })

const documentUploadSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const documentsSchema = new Schema({
  signedTnC: documentUploadSchema,
  rentAgreement: documentUploadSchema,
}, { _id: false })

const stageHistorySchema = new Schema({
  stage: { type: String, required: true },
  changedAt: { type: Date, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notes: { type: String },
}, { _id: false })

const franchiseDealSchema = new Schema<IFranchiseDeal>({
  dealNumber: { type: String, required: true, unique: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  buyerEmail: { type: String },
  buyerAddress: { type: addressSchema, required: true },
  buyerPan: { type: String },
  buyerAadhaar: { type: String },
  locationInterest: { type: String, required: true },
  source: { 
    type: String, 
    enum: ["walk_in", "referral", "campaign", "website", "other"], 
    required: true 
  },
  stage: { 
    type: String, 
    enum: [
      "prospect", "interested", "negotiation", "payment_pending", 
      "payment_entered", "verified", "documents_uploaded", 
      "hr_setup", "inventory_allocated", "active", "lost"
    ], 
    default: "prospect" 
  },
  followUps: [followUpSchema],
  interestLevel: { type: String, enum: ["cold", "warm", "hot"] },
  lostReason: { type: String },
  dealType: { type: String, enum: ["A", "B", "C"] },
  feeStructure: feeStructureSchema,
  includedAssets: includedAssetsSchema,
  commissionStructure: commissionStructureSchema,
  responsibilitiesAcknowledged: { type: Boolean },
  fdmId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  documents: documentsSchema,
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise" },
  stageHistory: [stageHistorySchema],
}, {
  timestamps: true,
})

// Indexes
franchiseDealSchema.index({ fdmId: 1, stage: 1 })
franchiseDealSchema.index({ stage: 1, createdAt: -1 })
franchiseDealSchema.index({ buyerPhone: 1 })

const FranchiseDeal: Model<IFranchiseDeal> = mongoose.models.FranchiseDeal || mongoose.model<IFranchiseDeal>("FranchiseDeal", franchiseDealSchema)

export default FranchiseDeal

