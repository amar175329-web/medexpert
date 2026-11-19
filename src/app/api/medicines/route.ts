import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMedicineSchema } from "@/lib/validations/medicine";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const householdId = searchParams.get("householdId");

    let query = supabase.from("user_medicines").select(`
      *,
      locations:location_id(name),
      profiles:prescribed_for(name),
      catalog_medicines:catalog_medicine_id(
        brand_name,
        generic_name,
        manufacturer,
        catalog_ingredients(ingredient, strength),
        catalog_facts(kind, text_en, text_hi, source_url, retrieved_at)
      )
    `);

    if (householdId) {
      query = query.eq("household_id", householdId);
    }

    if (q) {
      query = query.ilike("display_name", `%${q}%`);
    }

    const { data, error } = await query.order("expiry_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const parsed = createMedicineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const { data, error } = await supabase
      .from("user_medicines")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
