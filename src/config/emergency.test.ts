import { describe, it, expect } from "vitest";
import { EMERGENCY_CONTACTS } from "./emergency";

describe("Emergency Contacts Config (Rule 10)", () => {
  it("contains all three mandatory official numbers", () => {
    const ids = EMERGENCY_CONTACTS.map((c) => c.id);
    expect(ids).toContain("national-emergency");
    expect(ids).toContain("ambulance");
    expect(ids).toContain("poison-control");
  });

  it("has valid numbers and official source comments for all entries", () => {
    for (const contact of EMERGENCY_CONTACTS) {
      expect(contact.number).toMatch(/^\d+$/);
      expect(contact.officialSource.length).toBeGreaterThan(10);
    }
  });

  it("has national emergency 112, ambulance 108, and AIIMS poison control", () => {
    const national = EMERGENCY_CONTACTS.find((c) => c.id === "national-emergency");
    const ambulance = EMERGENCY_CONTACTS.find((c) => c.id === "ambulance");
    const poison = EMERGENCY_CONTACTS.find((c) => c.id === "poison-control");

    expect(national?.number).toBe("112");
    expect(ambulance?.number).toBe("108");
    expect(poison?.number).toBe("1800116117");
  });
});
