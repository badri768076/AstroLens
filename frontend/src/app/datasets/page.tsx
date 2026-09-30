"use client";

import { useState } from "react";
import Link from "next/link";

export default function DatasetsPage() {
  const [selectedTab, setSelectedTab] = useState<"plates" | "surveys">("plates");

  const catalogPlates = [
    {
      catalogId: "PLATE-01",
      archetype: "Smooth Round",
      scientificName: "Elliptical Galaxy (Hubble Type E0-E1)",
      imageUrl: "/samples/smooth_round_sample_1.png",
      filterBand: "SDSS Optical r-band",
      dimensions: "224 × 224 px",
      features: "Radially symmetric surface brightness distribution, dense stellar nucleus, absence of star-forming spiral arms.",
      stellarPop: "Population II / Old red giant stars",
    },
    {
      catalogId: "PLATE-02",
      archetype: "Smooth Cigar",
      scientificName: "Prolate Elliptical (Hubble Type E5-E7)",
      imageUrl: "/samples/smooth_cigar_sample_1.png",
      filterBand: "SDSS Optical g/r/i-band",
      dimensions: "224 × 224 px",
      features: "Strongly elongated elliptical morphology with axial ratio b/a < 0.5, uniform stellar halo.",
      stellarPop: "Older stellar population, minimal cold interstellar gas",
    },
    {
      catalogId: "PLATE-03",
      archetype: "Edge-On Disk",
      scientificName: "Lenticular / Edge-On Spiral (S0 / Sa)",
      imageUrl: "/samples/edge_on_disk_sample_1.png",
      filterBand: "SDSS Multi-band Cutout",
      dimensions: "224 × 224 px",
      features: "Prominent linear dust lane absorbing optical continuum along the disk midplane, central spheroid bulge.",
      stellarPop: "Mixed population with active dust attenuation",
    },
    {
      catalogId: "PLATE-04",
      archetype: "Unbarred Spiral",
      scientificName: "Grand Design Spiral (SA / Sc)",
      imageUrl: "/samples/unbarred_spiral_sample_1.png",
      filterBand: "SDSS DR17 Composite",
      dimensions: "224 × 224 px",
      features: "Prominent rotating spiral arms originating from the central nucleus, active star-forming H II ionization regions.",
      stellarPop: "Population I / Young hot OB stars in spiral arms",
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
    <main className="min-h-screen bg-[#020306] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Archive Header */}
        <div className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px] mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold tracking-wider uppercase">ASTRONOMICAL DATA ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Observation Catalogs & Reference Plates
            </h1>
          </div>

          {/* Tab Selector */}
          <div className="flex border border-zinc-800 bg-[#03060c] p-0.5">
            <button
              type="button"
              onClick={() => setSelectedTab("plates")}
              className={`px-3 py-1.5 uppercase tracking-wider font-bold transition ${
                selectedTab === "plates"
                  ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Morphological Plates
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("surveys")}
              className={`px-3 py-1.5 uppercase tracking-wider font-bold transition ${
                selectedTab === "surveys"
                  ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Survey Catalogs
            </button>
          </div>
        </div>

        {/* Tab 1: Morphological Plates Archive */}
        {selectedTab === "plates" ? (
          <div className="border border-zinc-800 bg-[#020409] divide-y divide-zinc-800">
            {catalogPlates.map((plate) => (
              <div key={plate.catalogId} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Large Dominant Photographic Plate Image */}
                <div className="lg:col-span-4 bg-black border border-zinc-800 p-2 flex items-center justify-center">
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden border border-zinc-900 flex items-center justify-center bg-[#010204]">
                    <img
                      src={plate.imageUrl}
                      alt={plate.archetype}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 border border-zinc-800 px-2 py-0.5 text-[10px] text-cyan-400 font-bold">
                      {plate.catalogId}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/85 border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400">
                      {plate.dimensions}
                    </div>
                  </div>
                </div>

                {/* Plate Astrometric Ledger & Description */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="border-b border-zinc-800 pb-2">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest block">
                      MORPHOLOGY ARCHETYPE
                    </span>
                    <h2 className="text-xl font-bold text-white uppercase mt-0.5">
                      {plate.archetype}
                    </h2>
                    <p className="text-zinc-400 text-xs mt-0.5">{plate.scientificName}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="border border-zinc-800/80 bg-[#04060c] p-2.5">
                      <span className="text-zinc-500 block text-[9px] uppercase">SURVEY FILTER</span>
                      <span className="text-zinc-200">{plate.filterBand}</span>
                    </div>
                    <div className="border border-zinc-800/80 bg-[#04060c] p-2.5">
                      <span className="text-zinc-500 block text-[9px] uppercase">STELLAR POPULATION</span>
                      <span className="text-zinc-200">{plate.stellarPop}</span>
                    </div>
                  </div>

                  <div className="pt-2 font-sans text-xs text-zinc-400 leading-relaxed">
                    <span className="font-mono text-zinc-500 text-[10px] uppercase block mb-0.5">MORPHOLOGICAL FEATURES:</span>
                    {plate.features}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tab 2: Survey Catalogs */
          <div className="border border-zinc-800 bg-[#020409] p-4 sm:p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">
                LINKED ASTRONOMICAL SURVEYS & DATABASES
              </span>
              <span className="text-zinc-500 text-[10px]">VERIFIED GROUND TRUTH</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-800">
                <thead>
                  <tr className="text-zinc-500 text-[10px]">
                    <th className="pb-3">Survey Archive</th>
                    <th className="pb-3">Target Scope</th>
                    <th className="pb-3">Observation Volume</th>
                    <th className="pb-3">Filter Wavelengths</th>
                    <th className="pb-3">Scientific Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {surveyCatalogs.map((s, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-bold text-white">
                        {s.name}
                        <span className="block text-[10px] text-cyan-400 font-normal">{s.role}</span>
                      </td>
                      <td className="py-3 text-zinc-400">{s.scope}</td>
                      <td className="py-3 text-white">{s.sampleCount}</td>
                      <td className="py-3 text-zinc-400">{s.bands}</td>
                      <td className="py-3 text-zinc-500 text-[11px]">{s.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link
            href="/analyze"
            className="px-5 py-2.5 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-wider transition"
          >
            Stage Observation in Workstation →
          </Link>
        </div>
      </div>
    </main>
  );
}
