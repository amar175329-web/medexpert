import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify cron authorization secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "development-cron-secret";

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
    }

    const admin = createAdminClient();
    const today = new Date().toISOString().split("T")[0];

    // 2. Scan medicines expiring within standard alert windows: 30, 15, 7 days
    const { data: medicines } = await admin
      .from("user_medicines")
      .select("id, household_id, display_name, expiry_date, created_by")
      .gt("expiry_date", today);

    let notificationsQueued = 0;

    if (medicines) {
      for (const med of medicines) {
        if (!med.created_by) continue;

        const expDate = new Date(med.expiry_date);
        const diffDays = Math.round(
          (expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        if ([30, 15, 7].includes(diffDays)) {
          // Idempotency key per (user, event, channel, date)
          const idempotencyKey = `expiry-${med.id}-${diffDays}d-${today}-push`;

          const { error } = await admin.from("notification_events").insert({
            user_id: med.created_by,
            kind: `expiry_${diffDays}_days`,
            channel: "push",
            idempotency_key: idempotencyKey,
            status: "pending",
          });

          if (!error) {
            notificationsQueued += 1;
          }
        }
      }
    }

    return NextResponse.json({
      status: "success",
      scheduled_at: new Date().toISOString(),
      notifications_queued: notificationsQueued,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Reminders job failed" }, { status: 500 });
  }
}
