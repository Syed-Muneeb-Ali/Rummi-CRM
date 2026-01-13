import mongoose, { Schema, Model } from "mongoose"
import type { IErickshawInvoice } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false })

const customerSnapshotSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: addressSchema, required: true },
  panNumber: { type: String },
}, { _id: false })

const vehicleDetailsSchema = new Schema({
  model: { type: String, required: true },
  engineNumber: { type: String, required: true },
  chassisNumber: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
}, { _id: false })

const pricingSchema = new Schema({
  basePrice: { type: Number, required: true },
  tax: { type: Number, required: true },
  taxRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
}, { _id: false })

const financerDetailsSchema = new Schema({
  financerName: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  downpayment: { type: Number, required: true },
}, { _id: false })

const erickshawInvoiceSchema = new Schema<IErickshawInvoice>({
  invoiceNumber: { type: String, required: true, unique: true },
  customerDealId: { type: Schema.Types.ObjectId, ref: "CustomerDeal", required: true, unique: true },
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
  salespersonId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  customerSnapshot: { type: customerSnapshotSchema, required: true },
  vehicleDetails: { type: vehicleDetailsSchema, required: true },
  pricing: { type: pricingSchema, required: true },
  financerDetails: financerDetailsSchema,
  pdfUrl: { type: String },
  generatedAt: { type: Date, required: true },
  generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
erickshawInvoiceSchema.index({ salespersonId: 1, generatedAt: -1 })
erickshawInvoiceSchema.index({ franchiseId: 1, generatedAt: -1 })

const ErickshawInvoice: Model<IErickshawInvoice> = mongoose.models.ErickshawInvoice || mongoose.model<IErickshawInvoice>("ErickshawInvoice", erickshawInvoiceSchema)

export default ErickshawInvoice

