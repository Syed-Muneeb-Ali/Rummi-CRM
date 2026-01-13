import mongoose, { Schema, Model } from "mongoose"
import type { IRole } from "@/types/db"

const permissionsSchema = new Schema({
  canViewDashboard: { type: Boolean, default: false },
  canManageUsers: { type: Boolean, default: false },
  canManageFranchises: { type: Boolean, default: false },
  canManageRoles: { type: Boolean, default: false },
  canViewAllFranchises: { type: Boolean, default: false },
  canManageInventory: { type: Boolean, default: false },
  canApproveInventoryTransfers: { type: Boolean, default: false },
  canManageFinance: { type: Boolean, default: false },
  canAssignLoanOptions: { type: Boolean, default: false },
  canUploadDueLetters: { type: Boolean, default: false },
  canGenerateInvoices: { type: Boolean, default: false },
  canVerifyCashDeposits: { type: Boolean, default: false },
  canManageExpenses: { type: Boolean, default: false },
  canApproveExpenses: { type: Boolean, default: false },
  canProcessSalary: { type: Boolean, default: false },
  canManageTransport: { type: Boolean, default: false },
  canCreateTrips: { type: Boolean, default: false },
  canManageMarketing: { type: Boolean, default: false },
  canViewReports: { type: Boolean, default: false },
  canExportReports: { type: Boolean, default: false },
  canViewAuditLogs: { type: Boolean, default: false },
  canConfigureSystem: { type: Boolean, default: false },
  canCreateLeads: { type: Boolean, default: false },
  canViewOwnLeads: { type: Boolean, default: false },
  canViewAllLeads: { type: Boolean, default: false },
  canReassignLeads: { type: Boolean, default: false },
  canUploadDocuments: { type: Boolean, default: false },
  canSelectLoanOption: { type: Boolean, default: false },
  canUploadCashDeposit: { type: Boolean, default: false },
  canManageFranchiseLeads: { type: Boolean, default: false },
  canCreateFranchiseDeals: { type: Boolean, default: false },
  canVerifyFranchisePayments: { type: Boolean, default: false },
  canCreateTickets: { type: Boolean, default: false },
  canManageTickets: { type: Boolean, default: false },
}, { _id: false })

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  isSystemRole: { type: Boolean, default: false },
  permissions: { type: permissionsSchema, required: true },
}, {
  timestamps: true,
})

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema)

export default Role

