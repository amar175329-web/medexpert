import { z } from "zod";

export const createProfileSchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  birth_year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  allergies: z.array(z.string().trim()).default([]),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateProfileSchema = createProfileSchema.partial().omit({
  household_id: true,
});
