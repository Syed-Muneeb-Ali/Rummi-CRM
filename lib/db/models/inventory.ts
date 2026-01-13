import mongoose, { Schema, Model } from "mongoose"
import type { IInventoryItem } from "@/types/db"

const transferHistorySchema = new Schema({
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  transferredAt: { type: Date, required: true },
  tripId: { type: Schema.Types.ObjectId },
}, { _id: false })

const inventorySchema = new Schema<IInventoryItem>({
  itemType: { 
    type: String, 
    enum: ["e_rickshaw", "spare_part", "gps", "charging_point"], 
    required: true 
  },
  engineNumber: { type: String, sparse: true, unique: true },
  chassisNumber: { type: String, sparse: true, unique: true },
  model: { type: String },
  sku: { type: String, sparse: true },
  partName: { type: String },
  title: { type: String, required: true },
  imageUrl: { type: String },
  sellingPrice: { type: Number, required: true },
  costPrice: { type: Number },
  locationType: { type: String, enum: ["ho", "franchise"], required: true },
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise" },
  status: { 
    type: String, 
    enum: ["available", "reserved", "sold", "in_transit", "used"], 
    default: "available" 
  },
  reservedForDealId: { type: Schema.Types.ObjectId, ref: "CustomerDeal", sparse: true },
  quantity: { type: Number },
  transferHistory: [transferHistorySchema],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
inventorySchema.index({ locationType: 1, franchiseId: 1, status: 1 })
inventorySchema.index({ itemType: 1, status: 1 })
inventorySchema.index({ reservedForDealId: 1 }, { sparse: true })

const Inventory: Model<IInventoryItem> = mongoose.models.Inventory || mongoose.model<IInventoryItem>("Inventory", inventorySchema)

export default Inventory

