"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { getObjectAstrophysics, SectorDefinition } from "./astronomyData";

interface SkyExplorerProps {
  objectName?: string | null;
  catalogId?: string | null;
  objectType?: string | null;
  ra?: number | null;
  dec?: number | null;
}

// Fixed pseudo-random deterministic stars with realistic astronomical magnitude distribution
const BACKGROUND_FIELD_STARS = Array.from({ length: 340 }, (_, i) => {
  const seed1 = (i * 12345 + 54321) % 1000000;
  const x = (seed1 / 1000000) * 880;

  const seed2 = (seed1 * 98765 + 13579) % 1000000;
  const y = 30 + (seed2 / 1000000) * 440;

  const seed3 = (seed2 * 24680 + 97531) % 1000000;
  const magnitudeTier = seed3 / 1000000;

  let r = 0.6;
  let color = "#ffffff";
  let opacity = 0.45;

  if (magnitudeTier > 0.96) {
    r = 2.4;
    color = "#93c5fd"; // Blue giant / hot OB
    opacity = 0.95;
  } else if (magnitudeTier > 0.88) {
    r = 1.8;
    color = "#fef08a"; // Warm yellow-white
    opacity = 0.85;
  } else if (magnitudeTier > 0.70) {
    r = 1.2;
    color = "#ffffff";
    opacity = 0.65;
  } else if (magnitudeTier > 0.45) {
    r = 0.9;
    color = "#e2e8f0";
    opacity = 0.5;
  }

  return { id: i, x, y, r, color, opacity };
});

export default function SkyExplorer({
  objectName,
  catalogId,
  objectType,
  ra,
  dec,
}: SkyExplorerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showStarLabels, setShowStarLabels] = useState(true);
  const [showNeighbors, setShowNeighbors] = useState(true);
  const [showReferenceDetails, setShowReferenceDetails] = useState(true);
  const [viewMode, setViewMode] = useState<"sector" | "allsky">("sector");

  const containerRef = useRef<HTMLDivElement>(null);

  const hasCoordinates =
    typeof ra === "number" && !isNaN(ra) && typeof dec === "number" && !isNaN(dec);

  // Retrieve comprehensive astrophysical and sector details
  const targetInfo = useMemo(() => {
    return getObjectAstrophysics(catalogId || objectName, objectType);
  }, [catalogId, objectName, objectType]);

  const activeSector: SectorDefinition = targetInfo.sector;
  const isPlanetary = Boolean(activeSector.isPlanetary);

  // Auto-center or reset when object changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [catalogId, objectName]);

  // Coordinates of Galactic Center (Sagittarius A*): RA 17h 45.7m (266.42°), DEC -29.01°
  const galacticCenterPos = useMemo(() => {
    const raDeg = 266.417;
    const decDeg = -29.008;
    const x = 840 - (raDeg / 360) * 800;
    const y = 450 - ((decDeg + 90) / 180) * 400;
    return { x, y, raDeg, decDeg };
  }, []);

  // Map RA [0, 360] and DEC [-90, +90] to SVG canvas coordinates (880 x 500)
  const targetAstrometry = useMemo(() => {
    if (!hasCoordinates || ra === null || dec === null) return null;
    const clampedDec = Math.max(-90, Math.min(90, dec));
    const normalizedRa = ((ra % 360) + 360) % 360;

    let x = 840 - (normalizedRa / 360) * 800;
    let y = 450 - ((clampedDec + 90) / 180) * 400;

    // In sector focus mode, target is centered at (440, 250)
    if (viewMode === "sector" && !isPlanetary) {
      x = 440;
      y = 250;
    }

    const h = Math.floor(normalizedRa / 15);
    const m = Math.floor(((normalizedRa / 15) - h) * 60);
    const s = ((((normalizedRa / 15) - h) * 60) - m) * 60;
    const hms = `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toFixed(1)}s`;

    const sign = dec >= 0 ? "+" : "−";
    const absD = Math.abs(dec);
    const dDeg = Math.floor(absD);
    const dMin = Math.floor((absD - dDeg) * 60);
    const dSec = ((absD - dDeg) * 60 - dMin) * 60;
    const dms = `${sign}${dDeg.toString().padStart(2, "0")}° ${dMin.toString().padStart(2, "0")}′ ${dSec.toFixed(0)}″`;

    return { x, y, hms, dms, raDeg: ra, decDeg: dec };
  }, [ra, dec, hasCoordinates, viewMode, isPlanetary]);

  // Curved RA Meridians (every 2 hours / 30 degrees)
  const meridians = useMemo(() => {
    const lines = [];
    for (let h = 0; h <= 24; h += 2) {
      const raDeg = h * 15;
      const xMid = 840 - (raDeg / 360) * 800;
      const curve = (xMid - 440) * 0.12;
      const d = `M ${xMid - curve} 50 Q ${xMid} 250 ${xMid - curve} 450`;
      lines.push({ hour: h, raDeg, d, xMid });
    }
    return lines;
  }, []);

  // DEC Parallels
  const parallels = useMemo(() => {
    const list = [];
    const decValues = [-60, -30, 0, 30, 60];
    for (const d of decValues) {
      const y = 450 - ((d + 90) / 180) * 400;
      const arc = d !== 0 ? (d > 0 ? -10 : 10) : 0;
      const path = `M 40 ${y} Q 440 ${y + arc} 840 ${y}`;
      list.push({ dec: d, y, path, isEquator: d === 0 });
    }
    return list;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => setIsDragging(false);

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col w-full bg-[#010204] border border-white/[0.08] select-none">
      {/* Astrometric Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#03050a] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Celestial Visualization</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">
            {targetAstrometry
              ? `${catalogId || objectName || "Resolved Target"} [J2000.0]`
              : isPlanetary
              ? `${catalogId || objectName || "Jovian System"} [Heliocentric]`
              : "Astrometric Exploration Field"}
          </span>
          <span className="hidden md:inline text-[10px] text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5">
            {isPlanetary ? "HELIOCENTRIC ORBIT TRACKER" : "OBSERVER REF: EARTH (SOLAR SYSTEM)"}
          </span>
        </div>

        {/* View Options & Dynamic Sector Switcher */}
        <div className="flex items-center gap-2 text-[10px]">
          {/* Dynamic View Mode Toggle: Sector Focus vs All-Sky */}
          {!isPlanetary && (
            <div className="flex border border-white/10 p-0.5 bg-black/60 mr-1">
              <button
                type="button"
                onClick={() => setViewMode("sector")}
                className={`px-2.5 py-0.5 uppercase transition ${
                  viewMode === "sector" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Target Sector
              </button>
              <button
                type="button"
                onClick={() => setViewMode("allsky")}
                className={`px-2.5 py-0.5 uppercase transition ${
                  viewMode === "allsky" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                All-Sky Map
              </button>
            </div>
          )}

          {isPlanetary && (
            <div className="flex border border-white/10 p-0.5 bg-black/60 mr-1">
              <button
                type="button"
                onClick={() => setViewMode("sector")}
                className={`px-2.5 py-0.5 uppercase transition ${
                  viewMode === "sector" ? "bg-amber-400 text-black font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Heliocentric Orbit
              </button>
              <button
                type="button"
                onClick={() => setViewMode("allsky")}
                className={`px-2.5 py-0.5 uppercase transition ${
                  viewMode === "allsky" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Ecliptic Zodiac
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowNeighbors(!showNeighbors)}
            className={`px-2 py-1 border transition-colors ${
              showNeighbors ? "border-cyan-400/50 text-cyan-200 bg-cyan-950/30" : "border-white/10 text-zinc-500"
            }`}
          >
            Neighbors
          </button>
          <button
            type="button"
            onClick={() => setShowConstellations(!showConstellations)}
            className={`px-2 py-1 border transition-colors ${
              showConstellations ? "border-white/30 text-white bg-white/10" : "border-white/10 text-zinc-500"
            }`}
          >
            Constellations
          </button>
          <button
            type="button"
            onClick={() => setShowReferenceDetails(!showReferenceDetails)}
            className={`px-2 py-1 border transition-colors ${
              showReferenceDetails ? "border-amber-400/50 text-amber-200 bg-amber-950/30" : "border-white/10 text-zinc-500"
            }`}
          >
            Object Info
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 border border-white/10 text-zinc-400 hover:text-white uppercase transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Interactive Celestial Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative h-[540px] sm:h-[620px] w-full bg-[#000002] overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 880 500"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <defs>
            {/* Dynamic Sector Gaseous / Dust Haze */}
            <radialGradient id="dynamicSectorHaze" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeSector.hazeColor} stopOpacity={activeSector.hazeOpacity} />
              <stop offset="60%" stopColor={activeSector.hazeColor} stopOpacity={activeSector.hazeOpacity * 0.3} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Target reticle glow */}
            <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Solar Core Radiance (for planetary view) */}
            <radialGradient id="solarRadiance" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Galactic center glow */}
            <radialGradient id="galacticCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#b45309" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ========================================================================= */}
          {/* BRANCH A: DYNAMIC SOLAR SYSTEM HELIOCENTRIC PLANE (FOR PLANETS / JUPITER)  */}
          {/* ========================================================================= */}
          {isPlanetary && viewMode === "sector" ? (
            <g className="transition-opacity duration-300">
              {/* Outer Deep Space Starfield */}
              <g>
                {BACKGROUND_FIELD_STARS.slice(0, 180).map((star) => (
                  <circle
                    key={`pstar-${star.id}`}
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 0.8}
                    fill={star.color}
                    opacity={star.opacity * 0.6}
                  />
                ))}
              </g>

              {/* Sun (Primary Star) */}
              <circle cx="440" cy="250" r="50" fill="url(#solarRadiance)" />
              <circle cx="440" cy="250" r="14" fill="#fef08a" />
              <text x="440" y="278" fill="#fef08a" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                SUN (SOL)
              </text>
              <text x="440" y="289" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Heliocentric Origin • 1.0 M☉
              </text>

              {/* Mercury Orbit (0.39 AU) */}
              <ellipse cx="440" cy="250" rx="35" ry="32" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 3" />
              <circle cx="475" cy="250" r="2.2" fill="#9ca3af" />

              {/* Venus Orbit (0.72 AU) */}
              <ellipse cx="440" cy="250" rx="65" ry="60" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 3" />
              <circle cx="410" cy="195" r="3.5" fill="#fde047" />

              {/* Earth Orbit (1.00 AU - Observer Reference) */}
              <ellipse cx="440" cy="250" rx="105" ry="96" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.2" />
              {/* Earth Position Beacon */}
              <g transform="translate(335, 250)">
                <circle cx="0" cy="0" r="12" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" className="animate-pulse" />
                <circle cx="0" cy="0" r="5" fill="#0284c7" />
                <circle cx="0" cy="0" r="2" fill="#ffffff" />
                <text x="0" y="-16" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  EARTH (OBSERVER)
                </text>
                <text x="0" y="-7" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  1.00 AU • Vantage Origin
                </text>
              </g>

              {/* Mars Orbit (1.52 AU) */}
              <ellipse cx="440" cy="250" rx="155" ry="142" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 3" />
              <circle cx="590" cy="210" r="3" fill="#ef4444" />
              <text x="590" y="222" fill="#ef4444" fontSize="7.5" fontFamily="monospace">
                Mars
              </text>

              {/* Main Asteroid Belt particle distribution (2.7 AU) */}
              <ellipse cx="440" cy="250" rx="200" ry="180" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="8" strokeDasharray="1 8" />
              <text x="440" y="60" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="monospace" textAnchor="middle">
                MAIN ASTEROID BELT (2.2 – 3.2 AU)
              </text>

              {/* Jupiter Orbit (5.20 AU) */}
              <ellipse cx="440" cy="250" rx="310" ry="220" fill="none" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.2" />

              {/* Jupiter Target Node */}
              <g transform="translate(710, 200)">
                {/* Planetary Target Reticle */}
                <circle cx="0" cy="0" r="28" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="14" fill="#d97706" />
                <circle cx="0" cy="0" r="12" fill="#f59e0b" />
                {/* Atmospheric bands */}
                <line x1="-10" y1="-3" x2="10" y2="-3" stroke="#b45309" strokeWidth="1.5" />
                <line x1="-12" y1="2" x2="12" y2="2" stroke="#78350f" strokeWidth="1.5" />
                {/* Great Red Spot */}
                <ellipse cx="3" cy="5" rx="3" ry="2" fill="#ef4444" />

                {/* 4 Galilean Moons */}
                <circle cx="-22" cy="0" r="1.5" fill="#ffffff">
                  <title>Io (Galilean Moon)</title>
                </circle>
                <circle cx="-16" cy="4" r="1.2" fill="#93c5fd">
                  <title>Europa (Galilean Moon)</title>
                </circle>
                <circle cx="18" cy="-3" r="2" fill="#cbd5e1">
                  <title>Ganymede (Galilean Moon)</title>
                </circle>
                <circle cx="25" cy="5" r="1.7" fill="#64748b">
                  <title>Callisto (Galilean Moon)</title>
                </circle>

                {/* Label Group */}
                <g transform="translate(35, -20)">
                  <rect x="0" y="0" width="130" height="42" fill="rgba(3,5,10,0.92)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
                  <text x="8" y="14" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    JUPITER
                  </text>
                  <text x="8" y="25" fill="#f59e0b" fontSize="8.5" fontFamily="monospace">
                    Distance: 4.2 AU
                  </text>
                  <text x="8" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    Transit: 43.2 Light-Min
                  </text>
                </g>
              </g>

              {/* Real-time Line-of-Sight Photon Transit Vector (Earth -> Jupiter) */}
              <line
                x1="335"
                y1="250"
                x2="710"
                y2="200"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              {/* Photon Vector Label */}
              <g transform="translate(510, 215)">
                <rect x="-80" y="-10" width="160" height="20" fill="rgba(0,0,0,0.85)" stroke="rgba(56,189,248,0.3)" strokeWidth="0.8" />
                <text x="0" y="3" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  LINE-OF-SIGHT VECTOR: 4.2 AU (628M km)
                </text>
              </g>
            </g>
          ) : (
            /* ========================================================================= */
            /* BRANCH B: DYNAMIC CELESTIAL DEEP-SKY SECTOR OR ALL-SKY PROJECTION         */
            /* ========================================================================= */
            <g className="transition-opacity duration-300">
              {/* Dynamic Gaseous Sector Haze (Specific to object morphology) */}
              <ellipse
                cx={viewMode === "sector" ? 440 : 440}
                cy={250}
                rx={viewMode === "sector" ? 340 : 420}
                ry={viewMode === "sector" ? 220 : 130}
                fill="url(#dynamicSectorHaze)"
                transform={viewMode === "sector" ? "rotate(10 440 250)" : "rotate(-15 440 250)"}
              />

              {/* Coordinate Grid (Equatorial or Sector) */}
              {showGrid && (
                <g className="transition-opacity duration-300">
                  {meridians.map((m) => (
                    <path
                      key={m.hour}
                      d={m.d}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  ))}

                  {parallels.map((p) => (
                    <path
                      key={p.dec}
                      d={p.path}
                      fill="none"
                      stroke={p.isEquator ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.05)"}
                      strokeWidth={p.isEquator ? "1.2" : "1"}
                      strokeDasharray={p.isEquator ? undefined : "2 3"}
                    />
                  ))}

                  {showStarLabels && (
                    <>
                      {meridians
                        .filter((_, i) => i % 2 === 0)
                        .map((m) => (
                          <text
                            key={`h-${m.hour}`}
                            x={m.xMid}
                            y="262"
                            fill="rgba(148, 163, 184, 0.4)"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {m.hour}h
                          </text>
                        ))}

                      {parallels.map((p) => (
                        <text
                          key={`d-${p.dec}`}
                          x="48"
                          y={p.y - 4}
                          fill="rgba(148, 163, 184, 0.4)"
                          fontSize="8"
                          fontFamily="monospace"
                        >
                          {p.dec >= 0 ? `+${p.dec}°` : `${p.dec}°`}
                        </text>
                      ))}
                      <text x="48" y="246" fill="rgba(56, 189, 248, 0.6)" fontSize="8" fontFamily="monospace">
                        CELESTIAL EQUATOR (0°)
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Dynamic Local Constellation Outlines (Changes based on target sector!) */}
              {showConstellations && (
                <g className="transition-opacity duration-300 pointer-events-none">
                  {(viewMode === "sector" ? activeSector.constellations : activeSector.constellations).map((c) => (
                    <g key={c.name}>
                      <path
                        d={c.path}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.3)"
                        strokeWidth="0.9"
                        strokeDasharray="3 3"
                      />
                      {showStarLabels && (
                        <text
                          x={c.labelX}
                          y={c.labelY}
                          fill="rgba(148, 163, 184, 0.65)"
                          fontSize="9.5"
                          fontFamily="monospace"
                          textAnchor="middle"
                          letterSpacing="0.1em"
                          fontWeight="bold"
                        >
                          {c.name.toUpperCase()}
                        </text>
                      )}
                    </g>
                  ))}
                </g>
              )}

              {/* Neighboring Deep-Sky Objects in this Sector */}
              {showNeighbors && (
                <g className="transition-opacity duration-300 pointer-events-none">
                  {activeSector.neighbors.map((nb) => (
                    <g key={nb.name} transform={`translate(${nb.x}, ${nb.y})`}>
                      <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(56,189,248,0.6)" strokeDasharray="1 1" />
                      <circle cx="0" cy="0" r="1" fill="#38bdf8" />
                      {showStarLabels && (
                        <g transform="translate(6, 3)">
                          <text fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">
                            {nb.name}
                          </text>
                          <text y="8" fill="rgba(56,189,248,0.7)" fontSize="7" fontFamily="monospace">
                            {nb.catalog} ({nb.type})
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </g>
              )}

              {/* Background Astronomical Star Field (Dense, multi-magnitude) */}
              <g>
                {BACKGROUND_FIELD_STARS.map((star) => (
                  <circle
                    key={star.id}
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    fill={star.color}
                    opacity={star.opacity}
                  />
                ))}
              </g>

              {/* PRIMARY ASTRONOMICAL REFERENCE: MILKY WAY GALACTIC CENTER (Sagittarius A*) */}
              <g className="pointer-events-none">
                <circle
                  cx={galacticCenterPos.x}
                  cy={galacticCenterPos.y}
                  r="22"
                  fill="url(#galacticCenterGlow)"
                />
                <polygon
                  points={`${galacticCenterPos.x},${galacticCenterPos.y - 7} ${galacticCenterPos.x + 7},${galacticCenterPos.y} ${galacticCenterPos.x},${galacticCenterPos.y + 7} ${galacticCenterPos.x - 7},${galacticCenterPos.y}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.9"
                />
                <circle cx={galacticCenterPos.x} cy={galacticCenterPos.y} r="1.5" fill="#f59e0b" />
                {showStarLabels && (
                  <g transform={`translate(${galacticCenterPos.x + 10}, ${galacticCenterPos.y + 3})`}>
                    <text fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      GALACTIC CENTER (Sgr A*)
                    </text>
                    <text y="9" fill="#d97706" fontSize="7" fontFamily="monospace">
                      26,000 ly from Earth
                    </text>
                  </g>
                )}
              </g>

              {/* Observer Line-of-Sight Vector: Connects Galactic Reference to Target */}
              {targetAstrometry && (
                <line
                  x1={galacticCenterPos.x}
                  y1={galacticCenterPos.y}
                  x2={targetAstrometry.x}
                  y2={targetAstrometry.y}
                  stroke="rgba(245, 158, 11, 0.25)"
                  strokeWidth="0.8"
                  strokeDasharray="3 4"
                />
              )}

              {/* Selected Astronomical Target Reticle & Dynamic Leader */}
              {targetAstrometry && (
                <g className="cursor-pointer">
                  <circle
                    cx={targetAstrometry.x}
                    cy={targetAstrometry.y}
                    r="44"
                    fill="url(#targetGlow)"
                  />
                  <circle
                    cx={targetAstrometry.x}
                    cy={targetAstrometry.y}
                    r="26"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                  <circle
                    cx={targetAstrometry.x}
                    cy={targetAstrometry.y}
                    r="6"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={targetAstrometry.x}
                    cy={targetAstrometry.y}
                    r="2.5"
                    fill="#ffffff"
                  />

                  {/* Crosshair Spikes */}
                  <line x1={targetAstrometry.x - 34} y1={targetAstrometry.y} x2={targetAstrometry.x - 8} y2={targetAstrometry.y} stroke="#38bdf8" strokeWidth="1" />
                  <line x1={targetAstrometry.x + 8} y1={targetAstrometry.y} x2={targetAstrometry.x + 34} y2={targetAstrometry.y} stroke="#38bdf8" strokeWidth="1" />
                  <line x1={targetAstrometry.x} y1={targetAstrometry.y - 34} x2={targetAstrometry.x} y2={targetAstrometry.y - 8} stroke="#38bdf8" strokeWidth="1" />
                  <line x1={targetAstrometry.x} y1={targetAstrometry.y + 8} x2={targetAstrometry.x} y2={targetAstrometry.y + 34} stroke="#38bdf8" strokeWidth="1" />

                  {/* Attached Scientific Annotation Leader */}
                  <path
                    d={`M ${targetAstrometry.x + 20} ${targetAstrometry.y - 20} L ${targetAstrometry.x + 50} ${targetAstrometry.y - 45} L ${targetAstrometry.x + 190} ${targetAstrometry.y - 45}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeOpacity="0.75"
                  />

                  {/* Label Group */}
                  <g transform={`translate(${targetAstrometry.x + 55}, ${targetAstrometry.y - 50})`}>
                    <rect
                      x="0"
                      y="-14"
                      width="155"
                      height="46"
                      fill="rgba(3, 5, 10, 0.94)"
                      stroke="rgba(56, 189, 248, 0.45)"
                      strokeWidth="1"
                    />
                    <text x="8" y="2" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      {catalogId || objectName || "TARGET RESOLVED"}
                    </text>
                    <text x="8" y="14" fill="#38bdf8" fontSize="8.5" fontFamily="monospace">
                      RA {targetAstrometry.hms}
                    </text>
                    <text x="8" y="24" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace">
                      DEC {targetAstrometry.dms}
                    </text>
                  </g>
                </g>
              )}
            </g>
          )}
        </svg>

        {/* BOTTOM-RIGHT: DYNAMIC ASTROPHYSICAL INFO & DISTANCE PANEL */}
        {showReferenceDetails && (
          <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full sm:w-84 bg-black/92 border border-white/20 p-4 font-mono shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[9px] text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Object Astrophysics & Distance
              </span>
              <span className="text-zinc-500 font-mono">{activeSector.name}</span>
            </div>

            <div className="space-y-2.5 pt-2.5 text-xs">
              {/* Distance in Light-Years & Parsecs */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Distance From Earth
                </span>
                <span className="text-white font-medium text-sm">
                  {targetInfo.distanceLightYears}
                </span>
                {targetInfo.distanceParsecs && (
                  <span className="text-[10px] text-zinc-400 ml-1.5 font-sans">
                    ({targetInfo.distanceParsecs})
                  </span>
                )}
              </div>

              {/* Lookback Time / Photon Transit */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Lookback Time (Photon Travel)
                </span>
                <span className="text-cyan-300 text-xs">
                  {targetInfo.lookbackTime}
                </span>
              </div>

              {/* Physical Scale / Extent */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Physical Scale / Extent
                </span>
                <span className="text-zinc-300 text-xs">
                  {targetInfo.scalePhysical}
                </span>
              </div>

              {/* Observer Reference Frame Vector */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Observer Reference Frame
                </span>
                <span className="text-amber-400/90 text-[11px]">
                  {targetInfo.referenceFrame}
                </span>
              </div>

              {/* Constellation / Domain */}
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  Celestial Constellation
                </span>
                <span className="text-zinc-200 text-xs">
                  {targetInfo.constellation}
                </span>
              </div>

              {/* Basic Astronomical Overview */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {targetInfo.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM-LEFT: DYNAMIC SECTOR & ICRS EQUATORIAL COORDINATES */}
        <div className="absolute bottom-4 left-4 z-20 max-w-md pointer-events-none font-mono text-[10px] text-zinc-400 bg-black/85 border border-white/10 p-3 space-y-1 backdrop-blur-sm">
          <div className="text-zinc-500 uppercase tracking-widest text-[9px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active Sector: <span className="text-white font-medium">{activeSector.name}</span></span>
          </div>

          {targetAstrometry ? (
            <div>
              ICRS EQUATORIAL COORDINATES:{" "}
              <span className="text-white font-semibold">RA {targetAstrometry.hms}</span> •{" "}
              <span className="text-white font-semibold">DEC {targetAstrometry.dms}</span>
            </div>
          ) : isPlanetary ? (
            <div className="text-amber-400">
              ORBITAL EPHEMERIS: Heliocentric Semimajor Axis ~5.20 AU (Jovian System)
            </div>
          ) : (
            <div className="text-zinc-500">*Awaiting target astrometry resolution*</div>
          )}

          <div className="text-[9px] text-zinc-500 pt-0.5">
            Reference Beacon: Galactic Center (Sagittarius A* • 26,000 ly) • Earth Observer
          </div>
        </div>
      </div>
    </div>
  );
}
