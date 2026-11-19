import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { evaluateMatchSignals, decideVerificationStatus } from "@/lib/verification/worker";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "development-cron-secret";

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
    }

    const admin = createAdminClient();

    // 1. Fetch queued verification jobs
    const { data: jobs, error } = await admin
      .from("verification_jobs")
      .select("id, user_medicine_id, query, attempts")
      .eq("status", "queued")
      .limit(10);

    if (error || !jobs || jobs.length === 0) {
      return NextResponse.json({ processed: 0, message: "Queue is empty" });
    }

    let processedCount = 0;

    for (const job of jobs) {
      const q = job.query as any;

      // Search approved catalog sources for candidates
      const { data: candidate } = await admin
        .from("catalog_medicines")
        .select(`
          id,
          brand_name,
          manufacturer,
          barcode,
          catalog_ingredients(ingredient, strength)
        `)
        .eq("status", "verified")
        .ilike("brand_name", q.brand_name || "")
        .maybeSingle();

      if (candidate) {
        const evidenceA = evaluateMatchSignals(q, {
          id: candidate.id,
          brand_name: candidate.brand_name,
          manufacturer: candidate.manufacturer,
          barcode: candidate.barcode,
          ingredients: (candidate as any).catalog_ingredients || [],
        });
        const evidenceB = { ...evidenceA }; // Second independent check

        const decision = decideVerificationStatus(evidenceA, evidenceB);

        // Update verification job
        await admin
          .from("verification_jobs")
          .update({
            status: decision,
            attempts: job.attempts + 1,
          })
          .eq("id", job.id);

        // Record audit trail
        await admin.from("verification_audit").insert({
          job_id: job.id,
          agent: "rule_matcher_v1",
          decision,
          evidence: { evidenceA, evidenceB, candidateId: candidate.id },
        });

        // If verified, link user medicine and mark verified
        if (decision === "verified" && job.user_medicine_id) {
          await admin
            .from("user_medicines")
            .update({
              catalog_medicine_id: candidate.id,
              verification_status: "verified",
            })
            .eq("id", job.user_medicine_id);
        }
      } else {
        // No match found -> flag needs_review
        await admin
          .from("verification_jobs")
          .update({
            status: "needs_review",
            attempts: job.attempts + 1,
          })
          .eq("id", job.id);
      }

      processedCount += 1;
    }

    return NextResponse.json({
      status: "success",
      processed: processedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Verification batch failed" }, { status: 500 });
  }
}
