import { getTranslations } from "next-intl/server";
import { CheckCircle2, ShieldCheck, Clock, Sparkles } from "lucide-react";

export default async function TodayPage() {
  const t = await getTranslations("today");
  const common = await getTranslations("common");

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("defaultGreeting")}
        </h1>
        <p className="text-sm text-ink-soft mt-0.5">
          {common("tagline")}
        </p>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-ink/10 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary-tint text-primary flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">
            {t("allClear")}
          </h2>
          <p className="text-sm text-ink-soft mt-1">
            No pending doses right now. Your cabinet is up to date.
          </p>
        </div>
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
