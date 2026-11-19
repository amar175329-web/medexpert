import { getTranslations } from "next-intl/server";
import { Search, Sparkles, AlertTriangle, ShieldAlert } from "lucide-react";

export default async function AskPage() {
  const t = await getTranslations("ask");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("title")}
        </h1>
      </div>

      {/* Mode Tabs: Search vs Ask */}
      <div className="flex bg-surface p-1 rounded-2xl border border-ink/10 shadow-sm">
        <button className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center bg-primary text-white shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{t("askTab")}</span>
        </button>
        <button className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-center text-ink-soft hover:text-ink flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          <span>{t("searchTab")}</span>
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <textarea
          rows={3}
          placeholder={t("placeholder")}
          className="w-full p-4 bg-surface border border-ink/15 rounded-2xl text-ink placeholder:text-ink-soft text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm resize-none"
        />
        <button className="w-full py-3 px-4 bg-primary text-white font-bold rounded-2xl shadow-sm hover:bg-primary-dark transition-colors min-h-[52px]">
          Ask Assistant
        </button>
      </div>

      {/* Warming State / Fallback notice */}
      <div className="bg-primary-tint/60 rounded-2xl p-4 border border-primary/20 text-xs text-ink space-y-1">
        <div className="font-semibold text-primary-dark flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Local AI Bridge</span>
        </div>
        <p className="text-ink-soft">
          {t("warming")}
        </p>
      </div>

      {/* Hard Guardrail Disclaimer */}
      <div className="bg-warn-bg rounded-2xl p-4 border border-warn/30 space-y-2">
        <div className="flex items-center gap-2 text-warn font-bold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Safety Guardrails</span>
        </div>
        <p className="text-xs text-warn font-medium leading-relaxed">
          {t("disclaimer")}
        </p>
        <p className="text-[11px] text-ink-soft border-t border-warn/20 pt-1.5">
          {t("noDiagnosisWarning")}
        </p>
      </div>
    </div>
  );
}
