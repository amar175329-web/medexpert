import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Verification jobs in needs_review or queued
    const { data: queue, error } = await supabase
      .from("verification_jobs")
      .select(`
        *,
        user_medicines(display_name, form, expiry_date, quantity)
      `)
      .in("status", ["needs_review", "queued"])
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({
      queue: queue || [],
      metrics: {
        totalPending: queue?.length || 0,
        needsReview: queue?.filter((j) => j.status === "needs_review").length || 0,
        queued: queue?.filter((j) => j.status === "queued").length || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch admin queue" }, { status: 500 });
  }
}
