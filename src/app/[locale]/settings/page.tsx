import { getTranslations } from "next-intl/server";
import { TextSizeSelector } from "@/components/settings/TextSizeSelector";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Database, ShieldCheck, Languages, LogOut } from "lucide-react";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {t("title")}
      </h1>

      {/* Language Section */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-ink">
            <Languages className="w-5 h-5 text-primary" />
            <span>{t("language")}</span>
          </div>
          <LanguageToggle />
        </div>
      </div>

      {/* Text Size / Accessibility */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-ink">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>{t("textSize")}</span>
        </div>
        <TextSizeSelector />
      </div>

      {/* Offline Storage Info */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 shadow-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-ink">
          <Database className="w-5 h-5 text-primary" />
          <span>{t("offlineNoticeTitle")}</span>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          {t("offlineNoticeDesc")}
        </p>
      </div>

      {/* Account / Sign out */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 shadow-sm space-y-3">
        <h2 className="font-bold text-ink text-sm">
          {t("account")}
        </h2>
        <p className="text-[11px] text-ink-soft leading-relaxed">
          User privacy note: Consent, export and deletion features included; legal review pending.
        </p>
        <button className="w-full py-3 px-4 rounded-xl border border-danger/30 text-danger font-semibold hover:bg-danger-bg/30 transition-colors flex items-center justify-center gap-2 min-h-[48px]">
          <LogOut className="w-4 h-4" />
          <span>{t("signOut")}</span>
        </button>
      </div>
    </div>
  );
}
