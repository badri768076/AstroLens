"use client";

import React from "react";

export interface ArchivePlate {
  id: string;
  catalogId: string;
  designation: string;
  classification: string;
  imageUrl: string;
  plateNumber: string;
}

export const ARCHIVE_SPECIMENS: ArchivePlate[] = [
  {
    id: "m31_specimen",
    catalogId: "M31",
    designation: "Andromeda Galaxy",
    classification: "Spiral Galaxy",
    imageUrl: "/astronomy/m31_gendler_2700.jpg",
    plateNumber: "PL-0031",
  },
  {
    id: "m42_specimen",
    catalogId: "M42",
    designation: "Orion Nebula",
    classification: "Emission Nebula",
    imageUrl: "/astronomy/m42_test2.jpg",
    plateNumber: "PL-0042",
  },
  {
    id: "jupiter_specimen",
    catalogId: "Jupiter",
    designation: "Gas Giant Planet",
    classification: "Solar System Body",
    imageUrl: "/astronomy/Jupiter_against_black_background_of_space.jpeg",
    plateNumber: "PL-0501",
  },
  {
    id: "m87_specimen",
    catalogId: "M87",
    designation: "Virgo A Elliptical",
    classification: "Active Galactic Nucleus",
    imageUrl: "/astronomy/elliptical_galaxy.jpg",
    plateNumber: "PL-0087",
  },
  {
    id: "omega_centauri_specimen",
    catalogId: "NGC 5139",
    designation: "Omega Centauri",
    classification: "Globular Star Cluster",
    imageUrl: "/astronomy/omega-centauri-infrared-sq-e1464861026459.jpg",
    plateNumber: "PL-5139",
  },
  {
    id: "milky_way_specimen",
    catalogId: "Milky Way",
    designation: "Galactic Center Core",
    classification: "Barred Spiral Arc",
    imageUrl: "/astronomy/night-sky-Milky-Way-Galaxy.jpg",
    plateNumber: "PL-0001",
  },
];

interface ObservationArchiveProps {
  onSelectPlate: (plate: ArchivePlate) => void;
  activeId?: string | null;
  isLoading?: boolean;
}

export default function ObservationArchive({
  onSelectPlate,
  activeId,
  isLoading,
}: ObservationArchiveProps) {
  return (
    <div className="w-full border-y border-zinc-800 bg-[#020409]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/80 bg-[#03060c] text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold tracking-wider uppercase">OBSERVATION ARCHIVE</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">ASTRONOMICAL REFERENCE PLATES</span>
        </div>
        <span className="text-zinc-500 hidden sm:inline">SELECT SPECIMEN TO STAGE OBSERVATION</span>
      </div>

      <div className="horizontal-scroll-container flex items-center gap-2 px-3 py-2.5 overflow-x-auto">
        {ARCHIVE_SPECIMENS.map((plate) => {
          const isSelected = activeId === plate.id;
          return (
            <button
              key={plate.id}
              type="button"
              onClick={() => onSelectPlate(plate)}
              disabled={isLoading}
              className={`group flex-shrink-0 flex items-center gap-3 p-1.5 border text-left transition duration-150 ${
                isSelected
                  ? "border-cyan-400 bg-cyan-950/30 text-white"
                  : "border-zinc-800/80 bg-[#050811] hover:border-zinc-600 hover:bg-[#080d1a] text-zinc-300"
              }`}
            >
              {/* Plate Thumbnail */}
              <div className="relative w-14 h-14 bg-black border border-zinc-800 flex-shrink-0 overflow-hidden">
                <img
                  src={plate.imageUrl}
                  alt={plate.designation}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 font-mono text-[8px] text-zinc-400">
                  {plate.plateNumber}
                </span>
              </div>

              {/* Plate Details */}
              <div className="pr-2 min-w-[95px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {plate.catalogId}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-zinc-300 truncate max-w-[120px] leading-tight mt-0.5">
                  {plate.designation}
                </p>
                <p className="font-mono text-[9px] text-zinc-500 truncate mt-0.5">
                  {plate.classification}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
