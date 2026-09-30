"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface AstronomicalImageViewerProps {
  imageUrl: string | null;
  imageName: string | null;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function AstronomicalImageViewer({
  imageUrl,
  imageName,
  onFileSelect,
  isLoading,
}: AstronomicalImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRuler, setShowRuler] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCursorCoords(null);
  }, [imageUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
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

      if (containerRef.current && naturalDimensions) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const normX = Math.max(0, Math.min(naturalDimensions.width, Math.round((clientX / rect.width) * naturalDimensions.width)));
        const normY = Math.max(0, Math.min(naturalDimensions.height, Math.round((clientY / rect.height) * naturalDimensions.height)));
        setCursorCoords({ x: normX, y: normY });
      }
    },
    [isPanning, startPan, naturalDimensions]
  );

  const handleMouseUp = () => setIsPanning(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col h-[520px] sm:h-[620px] w-full bg-[#020306] border transition-colors select-none ${
        isDragOver
          ? "border-cyan-400 bg-[#040914]"
          : "border-zinc-800/80 hover:border-zinc-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top Instrument Bar: Title, Zoom, Coordinates, Ruler Toggle */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-[#04060c] text-[11px] font-mono text-zinc-400 z-20">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">OPTICAL WELL</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
            {imageName || "NO SPECIMEN LOADED"}
          </span>
          {naturalDimensions && (
            <span className="text-zinc-500 hidden sm:inline">
              [{naturalDimensions.width} × {naturalDimensions.height} px]
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowRuler(!showRuler)}
            title="Toggle measurement grid"
            className={`px-2 py-0.5 border text-[10px] transition ${
              showRuler
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            GRID
          </button>
          <div className="h-3 w-[1px] bg-zinc-800 mx-1" />
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!imageUrl}
            title="Zoom Out"
            className="w-6 h-6 flex items-center justify-center border border-zinc-800 hover:border-zinc-600 disabled:opacity-30 disabled:pointer-events-none text-zinc-300"
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-[10px] text-zinc-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!imageUrl}
            title="Zoom In"
            className="w-6 h-6 flex items-center justify-center border border-zinc-800 hover:border-zinc-600 disabled:opacity-30 disabled:pointer-events-none text-zinc-300"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleFit}
            disabled={!imageUrl}
            title="Reset Fit"
            className="px-2 py-0.5 border border-zinc-800 hover:border-zinc-600 disabled:opacity-30 text-[10px] text-zinc-300 ml-1"
          >
            FIT
          </button>
          <div className="h-3 w-[1px] bg-zinc-800 mx-1" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-2.5 py-0.5 border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-[10px] uppercase font-semibold transition"
          >
            Load File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/tiff,image/bmp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 overflow-hidden flex items-center justify-center ${
          imageUrl ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!imageUrl) fileInputRef.current?.click();
        }}
      >
        {/* Subtle grid pattern inside viewport */}
        {showRuler && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}

        {/* Central Focus Crosshair in image well */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-16 h-16 border border-zinc-700/60 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400/80 rounded-full" />
          </div>
          <div className="absolute top-0 bottom-0 w-[1px] bg-zinc-800/60" />
          <div className="absolute left-0 right-0 h-[1px] bg-zinc-800/60" />
        </div>

        {/* Image Display */}
        {imageUrl ? (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isPanning ? "none" : "transform 0.15s ease-out",
            }}
            className="relative flex items-center justify-center max-w-full max-h-full"
          >
            {/* Photographic Plate Border */}
            <div className="relative p-1 bg-[#010204] border border-zinc-800 shadow-2xl">
              <img
                src={imageUrl}
                alt={imageName || "Astronomical Observation"}
                onLoad={handleImageLoad}
                draggable={false}
                className="max-h-[440px] sm:max-h-[520px] w-auto object-contain block"
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-6 max-w-sm pointer-events-none z-10">
            <div className="w-12 h-12 mx-auto mb-3 border border-zinc-700 bg-zinc-900/60 flex items-center justify-center text-zinc-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <p className="text-sm font-mono text-zinc-300 font-semibold uppercase tracking-wider">
              No Observation Staged
            </p>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Drop an astronomical photograph here, click to browse, or select a plate from the Observation Archive.
            </p>
            <span className="inline-block mt-3 px-2 py-0.5 text-[10px] font-mono border border-zinc-800 text-zinc-400 bg-zinc-950">
              PNG • JPEG • WEBP • TIFF • BMP
            </span>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-zinc-800 bg-[#04060c] text-[10px] font-mono text-zinc-500 z-20">
        <div className="flex items-center gap-4">
          <span>APERTURE: 1.0× FIELD</span>
          <span>
            SENSOR PIXEL: {cursorCoords ? `X:${cursorCoords.x} Y:${cursorCoords.y}` : "X:— Y:—"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600">DRAG TO PAN • SCROLL / BUTTONS TO ZOOM</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
        </div>
      </div>
    </div>
  );
}
