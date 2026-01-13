import mongoose, { Schema, Model } from "mongoose"
import type { IFranchise } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
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
  inventoryTransferCommission: { type: Number, default: 10 },
}, { _id: false })

const franchiseSchema = new Schema<IFranchise>({
  franchiseCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dealId: { type: Schema.Types.ObjectId, ref: "FranchiseDeal", required: true },
  dealType: { type: String, enum: ["A", "B", "C"], required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: addressSchema, required: true },
  commissionStructure: { type: commissionStructureSchema, required: true },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  activatedAt: { type: Date, required: true },
}, {
  timestamps: true,
})

// Indexes
franchiseSchema.index({ ownerId: 1 })
franchiseSchema.index({ status: 1 })
franchiseSchema.index({ dealId: 1 })

const Franchise: Model<IFranchise> = mongoose.models.Franchise || mongoose.model<IFranchise>("Franchise", franchiseSchema)

export default Franchise

