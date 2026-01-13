import type { Types } from "mongoose"

// Common types
export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface DocumentUpload {
  fileUrl: string
  uploadedAt: Date
  uploadedBy: Types.ObjectId
}

// User types
export interface SalaryInfo {
  baseSalary: number
  effectiveFrom: Date
}

export interface IUser {
  _id: Types.ObjectId
  empId: string
  name: string
  email: string
  phone: string
  passwordHash?: string
  biometricId?: string
  roleId: Types.ObjectId
  franchiseId?: Types.ObjectId
  locationType: "ho" | "franchise"
  salary?: SalaryInfo
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
  createdBy: Types.ObjectId
}

// Role types
export interface RolePermissions {
  canViewDashboard: boolean
  canManageUsers: boolean
  canManageFranchises: boolean
  canManageRoles: boolean
  canViewAllFranchises: boolean
  canManageInventory: boolean
  canApproveInventoryTransfers: boolean
  canManageFinance: boolean
  canAssignLoanOptions: boolean
  canUploadDueLetters: boolean
  canGenerateInvoices: boolean
  canVerifyCashDeposits: boolean
  canManageExpenses: boolean
  canApproveExpenses: boolean
  canProcessSalary: boolean
  canManageTransport: boolean
  canCreateTrips: boolean
  canManageMarketing: boolean
  canViewReports: boolean
  canExportReports: boolean
  canViewAuditLogs: boolean
  canConfigureSystem: boolean
  canCreateLeads: boolean
  canViewOwnLeads: boolean
  canViewAllLeads: boolean
  canReassignLeads: boolean
  canUploadDocuments: boolean
  canSelectLoanOption: boolean
  canUploadCashDeposit: boolean
  canManageFranchiseLeads: boolean
  canCreateFranchiseDeals: boolean
  canVerifyFranchisePayments: boolean
  canCreateTickets: boolean
  canManageTickets: boolean
}

export interface IRole {
  _id: Types.ObjectId
  name: string
  displayName: string
  description: string
  isSystemRole: boolean
  permissions: RolePermissions
  createdAt: Date
  updatedAt: Date
}

// Session types
export interface ISession {
  _id: Types.ObjectId
  userId: Types.ObjectId
  token: string
  deviceInfo?: string
  ipAddress?: string
  expiresAt: Date
  createdAt: Date
  lastActivityAt: Date
}

// Franchise Deal types
export interface FollowUp {
  date: Date
  notes: string
  nextActionDate?: Date
  createdBy: Types.ObjectId
}

export interface FeeStructure {
  eRickshawFee: number
  chargingPointFee: number
  gpsSparesFee: number
  totalFee: number
}

export interface IncludedAssets {
  eRickshawCount: number
  chargingPointCount: number
  gpsUnits: number
  sparesValue: number
}

export interface CommissionTier {
  minSales: number
  maxSales: number
  amountPerSale: number
}

export interface CommissionStructure {
  type: "tiered" | "flat"
  tiers?: CommissionTier[]
  flatRate?: number
  inventoryTransferCommission?: number
}

export interface FranchiseDealDocuments {
  signedTnC?: DocumentUpload
  rentAgreement?: DocumentUpload
}

export interface StageHistoryEntry {
  stage: string
  changedAt: Date
  changedBy: Types.ObjectId
  notes?: string
}

export type FranchiseDealStage = 
  | "prospect" 
  | "interested" 
  | "negotiation" 
  | "payment_pending" 
  | "payment_entered" 
  | "verified" 
  | "documents_uploaded" 
  | "hr_setup" 
  | "inventory_allocated" 
  | "active" 
  | "lost"

export type DealType = "A" | "B" | "C"

export interface IFranchiseDeal {
  _id: Types.ObjectId
  dealNumber: string
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  buyerAddress: Address
  buyerPan?: string
  buyerAadhaar?: string
  locationInterest: string
  source: "walk_in" | "referral" | "campaign" | "website" | "other"
  stage: FranchiseDealStage
  followUps: FollowUp[]
  interestLevel?: "cold" | "warm" | "hot"
  lostReason?: string
  dealType?: DealType
  feeStructure?: FeeStructure
  includedAssets?: IncludedAssets
  commissionStructure?: CommissionStructure
  responsibilitiesAcknowledged?: boolean
  fdmId: Types.ObjectId
  documents?: FranchiseDealDocuments
  franchiseId?: Types.ObjectId
  stageHistory: StageHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

// Franchise Payment types
export interface PaymentBreakup {
  eRickshawFee: number
  chargingPointFee: number
  gpsSparesFee: number
}

export interface IFranchisePayment {
  _id: Types.ObjectId
  franchiseDealId: Types.ObjectId
  amount: number
  paymentMethod: "bank_transfer"
  bankTransferRef: string
  paymentDate: Date
  breakup: PaymentBreakup
  status: "pending" | "verified" | "flagged"
  verifiedBy?: Types.ObjectId
  verifiedAt?: Date
  flagReason?: string
  proofDocument?: {
    fileUrl: string
    uploadedAt: Date
  }
  createdAt: Date
  updatedAt: Date
  createdBy: Types.ObjectId
}

// Franchise types
export interface FranchiseCommissionStructure {
  type: "tiered" | "flat"
  tiers?: CommissionTier[]
  flatRate?: number
  inventoryTransferCommission: number
}

export interface IFranchise {
  _id: Types.ObjectId
  franchiseCode: string
  name: string
  dealId: Types.ObjectId
  dealType: DealType
  ownerId: Types.ObjectId
  address: Address
  commissionStructure: FranchiseCommissionStructure
  status: "active" | "suspended"
  activatedAt: Date
  createdAt: Date
  updatedAt: Date
}

// Rent Agreement types
export interface RenewedDocument {
  fileUrl: string
  uploadedAt: Date
  uploadedBy: Types.ObjectId
  validFrom: Date
  validTo: Date
}

export interface IRentAgreement {
  _id: Types.ObjectId
  franchiseId: Types.ObjectId
  landlordName: string
  landlordPhone: string
  landlordEmail?: string
  landlordAddress?: string
  propertyAddress: Address
  propertySize?: string
  monthlyRent: number
  securityDeposit?: number
  agreementStartDate: Date
  agreementEndDate: Date
  annualIncrementPercent: number
  renewalTerms?: string
  paidBy: "company" | "franchise_owner"
  agreementDocument?: DocumentUpload
  renewedDocuments?: RenewedDocument[]
  status: "active" | "expired" | "renewed"
  createdAt: Date
  updatedAt: Date
  createdBy: Types.ObjectId
}

// Customer Deal types
export interface CustomerDocuments {
  panCard?: {
    number: string
    fileUrl: string
    uploadedAt: Date
  }
  photo?: {
    fileUrl: string
    uploadedAt: Date
  }
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    bankName: string
    branchName?: string
    fileUrl?: string
    uploadedAt: Date
  }
}

export interface CustomerInfo {
  name: string
  phone: string
  email?: string
  address: Address
  source: "walk_in" | "referral" | "campaign" | "freelancer" | "other_seller"
  documents?: CustomerDocuments
}

export interface OtherSellerInfo {
  name: string
  phone: string
  email?: string
  address?: string
}

export interface VehicleSelection {
  inventoryId: Types.ObjectId
  engineNumber: string
  chassisNumber: string
  model: string
  selectedAt: Date
}

export interface LoanDetails {
  assignedOptions: Types.ObjectId[]
  selectedOptionId?: Types.ObjectId
  downpaymentAmount?: number
  downpaymentConfirmedAt?: Date
}

export type CustomerDealStage = 
  | "lead" 
  | "interested" 
  | "documents_submitted" 
  | "loan_in_progress" 
  | "approved" 
  | "sold" 
  | "delivered"

export interface ICustomerDeal {
  _id: Types.ObjectId
  dealNumber: string
  franchiseId: Types.ObjectId
  customer: CustomerInfo
  salespersonType: "staff" | "freelancer" | "other_seller"
  salespersonId: Types.ObjectId
  freelancerId?: Types.ObjectId
  otherSellerInfo?: OtherSellerInfo
  stage: CustomerDealStage
  followUps: FollowUp[]
  vehicleSelection?: VehicleSelection
  loanDetails?: LoanDetails
  dueLetterId?: Types.ObjectId
  invoiceId?: Types.ObjectId
  soldAt?: Date
  deliveredAt?: Date
  deliveryTripId?: Types.ObjectId
  stageHistory: StageHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

// Loan Option types
export interface ILoanOption {
  _id: Types.ObjectId
  financerName: string
  name: string
  interestRate: number
  tenure: number
  processingFee: number
  processingFeeType: "fixed" | "percentage"
  requiredDocuments: string[]
  minDownpayment?: number
  maxLoanAmount?: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
  createdBy: Types.ObjectId
}

// Due Letter types
export interface IDueLetter {
  _id: Types.ObjectId
  customerDealId: Types.ObjectId
  loanOptionId: Types.ObjectId
  financerName: string
  dueLetterNumber: string
  amount: number
  document: DocumentUpload
  createdAt: Date
}

// E-rickshaw Invoice types
export interface CustomerSnapshot {
  name: string
  phone: string
  address: Address
  panNumber?: string
}

export interface VehicleDetails {
  model: string
  engineNumber: string
  chassisNumber: string
  sellingPrice: number
}

export interface InvoicePricing {
  basePrice: number
  tax: number
  taxRate: number
  totalAmount: number
}

export interface FinancerDetails {
  financerName: string
  loanAmount: number
  downpayment: number
}

export interface IErickshawInvoice {
  _id: Types.ObjectId
  invoiceNumber: string
  customerDealId: Types.ObjectId
  franchiseId: Types.ObjectId
  salespersonId: Types.ObjectId
  customerSnapshot: CustomerSnapshot
  vehicleDetails: VehicleDetails
  pricing: InvoicePricing
  financerDetails?: FinancerDetails
  pdfUrl?: string
  generatedAt: Date
  generatedBy: Types.ObjectId
  createdAt: Date
}

// Cash Deposit types
export interface DepositSlip {
  fileUrl: string
  uploadedAt: Date
  uploadedBy: Types.ObjectId
}

export interface ICashDeposit {
  _id: Types.ObjectId
  invoiceId: Types.ObjectId
  customerDealId: Types.ObjectId
  salespersonId: Types.ObjectId
  franchiseId: Types.ObjectId
  amount: number
  deadlineAt: Date
  depositSlip?: DepositSlip
  status: "pending_upload" | "uploaded" | "verified" | "flagged"
  verifiedBy?: Types.ObjectId
  verifiedAt?: Date
  flagReason?: string
  isOverdue: boolean
  createdAt: Date
  updatedAt: Date
}

// Freelancer types
export interface FreelancerBankDetails {
  accountNumber: string
  ifscCode: string
  bankName: string
  branchName?: string
}

export interface IFreelancer {
  _id: Types.ObjectId
  empId: string
  name: string
  phone: string
  email?: string
  aadhaarNumber: string
  panNumber: string
  address: Address
  bankDetails: FreelancerBankDetails
  commissionPerSale: number
  requestedBy: Types.ObjectId
  requestedAt: Date
  approvedBy?: Types.ObjectId
  approvedAt?: Date
  status: "pending" | "active" | "rejected" | "inactive"
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

// Inventory types
export interface TransferHistoryEntry {
  fromLocation: string
  toLocation: string
  transferredAt: Date
  tripId?: Types.ObjectId
}

export type InventoryItemType = "e_rickshaw" | "spare_part" | "gps" | "charging_point"
export type InventoryStatus = "available" | "reserved" | "sold" | "in_transit" | "used"

export interface IInventoryItem {
  _id: Types.ObjectId
  itemType: InventoryItemType
  engineNumber?: string
  chassisNumber?: string
  model?: string
  sku?: string
  partName?: string
  title: string
  imageUrl?: string
  sellingPrice: number
  costPrice?: number
  locationType: "ho" | "franchise"
  franchiseId?: Types.ObjectId
  status: InventoryStatus
  reservedForDealId?: Types.ObjectId
  quantity?: number
  transferHistory: TransferHistoryEntry[]
  createdAt: Date
  updatedAt: Date
  createdBy: Types.ObjectId
}

