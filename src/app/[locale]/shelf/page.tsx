import { getTranslations } from "next-intl/server";
import { Search, Plus, Archive, Barcode, Camera, Edit3 } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";

export default async function ShelfPage() {
  const t = await getTranslations("shelf");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("title")}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-ink/15 rounded-2xl text-ink placeholder:text-ink-soft text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
        <button className="px-3.5 py-1.5 rounded-full bg-primary text-white font-semibold shadow-sm">
          {t("filterAll")}
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-surface border border-ink/15 text-ink-soft font-medium hover:border-ink/30">
          {t("filterVerified")}
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-surface border border-ink/15 text-ink-soft font-medium hover:border-ink/30">
          {t("filterExpiring")}
        </button>
      </div>

      {/* Status Chips Showcase */}
      <div className="flex flex-wrap gap-2 pt-1 pb-1">
        <StatusChip type="verified" />
        <StatusChip type="unverified" />
        <StatusChip type="expiring" />
        <StatusChip type="expired" />
        <StatusChip type="low-stock" />
      </div>

      {/* Empty State */}
      <div className="bg-surface rounded-2xl p-6 border border-ink/10 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary-tint text-primary flex items-center justify-center">
          <Archive className="w-8 h-8" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">
            {t("emptyShelf")}
          </h2>
          <p className="text-xs text-ink-soft mt-1">
            Track batches, locations, and courses securely.
          </p>
        </div>

        {/* 3 Doors for Adding */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-ink/10 bg-bg hover:bg-primary-tint hover:border-primary/30 transition-all">
            <Barcode className="w-5 h-5 text-primary mb-1" />
            <span className="text-[11px] font-semibold text-ink">{t("scanBarcode")}</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-ink/10 bg-bg hover:bg-primary-tint hover:border-primary/30 transition-all">
            <Camera className="w-5 h-5 text-primary mb-1" />
            <span className="text-[11px] font-semibold text-ink">{t("photographPack")}</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-ink/10 bg-bg hover:bg-primary-tint hover:border-primary/30 transition-all">
            <Edit3 className="w-5 h-5 text-primary mb-1" />
            <span className="text-[11px] font-semibold text-ink">{t("manualEntry")}</span>
          </button>
        </div>
      </div>

      {/* Primary Floating Action */}
      <button className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 min-h-[56px]">
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>{t("addMedicine")}</span>
      </button>
    </div>
  );
}
