import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updatePrefsSchema = z.object({
  push: z.boolean().optional(),
  whatsapp: z.boolean().optional(),
  whatsapp_number: z.string().regex(/^\+91\d{10}$/, "Invalid Indian mobile number (+91XXXXXXXXXX)").optional().nullable(),
  email: z.boolean().optional(),
  expiry_days: z.array(z.number().int()).default([30, 15, 7]),
  quiet_start: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  quiet_end: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notification_prefs")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: data || {
        push: true,
        whatsapp: false,
        whatsapp_number: null,
        email: true,
        expiry_days: [30, 15, 7],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load preferences" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updatePrefsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const { data, error } = await supabase
      .from("notification_prefs")
      .upsert({ user_id: user.id, ...parsed.data })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update preferences" }, { status: 500 });
  }
}
