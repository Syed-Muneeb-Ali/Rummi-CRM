import mongoose, { Schema, Model } from "mongoose"
import type { IFreelancer } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false })

const bankDetailsSchema = new Schema({
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String },
}, { _id: false })

const freelancerSchema = new Schema<IFreelancer>({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  aadhaarNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
  address: { type: addressSchema, required: true },
  bankDetails: { type: bankDetailsSchema, required: true },
  commissionPerSale: { type: Number, default: 5000 },
  requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  requestedAt: { type: Date, required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  status: { 
    type: String, 
    enum: ["pending", "active", "rejected", "inactive"], 
    default: "pending" 
  },
  rejectionReason: { type: String },
}, {
  timestamps: true,
})

// Indexes
freelancerSchema.index({ status: 1 })

const Freelancer: Model<IFreelancer> = mongoose.models.Freelancer || mongoose.model<IFreelancer>("Freelancer", freelancerSchema)

export default Freelancer

