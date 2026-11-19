import { getTranslations } from "next-intl/server";
import { StatusChip } from "@/components/ui/StatusChip";
import { calculateExpiryStatus, calculateStockStatus } from "@/lib/medicines/status";
import { ArrowLeft, MapPin, Calendar, Layers, ShieldCheck, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function MedicineDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const common = await getTranslations("common");

  // Mock / demo medicine payload for detail view testing
  const medicine = {
    id,
    display_name: "Dolo 650 Tablet",
    form: "Tablet",
    location_name: "Master Bedroom > First Aid Box",
    expiry_date: "2027-04-15",
    quantity: 15,
    quantity_unit: "tablets",
    low_stock_threshold: 4,
    verification_status: "verified" as const,
    prescribed_for_name: "Family Common",
    batch_no: "DL2409",
    catalog: {
      brand_name: "Dolo 650",
      generic_name: "Paracetamol 650mg",
      manufacturer: "Micro Labs Ltd",
      ingredients: [{ ingredient: "Paracetamol", strength: "650 mg" }],
      facts: [
        {
          kind: "use",
          text_en: "Relief of mild to moderate pain and temporary reduction of fever.",
          source_url: "https://cdsco.gov.in",
          retrieved_at: "2026-05-10",
        },
        {
          kind: "warning",
          text_en: "Do not exceed recommended dose. Overdose may cause serious liver damage.",
          source_url: "https://cdsco.gov.in",
          retrieved_at: "2026-05-10",
        },
        {
          kind: "storage",
          text_en: "Store below 30°C in a dry place. Protect from direct sunlight.",
          source_url: "https://cdsco.gov.in",
          retrieved_at: "2026-05-10",
        },
      ],
    },
  };

  const expiryCalc = calculateExpiryStatus(medicine.expiry_date);
  const stockCalc = calculateStockStatus(medicine.quantity, medicine.low_stock_threshold);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/shelf"
          className="p-2 -ml-2 text-ink-soft hover:text-ink rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={common("back")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <StatusChip type={medicine.verification_status} />
      </div>

      {/* Main Header Card */}
      <div className="bg-surface rounded-2xl p-5 border border-ink/10 shadow-sm space-y-3">
        <div>
          <span className="text-xs font-semibold text-primary-dark uppercase tracking-wider">
            {medicine.form}
          </span>
          <h1 className="text-2xl font-extrabold text-ink leading-tight">
            {medicine.display_name}
          </h1>
          {medicine.catalog?.generic_name && (
            <p className="text-xs text-ink-soft mt-0.5">
              Generic: {medicine.catalog.generic_name}
            </p>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-ink/10">
          <StatusChip type={expiryCalc.status === "ok" ? "verified" : expiryCalc.status} />
          {stockCalc.isLowStock && <StatusChip type="low-stock" />}
        </div>
      </div>

      {/* Prominent Storage Location */}
      <div className="bg-primary-tint/70 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2.5 bg-primary text-white rounded-xl flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-primary-dark uppercase tracking-wider">
            Where it is kept
          </span>
          <p className="text-base font-bold text-ink">
            {medicine.location_name}
          </p>
        </div>
      </div>

      {/* Quantity & Expiry Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-4 border border-ink/10">
          <span className="text-xs font-semibold text-ink-soft">Remaining Stock</span>
          <p className="text-xl font-bold text-ink mt-1">
            {medicine.quantity} {medicine.quantity_unit}
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-ink/10">
          <span className="text-xs font-semibold text-ink-soft">Expires</span>
          <p className="text-xl font-bold text-ink mt-1">
            {medicine.expiry_date}
          </p>
          <span className="text-[11px] text-ink-soft">
            ({expiryCalc.daysRemaining} days left)
          </span>
        </div>
      </div>

      {/* Verified Section with Authoritative Citations */}
      {medicine.verification_status === "verified" && medicine.catalog ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Verified Authoritative Facts</span>
          </div>

          {/* Active Ingredients */}
          <div className="bg-surface rounded-2xl p-4 border border-ink/10 space-y-2">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Active Ingredients & Strength
            </h3>
            <div className="space-y-1">
              {medicine.catalog.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-ink/5 last:border-0">
                  <span className="font-semibold text-ink">{ing.ingredient}</span>
                  <span className="text-ink-soft">{ing.strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cited Facts */}
          {medicine.catalog.facts.map((fact, idx) => (
            <div key={idx} className="bg-surface rounded-2xl p-4 border border-ink/10 space-y-1.5">
              <span className="text-[11px] font-bold text-primary-dark uppercase tracking-wider">
                {fact.kind}
              </span>
              <p className="text-sm text-ink leading-relaxed">
                {fact.text_en}
              </p>
              <div className="pt-2 border-t border-ink/5 flex items-center justify-between text-[11px] text-ink-soft">
                <span>Retrieved: {fact.retrieved_at}</span>
                <a
                  href={fact.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <span>Official Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Unverified Section */
        <div className="bg-warn-bg border border-warn/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-warn font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Unverified Medicine</span>
          </div>
          <p className="text-xs text-warn font-medium leading-relaxed">
            You added this information. To guarantee family safety, we never invent medical facts or uses without an official cited source.
          </p>
          <button className="w-full py-2.5 px-3 bg-surface border border-warn/40 text-warn font-semibold text-xs rounded-xl hover:bg-warn/10 transition-colors flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check this medicine against official catalog</span>
          </button>
        </div>
      )}
    </div>
  );
}
