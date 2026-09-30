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
    plateNumber: "PLATE-0031",
  },
  {
    id: "m42_specimen",
    catalogId: "M42",
    designation: "Orion Nebula",
    classification: "Emission Nebula",
    imageUrl: "/astronomy/m42_test2.jpg",
    plateNumber: "PLATE-0042",
  },
  {
    id: "jupiter_specimen",
    catalogId: "Jupiter",
    designation: "Gas Giant System",
    classification: "Solar System Body",
    imageUrl: "/astronomy/Jupiter_against_black_background_of_space.jpeg",
    plateNumber: "PLATE-0501",
  },
  {
    id: "m87_specimen",
    catalogId: "M87",
    designation: "Virgo A Elliptical",
    classification: "Active Galactic Nucleus",
    imageUrl: "/astronomy/elliptical_galaxy.jpg",
    plateNumber: "PLATE-0087",
  },
  {
    id: "omega_centauri_specimen",
    catalogId: "NGC 5139",
    designation: "Omega Centauri",
    classification: "Globular Cluster",
    imageUrl: "/astronomy/omega-centauri-infrared-sq-e1464861026459.jpg",
    plateNumber: "PLATE-5139",
  },
  {
    id: "milky_way_specimen",
    catalogId: "Milky Way",
    designation: "Galactic Center Core",
    classification: "Barred Spiral Core",
    imageUrl: "/astronomy/night-sky-Milky-Way-Galaxy.jpg",
    plateNumber: "PLATE-0001",
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
    <div className="w-full border-b border-white/[0.08] bg-[#020306]">
      <div className="max-w-[1720px] mx-auto px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span className="uppercase tracking-[0.15em] text-zinc-400">
          Archival Plate Index
        </span>
        <span className="text-[10px] hidden sm:inline text-zinc-600">
          SELECT SPECIMEN TO INSPECT OBSERVATION
        </span>
      </div>

      <div className="max-w-[1720px] mx-auto px-5 pb-3">
        <div className="astro-scrollbar flex items-stretch gap-3 overflow-x-auto pb-1">
          {ARCHIVE_SPECIMENS.map((plate) => {
            const isSelected = activeId === plate.id;
            return (
              <button
                key={plate.id}
                type="button"
                onClick={() => onSelectPlate(plate)}
                disabled={isLoading}
                className={`group flex-shrink-0 flex items-center gap-3.5 p-2 transition-all text-left border ${
                  isSelected
                    ? "bg-white/[0.08] border-white/40 shadow-sm"
                    : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/20"
                }`}
              >
                {/* Plate Square Specimen */}
                <div className="relative w-12 h-12 bg-black flex-shrink-0 overflow-hidden border border-white/10">
                  <img
                    src={plate.imageUrl}
                    alt={plate.designation}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isSelected ? "scale-105" : "group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 border border-cyan-400/80 pointer-events-none" />
                  )}
                </div>

                {/* Specimen Typography */}
                <div className="min-w-[110px] pr-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="font-semibold text-white group-hover:text-cyan-200">
                      {plate.catalogId}
                    </span>
                    <span className="text-[9px] text-zinc-500">
                      {plate.plateNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-300 truncate font-sans mt-0.5">
                    {plate.designation}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {plate.classification}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
