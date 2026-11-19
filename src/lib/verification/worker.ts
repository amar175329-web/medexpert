/**
 * Verification Worker & Rule Matcher Engine
 * Requirements: docs/06_VERIFICATION_AGENTS.md
 * - Only verified from approved authoritative sources with citations
 * - Rule-based matching with >= 2 independent signals
 * - Second independent check
 * - Automatic rollback & exception queuing
 * - Full audit log in verification_audit
 */

export interface MatchEvidence {
  brandMatched: boolean;
  manufacturerMatched: boolean;
  ingredientStrengthMatched: boolean;
  barcodeMatched: boolean;
  confidenceScore: number;
}

export interface VerificationCandidate {
  id: string;
  brand_name: string;
  manufacturer?: string | null;
  barcode?: string | null;
  ingredients: Array<{ ingredient: string; strength: string | null }>;
}

export function evaluateMatchSignals(
  query: { brand_name: string; manufacturer?: string; barcode?: string; ingredient?: string },
  candidate: VerificationCandidate
): MatchEvidence {
  let signalsCount = 0;

  const brandMatched =
    query.brand_name.trim().toLowerCase() === candidate.brand_name.trim().toLowerCase();
  if (brandMatched) signalsCount += 1;

  const barcodeMatched = Boolean(
    query.barcode && candidate.barcode && query.barcode.trim() === candidate.barcode.trim()
  );
  if (barcodeMatched) signalsCount += 1;

  const manufacturerMatched = Boolean(
    query.manufacturer &&
      candidate.manufacturer &&
      query.manufacturer.trim().toLowerCase() === candidate.manufacturer.trim().toLowerCase()
  );
  if (manufacturerMatched) signalsCount += 1;

  const ingredientStrengthMatched = Boolean(
    query.ingredient &&
      candidate.ingredients.some(
        (i) =>
          i.ingredient.toLowerCase().includes(query.ingredient!.toLowerCase()) ||
          query.ingredient!.toLowerCase().includes(i.ingredient.toLowerCase())
      )
  );
  if (ingredientStrengthMatched) signalsCount += 1;

  // Confidence score: requires at least 2 independent signals (docs/06 Rule 3)
  const confidenceScore = signalsCount >= 2 ? 0.95 : signalsCount === 1 ? 0.5 : 0.0;

  return {
    brandMatched,
    manufacturerMatched,
    ingredientStrengthMatched,
    barcodeMatched,
    confidenceScore,
  };
}

export function decideVerificationStatus(
  evidenceA: MatchEvidence,
  evidenceB: MatchEvidence
): "verified" | "needs_review" | "failed" {
  // Independent second agent check (docs/06 Rule 6)
  if (evidenceA.confidenceScore >= 0.9 && evidenceB.confidenceScore >= 0.9) {
    return "verified";
  }

  // Conflict or borderline match -> needs_review (docs/06 Rule 4)
  if (evidenceA.confidenceScore >= 0.5 || evidenceB.confidenceScore >= 0.5) {
    return "needs_review";
  }

  return "failed";
}
