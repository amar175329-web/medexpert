import { z } from "zod";

export const createMedicineSchema = z.object({
  household_id: z.string().uuid(),
  display_name: z.string().min(1, "Medicine name is required").max(200),
  form: z.string().max(50).optional().nullable(),
  location_id: z.string().uuid().optional().nullable(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  quantity: z.coerce.number().min(0).optional().nullable(),
  quantity_unit: z.string().max(30).optional().nullable(),
  low_stock_threshold: z.coerce.number().min(0).optional().nullable(),
  price_inr: z.coerce.number().min(0).optional().nullable(),
  purchased_from: z.string().max(200).optional().nullable(),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  batch_no: z.string().max(100).optional().nullable(),
  prescribed_for: z.string().uuid().optional().nullable(),
  doctor: z.string().max(150).optional().nullable(),
  catalog_medicine_id: z.string().uuid().optional().nullable(),
  verification_status: z.enum(["verified", "unverified"]).default("unverified"),
  photo_paths: z.array(z.string()).default([]),
});

export const updateMedicineSchema = createMedicineSchema.partial().omit({
  household_id: true,
});

export const matchMedicineSchema = z.object({
  barcode: z.string().min(3).max(50).optional(),
  queryText: z.string().min(2).max(200).optional(),
});
