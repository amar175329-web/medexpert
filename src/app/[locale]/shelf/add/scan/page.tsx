"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Camera, Barcode, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BarcodeScanPage() {
  const t = useTranslations("shelf");
  const common = useTranslations("common");
  const router = useRouter();

  const [hasCamera, setHasCamera] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedItem, setMatchedItem] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let currentVideo = videoRef.current;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            currentVideo = videoRef.current;
            setHasCamera(true);
          }
        }
      } catch {
        setHasCamera(false);
      }
    }
    initCamera();

    return () => {
      if (currentVideo && currentVideo.srcObject) {
        const stream = currentVideo.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleLookup = async (code: string) => {
    if (!code) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/medicines/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code }),
      });
      const data = await res.json();
      if (data.candidates && data.candidates.length > 0) {
        setMatchedItem(data.candidates[0]);
      } else {
        // Unmatched barcode: guide user to manual entry
        router.push("/shelf/add/manual");
      }
    } catch {
      router.push("/shelf/add/manual");
    } finally {
      setIsSearching(false);
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
          {t("scanBarcode")}
        </h1>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative aspect-square w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden border-2 border-primary/40 shadow-inner flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {/* Viewfinder Target Box */}
        <div className="absolute inset-8 border-2 border-primary rounded-2xl pointer-events-none flex flex-col items-center justify-between p-4 bg-primary/5">
          <span className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full">
            Align barcode inside frame
          </span>
          <div className="w-full h-0.5 bg-accent animate-pulse" />
          <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
            GS1 / EAN-13 / QR
          </span>
        </div>
      </div>

      {/* Manual Barcode Input Fallback */}
      <div className="bg-surface rounded-2xl p-4 border border-ink/10 space-y-3">
        <label className="block text-xs font-bold text-ink">
          Or type the number below the barcode:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. 8901234567890"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-ink/20 text-ink text-sm focus:border-primary outline-none"
          />
          <button
            onClick={() => handleLookup(manualCode)}
            disabled={isSearching || !manualCode}
            className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-sm disabled:opacity-50"
          >
            {isSearching ? common("loading") : "Lookup"}
          </button>
        </div>
      </div>
    </div>
  );
}
