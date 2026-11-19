import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's households
    const { data: householdUsers } = await supabase
      .from("household_users")
      .select("household_id")
      .eq("user_id", user.id);

    const householdIds = householdUsers?.map((h) => h.household_id) || [];

    // Fetch all related records
    const [medicines, profiles, schedules, logs] = await Promise.all([
      supabase.from("user_medicines").select("*").in("household_id", householdIds),
      supabase.from("profiles").select("*").in("household_id", householdIds),
      supabase.from("dose_schedules").select("*").in("household_id", householdIds),
      supabase.from("dose_logs").select("*").in("household_id", householdIds),
    ]);

    const exportBundle = {
      exported_at: new Date().toISOString(),
      user_id: user.id,
      households: householdIds,
      medicines: medicines.data || [],
      profiles: profiles.data || [],
      schedules: schedules.data || [],
      dose_logs: logs.data || [],
    };

    return new NextResponse(JSON.stringify(exportBundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="medexpert_export_${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 });
  }
}
