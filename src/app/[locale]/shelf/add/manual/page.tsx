"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { StatusChip } from "@/components/ui/StatusChip";
import { ArrowLeft, Save, AlertCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ManualAddPage() {
  const t = useTranslations("shelf");
  const common = useTranslations("common");
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    form: "Tablet",
    locationName: "Medicine Box",
    expiryDate: "",
    quantity: "10",
    lowStockThreshold: "2",
    prescribedFor: "",
    batchNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In Phase 1 client demo / offline mode, navigate back to shelf after saving
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/shelf");
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/shelf"
          className="p-2 -ml-2 text-ink-soft hover:text-ink rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={common("back")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-ink">
          {t("manualEntry")}
        </h1>
      </div>

      {/* Honest Labeling Notice */}
      <div className="bg-warn-bg border border-warn/30 rounded-2xl p-4 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <StatusChip type="unverified" />
        </div>
        <p className="text-xs text-warn font-medium leading-relaxed pt-1">
          Medicines entered manually are marked as <strong>Added by you</strong>. We will never display unverified ingredients or medical uses.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-surface rounded-2xl p-4 border border-ink/10 space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Brand / Medicine Name *
            </label>
            <input
              type="text"
              required
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              placeholder="e.g. Dolo 650, Crocin, Azithral"
              className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Form
              </label>
              <select
                value={form.form}
                onChange={(e) => setForm({ ...form, form: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base bg-surface focus:border-primary outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Ointment">Ointment</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Where is it kept? *
              </label>
              <input
                type="text"
                required
                value={form.locationName}
                onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                placeholder="e.g. Hall Cabinet"
                className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-ink/10 space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              required
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Quantity Remaining
              </label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Low Stock Alert At
              </label>
              <input
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-ink/20 text-ink text-base focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 min-h-[56px]"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          <span>{isSubmitting ? common("loading") : common("save")}</span>
        </button>
      </form>
    </div>
  );
}
