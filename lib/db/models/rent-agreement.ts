import mongoose, { Schema, Model } from "mongoose"
import type { IRentAgreement } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false })

const documentUploadSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const renewedDocumentSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
}, { _id: false })

const rentAgreementSchema = new Schema<IRentAgreement>({
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
  landlordName: { type: String, required: true },
  landlordPhone: { type: String, required: true },
  landlordEmail: { type: String },
  landlordAddress: { type: String },
  propertyAddress: { type: addressSchema, required: true },
  propertySize: { type: String },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number },
  agreementStartDate: { type: Date, required: true },
  agreementEndDate: { type: Date, required: true },
  annualIncrementPercent: { type: Number, required: true },
  renewalTerms: { type: String },
  paidBy: { type: String, enum: ["company", "franchise_owner"], required: true },
  agreementDocument: documentUploadSchema,
  renewedDocuments: [renewedDocumentSchema],
  status: { type: String, enum: ["active", "expired", "renewed"], default: "active" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
rentAgreementSchema.index({ franchiseId: 1 })
rentAgreementSchema.index({ agreementEndDate: 1 })
rentAgreementSchema.index({ status: 1 })

const RentAgreement: Model<IRentAgreement> = mongoose.models.RentAgreement || mongoose.model<IRentAgreement>("RentAgreement", rentAgreementSchema)

export default RentAgreement

