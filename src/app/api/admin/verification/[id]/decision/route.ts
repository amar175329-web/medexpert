import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const decisionSchema = z.object({
  decision: z.enum(["verified", "failed"]),
  catalog_medicine_id: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = decisionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const admin = createAdminClient();

    // 1. Fetch the job
    const { data: job, error: jobErr } = await admin
      .from("verification_jobs")
      .select("id, user_medicine_id")
      .eq("id", id)
      .single();

    if (jobErr || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 2. Update job status
    await admin
      .from("verification_jobs")
      .update({ status: parsed.data.decision })
      .eq("id", id);

    // 3. Write audit log
    await admin.from("verification_audit").insert({
      job_id: id,
      agent: "human_admin_review",
      decision: parsed.data.decision,
      evidence: { notes: parsed.data.notes, catalog_id: parsed.data.catalog_medicine_id },
    });

    // 4. If approved and catalog_medicine_id given, update user medicine
    if (parsed.data.decision === "verified" && job.user_medicine_id && parsed.data.catalog_medicine_id) {
      await admin
        .from("user_medicines")
        .update({
          catalog_medicine_id: parsed.data.catalog_medicine_id,
          verification_status: "verified",
        })
        .eq("id", job.user_medicine_id);
    }

    return NextResponse.json({ success: true, decision: parsed.data.decision });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit decision" }, { status: 500 });
  }
}
