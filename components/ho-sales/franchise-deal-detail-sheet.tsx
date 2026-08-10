"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { S3FileUpload } from "@/components/common/s3-file-upload";
import { EnterPaymentModal } from "@/components/ho-sales/enter-payment-modal";
import { FRANCHISE_DEAL_TYPE_LIST } from "@/lib/constants/franchise-deal-types";

interface PopulatedRef {
  _id: string;
  name: string;
  empId?: string;
}

interface FranchiseDealDetail {
  _id: string;
  dealNumber: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerPan?: string;
  buyerAadhaar?: string;
  locationInterest: string;
  source: string;
  stage: string;
  interestLevel?: "cold" | "warm" | "hot";
  dealType?: "A" | "B" | "C";
  feeStructure?: { totalFee: number };
  lostReason?: string;
  fdmId: PopulatedRef | string;
  franchiseId?: PopulatedRef | string;
  followUps: { date: string; notes: string; nextActionDate?: string; createdBy: PopulatedRef | string }[];
  documents?: {
    signedTnC?: { fileUrl: string };
    rentAgreement?: { fileUrl: string };
  };
  stageHistory: { stage: string; changedAt: string; changedBy: PopulatedRef | string; notes?: string }[];
  createdAt: string;
}

const STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  interested: "Interested",
  negotiation: "Negotiation",
  payment_pending: "Payment Pending",
  payment_entered: "Payment Entered",
  verified: "Verified",
  documents_uploaded: "Documents Uploaded",
  hr_setup: "HR Setup",
  inventory_allocated: "Inventory Allocated",
  active: "Active",
  lost: "Lost",
};

const LEAD_STAGES = ["prospect", "interested", "negotiation"];

interface DealDetailSheetProps {
  dealId: string | null;
  open: boolean;
  onClose: () => void;
  onChanged?: () => void;
}

export function FranchiseDealDetailSheet({ dealId, open, onClose, onChanged }: DealDetailSheetProps) {
  const { can } = useAuth();
  const [deal, setDeal] = useState<FranchiseDealDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [interestLevel, setInterestLevel] = useState<string>("");

  const [convertDealType, setConvertDealType] = useState<string>("");
  const [buyerPan, setBuyerPan] = useState("");
  const [buyerAadhaar, setBuyerAadhaar] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const [lostReason, setLostReason] = useState("");

  const fetchDeal = useCallback(async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ho-sales/franchise-deals/${dealId}`);
      const data = await res.json();
      if (res.ok) setDeal(data.deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    if (open && dealId) {
      fetchDeal();
      setActionError(null);
    }
  }, [open, dealId, fetchDeal]);

  async function runAction(body: Record<string, unknown>) {
    if (!dealId) return;
    setBusy(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/ho-sales/franchise-deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setDeal(data.deal);
      onChanged?.();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogFollowUp() {
    if (!followUpNotes.trim()) return;
    await runAction({
      action: "logFollowUp",
      notes: followUpNotes,
      nextActionDate: nextActionDate || undefined,
      interestLevel: interestLevel || undefined,
    });
    setFollowUpNotes("");
    setNextActionDate("");
  }

  async function handleConvertToDeal() {
    if (!convertDealType || !buyerPan || !buyerAadhaar || !acknowledged) return;
    await runAction({
      action: "convertToDeal",
      dealType: convertDealType,
      buyerPan,
      buyerAadhaar,
      responsibilitiesAcknowledged: true,
    });
  }

  async function handleAdvanceStage(targetStage: string) {
    await runAction({ action: "advanceStage", targetStage });
  }

  async function handleMarkLost() {
    if (!lostReason.trim()) return;
    await runAction({ action: "markLost", lostReason });
    setLostReason("");
  }

  if (!open) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          {loading || !deal ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle>{deal.dealNumber}</SheetTitle>
                  <Badge>{STAGE_LABELS[deal.stage] || deal.stage}</Badge>
                </div>
                <SheetDescription>
                  {deal.buyerName} &middot; {deal.buyerPhone}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-6">
                {actionError && (
                  <p className="text-sm text-destructive">{actionError}</p>
                )}

                {/* Basic info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Location Interest</div>
                    <div className="font-medium">{deal.locationInterest}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Source</div>
                    <div className="font-medium capitalize">{deal.source.replace("_", " ")}</div>
                  </div>
                  {deal.dealType && (
                    <div>
                      <div className="text-muted-foreground">Deal Type</div>
                      <div className="font-medium">Type {deal.dealType}</div>
                    </div>
                  )}
                  {deal.feeStructure && (
                    <div>
                      <div className="text-muted-foreground">Total Fee</div>
                      <div className="font-medium">₹{deal.feeStructure.totalFee.toLocaleString("en-IN")}</div>
                    </div>
                  )}
                  {typeof deal.fdmId === "object" && (
                    <div>
                      <div className="text-muted-foreground">FDM</div>
                      <div className="font-medium">{deal.fdmId.name}</div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Convert to deal (lead stages only) */}
                {LEAD_STAGES.includes(deal.stage) && can("canCreateFranchiseDeals") && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Convert to Deal</h4>
                    <Select value={convertDealType} onValueChange={setConvertDealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FRANCHISE_DEAL_TYPE_LIST.map((t) => (
                          <SelectItem key={t.code} value={t.code}>
                            {t.label} &middot; ₹{t.feeStructure.totalFee.toLocaleString("en-IN")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Buyer PAN" value={buyerPan} onChange={(e) => setBuyerPan(e.target.value)} />
                    <Input placeholder="Buyer Aadhaar" value={buyerAadhaar} onChange={(e) => setBuyerAadhaar(e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Checkbox checked={acknowledged} onCheckedChange={(v) => setAcknowledged(!!v)} />
                      <span className="text-sm">Responsibilities acknowledged</span>
                    </div>
                    <Button
                      size="sm"
                      disabled={busy || !convertDealType || !buyerPan || !buyerAadhaar || !acknowledged}
                      onClick={handleConvertToDeal}
                    >
                      Convert to Deal
                    </Button>
                  </div>
                )}

                {/* Enter payment */}
                {deal.stage === "payment_pending" && can("canCreateFranchiseDeals") && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Payment</h4>
                    <Button size="sm" onClick={() => setPaymentModalOpen(true)}>
                      Enter Payment
                    </Button>
                  </div>
                )}

                {/* Documents */}
                {["verified", "documents_uploaded", "hr_setup", "inventory_allocated", "active"].includes(deal.stage) &&
                  can("canCreateFranchiseDeals") && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Documents</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Signed T&C {deal.documents?.signedTnC ? "✓ uploaded" : "— pending"}
                        </p>
                        <S3FileUpload
                          label="Upload signed T&C"
                          accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] }}
                          onUploaded={({ urls }) => runAction({ action: "uploadDocuments", signedTnC: { fileUrl: urls[0] } })}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Rent Agreement {deal.documents?.rentAgreement ? "✓ uploaded" : "— pending"}
                        </p>
                        <S3FileUpload
                          label="Upload rent agreement"
                          accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] }}
                          onUploaded={({ urls }) => runAction({ action: "uploadDocuments", rentAgreement: { fileUrl: urls[0] } })}
                        />
                      </div>
                    </div>
                  )}

                {/* Manual HR advance */}
                {can("canManageFranchises") && (deal.stage === "documents_uploaded" || deal.stage === "hr_setup") && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">HR Setup</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() =>
                        handleAdvanceStage(deal.stage === "documents_uploaded" ? "hr_setup" : "inventory_allocated")
                      }
                    >
                      Advance to {deal.stage === "documents_uploaded" ? "HR Setup" : "Inventory Allocated"}
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Follow-ups */}
                {can("canManageFranchiseLeads") && deal.stage !== "active" && deal.stage !== "lost" && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Log Follow-up</h4>
                    <Textarea
                      placeholder="Notes..."
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={nextActionDate}
                        onChange={(e) => setNextActionDate(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={interestLevel} onValueChange={setInterestLevel}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Interest level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cold">Cold</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="hot">Hot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" disabled={busy || !followUpNotes.trim()} onClick={handleLogFollowUp}>
                      Add Follow-up
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {[...deal.followUps].reverse().map((f, i) => (
                    <div key={i} className="text-sm border-l-2 pl-3 py-1">
                      <div className="text-muted-foreground text-xs">{format(new Date(f.date), "MMM dd, yyyy")}</div>
                      <div>{f.notes}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Stage history */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Stage History</h4>
                  {[...deal.stageHistory].reverse().map((s, i) => (
                    <div key={i} className="text-sm border-l-2 pl-3 py-1">
                      <div className="text-muted-foreground text-xs">{format(new Date(s.changedAt), "MMM dd, yyyy HH:mm")}</div>
                      <div>{STAGE_LABELS[s.stage] || s.stage}</div>
                    </div>
                  ))}
                </div>

                {/* Mark lost */}
                {can("canManageFranchiseLeads") && deal.stage !== "active" && deal.stage !== "lost" && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-destructive">Mark as Lost</h4>
                      <Textarea
                        placeholder="Reason..."
                        value={lostReason}
                        onChange={(e) => setLostReason(e.target.value)}
                        rows={2}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy || !lostReason.trim()}
                        onClick={handleMarkLost}
                      >
                        Mark as Lost
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <EnterPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        franchiseDealId={dealId ?? null}
        totalFee={deal?.feeStructure?.totalFee}
        onSuccess={() => {
          fetchDeal();
          onChanged?.();
        }}
      />
    </>
  );
}
