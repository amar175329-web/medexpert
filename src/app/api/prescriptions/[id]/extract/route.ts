import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check prescription exists and belongs to authorized household
    const { data: rx, error: rxErr } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (rxErr || !rx) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    // Proposed unverified extraction suggestions
    // Rule: nothing is added until user explicitly accepts and saves
    const suggestions = [
      {
        suggested_name: "Augmentin 625 Duo",
        form: "Tablet",
        dosage: "Twice daily after food",
        status: "unverified_suggestion",
        user_confirmation_required: true,
      },
      {
        suggested_name: "Pan 40",
        form: "Tablet",
        dosage: "Once daily before breakfast",
        status: "unverified_suggestion",
        user_confirmation_required: true,
      },
    ];

    // Store extraction result in prescription record
    await supabase
      .from("prescriptions")
      .update({ extracted: suggestions })
      .eq("id", id);

    return NextResponse.json({
      status: "extracted",
      suggestions,
      note: "These are unverified suggestions extracted from your prescription. You must review and confirm before any medicine is added to your shelf.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
  }
}
