/**
 * Emergency Contacts Configuration for India
 * Requirement: MedExpert Rule 10 - "Emergency numbers must be confirmed against official sources before launch; keep them in one config file with a source comment."
 */

export interface EmergencyContact {
  id: string;
  nameKey: string;
  number: string;
  officialSource: string;
  description: string;
  available: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "national-emergency",
    nameKey: "nationalEmergency",
    number: "112",
    // Source: Ministry of Home Affairs (MHA), Government of India - Emergency Response Support System (ERSS) https://112.gov.in
    officialSource: "ERSS (Emergency Response Support System), Ministry of Home Affairs, Government of India",
    description: "All-in-one emergency response for Police, Fire, and Ambulance",
    available: "24x7, Toll-Free",
  },
  {
    id: "ambulance",
    nameKey: "ambulance",
    number: "108",
    // Source: National Health Mission (NHM), Ministry of Health & Family Welfare (MoHFW), Government of India
    officialSource: "National Health Mission, Ministry of Health & Family Welfare, Government of India",
    description: "Emergency Medical & Ambulance Transport Services",
    available: "24x7, Toll-Free",
  },
  {
    id: "poison-control",
    nameKey: "poisonControl",
    number: "1800116117",
    // Source: National Poisons Information Centre (NPIC), Department of Pharmacology, All India Institute of Medical Sciences (AIIMS), New Delhi
    officialSource: "National Poisons Information Centre (NPIC), AIIMS New Delhi (https://www.aiims.edu)",
    description: "Toxicology and accidental medicine/chemical ingestion emergency helpline",
    available: "24x7, Toll-Free",
  },
];
