import mongoose, { Schema, Model } from "mongoose"

export interface IAuditLog {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  action: string
  module: string
  recordId?: mongoose.Types.ObjectId | string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  recordId: { type: Schema.Types.Mixed },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, required: true, default: Date.now },
}, {
  timestamps: false,
})

auditLogSchema.index({ userId: 1, timestamp: -1 })
auditLogSchema.index({ module: 1, timestamp: -1 })
auditLogSchema.index({ action: 1, timestamp: -1 })
auditLogSchema.index({ timestamp: -1 })

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", auditLogSchema)

export default AuditLog
