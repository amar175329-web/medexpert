"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { CalendarCheck, Archive, HelpCircle, Users } from "lucide-react";
import clsx from "clsx";

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/today",
      label: t("today"),
      icon: CalendarCheck,
    },
    {
      href: "/shelf",
      label: t("shelf"),
      icon: Archive,
    },
    {
      href: "/ask",
      label: t("ask"),
      icon: HelpCircle,
    },
    {
      href: "/family",
      label: t("family"),
      icon: Users,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-ink/10 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center min-h-[56px] py-1.5 px-1 transition-colors text-center select-none",
                isActive
                  ? "text-primary font-bold"
                  : "text-ink-soft hover:text-ink font-medium"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={clsx(
                  "p-1 rounded-xl transition-colors",
                  isActive && "bg-primary-tint"
                )}
              >
                <Icon
                  className={clsx(
                    "w-6 h-6",
                    isActive ? "stroke-[2.5px] text-primary" : "stroke-2"
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs mt-0.5 leading-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
