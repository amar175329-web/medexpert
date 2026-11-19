/**
 * Safety Warning Flags: Allergy & Duplicate Active Ingredient Check
 * Requirement: PRD §6.6 - Flags when an ingredient matches an allergy,
 * or the same active ingredient appears twice across active schedules for a member.
 */

export interface SafetyCheckResult {
  hasAllergyFlag: boolean;
  allergyWarnings: string[];
  hasDuplicateIngredientFlag: boolean;
  duplicateWarnings: string[];
}

export function checkSafetyFlags(params: {
  medicineIngredients: string[];
  memberAllergies: string[];
  existingActiveMedicineIngredients: Array<{ medicineName: string; ingredients: string[] }>;
}): SafetyCheckResult {
  const allergyWarnings: string[] = [];
  const duplicateWarnings: string[] = [];

  const normalizedAllergies = params.memberAllergies.map((a) => a.trim().toLowerCase());

  // 1. Check against member allergies
  for (const ingredient of params.medicineIngredients) {
    const normIng = ingredient.trim().toLowerCase();
    for (const allergy of normalizedAllergies) {
      if (normIng.includes(allergy) || allergy.includes(normIng)) {
        allergyWarnings.push(`Caution: "${ingredient}" matches known profile allergy "${allergy}".`);
      }
    }
  }

  // 2. Check for duplicate active ingredients across existing active medications
  for (const ingredient of params.medicineIngredients) {
    const normIng = ingredient.trim().toLowerCase();
    for (const activeMed of params.existingActiveMedicineIngredients) {
      for (const existingIng of activeMed.ingredients) {
        if (existingIng.trim().toLowerCase() === normIng) {
          duplicateWarnings.push(
            `Duplicate Ingredient: "${ingredient}" is already present in active schedule "${activeMed.medicineName}".`
          );
        }
      }
    }
  }

  return {
    hasAllergyFlag: allergyWarnings.length > 0,
    allergyWarnings,
    hasDuplicateIngredientFlag: duplicateWarnings.length > 0,
    duplicateWarnings,
  };
}
