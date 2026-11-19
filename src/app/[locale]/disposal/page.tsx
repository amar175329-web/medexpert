import { getTranslations } from "next-intl/server";
import { ArrowLeft, Trash2, ShieldAlert, CheckCircle2, AlertOctagon, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function DisposalGuidancePage() {
  const common = await getTranslations("common");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/shelf"
          className="p-2 -ml-2 text-ink-soft hover:text-ink rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={common("back")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-ink">
          Safe Medicine Disposal Guide
        </h1>
      </div>

      {/* Critical Don'ts */}
      <div className="bg-danger-bg border border-danger/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-danger font-bold text-sm">
          <AlertOctagon className="w-5 h-5 flex-shrink-0" />
          <span>Do NOT Flush or Drain</span>
        </div>
        <p className="text-xs text-danger font-medium leading-relaxed">
          Never pour syrups or flush expired pills down the toilet or kitchen sink. Residues enter local water bodies and harm public sanitation.
        </p>
      </div>

      {/* Recommended Steps */}
      <div className="bg-surface rounded-2xl p-5 border border-ink/10 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-ink">
          Home Disposal Protocol (Solid Dosage)
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-semibold text-ink">Remove from original packaging</p>
              <p className="text-xs text-ink-soft">
                Take tablets/capsules out of their blister strips or plastic bottles.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <p className="font-semibold text-ink">Mix with unpalatable waste</p>
              <p className="text-xs text-ink-soft">
                Mix medicines with used tea leaves, coffee grounds, or soil so children and stray animals cannot ingest them.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="font-semibold text-ink">Seal in a secure pouch</p>
              <p className="text-xs text-ink-soft">
                Place the mixture inside a sealed plastic or biodegradable bag to prevent any spillage.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </span>
            <div>
              <p className="font-semibold text-ink">Scratch patient labels</p>
              <p className="text-xs text-ink-soft">
                Scratch out personal names and prescription numbers on empty packaging before recycling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Citation */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 text-xs text-ink-soft space-y-2">
        <span className="font-bold text-ink">Authoritative Source Citation</span>
        <p className="leading-relaxed">
          Guidance formulated in accordance with the <em>Bio-Medical Waste Management Rules (Ministry of Environment, Forest and Climate Change, Govt. of India)</em> and Central Pollution Control Board (CPCB) guidelines on hazardous domestic pharmaceutical waste.
        </p>
        <a
          href="https://cpcb.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          <span>Central Pollution Control Board (CPCB)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
