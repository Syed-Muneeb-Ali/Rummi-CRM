import mongoose, { Schema, Model } from "mongoose"
import type { IUser } from "@/types/db"

const salarySchema = new Schema({
  baseSalary: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
}, { _id: false })

const userSchema = new Schema<IUser>({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  biometricId: { type: String },
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  franchiseId: { type: Schema.Types.ObjectId, ref: "Franchise" },
  locationType: { type: String, enum: ["ho", "franchise"], required: true },
  salary: salarySchema,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
})

// Indexes
userSchema.index({ franchiseId: 1, status: 1 })
userSchema.index({ roleId: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User

