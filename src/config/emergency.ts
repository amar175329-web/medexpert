/**
 * Official Emergency Contacts Configuration for India
 * Requirement: 112, 102, 108 (state-dependent), 1800-116-117 (AIIMS NPIC).
 * Each entry includes an authoritative official source comment.
 */

export interface EmergencyContact {
  id: string;
  nameKey: string;
  number: string;
  displayNumber: string;
  officialSource: string;
  description: string;
  available: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "national-emergency",
    nameKey: "nationalEmergency",
    number: "112",
    displayNumber: "112",
    // Official Source: Emergency Response Support System (ERSS), Ministry of Home Affairs (MHA), Government of India (https://112.gov.in)
    officialSource: "ERSS, Ministry of Home Affairs, Government of India",
    description: "Pan-India single emergency number for Police, Fire, and Medical emergencies",
    available: "24x7, Toll-Free",
  },
  {
    id: "maternal-ambulance",
    nameKey: "maternalAmbulance",
    number: "102",
    displayNumber: "102",
    // Official Source: National Health Mission (NHM), Ministry of Health & Family Welfare (MoHFW), Government of India - Janani Shishu Suraksha Karyakram (JSSK)
    officialSource: "National Health Mission (NHM), Ministry of Health & Family Welfare, Government of India",
    description: "Free referral transport ambulance primarily for pregnant women, mothers and sick infants",
    available: "24x7, Toll-Free",
  },
  {
    id: "ambulance-108",
    nameKey: "ambulance",
    number: "108",
    displayNumber: "108",
    // Official Source: National Health Mission (NHM), MoHFW / State Governments (PPP emergency medical service operational in participating states)
    officialSource: "National Health Mission & State Governments (State-dependent operational emergency service)",
    description: "State-dependent emergency medical response & critical care ambulance service",
    available: "24x7, Toll-Free (in participating states)",
  },
  {
    id: "poison-control",
    nameKey: "poisonControl",
    number: "1800116117",
    displayNumber: "1800-116-117",
    // Official Source: National Poisons Information Centre (NPIC), Department of Pharmacology, All India Institute of Medical Sciences (AIIMS), New Delhi (https://www.aiims.edu)
    officialSource: "National Poisons Information Centre (NPIC), AIIMS New Delhi",
    description: "National toxicology emergency helpline for accidental poison, chemical, or medicine ingestion",
    available: "24x7, Toll-Free",
  },
];
