export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HouseholdRole = "owner" | "member";
export type VerificationStatus = "verified" | "unverified";
export type FactKind =
  | "use"
  | "warning"
  | "side_effect"
  | "interaction"
  | "storage"
  | "dosage_label"
  | "disposal";

export interface Household {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface HouseholdUser {
  household_id: string;
  user_id: string;
  role: HouseholdRole;
}

export interface Profile {
  id: string;
  household_id: string;
  name: string;
  birth_year: number | null;
  allergies: string[];
  notes: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  household_id: string;
  parent_id: string | null;
  name: string;
}

export interface CatalogSource {
  id: string;
  name: string;
  url: string | null;
  trust_tier: 1 | 2 | 3;
  license_note: string | null;
  active: boolean;
  created_at: string;
}

export interface CatalogMedicine {
  id: string;
  brand_name: string;
  generic_name: string | null;
  form: string | null;
  manufacturer: string | null;
  barcode: string | null;
  status: "verified" | "rolled_back";
  verified_at: string | null;
  created_at: string;
}

export interface CatalogIngredient {
  id: string;
  catalog_medicine_id: string;
  ingredient: string;
  strength: string | null;
}

export interface CatalogFact {
  id: string;
  catalog_medicine_id: string;
  kind: FactKind;
  text_en: string;
  text_hi: string | null;
  source_id: string;
  source_url: string;
  retrieved_at: string;
  verification_job_id: string | null;
}

export interface UserMedicine {
  id: string;
  household_id: string;
  catalog_medicine_id: string | null;
  display_name: string;
  form: string | null;
  location_id: string | null;
  expiry_date: string;
  quantity: number | null;
  quantity_unit: string | null;
  low_stock_threshold: number | null;
  price_inr: number | null;
  purchased_from: string | null;
  purchase_date: string | null;
  batch_no: string | null;
  prescribed_for: string | null;
  doctor: string | null;
  verification_status: VerificationStatus;
  photo_paths: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrichedUserMedicine extends UserMedicine {
  location_name?: string | null;
  prescribed_for_name?: string | null;
  catalog?: {
    brand_name: string;
    generic_name: string | null;
    manufacturer: string | null;
    ingredients: Array<{ ingredient: string; strength: string | null }>;
    facts: CatalogFact[];
  } | null;
}
