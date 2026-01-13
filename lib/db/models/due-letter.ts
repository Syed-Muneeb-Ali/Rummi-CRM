import mongoose, { Schema, Model } from "mongoose"
import type { IDueLetter } from "@/types/db"

const documentUploadSchema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: false })

const dueLetterSchema = new Schema<IDueLetter>({
  customerDealId: { type: Schema.Types.ObjectId, ref: "CustomerDeal", required: true, unique: true },
  loanOptionId: { type: Schema.Types.ObjectId, ref: "LoanOption", required: true },
  financerName: { type: String, required: true },
  dueLetterNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  document: { type: documentUploadSchema, required: true },
}, {
  timestamps: true,
})

// Indexes
dueLetterSchema.index({ financerName: 1 })

const DueLetter: Model<IDueLetter> = mongoose.models.DueLetter || mongoose.model<IDueLetter>("DueLetter", dueLetterSchema)

export default DueLetter

