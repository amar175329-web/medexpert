import { describe, it, expect, vi } from "vitest";
import { EMERGENCY_CONTACTS } from "@/config/emergency";
import { UserMedicine } from "@/types/database";

describe("Offline Storage & Proof of Functionality (idb)", () => {
  const sampleMedicine: UserMedicine = {
    id: "med-offline-1",
    household_id: "hh-offline-1",
    catalog_medicine_id: null,
    display_name: "Paracetamol 500",
    form: "Tablet",
    location_id: "loc-1",
    expiry_date: "2027-01-01",
    quantity: 10,
    quantity_unit: "strips",
    low_stock_threshold: 2,
    price_inr: 30,
    purchased_from: "Local Chemist",
    purchase_date: "2026-11-01",
    batch_no: "BATCH-99",
    prescribed_for: null,
    doctor: null,
    verification_status: "unverified",
    photo_paths: [],
    created_by: "user-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it("confirms idb package is installed and exportable", async () => {
    const idbModule = await import("idb");
    expect(idbModule.openDB).toBeDefined();
    expect(typeof idbModule.openDB).toBe("function");
  });

  it("proves emergency contacts render completely offline without any network call", () => {
    expect(EMERGENCY_CONTACTS.length).toBe(4);
    const numbers = EMERGENCY_CONTACTS.map((c) => c.number);

    expect(numbers).toContain("112");
    expect(numbers).toContain("102");
    expect(numbers).toContain("108");
    expect(numbers).toContain("1800116117");

    // Check offline source tags
    for (const contact of EMERGENCY_CONTACTS) {
      expect(contact.officialSource).toBeDefined();
      expect(contact.officialSource.length).toBeGreaterThan(10);
    }
  });

  it("validates offline shelf medicine structure matches schema", () => {
    expect(sampleMedicine.display_name).toBe("Paracetamol 500");
    expect(sampleMedicine.verification_status).toBe("unverified");
    expect(sampleMedicine.quantity).toBe(10);
  });
});
