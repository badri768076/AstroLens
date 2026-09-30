"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";

interface CelestialSkyChartProps {
  objectName?: string | null;
  catalogId?: string | null;
  objectType?: string | null;
  ra?: number | null;
  dec?: number | null;
}

// Deterministic pseudo-random stars for visual depth only
const VISUAL_BACKGROUND_STARS = Array.from({ length: 180 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const x = (seed / 233280) * 800;
  const seed2 = (seed * 9301 + 49297) % 233280;
  const y = (seed2 / 233280) * 440;
  const seed3 = (seed2 * 9301 + 49297) % 233280;
  const r = (seed3 / 233280) * 1.4 + 0.3;
  const opacity = (seed3 / 233280) * 0.6 + 0.2;
  return { x, y, r, opacity };
});

export default function CelestialSkyChart({
  objectName,
  catalogId,
  objectType,
  ra,
  dec,
}: CelestialSkyChartProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isHoveringTarget, setIsHoveringTarget] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const hasCoordinates = typeof ra === "number" && !isNaN(ra) && typeof dec === "number" && !isNaN(dec);

  // Map RA [0, 360] degrees and DEC [-90, +90] into SVG viewBox (800 x 440)
  // Center is (400, 220). Celestial equator is at y = 220.
  // North pole is at y = 40 (DEC = +90). South pole is at y = 400 (DEC = -90).
  const targetPos = useMemo(() => {
    if (!hasCoordinates || ra === null || dec === null) return null;
    const clampedDec = Math.max(-90, Math.min(90, dec));
    const normalizedRa = ((ra % 360) + 360) % 360;

    // RA: 0° to 360° mapped across 700 width, centered at 400
    // West to East: 360° (left) to 0° (right) in standard celestial projection
    const x = 750 - (normalizedRa / 360) * 700;
    // DEC: -90° to +90° mapped across 360 height (+90 at top y=40, -90 at bottom y=400)
    const y = 400 - ((clampedDec + 90) / 180) * 360;

    // Convert RA to Hours, Minutes, Seconds
    const hours = Math.floor(normalizedRa / 15);
    const minutes = Math.floor(((normalizedRa / 15) - hours) * 60);
    const seconds = ((((normalizedRa / 15) - hours) * 60) - minutes) * 60;
    const hms = `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;

    const sign = dec >= 0 ? "+" : "";
    const dms = `${sign}${dec.toFixed(4)}°`;

    return { x, y, hms, dms };
  }, [ra, dec, hasCoordinates]);

  // Curved RA Meridians (lines of constant Right Ascension converging toward the poles)
  // We draw lines for every 30 degrees (2 hours of RA): 0h, 2h, 4h, 6h, 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 24h
  const raMeridians = useMemo(() => {
    const lines = [];
    for (let h = 0; h <= 24; h += 2) {
      const raDeg = h * 15;
      const xMid = 750 - (raDeg / 360) * 700;
      // Slight curve curving gently toward center as it nears poles
      const curveOffset = (xMid - 400) * 0.15;
      const d = `M ${xMid - curveOffset} 40 Q ${xMid} 220 ${xMid - curveOffset} 400`;
      lines.push({ hour: h, d, xMid });
    }
    return lines;
  }, []);

  // Curved DEC Parallels (lines of constant Declination): -60°, -30°, 0° (Equator), +30°, +60°
  const decParallels = useMemo(() => {
    const parallels = [];
    const decValues = [-60, -30, 0, 30, 60];
    for (const d of decValues) {
      const y = 400 - ((d + 90) / 180) * 360;
      const arcHeight = d !== 0 ? (d > 0 ? -12 : 12) : 0;
      const path = `M 50 ${y} Q 400 ${y + arcHeight} 750 ${y}`;
      parallels.push({ dec: d, y, path, isEquator: d === 0 });
    }
    return parallels;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
      }
    },
    [isDragging, startPos]
  );

  const handleMouseUp = () => setIsDragging(false);

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col w-full bg-[#020306] border border-zinc-800/80 select-none">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-zinc-800 bg-[#04060c] text-[11px] font-mono text-zinc-400 z-10">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">CELESTIAL ATLAS</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">
            {objectName || catalogId || "ASTROMETRIC CHART"}
          </span>
          <span className="text-zinc-500 hidden sm:inline">
            [EQUATORIAL J2000.0]
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-0.5 border text-[10px] transition ${
              showGrid
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            GRID
          </button>
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-0.5 border text-[10px] transition ${
              showLabels
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            LABELS
          </button>
          <div className="h-3 w-[1px] bg-zinc-800" />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
            className="w-5 h-5 flex items-center justify-center border border-zinc-800 hover:border-zinc-600 text-zinc-300"
          >
            −
          </button>
          <span className="text-[10px] w-8 text-center text-zinc-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="w-5 h-5 flex items-center justify-center border border-zinc-800 hover:border-zinc-600 text-zinc-300"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-0.5 border border-zinc-800 hover:border-zinc-600 text-[10px] text-zinc-400"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative h-[380px] sm:h-[460px] w-full overflow-hidden bg-[#010204] cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <defs>
            {/* Dark celestial dome gradient */}
            <radialGradient id="skyAtlasBackdrop" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#081022" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#03060d" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#010205" stopOpacity="1" />
            </radialGradient>

            {/* Target reticle glow */}
            <filter id="reticleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky background */}
          <rect width="800" height="440" fill="url(#skyAtlasBackdrop)" />

          {/* Procedural Visual Starfield (Explicitly annotated as visual texture) */}
          <g opacity="0.75">
            {VISUAL_BACKGROUND_STARS.map((star, idx) => (
              <circle
                key={idx}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#e2e8f0"
                opacity={star.opacity}
              />
            ))}
          </g>

          {/* Coordinate Atlas Grid */}
          {showGrid && (
            <g className="transition-opacity duration-200">
              {/* North & South Celestial Poles markings */}
              <line x1="50" y1="40" x2="750" y2="40" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 4" />
              <line x1="50" y1="400" x2="750" y2="400" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 4" />

              {/* RA Meridians */}
              {raMeridians.map((m) => (
                <path
                  key={`ra-${m.hour}`}
                  d={m.d}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
              ))}

              {/* DEC Parallels */}
              {decParallels.map((p) => (
                <path
                  key={`dec-${p.dec}`}
                  d={p.path}
                  fill="none"
                  stroke={p.isEquator ? "#0284c7" : "#1e293b"}
                  strokeWidth={p.isEquator ? "1.25" : "0.75"}
                  strokeDasharray={p.isEquator ? "none" : "3 3"}
                  opacity={p.isEquator ? 0.7 : 0.6}
                />
              ))}

              {/* Ecliptic Guide (approximate solar path) */}
              <path
                d="M 50 220 Q 225 150, 400 220 T 750 220"
                fill="none"
                stroke="#d97706"
                strokeWidth="0.75"
                strokeDasharray="4 6"
                opacity="0.4"
              />
            </g>
          )}

          {/* Coordinate Axis Labels */}
          {showLabels && (
            <g className="font-mono text-[9px] select-none fill-zinc-500">
              {/* Pole markers */}
              <text x="60" y="34" fill="#38bdf8">+90° NORTH CELESTIAL POLE</text>
              <text x="60" y="415" fill="#38bdf8">-90° SOUTH CELESTIAL POLE</text>

              {/* Celestial Equator Label */}
              <text x="60" y="214" fill="#0284c7" fontWeight="bold">
                0° CELESTIAL EQUATOR (δ = 0°)
              </text>
              <text x="660" y="208" fill="#d97706">
                ECLIPTIC GUIDE
              </text>

              {/* DEC parallel labels */}
              <text x="754" y="103" fill="#64748b">+60°</text>
              <text x="754" y="163" fill="#64748b">+30°</text>
              <text x="754" y="283" fill="#64748b">-30°</text>
              <text x="754" y="343" fill="#64748b">-60°</text>

              {/* RA hours markings along the bottom */}
              {raMeridians.map((m) => (
                <text
                  key={`label-${m.hour}`}
                  x={m.xMid - 6}
                  y="430"
                  fill="#64748b"
                >
                  {m.hour}h
                </text>
              ))}
            </g>
          )}

          {/* Dynamic Target Marker */}
          {targetPos ? (
            <g
              transform={`translate(${targetPos.x}, ${targetPos.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setIsHoveringTarget(true)}
              onMouseLeave={() => setIsHoveringTarget(false)}
            >
              {/* Outer Pulsing Crosshairs */}
              <circle r="14" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
              <circle r="6" fill="#06b6d4" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="1.5" filter="url(#reticleGlow)" />
              <circle r="1.5" fill="#ffffff" />

              {/* Crosshair ticks */}
              <line x1="-18" y1="0" x2="-8" y2="0" stroke="#22d3ee" strokeWidth="1.2" />
              <line x1="8" y1="0" x2="18" y2="0" stroke="#22d3ee" strokeWidth="1.2" />
              <line x1="0" y1="-18" x2="0" y2="-8" stroke="#22d3ee" strokeWidth="1.2" />
              <line x1="0" y1="8" x2="0" y2="18" stroke="#22d3ee" strokeWidth="1.2" />

              {/* Leader Line & Target Box */}
              <g transform="translate(18, -26)">
                <line x1="-6" y1="20" x2="6" y2="6" stroke="#22d3ee" strokeWidth="1" />
                <rect
                  x="6"
                  y="-10"
                  width="130"
                  height="34"
                  fill="#03060c"
                  fillOpacity="0.92"
                  stroke="#0891b2"
                  strokeWidth="1"
                />
                <text x="12" y="3" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {catalogId || objectName || "TARGET"}
                </text>
                <text x="12" y="16" fill="#22d3ee" fontSize="8" fontFamily="monospace">
                  α:{targetPos.hms} • δ:{targetPos.dms}
                </text>
              </g>
            </g>
          ) : (
            /* Graceful State when RA/DEC is unavailable */
            <g transform="translate(400, 220)">
              <rect x="-140" y="-20" width="280" height="40" fill="#03060c" fillOpacity="0.9" stroke="#334155" strokeWidth="1" />
              <text x="0" y="-3" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ASTROMETRIC COORDINATES UNAVAILABLE
              </text>
              <text x="0" y="12" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Catalog astrometry pending or planetary target without fixed J2000 ephemeris
              </text>
            </g>
          )}
        </svg>

        {/* Hover Coordinate Floating Tooltip */}
        {isHoveringTarget && targetPos && (
          <div className="absolute top-4 left-4 bg-[#03060c]/95 border border-cyan-500/50 p-2.5 text-xs font-mono shadow-2xl pointer-events-none z-30">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              {objectName || catalogId || "RESOLVED TARGET"}
            </div>
            <div className="text-zinc-300 text-[10px] mt-1 space-y-0.5">
              <div>RIGHT ASCENSION: <span className="text-white">{targetPos.hms} ({ra?.toFixed(5)}°)</span></div>
              <div>DECLINATION: <span className="text-white">{targetPos.dms}</span></div>
              {objectType && <div>OBJECT TYPE: <span className="text-cyan-400">{objectType}</span></div>}
              <div>EPOCH: <span className="text-zinc-400">J2000.0 (EQUATORIAL)</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chart Footer with Real Science Disclaimer */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 border-t border-zinc-800 bg-[#04060c] text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-4">
          <span>PROJECTION: EQUATORIAL ATLAS</span>
          <span>
            TARGET: {hasCoordinates ? `RA ${ra?.toFixed(4)}° / DEC ${dec && dec >= 0 ? "+" : ""}${dec?.toFixed(4)}°` : "NOT RESOLVED"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          <span>*BACKGROUND STARS ARE PROCEDURAL VISUALIZATION ONLY</span>
        </div>
      </div>
    </div>
  );
}
