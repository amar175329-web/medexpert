import { describe, it, expect } from "vitest";
import { calculateExpiryStatus, calculateStockStatus } from "./status";

describe("Medicine Expiry & Stock Calculations", () => {
  const baseDate = new Date("2026-11-19T00:00:00Z");

  it("identifies past dates as expired", () => {
    const result = calculateExpiryStatus("2026-11-18", baseDate);
    expect(result.status).toBe("expired");
    expect(result.daysRemaining).toBe(-1);
    expect(result.urgencyLevel).toBe("critical");
  });

  it("identifies dates within 7 days as critical expiring", () => {
    const result = calculateExpiryStatus("2026-11-24", baseDate);
    expect(result.status).toBe("expiring");
    expect(result.daysRemaining).toBe(5);
    expect(result.urgencyLevel).toBe("critical");
  });

  it("identifies dates within 15-30 days as warning expiring", () => {
    const result15 = calculateExpiryStatus("2026-12-04", baseDate); // 15 days
    expect(result15.status).toBe("expiring");
    expect(result15.daysRemaining).toBe(15);
    expect(result15.urgencyLevel).toBe("warning");

    const result30 = calculateExpiryStatus("2026-12-19", baseDate); // 30 days
    expect(result30.status).toBe("expiring");
    expect(result30.daysRemaining).toBe(30);
    expect(result30.urgencyLevel).toBe("warning");
  });

  it("identifies dates > 30 days as ok", () => {
    const result = calculateExpiryStatus("2027-01-01", baseDate);
    expect(result.status).toBe("ok");
    expect(result.daysRemaining).toBeGreaterThan(30);
    expect(result.urgencyLevel).toBe("normal");
  });

  it("detects low stock accurately against threshold", () => {
    expect(calculateStockStatus(2, 5).isLowStock).toBe(true);
    expect(calculateStockStatus(5, 5).isLowStock).toBe(true);
    expect(calculateStockStatus(6, 5).isLowStock).toBe(false);
    expect(calculateStockStatus(null, 5).isLowStock).toBe(false);
    expect(calculateStockStatus(2, null).isLowStock).toBe(false);
  });
});
