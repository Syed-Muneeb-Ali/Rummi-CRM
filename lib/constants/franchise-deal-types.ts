import type { CommissionStructure, FeeStructure, IncludedAssets } from "@/types/db"

export type DealTypeCode = "A" | "B" | "C"

export interface FranchiseDealTypeConfig {
  code: DealTypeCode
  label: string
  eRickshawCount: number
  feeStructure: FeeStructure
  includedAssets: IncludedAssets
  commissionStructure: CommissionStructure
}

// PRD: HO Sales - Franchise Sales Lifecycle (FDM) fee/commission table
export const FRANCHISE_DEAL_TYPES: Record<DealTypeCode, FranchiseDealTypeConfig> = {
  A: {
    code: "A",
    label: "Type A (3 E-Rickshaws)",
    eRickshawCount: 3,
    feeStructure: {
      eRickshawFee: 683000,
      chargingPointFee: 0,
      gpsSparesFee: 0,
      totalFee: 683000,
    },
    includedAssets: {
      eRickshawCount: 3,
      chargingPointCount: 1,
      gpsUnits: 3,
      sparesValue: 0,
    },
    commissionStructure: {
      type: "tiered",
      tiers: [
        { minSales: 1, maxSales: 10, amountPerSale: 7000 },
        { minSales: 11, maxSales: 15, amountPerSale: 6000 },
        { minSales: 16, maxSales: 20, amountPerSale: 5000 },
      ],
      inventoryTransferCommission: 10,
    },
  },
  B: {
    code: "B",
    label: "Type B (1 E-Rickshaw)",
    eRickshawCount: 1,
    feeStructure: {
      eRickshawFee: 383000,
      chargingPointFee: 0,
      gpsSparesFee: 0,
      totalFee: 383000,
    },
    includedAssets: {
      eRickshawCount: 1,
      chargingPointCount: 1,
      gpsUnits: 1,
      sparesValue: 0,
    },
    commissionStructure: {
      type: "flat",
      flatRate: 9000,
      inventoryTransferCommission: 10,
    },
  },
  C: {
    code: "C",
    label: "Type C (2 E-Rickshaws)",
    eRickshawCount: 2,
    feeStructure: {
      eRickshawFee: 583000,
      chargingPointFee: 0,
      gpsSparesFee: 0,
      totalFee: 583000,
    },
    includedAssets: {
      eRickshawCount: 2,
      chargingPointCount: 1,
      gpsUnits: 2,
      sparesValue: 0,
    },
    commissionStructure: {
      type: "tiered",
      tiers: [
        { minSales: 1, maxSales: 10, amountPerSale: 6500 },
        { minSales: 11, maxSales: 15, amountPerSale: 5000 },
        { minSales: 16, maxSales: 20, amountPerSale: 4000 },
      ],
      inventoryTransferCommission: 10,
    },
  },
}

export function getFranchiseDealTypeConfig(dealType: DealTypeCode): FranchiseDealTypeConfig {
  return FRANCHISE_DEAL_TYPES[dealType]
}

export const FRANCHISE_DEAL_TYPE_LIST = Object.values(FRANCHISE_DEAL_TYPES)
