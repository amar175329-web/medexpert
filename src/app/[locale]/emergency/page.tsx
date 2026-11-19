import { getTranslations } from "next-intl/server";
import { EMERGENCY_CONTACTS } from "@/config/emergency";
import { PhoneCall, AlertTriangle, ShieldCheck } from "lucide-react";

export default async function EmergencyPage() {
  const t = await getTranslations("emergency");

  return (
    <div className="space-y-6">
      <div className="bg-danger-bg border border-danger/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-danger font-bold text-base">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{t("callFirstNote")}</span>
        </div>
      </div>

      <div className="space-y-3">
        {EMERGENCY_CONTACTS.map((contact) => (
          <a
            key={contact.id}
            href={`tel:${contact.number}`}
            className="flex items-center justify-between p-4 bg-surface rounded-2xl border-2 border-danger/20 hover:border-danger hover:bg-danger-bg/40 transition-all shadow-sm group min-h-[72px]"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-danger tracking-wide uppercase">
                {contact.available}
              </span>
              <h2 className="text-base font-bold text-ink">
                {t(contact.nameKey as any)}
              </h2>
              <p className="text-xs text-ink-soft">
                {contact.description}
              </p>
              <p className="text-[10px] text-ink-soft/80 italic pt-0.5">
                Source: {contact.officialSource}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-danger text-white px-4 py-2.5 rounded-full font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 ml-2">
              <PhoneCall className="w-4 h-4" />
              <span>{contact.displayNumber}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-4 border border-ink/10 text-xs text-ink-soft space-y-1.5">
        <div className="flex items-center gap-1.5 text-primary-dark font-semibold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Offline Ready</span>
        </div>
        <p>
          These emergency contacts are stored locally and accessible even when offline without internet connectivity.
        </p>
      </div>
    </div>
  );
}
