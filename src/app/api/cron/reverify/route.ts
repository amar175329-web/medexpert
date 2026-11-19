import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "development-cron-secret";

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Check catalog sources health and identify rolled back catalog items
    const { data: rolledBackMedicines } = await admin
      .from("catalog_medicines")
      .select("id")
      .eq("status", "rolled_back");

    let rollbackCount = 0;

    if (rolledBackMedicines && rolledBackMedicines.length > 0) {
      const rolledBackIds = rolledBackMedicines.map((m) => m.id);

      // Automatic rollback: affected user medicines revert to unverified
      const { data: updated } = await admin
        .from("user_medicines")
        .update({
          catalog_medicine_id: null,
          verification_status: "unverified",
        })
        .in("catalog_medicine_id", rolledBackIds)
        .select("id");

      rollbackCount = updated?.length || 0;
    }

    return NextResponse.json({
      status: "success",
      reverified_at: new Date().toISOString(),
      rollbacks_applied: rollbackCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Re-verification failed" }, { status: 500 });
  }
}
