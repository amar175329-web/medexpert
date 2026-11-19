"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "hi" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-full border border-primary/30 text-primary-dark hover:bg-primary-tint min-h-[44px] min-w-[44px] transition-colors"
      aria-label={locale === "en" ? "हिंदी में बदलें" : "Switch to English"}
    >
      {locale === "en" ? "हिं" : "EN"}
    </button>
  );
}
