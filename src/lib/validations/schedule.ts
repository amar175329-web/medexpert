import { z } from "zod";

export const createScheduleSchema = z.object({
  household_id: z.string().uuid(),
  user_medicine_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  times: z.array(z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/)).min(1, "At least one dose time required"),
  days_of_week: z.array(z.number().int().min(1).max(7)).default([1, 2, 3, 4, 5, 6, 7]),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  instructions: z.string().max(500).optional().nullable(),
  timezone: z.string().default("Asia/Kolkata"),
  active: z.boolean().default(true),
});

export const createDoseLogSchema = z.object({
  household_id: z.string().uuid(),
  schedule_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  status: z.enum(["taken", "skipped", "snoozed", "missed"]),
});
