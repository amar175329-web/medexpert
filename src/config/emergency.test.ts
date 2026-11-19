import { describe, it, expect } from "vitest";
import { EMERGENCY_CONTACTS } from "./emergency";

describe("Emergency Contacts Config (Rule 10 & Item 3)", () => {
  it("contains 112, 102, 108 and AIIMS NPIC 1800116117", () => {
    const ids = EMERGENCY_CONTACTS.map((c) => c.id);
    expect(ids).toContain("national-emergency");
    expect(ids).toContain("maternal-ambulance");
    expect(ids).toContain("ambulance-108");
    expect(ids).toContain("poison-control");
  });

  it("labels 108 as state-dependent ambulance service", () => {
    const amb108 = EMERGENCY_CONTACTS.find((c) => c.number === "108");
    expect(amb108).toBeDefined();
    expect(amb108?.officialSource).toContain("State-dependent");
  });

  it("includes official source citations for all emergency numbers", () => {
    for (const contact of EMERGENCY_CONTACTS) {
      expect(contact.number).toMatch(/^\d+$/);
      expect(contact.officialSource.length).toBeGreaterThan(15);
    }
  });

  it("configures poison control as AIIMS NPIC 1800-116-117", () => {
    const poison = EMERGENCY_CONTACTS.find((c) => c.id === "poison-control");
    expect(poison?.number).toBe("1800116117");
    expect(poison?.displayNumber).toBe("1800-116-117");
    expect(poison?.officialSource).toContain("AIIMS New Delhi");
  });
});
