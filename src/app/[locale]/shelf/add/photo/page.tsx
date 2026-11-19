"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { StatusChip } from "@/components/ui/StatusChip";
import { ArrowLeft, Camera, Upload, Check, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PhotoAddPage() {
  const t = useTranslations("shelf");
  const common = useTranslations("common");
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposedCandidate, setProposedCandidate] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setIsProcessing(true);

      // Simulating OCR parsing
      setTimeout(() => {
        setIsProcessing(false);
        setProposedCandidate({
          brand_name: "Azithral 500",
          form: "Tablet",
          generic_name: "Azithromycin 500mg",
          confidence: "88%",
        });
      }, 1000);
    }
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
          {t("photographPack")}
        </h1>
      </div>

      {/* Image Capture / Upload Area */}
      <div className="bg-surface rounded-2xl p-6 border-2 border-dashed border-ink/20 text-center space-y-3">
        {imagePreview ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Medicine pack preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-tint text-primary flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">
                Take a clear photo of the medicine strip or box
              </p>
              <p className="text-xs text-ink-soft mt-0.5">
                Ensure brand name and expiry date are visible
              </p>
            </div>
          </div>
        )}

        <label className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-dark transition-colors min-h-[48px]">
          <Upload className="w-4 h-4" />
          <span>{imagePreview ? "Retake Photo" : "Upload / Camera"}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* OCR Processing State */}
      {isProcessing && (
        <div className="p-4 bg-primary-tint/60 rounded-2xl border border-primary/20 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary animate-spin" />
          <p className="text-xs font-semibold text-primary-dark">
            Reading packaging text and searching verified catalog...
          </p>
        </div>
      )}

      {/* Confirmation Step */}
      {proposedCandidate && (
        <div className="bg-surface rounded-2xl p-5 border-2 border-primary/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Proposed Match (Confidence: {proposedCandidate.confidence})
            </span>
            <StatusChip type="unverified" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">
              Is this your medicine?
            </h2>
            <p className="text-xl font-extrabold text-primary mt-1">
              {proposedCandidate.brand_name}
            </p>
            <p className="text-xs text-ink-soft">
              {proposedCandidate.form} · {proposedCandidate.generic_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink/10">
            <button
              onClick={() => router.push("/shelf/add/manual")}
              className="py-3 px-4 border border-ink/20 text-ink font-semibold text-sm rounded-xl hover:bg-black/5"
            >
              None of these
            </button>
            <button
              onClick={() => router.push("/shelf/add/manual")}
              className="py-3 px-4 bg-primary text-white font-bold text-sm rounded-xl shadow-sm hover:bg-primary-dark flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Yes, continue</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
