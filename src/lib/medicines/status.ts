/**
 * Medicine Expiry and Stock Calculation Logic
 * Requirement: PRD §6.5 & TRD §7 (Expiry 30/15/7 days, expired, low-stock threshold)
 */

export type ExpiryStatus = "expired" | "expiring" | "ok";

export interface ExpiryCalculation {
  status: ExpiryStatus;
  daysRemaining: number;
  urgencyLevel?: "critical" | "warning" | "normal"; // 7d = critical, 15d = warning, 30d = warning
}

export function calculateExpiryStatus(
  expiryDateStr: string | Date,
  referenceDate: Date = new Date()
): ExpiryCalculation {
  const expiry = new Date(expiryDateStr);
  // Normalize both dates to midnight UTC for accurate day difference
  const expUtc = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const refUtc = Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((expUtc - refUtc) / msPerDay);

  if (daysRemaining < 0) {
    return {
      status: "expired",
      daysRemaining,
      urgencyLevel: "critical",
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: "expiring",
      daysRemaining,
      urgencyLevel: daysRemaining <= 7 ? "critical" : "warning",
    };
  }

  return {
    status: "ok",
    daysRemaining,
    urgencyLevel: "normal",
  };
}

export function calculateStockStatus(
  quantity: number | null | undefined,
  threshold: number | null | undefined
): { isLowStock: boolean } {
  if (quantity === null || quantity === undefined) {
    return { isLowStock: false };
  }
  if (threshold === null || threshold === undefined) {
    return { isLowStock: false };
  }
  return {
    isLowStock: quantity <= threshold,
  };
}
