"use client";

import React, { useMemo } from "react";
import { AnalysisResult } from "./ObservationReadout";
import { getObjectAstrophysics } from "./astronomyData";

interface ScientificProfileProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  activeStage: number;
  onExecute: () => void;
  canExecute: boolean;
  errorMsg?: string | null;
}

// Convert decimal RA to HMS format
function formatRA(raVal: number | null | undefined): string {
  if (raVal === null || raVal === undefined || isNaN(raVal)) return "NOT AVAILABLE";
  const norm = ((raVal % 360) + 360) % 360;
  const h = Math.floor(norm / 15);
  const m = Math.floor(((norm / 15) - h) * 60);
  const s = ((((norm / 15) - h) * 60) - m) * 60;
  return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toFixed(1)}s (${raVal.toFixed(4)}°)`;
}

// Convert decimal DEC to DMS format
function formatDEC(decVal: number | null | undefined): string {
  if (decVal === null || decVal === undefined || isNaN(decVal)) return "NOT AVAILABLE";
  const sign = decVal >= 0 ? "+" : "−";
  const abs = Math.abs(decVal);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = ((abs - d) * 60 - m) * 60;
  return `${sign}${d.toString().padStart(2, "0")}° ${m.toString().padStart(2, "0")}′ ${s.toFixed(0)}″ (${decVal >= 0 ? "+" : ""}${decVal.toFixed(4)}°)`;
}

function formatClassTitle(raw: string): string {
  if (!raw) return "Unclassified";
  return raw
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ScientificProfile({
  analysis,
  isLoading,
  activeStage,
  onExecute,
  canExecute,
  errorMsg,
}: ScientificProfileProps) {
  const objectName = analysis?.identification.object || analysis?.scientific_information?.name;
  const catalogId = analysis?.scientific_information?.catalog_id;
  const classification = analysis ? formatClassTitle(analysis.classification.class) : null;
  const confidence = analysis ? (analysis.classification.confidence * 100).toFixed(1) : null;
  const similarity =
    analysis?.identification.similarity !== null && analysis?.identification.similarity !== undefined
      ? (analysis.identification.similarity * 100).toFixed(1)
      : null;

  const raDisplay = formatRA(analysis?.scientific_information?.ra ?? analysis?.visualization?.ra);
  const decDisplay = formatDEC(analysis?.scientific_information?.dec ?? analysis?.visualization?.dec);

  const targetInfo = useMemo(() => {
    return getObjectAstrophysics(catalogId || objectName, analysis?.scientific_information?.type || classification);
  }, [catalogId, objectName, analysis?.scientific_information?.type, classification]);

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#030408] border border-white/[0.08] p-6 lg:p-7 select-none">
      {/* Editorial Header / Section Label */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
          <span>Scientific Profile</span>
          <span className="text-zinc-600">CDS SIMBAD • FASTAI • VIT</span>
        </div>

        {/* State 1: Loading Progress */}
        {isLoading && (
          <div className="py-6 space-y-4 font-mono">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="uppercase tracking-wider">Inference in Progress</span>
            </div>

            <div className="space-y-3 pt-2 text-[11px] text-zinc-500">
              <div className={`flex items-center justify-between ${activeStage >= 1 ? "text-zinc-200" : ""}`}>
                <span>01. Morphology Classification</span>
                <span className="font-mono">{activeStage >= 1 ? "DONE" : "..."}</span>
              </div>
              <div className={`flex items-center justify-between ${activeStage >= 2 ? "text-zinc-200" : ""}`}>
                <span>02. ViT Metric Embedding</span>
                <span className="font-mono">{activeStage >= 2 ? "MATCHING" : "..."}</span>
              </div>
              <div className={`flex items-center justify-between ${activeStage >= 3 ? "text-zinc-200" : ""}`}>
                <span>03. CDS SIMBAD Query</span>
                <span className="font-mono">{activeStage >= 3 ? "RESOLVING" : "..."}</span>
              </div>
              <div className={`flex items-center justify-between ${activeStage >= 4 ? "text-zinc-200" : ""}`}>
                <span>04. Astrometric Projection</span>
                <span className="font-mono">{activeStage >= 4 ? "PROJECTING" : "..."}</span>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Error Notification */}
        {errorMsg && !isLoading && (
          <div className="border border-red-500/30 bg-red-950/10 p-4 text-xs font-mono text-red-300">
            <div className="font-semibold uppercase tracking-wider mb-1 text-red-400">Analysis Halted</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* State 3: Successfully Resolved Object Profile */}
        {analysis && !isLoading && (
          <div className="space-y-5">
            {/* Primary Object Headline */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-medium mb-1">
                Identified Object
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                {catalogId || objectName || "Resolved Target"}
              </h2>
              {objectName && catalogId && objectName !== catalogId && (
                <div className="text-sm text-zinc-400 font-sans mt-0.5">{objectName}</div>
              )}

              {/* Taxonomic Classification & Confidence */}
              <div className="mt-3 flex flex-wrap items-baseline gap-3 text-xs font-mono">
                <span className="text-zinc-200 uppercase tracking-wider font-medium">
                  {classification}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">
                  Confidence <span className="text-white font-medium">{confidence}%</span>
                </span>
                {similarity && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">
                      Match <span className="text-emerald-400 font-medium">{similarity}%</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Astrophysical Summary Note */}
            <div className="bg-black/60 border border-white/[0.06] p-3 text-[11px] text-zinc-400 font-sans leading-relaxed">
              {targetInfo.summary}
            </div>

            {/* Scientific Astrometric & Distance Ledger */}
            <div className="pt-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
                Astrometric & Distance Ledger
              </div>

              <div className="space-y-2.5 font-mono text-xs border-t border-white/[0.08] pt-2.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Distance From Earth</span>
                  <span className="text-cyan-300 font-medium">{targetInfo.distanceLightYears}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Physical Scale</span>
                  <span className="text-zinc-300">{targetInfo.scalePhysical}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Reference Vector</span>
                  <span className="text-amber-400/90 text-[10px]">{targetInfo.referenceFrame}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Catalog Identifier</span>
                  <span className="text-white font-medium">{catalogId || "NOT AVAILABLE"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">SIMBAD Morphology</span>
                  <span className="text-zinc-300">{analysis.scientific_information?.type || "NOT AVAILABLE"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Right Ascension (α)</span>
                  <span className="text-zinc-200">{raDisplay}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 border-b border-white/[0.04] gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Declination (δ)</span>
                  <span className="text-zinc-200">{decDisplay}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-0.5 gap-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Coordinate Epoch</span>
                  <span className="text-zinc-400">ICRS Equatorial J2000.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Awaiting Stage */}
        {!analysis && !isLoading && !errorMsg && (
          <div className="py-8 space-y-3 font-mono text-xs">
            <div className="text-zinc-400 uppercase tracking-widest text-[11px]">
              Observation Idle
            </div>
            <p className="text-zinc-500 font-sans leading-relaxed text-xs">
              Load an astronomical image into the optical aperture or select a reference plate from the
              archival contact strip below, then execute inference to resolve morphology, catalog identity,
              astrometric coordinates, and distance vectors.
            </p>
          </div>
        )}
      </div>

      {/* Execution Trigger Action */}
      <div className="pt-6 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={onExecute}
          disabled={!canExecute || isLoading}
          className={`w-full py-3 px-4 font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all ${
            !canExecute || isLoading
              ? "bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed"
              : "bg-white hover:bg-zinc-200 text-black border border-white cursor-pointer shadow-lg active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <span>Analyzing Observation...</span>
          ) : analysis ? (
            <span>Re-Analyze Plate ↺</span>
          ) : (
            <span>Analyze Observation →</span>
          )}
        </button>
      </div>
    </aside>
  );
}
