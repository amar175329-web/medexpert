import { getTranslations } from "next-intl/server";
import { Users, UserPlus, HeartHandshake, ShieldCheck } from "lucide-react";

export default async function FamilyPage() {
  const t = await getTranslations("family");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("title")}
        </h1>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-ink/10 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary-tint text-primary flex items-center justify-center">
          <Users className="w-8 h-8" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">
            Household Care
          </h2>
          <p className="text-sm text-ink-soft mt-1 leading-relaxed">
            {t("emptyFamily")}
          </p>
        </div>

        <div className="bg-bg rounded-xl p-3 border border-ink/10 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Allergy & Duplicate Warnings</span>
          </div>
          <p className="text-ink-soft">
            Profiles flag matching allergies and duplicate active ingredients across courses automatically.
          </p>
        </div>
      </div>

      <button className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 min-h-[56px]">
        <UserPlus className="w-5 h-5 stroke-[2.5]" />
        <span>{t("addMember")}</span>
      </button>
    </div>
  );
}
