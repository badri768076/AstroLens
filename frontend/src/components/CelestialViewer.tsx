"use client";

import React, { useMemo } from "react";

interface CelestialViewerProps {
  objectName?: string | null;
  catalogId?: string | null;
  ra?: number | null;
  dec?: number | null;
  objectType?: string | null;
}

export default function CelestialViewer({
  objectName,
  catalogId,
  ra,
  dec,
  objectType,
}: CelestialViewerProps) {
  // Convert RA (0-360°) and DEC (-90° to +90°) into normalized 2D projection percentages
  const { posX, posY, hemisphere, formattedRa, formattedDec } = useMemo(() => {
    const hasRa = typeof ra === "number" && !isNaN(ra);
    const hasDec = typeof dec === "number" && !isNaN(dec);

    let x = 50;
    let y = 50;

    if (hasRa) {
      // Map RA [0, 360] to [15%, 85%] inside coordinate box
      const normalizedRa = ((ra % 360) + 360) % 360;
      x = 15 + (normalizedRa / 360) * 70;
    }

    if (hasDec) {
      // Map DEC [-90, +90] to [85%, 15%] (North up, South down)
      const clampedDec = Math.max(-90, Math.min(90, dec));
      y = 85 - ((clampedDec + 90) / 180) * 70;
    }

    const hemi = hasDec ? (dec >= 0 ? "Northern Sky" : "Southern Sky") : "Celestial Equator";

    // Format RA in hours:minutes:seconds or degrees
    let raStr = "—";
    if (hasRa) {
      const hours = Math.floor(ra / 15);
      const minutes = Math.floor(((ra / 15) - hours) * 60);
      const seconds = ((((ra / 15) - hours) * 60) - minutes) * 60;
      raStr = `${ra.toFixed(5)}° (${hours}h ${minutes}m ${seconds.toFixed(1)}s)`;
    }

    let decStr = "—";
    if (hasDec) {
      const sign = dec >= 0 ? "+" : "";
      decStr = `${sign}${dec.toFixed(5)}°`;
    }

    return {
      posX: x,
      posY: y,
      hemisphere: hemi,
      formattedRa: raStr,
      formattedDec: decStr,
    };
  }, [ra, dec]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#060a14] p-6 text-zinc-100 overflow-hidden">
      {/* Background celestial coordinate grid */}
      <div className="absolute inset-0 opacity-25 celestial-grid pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              CELESTIAL COORDINATE PROJECTION
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-white">
            {objectName || catalogId || "Target Observation"}
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            {objectType ? `Type: ${objectType} • ` : ""}{hemisphere} (Epoch J2000.0)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {catalogId && (
            <span className="rounded border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300">
              {catalogId}
            </span>
          )}
          <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
            SIMBAD Astrometry
          </span>
        </div>
      </div>

      {/* Main Coordinate Field & Visual Target */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sky View Graphic Canvas */}
        <div className="lg:col-span-8 relative h-72 w-full rounded-xl border border-white/10 bg-[#03060c] overflow-hidden">
          {/* Subtle star dots */}
          <div className="absolute inset-0 celestial-dots opacity-40" />

          {/* Coordinate Axes & Rings */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="celestialGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#celestialGrad)" />

            {/* Circular celestial projection rings */}
            <circle cx="50%" cy="50%" r="42%" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="14%" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />

            {/* Celestial Equator (DEC = 0) */}
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Vernal Equinox Meridian (RA = 0h / 180h) */}
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Diagonal guide lines */}
            <line x1="15%" y1="15%" x2="85%" y2="85%" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <line x1="85%" y1="15%" x2="15%" y2="85%" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </svg>

          {/* Precision Corner Markings */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
            <span className="text-cyan-400">+90° DEC</span>
            <span>(North Celestial Pole)</span>
          </div>
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
            <span className="text-cyan-400">-90° DEC</span>
            <span>(South Celestial Pole)</span>
          </div>
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-500">
            0h → 24h RA
          </div>
          <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            EQUATORIAL J2000
          </div>

          {/* Dynamic Target Position Reticle */}
          {typeof ra === "number" && typeof dec === "number" ? (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              {/* Outer target ring */}
              <div className="relative flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>
                {/* Crosshairs */}
                <div className="absolute -top-3 h-2 w-[1px] bg-cyan-400/70" />
                <div className="absolute -bottom-3 h-2 w-[1px] bg-cyan-400/70" />
                <div className="absolute -left-3 w-2 h-[1px] bg-cyan-400/70" />
                <div className="absolute -right-3 w-2 h-[1px] bg-cyan-400/70" />
              </div>

              {/* Float label */}
              <div className="absolute left-10 top-0 whitespace-nowrap rounded border border-cyan-500/40 bg-zinc-950/90 px-2 py-1 text-[10px] font-mono text-cyan-300 shadow-md">
                <span className="font-semibold">{objectName || catalogId || "Target"}</span>
                <span className="block text-[9px] text-zinc-400">{dec >= 0 ? "+" : ""}{dec.toFixed(2)}°, {ra.toFixed(2)}°</span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center font-mono text-xs text-zinc-500">
                <p>Coordinates unresolved for visual plotting</p>
                <p className="text-[10px] text-zinc-600 mt-1">Sky grid standing by</p>
              </div>
            </div>
          )}
        </div>

        {/* Readout Side Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
          <div className="rounded-xl border border-white/10 bg-[#080d1a] p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              RIGHT ASCENSION (α)
            </span>
            <div className="text-base sm:text-lg font-mono font-semibold text-white tracking-tight">
              {formattedRa}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Angular distance eastward along celestial equator
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#080d1a] p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              DECLINATION (δ)
            </span>
            <div className="text-base sm:text-lg font-mono font-semibold text-white tracking-tight">
              {formattedDec}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Angular distance north (+) or south (-) of celestial equator
            </p>
          </div>

          {/* Honest Roadmap Notice */}
          <div className="rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-cyan-300">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
              </svg>
              <span>COMING NEXT: INTERACTIVE SKY EXPLORER</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              This celestial coordinate grid visualizes astrometric positioning. Future updates will embed a WebGL Aladin/HiPS interactive planetarium directly into this view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
