"use client";

import { useTranslations } from "next-intl";
import { Check, AlertCircle, Clock, X, ArrowDown } from "lucide-react";
import clsx from "clsx";

export type StatusChipType =
  | "verified"
  | "unverified"
  | "expiring"
  | "expired"
  | "low-stock";

interface StatusChipProps {
  type: StatusChipType;
  className?: string;
}

export function StatusChip({ type, className }: StatusChipProps) {
  const t = useTranslations("common");

  switch (type) {
    case "verified":
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-tint text-primary-dark border border-primary/20",
            className
          )}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{t("verified")}</span>
        </span>
      );

    case "unverified":
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-warn-bg text-warn border border-warn/30",
            className
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{t("unverified")}</span>
        </span>
      );

    case "expiring":
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-warn-bg text-warn border border-warn/30",
            className
          )}
        >
          <Clock className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{t("expiringSoon")}</span>
        </span>
      );

    case "expired":
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-danger-bg text-danger border border-danger/30",
            className
          )}
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{t("expired")}</span>
        </span>
      );

    case "low-stock":
      return (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-warn-bg text-warn border border-warn/30",
            className
          )}
        >
          <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>{t("lowStock")}</span>
        </span>
      );
  }
}
