import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { matchMedicineSchema } from "@/lib/validations/medicine";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const parsed = matchMedicineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const { barcode, queryText } = parsed.data;

    let query = supabase
      .from("catalog_medicines")
      .select(`
        id,
        brand_name,
        generic_name,
        form,
        manufacturer,
        barcode,
        status,
        catalog_ingredients(ingredient, strength),
        catalog_facts(kind, text_en, text_hi, source_url, retrieved_at)
      `)
      .eq("status", "verified");

    if (barcode) {
      query = query.eq("barcode", barcode);
    } else if (queryText) {
      query = query.ilike("brand_name", `%${queryText}%`);
    } else {
      return NextResponse.json({ candidates: [] });
    }

    const { data, error } = await query.limit(5);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ candidates: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
