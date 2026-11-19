import { describe, it, expect } from "vitest";
import { checkSafetyFlags } from "./allergy-check";

describe("Safety Warning Flags Engine (PRD §6.6)", () => {
  it("flags allergy matches accurately", () => {
    const result = checkSafetyFlags({
      medicineIngredients: ["Amoxicillin Clavulanate", "Paracetamol"],
      memberAllergies: ["Penicillin", "Amoxicillin"],
      existingActiveMedicineIngredients: [],
    });

    expect(result.hasAllergyFlag).toBe(true);
    expect(result.allergyWarnings.length).toBeGreaterThan(0);
    expect(result.allergyWarnings[0]).toContain("Amoxicillin");
  });

  it("flags duplicate active ingredients across active schedules", () => {
    const result = checkSafetyFlags({
      medicineIngredients: ["Paracetamol", "Caffeine"],
      memberAllergies: [],
      existingActiveMedicineIngredients: [
        {
          medicineName: "Dolo 650",
          ingredients: ["Paracetamol"],
        },
      ],
    });

    expect(result.hasDuplicateIngredientFlag).toBe(true);
    expect(result.duplicateWarnings.length).toBe(1);
    expect(result.duplicateWarnings[0]).toContain('already present in active schedule "Dolo 650"');
  });

  it("returns clear status when no conflict exists", () => {
    const result = checkSafetyFlags({
      medicineIngredients: ["Cetirizine 10mg"],
      memberAllergies: ["Sulfa drugs"],
      existingActiveMedicineIngredients: [
        { medicineName: "Vitamin C", ingredients: ["Ascorbic Acid"] },
      ],
    });

    expect(result.hasAllergyFlag).toBe(false);
    expect(result.hasDuplicateIngredientFlag).toBe(false);
  });
});
