"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

export type TextSize = "S" | "M" | "L" | "XL";

export function TextSizeSelector() {
  const t = useTranslations("settings");
  const [currentSize, setCurrentSize] = useState<TextSize>("M");

  useEffect(() => {
    const saved = (localStorage.getItem("medexpert_text_size") as TextSize) || "M";
    setCurrentSize(saved);
    document.documentElement.dataset.textSize = saved;
  }, []);

  const selectSize = (size: TextSize) => {
    setCurrentSize(size);
    localStorage.setItem("medexpert_text_size", size);
    document.documentElement.dataset.textSize = size;
  };

  const sizes: Array<{ id: TextSize; label: string }> = [
    { id: "S", label: t("textSizeS") },
    { id: "M", label: t("textSizeM") },
    { id: "L", label: t("textSizeL") },
    { id: "XL", label: t("textSizeXL") },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {sizes.map(({ id, label }) => {
          const isSelected = currentSize === id;
          return (
            <button
              key={id}
              onClick={() => selectSize(id)}
              className={clsx(
                "p-3 rounded-2xl border text-sm font-semibold text-center transition-all min-h-[56px] flex items-center justify-center",
                isSelected
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface border-ink/15 text-ink hover:border-primary/40"
              )}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-soft pt-1">
        Adjusts text across Hindi and English for comfortable reading.
      </p>
    </div>
  );
}
