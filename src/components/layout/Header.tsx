"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { EmergencyButton } from "@/components/ui/EmergencyButton";
import { HeartPulse } from "lucide-react";

export function Header() {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-ink/10 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <Link
          href="/today"
          className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight"
          aria-label={t("appName")}
        >
          <span className="p-1.5 bg-primary-tint rounded-xl text-primary flex items-center justify-center">
            <HeartPulse className="w-6 h-6" aria-hidden="true" />
          </span>
          <span className="text-ink font-extrabold">{t("appName")}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <EmergencyButton />
        </div>
      </div>
    </header>
  );
}
