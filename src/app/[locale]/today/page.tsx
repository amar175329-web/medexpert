import { getTranslations } from "next-intl/server";
import { CheckCircle2, ShieldCheck, Clock, Check, X, RotateCcw, AlertTriangle } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";

export default async function TodayPage() {
  const t = await getTranslations("today");
  const common = await getTranslations("common");

  // Upcoming dose schedules demo for Today screen
  const upcomingDoses = [
    {
      id: "dose-1",
      medicineName: "Dolo 650",
      memberName: "Amit (Self)",
      scheduledTime: "02:00 PM",
      instructions: "After lunch with warm water",
      form: "Tablet",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("greeting", { name: "Amit" })}
        </h1>
        <p className="text-sm text-ink-soft mt-0.5">
          {common("tagline")}
        </p>
      </div>

      {/* Upcoming Doses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">
            {t("upcomingDoses")}
          </h2>
          <span className="text-xs font-semibold text-primary-dark bg-primary-tint px-2.5 py-1 rounded-full">
            Today
          </span>
        </div>

        {upcomingDoses.map((dose) => (
          <div
            key={dose.id}
            className="bg-surface rounded-2xl p-4 border border-ink/10 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-ink-soft">
                  {dose.memberName} · {dose.scheduledTime}
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  {dose.medicineName}
                </h3>
                <p className="text-xs text-ink-soft">
                  {dose.instructions}
                </p>
              </div>
              <StatusChip type="verified" />
            </div>

            {/* Big Action Buttons: Taken / Skip / Snooze */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-ink/10">
              <button className="py-2.5 px-2 bg-primary text-white font-bold text-xs rounded-xl shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 min-h-[44px]">
                <Check className="w-4 h-4" />
                <span>{t("take")}</span>
              </button>
              <button className="py-2.5 px-2 bg-surface border border-ink/20 text-ink-soft hover:text-ink font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 min-h-[44px]">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("snooze")}</span>
              </button>
              <button className="py-2.5 px-2 bg-surface border border-ink/20 text-ink-soft hover:text-danger font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 min-h-[44px]">
                <X className="w-4 h-4" />
                <span>{t("skip")}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Expiring Soon Strip */}
      <div className="bg-warn-bg border border-warn/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-warn font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{t("expiringSoon")}</span>
          </div>
          <StatusChip type="expiring" />
        </div>
        <p className="text-xs text-warn font-medium leading-relaxed">
          <strong>Azithral 500</strong> in Bedroom Cabinet expires in 14 days (Dec 03).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-4 border border-ink/10">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Safety</span>
          </div>
          <p className="text-xs text-ink-soft">
            Only authoritative, cited facts are displayed.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-ink/10">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span>Smart Expiry</span>
          </div>
          <p className="text-xs text-ink-soft">
            Proactive alerts 30, 15, and 7 days before expiry.
          </p>
        </div>
      </div>
    </div>
  );
}
