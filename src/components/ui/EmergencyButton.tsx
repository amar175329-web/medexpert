"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PhoneCall } from "lucide-react";

export function EmergencyButton() {
  const t = useTranslations("common");

  return (
    <Link
      href="/emergency"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white bg-danger rounded-full hover:opacity-90 transition-opacity min-h-[44px] shadow-sm"
      aria-label={t("emergency")}
    >
      <PhoneCall className="w-4 h-4" aria-hidden="true" />
      <span>{t("emergency")}</span>
    </Link>
  );
}
