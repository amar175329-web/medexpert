import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAiProvider } from "@/lib/ai/provider";
import { z } from "zod";

const askInputSchema = z.object({
  question: z.string().min(2).max(500),
  householdId: z.string().uuid().optional(),
});

const structuredQuerySchema = z.object({
  action: z.enum(["find_medicine", "check_expiry", "search_shelf", "check_location"]),
  medicine_name: z.string().optional(),
  term: z.string().optional(),
  is_symptom_query: z.boolean().default(false),
});

const SEE_DOCTOR_NOTE =
  "\n\nImportant: MedExpert provides information from your stored medicine labels only and does not provide medical diagnosis or advice. Please consult a qualified doctor if you are experiencing health symptoms.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = askInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const { question, householdId } = parsed.data;
    const aiProvider = getAiProvider();

    // 1. Health / Warmup check
    const health = await aiProvider.health();
    if (health.state === "asleep" || health.state === "warming") {
      // Trigger wake in background
      aiProvider.wake().catch(() => {});

      // Fallback directly to instant search per TRD §6
      const supabase = await createClient();
      let fallbackQuery = supabase
        .from("user_medicines")
        .select("id, display_name, form, expiry_date, locations(name)")
        .limit(5);

      if (householdId) {
        fallbackQuery = fallbackQuery.eq("household_id", householdId);
      }

      const { data: fallbackResults } = await fallbackQuery;

      return NextResponse.json({
        state: "warming",
        message: "Assistant is warming up… displaying instant search results in the meantime.",
        results: fallbackResults || [],
      });
    }

    // 2. Structured query conversion with strict JSON schema
    const structuredQueryPrompt = `Analyze the user's home medicine inquiry and extract structured search parameters into JSON matching schema.`;
    const aiResponse = await aiProvider.generate({
      system: "You are a medical inventory search parser. Convert natural language queries into structured parameters. Do NOT provide medical diagnosis.",
      prompt: question,
      jsonSchema: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["find_medicine", "check_expiry", "search_shelf", "check_location"] },
          medicine_name: { type: "string" },
          is_symptom_query: { type: "boolean" },
        },
        required: ["action"],
      },
    });

    // 3. Validate structured query
    const parsedQuery = structuredQuerySchema.safeParse(aiResponse.json || {});
    const queryParams = parsedQuery.success
      ? parsedQuery.data
      : { action: "search_shelf" as const, is_symptom_query: false };

    // 4. Parameterized DB query under user RLS
    const supabase = await createClient();
    let query = supabase.from("user_medicines").select(`
      id,
      display_name,
      form,
      expiry_date,
      quantity,
      verification_status,
      locations(name),
      catalog_medicines:catalog_medicine_id(
        brand_name,
        generic_name,
        catalog_facts(kind, text_en, text_hi, source_url)
      )
    `);

    if (householdId) {
      query = query.eq("household_id", householdId);
    }

    if (queryParams.medicine_name) {
      query = query.ilike("display_name", `%${queryParams.medicine_name}%`);
    }

    const { data: medicines } = await query.limit(5);

    // 5. Output filter & safety grounding
    let responseText = "";
    if (!medicines || medicines.length === 0) {
      responseText = `No matching medicines found in your shelf for "${question}".`;
    } else {
      const summaries = medicines.map((m: any) => {
        const loc = m.locations?.name || "Unspecified location";
        return `• ${m.display_name} (${m.form || "Medicine"}) is kept in: ${loc}. Expiry: ${m.expiry_date}. Status: ${m.verification_status}.`;
      });
      responseText = `Here are the matching medicines found in your shelf:\n` + summaries.join("\n");
    }

    // 6. Append doctor note if symptom related or whenever advice could be inferred
    if (queryParams.is_symptom_query || question.toLowerCase().match(/(fever|pain|cough|cold|headache|dose|sick|take)/i)) {
      responseText += SEE_DOCTOR_NOTE;
    }

    return NextResponse.json({
      answer: responseText,
      matches: medicines || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process query" }, { status: 500 });
  }
}
