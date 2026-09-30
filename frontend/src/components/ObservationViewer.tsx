"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface ObservationViewerProps {
  imageUrl: string | null;
  objectName?: string | null;
  catalogId?: string | null;
  classification?: string | null;
  ra?: number | null;
  dec?: number | null;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function ObservationViewer({
  imageUrl,
  objectName,
  catalogId,
  classification,
  ra,
  dec,
  onFileSelect,
  isLoading,
}: ObservationViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [imageUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setDimensions({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageUrl || e.button !== 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      }
      if (containerRef.current && dimensions) {
        const rect = containerRef.current.getBoundingClientRect();
        const px = Math.round(((e.clientX - rect.left) / rect.width) * dimensions.width);
        const py = Math.round(((e.clientY - rect.top) / rect.height) * dimensions.height);
        setCursorPos({
          x: Math.max(0, Math.min(dimensions.width, px)),
          y: Math.max(0, Math.min(dimensions.height, py)),
        });
      }
    },
    [isPanning, startPan, dimensions]
  );

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!imageUrl) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((z) => Math.max(0.4, Math.min(4, z + delta)));
  };

  // Convert decimal RA to HMS string
  const formatHMS = (raVal: number | null | undefined) => {
    if (raVal === null || raVal === undefined || isNaN(raVal)) return null;
    const norm = ((raVal % 360) + 360) % 360;
    const h = Math.floor(norm / 15);
    const m = Math.floor(((norm / 15) - h) * 60);
    const s = ((((norm / 15) - h) * 60) - m) * 60;
    return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toFixed(1)}s`;
  };

  // Convert decimal DEC to DMS string
  const formatDMS = (decVal: number | null | undefined) => {
    if (decVal === null || decVal === undefined || isNaN(decVal)) return null;
    const sign = decVal >= 0 ? "+" : "−";
    const abs = Math.abs(decVal);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d) * 60 - m) * 60;
    return `${sign}${d.toString().padStart(2, "0")}° ${m.toString().padStart(2, "0")}′ ${s.toFixed(0)}″`;
  };

  const formattedRa = formatHMS(ra);
  const formattedDec = formatDMS(dec);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onFileSelect(e.dataTransfer.files[0]);
        }
      }}
      className={`relative h-[560px] sm:h-[660px] w-full bg-[#000000] border select-none overflow-hidden transition-colors ${
        isDragOver ? "border-cyan-400/80 bg-[#02050e]" : "border-white/[0.08]"
      }`}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/tiff,image/bmp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) onFileSelect(e.target.files[0]);
        }}
        className="hidden"
      />

      {/* Top Left: Astronomical Plate ID & Orientation */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-start gap-4 font-mono text-[10px]">
        {/* Astronomical Compass (North / East) */}
        <div className="relative w-9 h-9 border border-white/10 bg-black/60 p-1">
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-cyan-400 font-bold">N</div>
          <div className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400">E</div>
          <svg className="w-full h-full" viewBox="0 0 32 32">
            <line x1="16" y1="16" x2="16" y2="7" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="16" y1="16" x2="7" y2="16" stroke="#9ca3af" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="space-y-0.5 bg-black/70 px-2.5 py-1 border border-white/10">
          <div className="text-zinc-400 uppercase tracking-widest text-[9px]">Optical Aperture</div>
          <div className="text-white font-medium text-[11px]">
            {objectName || catalogId || "Survey Cutout Frame"}
          </div>
        </div>
      </div>

      {/* Top Right: Calibration, Zoom & Intake Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 font-mono text-[10px]">
        {dimensions && (
          <span className="text-zinc-400 hidden sm:inline px-2 py-1 bg-black/80 border border-white/10">
            {dimensions.width} × {dimensions.height} px
          </span>
        )}

        {/* Minimal Zoom Controls */}
        <div className="flex items-center bg-black/80 border border-white/10 divide-x divide-white/10">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.25))}
            disabled={!imageUrl}
            title="Zoom Out"
            className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 disabled:opacity-30"
          >
            −
          </button>
          <span className="px-2 text-zinc-300 min-w-[44px] text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
            disabled={!imageUrl}
            title="Zoom In"
            className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 disabled:opacity-30"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            disabled={!imageUrl}
            title="Fit to Screen"
            className="px-2.5 h-7 text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 uppercase tracking-wider text-[9px]"
          >
            Fit
          </button>
        </div>

        {/* Intake Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="px-3 h-7 bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white uppercase tracking-wider text-[10px] font-semibold transition"
        >
          Upload Image
        </button>
      </div>

      {/* Main Photographic Stage */}
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
        {imageUrl ? (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isPanning ? "none" : "transform 0.15s ease-out",
            }}
            className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* Photographic Image Frame */}
            <div className="relative shadow-[0_0_120px_rgba(0,0,0,1)]">
              <img
                src={imageUrl}
                alt={objectName || "Astronomical Object"}
                onLoad={handleImageLoad}
                draggable={false}
                className="max-h-[480px] sm:max-h-[580px] w-auto max-w-full object-contain block opacity-95"
              />

              {/* Central Target Reticle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-10 h-10 border border-white/25 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                </div>
                <div className="absolute top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
              </div>

              {/* Scientific Leader Annotation (Floating editorial caption on the object) */}
              {(objectName || catalogId) && (
                <div className="absolute -top-3 -right-3 sm:top-4 sm:right-4 pointer-events-none z-10">
                  <div className="relative bg-black/85 border border-white/20 px-3 py-2 text-left font-mono shadow-2xl backdrop-blur-sm min-w-[160px]">
                    <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 uppercase tracking-widest font-semibold mb-0.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      Target Resolved
                    </div>
                    <div className="text-white font-bold text-sm tracking-tight">
                      {objectName || catalogId}
                    </div>
                    {classification && (
                      <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                        {classification}
                      </div>
                    )}
                    {(formattedRa || formattedDec) && (
                      <div className="mt-1.5 pt-1.5 border-t border-white/10 text-[9px] text-zinc-400 space-y-0.5">
                        {formattedRa && <div>RA {formattedRa}</div>}
                        {formattedDec && <div>DEC {formattedDec}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty Intake State */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer text-center p-10 max-w-lg border border-dashed border-white/15 hover:border-white/40 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-4 border border-white/20 rounded-full flex items-center justify-center text-zinc-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white font-medium">
              Load Astronomical Observation
            </p>
            <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
              Drop any celestial photograph, deep-space survey cutout, or telescope CCD exposure here.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3 text-[10px] font-mono text-zinc-500">
              <span>PNG / JPEG / WebP / TIFF</span>
              <span>•</span>
              <span className="text-cyan-400">or pick a sample plate below</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Coordinate Measurement Ticks along borders */}
      <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none flex justify-between px-12 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-[1px] h-1.5 bg-white" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none flex justify-between px-12 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-[1px] h-1.5 bg-white" />
        ))}
      </div>

      {/* Bottom Photographic Status Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between pointer-events-none font-mono text-[9px] text-zinc-500">
        <div>
          {cursorPos ? (
            <span>
              SENSOR PIXEL: <span className="text-zinc-300">X {cursorPos.x}</span> • <span className="text-zinc-300">Y {cursorPos.y}</span>
            </span>
          ) : (
            <span>OPTICAL SENSOR READY</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <span>DRAG TO PAN • SCROLL TO ZOOM</span>
          <span className="hidden sm:inline">SCALE: 1.0 (NATIVE)</span>
        </div>
      </div>
    </div>
  );
}
