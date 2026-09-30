"use client";

import { useState } from "react";
import Link from "next/link";

export default function DatasetsPage() {
  const [selectedTab, setSelectedTab] = useState<"specimens" | "surveys">("specimens");

  const catalogPlates = [
    {
      classIndex: "01",
      archetype: "SMOOTH ROUND",
      scientificName: "Elliptical Galaxy (Hubble Type E0–E1)",
      imageUrl: "/samples/smooth_round_sample_1.png",
      filterBand: "SDSS Optical r-band",
      dimensions: "224 × 224 px",
      features: "Radially symmetric surface brightness distribution following de Vaucouleurs profile, dense stellar nucleus, absence of star-forming spiral arms or cold dust lanes.",
      stellarPop: "Population II / Old red giant stars, low interstellar dust attenuation.",
      axialRatio: "b/a ≈ 0.95 – 1.00",
      sampleCount: "2,500 Curated Specimens",
    },
    {
      classIndex: "02",
      archetype: "SMOOTH CIGAR",
      scientificName: "Prolate Elliptical (Hubble Type E5–E7)",
      imageUrl: "/samples/smooth_cigar_sample_1.png",
      filterBand: "SDSS Optical g/r/i-band",
      dimensions: "224 × 224 px",
      features: "Strongly elongated elliptical morphology with axial ratio b/a < 0.5, uniform extended stellar halo, smooth surface brightness gradient lacking disk substructure.",
      stellarPop: "Older stellar population, minimal cold neutral hydrogen gas reservoir.",
      axialRatio: "b/a ≈ 0.35 – 0.50",
      sampleCount: "2,500 Curated Specimens",
    },
    {
      classIndex: "03",
      archetype: "EDGE-ON DISK",
      scientificName: "Lenticular / Edge-On Spiral (S0 / Sa)",
      imageUrl: "/samples/edge_on_disk_sample_1.png",
      filterBand: "SDSS Multi-band Optical Cutout",
      dimensions: "224 × 224 px",
      features: "Prominent linear dust lane absorbing optical continuum along the disk midplane, central spheroid bulge, high inclination angle approaching 90 degrees.",
      stellarPop: "Mixed population: older bulge stars with active dust extinction in the disk plane.",
      axialRatio: "b/a < 0.25 (High Inclination)",
      sampleCount: "2,500 Curated Specimens",
    },
    {
      classIndex: "04",
      archetype: "UNBARRED SPIRAL",
      scientificName: "Grand Design Spiral (SA / Sc)",
      imageUrl: "/samples/unbarred_spiral_sample_1.png",
      filterBand: "SDSS DR17 Composite",
      dimensions: "224 × 224 px",
      features: "Prominent rotating spiral arms originating directly from the central nucleus without an intermediate stellar bar, active star-forming H II ionization regions.",
      stellarPop: "Population I / Young hot OB stars in spiral arms, cold interstellar dust lanes.",
      axialRatio: "Face-on to Intermediate Inclination",
      sampleCount: "2,500 Curated Specimens",
    },
  ];

  const surveyCatalogs = [
    {
      name: "Galaxy Zoo 2 / SDSS DR17",
      scope: "Morphological Galaxy Taxonomy",
      sampleCount: "10,000 Curated Specimens",
      bands: "u, g, r, i, z Optical",
      resolution: "0.396 arcsec / pixel",
      source: "Sloan Digital Sky Survey (Apache Point Observatory)",
      role: "Active Morphology Benchmark",
    },
    {
      name: "CDS SIMBAD Astronomical Database",
      scope: "Cross-Identifications & Astrometry",
      sampleCount: "13,800,000+ Objects",
      bands: "Multi-wavelength (Radio to Gamma)",
      resolution: "Sub-arcsecond Astrometry",
      source: "Centre de Données astronomiques de Strasbourg (CDS)",
      role: "Live Astrometric Query Service",
    },
    {
      name: "Galaxy10 DECals Survey",
      scope: "10-Class Extended Morphology",
      sampleCount: "17,736 Deep-Sky Cutouts",
      bands: "DESI Legacy Imaging Surveys",
      resolution: "256 × 256 px",
      source: "Dark Energy Camera (Blanco 4m Telescope)",
      role: "Candidate Extension Catalog",
    },
  ];

  return (
    <main className="min-h-screen bg-[#010204] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs select-none">
      <div className="max-w-[1720px] mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              Astronomical Morphology Archive
            </span>
            <h1 className="text-3xl font-light text-white tracking-tight">
              Galaxy Zoo & SDSS Morphological Cutouts
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-3xl pt-1">
              Curated astronomical survey plates illustrating the fundamental celestial morphological archetypes
              used for training and benchmark calibration.
            </p>
          </div>

          <div className="flex border border-white/10 p-1 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setSelectedTab("specimens")}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition ${
                selectedTab === "specimens" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Morphology Specimens
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("surveys")}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition ${
                selectedTab === "surveys" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Survey Catalogs
            </button>
          </div>
        </div>

        {/* TAB 1: SPECIMEN ARCHIVE */}
        {selectedTab === "specimens" && (
          <div className="space-y-12">
            {catalogPlates.map((plate) => (
              <article
                key={plate.classIndex}
                className="border border-white/[0.08] bg-[#020306] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Large Astronomical Specimen Image (4 cols) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[320px] bg-black border border-white/15 p-2 shadow-2xl">
                    <img
                      src={plate.imageUrl}
                      alt={plate.archetype}
                      className="w-full h-full object-contain filter contrast-125"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 border border-white/15 text-[9px] text-zinc-400">
                      CLASS {plate.classIndex}
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-zinc-500 font-mono">
                    {plate.filterBand} • {plate.dimensions}
                  </div>
                </div>

                {/* Scientific Description & Metrics (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="border-b border-white/[0.08] pb-3">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-medium">
                      Morphology Class {plate.classIndex}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight mt-1">
                      {plate.archetype}
                    </h2>
                    <div className="text-xs text-zinc-400 font-sans mt-0.5">
                      {plate.scientificName}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-sans text-zinc-300 leading-relaxed">
                    <div className="font-mono text-[10px] uppercase text-zinc-500">
                      Physical Dynamics & Morphology
                    </div>
                    <p>{plate.features}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 uppercase text-[9px] block">Stellar Population</span>
                      <span className="text-zinc-300 text-[11px] font-sans">{plate.stellarPop}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase text-[9px] block">Axial Ratio</span>
                      <span className="text-white text-[11px]">{plate.axialRatio}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase text-[9px] block">Training Volume</span>
                      <span className="text-cyan-300 text-[11px]">{plate.sampleCount}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* TAB 2: SURVEY CATALOGS */}
        {selectedTab === "surveys" && (
          <div className="border border-white/[0.08] bg-[#020306] divide-y divide-white/[0.06]">
            {surveyCatalogs.map((survey) => (
              <div key={survey.name} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-4">
                  <h3 className="text-base text-white font-medium">{survey.name}</h3>
                  <div className="text-xs text-zinc-400 font-sans mt-0.5">{survey.source}</div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] block">Scope</span>
                    <span className="text-zinc-300">{survey.scope}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] block">Records</span>
                    <span className="text-white">{survey.sampleCount}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] block">Wavelengths</span>
                    <span className="text-zinc-300">{survey.bands}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] block">Instrument Role</span>
                    <span className="text-cyan-300">{survey.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM ACTION */}
        <div className="border-t border-white/[0.08] pt-6 flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-sans">
            Ready to test live inference on your own astronomical plates?
          </span>
          <Link
            href="/analyze"
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black uppercase tracking-wider font-semibold transition"
          >
            Open Observation Canvas →
          </Link>
        </div>
      </div>
    </main>
  );
}
