import mongoose, { Schema, Model } from "mongoose"
import type { ISession } from "@/types/db"

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  expiresAt: { type: Date, required: true },
  lastActivityAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

// Indexes
sessionSchema.index({ userId: 1 })
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index for auto-cleanup

const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema)

export default Session

