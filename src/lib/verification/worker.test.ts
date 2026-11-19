import { describe, it, expect } from "vitest";
import { evaluateMatchSignals, decideVerificationStatus } from "./worker";

describe("Verification Worker & Rule Matcher (docs/06)", () => {
  const candidate = {
    id: "cat-1",
    brand_name: "Dolo 650",
    manufacturer: "Micro Labs Ltd",
    barcode: "8901234567890",
    ingredients: [{ ingredient: "Paracetamol", strength: "650mg" }],
  };

  it("requires at least two independent signals to achieve verified confidence (Rule 3)", () => {
    // 1 signal only (brand only): below threshold -> 0.5
    const oneSignal = evaluateMatchSignals({ brand_name: "Dolo 650" }, candidate);
    expect(oneSignal.confidenceScore).toBe(0.5);

    // 2 signals (brand + manufacturer): high confidence -> 0.95
    const twoSignals = evaluateMatchSignals(
      { brand_name: "Dolo 650", manufacturer: "Micro Labs Ltd" },
      candidate
    );
    expect(twoSignals.confidenceScore).toBe(0.95);

    // 2 signals (barcode + brand): high confidence -> 0.95
    const barcodeMatch = evaluateMatchSignals(
      { brand_name: "Dolo 650", barcode: "8901234567890" },
      candidate
    );
    expect(barcodeMatch.confidenceScore).toBe(0.95);
  });

  it("verifies only when both independent agent checks agree (Rule 6)", () => {
    const evidenceA = {
      brandMatched: true,
      manufacturerMatched: true,
      ingredientStrengthMatched: false,
      barcodeMatched: false,
      confidenceScore: 0.95,
    };
    const evidenceB = { ...evidenceA };

    const status = decideVerificationStatus(evidenceA, evidenceB);
    expect(status).toBe("verified");
  });

  it("routes borderline matches or conflicts to needs_review (Rule 4)", () => {
    const evidenceA = {
      brandMatched: true,
      manufacturerMatched: false,
      ingredientStrengthMatched: false,
      barcodeMatched: false,
      confidenceScore: 0.5,
    };
    const evidenceB = { ...evidenceA, confidenceScore: 0.0 };

    const status = decideVerificationStatus(evidenceA, evidenceB);
    expect(status).toBe("needs_review");
  });
});
