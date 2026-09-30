"use client";

import React from "react";

export interface AnalysisResult {
  classification: {
    class: string;
    confidence: number;
  };
  identification: {
    object: string | null;
    similarity: number | null;
  };
  scientific_information: {
    name: string | null;
    catalog_id: string | null;
    type: string | null;
    ra: number | null;
    dec: number | null;
  } | null;
  visualization: {
    object_name: string | null;
    ra: number | null;
    dec: number | null;
    catalog_id: string | null;
  } | null;
}

interface ObservationReadoutProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  activeStage: number;
  onExecute: () => void;
  canExecute: boolean;
  errorMsg?: string | null;
}

function formatClassTitle(raw: string): string {
  if (!raw) return "Unclassified";
  return raw
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ObservationReadout({
  analysis,
  isLoading,
  activeStage,
  onExecute,
  canExecute,
  errorMsg,
}: ObservationReadoutProps) {
  return (
    <div className="flex flex-col h-full bg-[#020409] border border-zinc-800/80 text-zinc-100">
      {/* Readout Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-[#04060c] text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-zinc-300 font-bold uppercase tracking-wider">OBSERVATION READOUT</span>
        </div>
        <span className="text-zinc-500">CDS SIMBAD • FASTAI • VIT</span>
      </div>

      {/* Main Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-6 overflow-y-auto">
        {/* State 1: Active Analysis Loading Stages */}
        {isLoading && (
          <div className="py-6 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-bold tracking-wider uppercase">INFERENCE EXECUTING</span>
            </div>

            <div className="space-y-2 border-l border-zinc-800 pl-3">
              <div className={activeStage >= 1 ? "text-cyan-300 font-semibold" : "text-zinc-600"}>
                01 / CLASSIFYING BROAD MORPHOLOGY
              </div>
              <div className={activeStage >= 2 ? "text-cyan-300 font-semibold" : "text-zinc-600"}>
                02 / EMBEDDING & VIT REFERENCE MATCHING
              </div>
              <div className={activeStage >= 3 ? "text-cyan-300 font-semibold" : "text-zinc-600"}>
                03 / QUERYING CDS SIMBAD ASTRONOMICAL DATABASE
              </div>
              <div className={activeStage >= 4 ? "text-cyan-300 font-semibold" : "text-zinc-600"}>
                04 / PROJECTING CELESTIAL EQUATORIAL COORDINATES
              </div>
            </div>
          </div>
        )}

        {/* State 2: Error Notification */}
        {errorMsg && !isLoading && (
          <div className="border border-rose-900/60 bg-rose-950/20 p-3 text-xs font-mono text-rose-300">
            <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-rose-400">
              <span>ANALYSIS INTERRUPTED</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{errorMsg}</p>
          </div>
        )}

        {/* State 3: Successfully Resolved Observation */}
        {analysis && !isLoading && (
          <div className="space-y-5">
            {/* Primary Resolution Banner */}
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                RESOLVED OBSERVATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {analysis.identification.object || analysis.scientific_information?.name || "Catalog Target"}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 font-mono text-xs">
                <span className="text-cyan-300 font-semibold uppercase">
                  {formatClassTitle(analysis.classification.class)}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">
                  Confidence: <span className="text-white font-bold">{(analysis.classification.confidence * 100).toFixed(2)}%</span>
                </span>
              </div>
              {analysis.identification.similarity !== null && (
                <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span>Reference Match:</span>
                  <span className="text-emerald-400 font-bold">
                    {(analysis.identification.similarity * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>

            {/* Scientific Record Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  SCIENTIFIC RECORD
                </span>
                <span className="text-[9px] font-mono text-zinc-600">CDS SIMBAD J2000</span>
              </div>

              <div className="border border-zinc-800/80 bg-[#04060c] text-xs font-mono divide-y divide-zinc-800/80">
                <div className="flex items-center justify-between p-2">
                  <span className="text-zinc-500 text-[11px]">Primary Name</span>
                  <span className="text-white font-semibold">
                    {analysis.scientific_information?.name || analysis.identification.object || "NOT AVAILABLE"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-zinc-500 text-[11px]">Catalog ID</span>
                  <span className="text-cyan-300 font-semibold">
                    {analysis.scientific_information?.catalog_id || "NOT AVAILABLE"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-zinc-500 text-[11px]">Object Type</span>
                  <span className="text-zinc-300">
                    {analysis.scientific_information?.type || "NOT AVAILABLE"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-zinc-500 text-[11px]">Right Ascension (RA)</span>
                  <span className="text-white">
                    {analysis.scientific_information?.ra !== null && analysis.scientific_information?.ra !== undefined
                      ? `${analysis.scientific_information.ra.toFixed(5)}°`
                      : "NOT AVAILABLE"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-zinc-500 text-[11px]">Declination (DEC)</span>
                  <span className="text-white">
                    {analysis.scientific_information?.dec !== null && analysis.scientific_information?.dec !== undefined
                      ? `${analysis.scientific_information.dec >= 0 ? "+" : ""}${analysis.scientific_information.dec.toFixed(5)}°`
                      : "NOT AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Initial Prompt */}
        {!analysis && !isLoading && !errorMsg && (
          <div className="py-6 text-zinc-500 font-mono text-xs text-center space-y-2">
            <p className="text-zinc-400 font-semibold uppercase tracking-wider">
              Awaiting Inference
            </p>
            <p className="text-[11px] text-zinc-600 font-sans">
              Stage an astronomical photograph in the optical well and execute analysis to retrieve classification, catalog identity, and astrometry.
            </p>
          </div>
        )}

        {/* Execute Analysis Action Button */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onExecute}
            disabled={!canExecute || isLoading}
            className={`w-full py-2.5 px-4 font-mono text-xs uppercase font-bold tracking-wider transition flex items-center justify-center gap-2 border ${
              !canExecute || isLoading
                ? "border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed"
                : "border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            }`}
          >
            {isLoading ? (
              <span>Analyzing Observation...</span>
            ) : analysis ? (
              <span>Re-Analyze Observation ↺</span>
            ) : (
              <span>Analyze Observation →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
