import mongoose, { Schema, Model } from "mongoose"
import type { ICustomerDeal } from "@/types/db"

const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false })

const panCardSchema = new Schema({
  number: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
}, { _id: false })

const photoSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
}, { _id: false })

const bankDetailsSchema = new Schema({
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String },
  fileUrl: { type: String },
  uploadedAt: { type: Date, required: true },
}, { _id: false })

const customerDocumentsSchema = new Schema({
  panCard: panCardSchema,
  photo: photoSchema,
  bankDetails: bankDetailsSchema,
}, { _id: false })

const customerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: addressSchema, required: true },
  source: { 
    type: String, 
    enum: ["walk_in", "referral", "campaign", "freelancer", "other_seller"], 
    required: true 
  },
  documents: customerDocumentsSchema,
}, { _id: false })

const otherSellerInfoSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
}, { _id: false })

const followUpSchema = new Schema({
  date: { type: Date, required: true },
  notes: { type: String, required: true },
  nextActionDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const vehicleSelectionSchema = new Schema({
  inventoryId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
  engineNumber: { type: String, required: true },
  chassisNumber: { type: String, required: true },
  model: { type: String, required: true },
  selectedAt: { type: Date, required: true },
}, { _id: false })

const loanDetailsSchema = new Schema({
  assignedOptions: [{ type: Schema.Types.ObjectId, ref: "LoanOption" }],
  selectedOptionId: { type: Schema.Types.ObjectId, ref: "LoanOption" },
  downpaymentAmount: { type: Number },
  downpaymentConfirmedAt: { type: Date },
}, { _id: false })

const stageHistorySchema = new Schema({
  stage: { type: String, required: true },
  changedAt: { type: Date, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notes: { type: String },
}, { _id: false })

const customerDealSchema = new Schema<ICustomerDeal>({
  dealNumber: { type: String, required: true, unique: true },
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise", required: true },
  customer: { type: customerSchema, required: true },
  salespersonType: { 
    type: String, 
    enum: ["staff", "freelancer", "other_seller"], 
    required: true 
  },
  salespersonId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  freelancerId: { type: Schema.Types.ObjectId, ref: "Freelancer" },
  otherSellerInfo: otherSellerInfoSchema,
  stage: { 
    type: String, 
    enum: ["lead", "interested", "documents_submitted", "loan_in_progress", "approved", "sold", "delivered"], 
    default: "lead" 
  },
  followUps: [followUpSchema],
  vehicleSelection: vehicleSelectionSchema,
  loanDetails: loanDetailsSchema,
  dueLetterId: { type: Schema.Types.ObjectId, ref: "DueLetter" },
  invoiceId: { type: Schema.Types.ObjectId, ref: "ErickshawInvoice" },
  soldAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryTripId: { type: Schema.Types.ObjectId },
  stageHistory: [stageHistorySchema],
}, {
  timestamps: true,
})

// Indexes
customerDealSchema.index({ "customer.phone": 1 })
customerDealSchema.index({ franchiseId: 1, stage: 1 })
customerDealSchema.index({ salespersonId: 1, stage: 1 })
customerDealSchema.index({ stage: 1, createdAt: -1 })
customerDealSchema.index({ "vehicleSelection.inventoryId": 1 }, { sparse: true })

const CustomerDeal: Model<ICustomerDeal> = mongoose.models.CustomerDeal || mongoose.model<ICustomerDeal>("CustomerDeal", customerDealSchema)

export default CustomerDeal

