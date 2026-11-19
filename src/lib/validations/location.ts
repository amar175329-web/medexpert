import { z } from "zod";

export const createLocationSchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1, "Location name is required").max(100),
  parent_id: z.string().uuid().optional().nullable(),
});
