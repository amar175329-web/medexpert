import { getTranslations } from "next-intl/server";
import { ShieldCheck, AlertCircle, Check, X, Clock, Layers } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";

export default async function AdminVerificationPage() {
  const common = await getTranslations("common");

  // Mock admin queue items for operations review
  const queueItems = [
    {
      id: "vjob-101",
      userMedicine: "Crocin 650",
      userForm: "Tablet",
      candidateBrand: "Crocin 650 Fast Release",
      candidateManufacturer: "GlaxoSmithKline Pharmaceuticals Ltd",
      evidenceSignals: ["Brand matched", "Manufacturer matched"],
      confidence: "95%",
      status: "needs_review",
      createdAt: "2026-11-19 14:10",
    },
    {
      id: "vjob-102",
      userMedicine: "Gelusil MPS",
      userForm: "Syrup",
      candidateBrand: "Gelusil MPS Antacid Liquid",
      candidateManufacturer: "Pfizer Ltd",
      evidenceSignals: ["Brand matched"],
      confidence: "50%",
      status: "needs_review",
      createdAt: "2026-11-19 14:25",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Verification Queue
          </h1>
          <p className="text-xs text-ink-soft">
            Admin oversight: Autonomous verification exceptions
          </p>
        </div>
        <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">
          Admin Portal
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-2xl p-3 border border-ink/10 text-center">
          <span className="text-[11px] font-semibold text-ink-soft">Waiting</span>
          <p className="text-xl font-bold text-ink mt-0.5">2</p>
        </div>
        <div className="bg-surface rounded-2xl p-3 border border-ink/10 text-center">
          <span className="text-[11px] font-semibold text-ok">Auto-Verified</span>
          <p className="text-xl font-bold text-ok mt-0.5">148</p>
        </div>
        <div className="bg-surface rounded-2xl p-3 border border-ink/10 text-center">
          <span className="text-[11px] font-semibold text-ink-soft">Rollback Rate</span>
          <p className="text-xl font-bold text-ink mt-0.5">0.0%</p>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-ink">
          Pending Exceptions ({queueItems.length})
        </h2>

        {queueItems.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-2xl p-5 border border-ink/10 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ink-soft">
                Job #{item.id} · {item.createdAt}
              </span>
              <StatusChip type="unverified" />
            </div>

            {/* Side-by-side Evidence */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-bg p-3 rounded-xl border border-ink/10">
              <div>
                <span className="font-bold text-ink-soft uppercase tracking-wider block mb-1">
                  User Entered
                </span>
                <p className="font-bold text-ink text-sm">{item.userMedicine}</p>
                <p className="text-ink-soft">{item.userForm}</p>
              </div>

              <div>
                <span className="font-bold text-primary-dark uppercase tracking-wider block mb-1">
                  Catalog Match ({item.confidence})
                </span>
                <p className="font-bold text-primary text-sm">{item.candidateBrand}</p>
                <p className="text-ink-soft">{item.candidateManufacturer}</p>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button className="py-2.5 px-3 border border-danger/30 text-danger hover:bg-danger-bg/30 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                <X className="w-4 h-4" />
                <span>Reject Match</span>
              </button>
              <button className="py-2.5 px-3 bg-primary text-white hover:bg-primary-dark font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors">
                <Check className="w-4 h-4" />
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
