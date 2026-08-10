"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { FranchiseDealsTable } from "@/components/ho-sales/franchise-deals-table";

export default function FranchiseDealsPage() {
  return (
    <ProtectedRoute requiredPermission="canManageFranchiseLeads">
      <FranchiseDealsTable scope="deals" />
    </ProtectedRoute>
  );
}
