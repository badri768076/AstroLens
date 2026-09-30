"use client";

import Link from "next/link";
import { useState } from "react";

const HERO_OBSERVATIONS = [
  {
    id: "m31",
    catalogId: "M31",
    name: "Andromeda Galaxy",
    taxonomy: "Spiral Galaxy (SA(s)b)",
    ra: "00h 42m 44.3s",
    dec: "+41° 16′ 09″",
    simbadType: "Galaxy in Pair of Galaxies (GiP)",
    confidence: "99.4%",
    image: "/astronomy/m31_gendler_2700.jpg",
    context: "Nearest major spiral galaxy to the Milky Way, displaying structured dust lanes and active star-forming arms.",
  },
  {
    id: "m42",
    catalogId: "M42",
    name: "Orion Nebula",
    taxonomy: "Diffuse Emission Nebula",
    ra: "05h 35m 17.3s",
    dec: "−05° 23′ 28″",
    simbadType: "HII Ionized Region (HII)",
    confidence: "98.9%",
    image: "/astronomy/m42_test2.jpg",
    context: "Stellar nursery inside the Orion constellation, illuminated by the high-mass Trapezium star cluster.",
  },
  {
    id: "jupiter",
    catalogId: "Jupiter",
    name: "Jovian Planetary System",
    taxonomy: "Solar System Gas Giant",
    ra: "Time-varying",
    dec: "Orbital Ephemeris",
    simbadType: "Major Planet (Planet)",
    confidence: "99.1%",
    image: "/astronomy/Jupiter_against_black_background_of_space.jpeg",
    context: "The largest planet in the Solar System with banded atmospheric turbulence and Great Red Spot anticyclone.",
  },
  {
    id: "m87",
    catalogId: "M87",
    name: "Virgo A Elliptical",
    taxonomy: "Supergiant Elliptical (E0-E1)",
    ra: "12h 30m 49.4s",
    dec: "+12° 23′ 28″",
    simbadType: "Active Galactic Nucleus (AGN)",
    confidence: "97.6%",
    image: "/astronomy/elliptical_galaxy.jpg",
    context: "Dominant central galaxy of the Virgo Cluster, hosting a 6.5-billion-solar-mass supermassive black hole.",
  },
];

export default function Home() {
  const [selectedObs, setSelectedObs] = useState(HERO_OBSERVATIONS[0]);

  return (
    <main className="min-h-screen bg-[#010204] text-zinc-100 flex flex-col font-sans select-none">
      {/* SECTION 1: HERO ASTRONOMICAL OBSERVATION */}
      <section className="relative border-b border-white/[0.08] px-4 sm:px-6 pt-6 pb-12">
        <div className="max-w-[1720px] mx-auto space-y-6">
          {/* Scientific Identity Line */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-zinc-300 uppercase tracking-[0.2em]">
                AstroLens Scientific Exploration Instrument
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>ICRS J2000.0</span>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-400">FASTAI + VIT + CDS SIMBAD</span>
            </div>
          </div>

          {/* Core Guiding Question & Action */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight">
                “I have a space image. <br className="hidden sm:inline" />
                <span className="italic font-serif text-cyan-200">What am I looking at?</span>”
              </h1>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                AstroLens accepts celestial photography, identifies the object through convolutional morphology
                and Vision Transformer metric embeddings, and resolves astrometric coordinates via the CDS SIMBAD
                astronomical database.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <Link
                href="/analyze"
                className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-medium uppercase tracking-[0.15em] transition shadow-lg"
              >
                Analyze Space Image →
              </Link>
              <Link
                href="/methodology"
                className="px-4 py-3 border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white uppercase tracking-wider transition"
              >
                Pipeline Doc
              </Link>
            </div>
          </div>

          {/* Hero Visual Anchor: Large Astronomical Observation */}
          <div className="relative w-full h-[520px] sm:h-[640px] bg-black border border-white/[0.1] overflow-hidden">
            {/* Photographic Image */}
            <img
              src={selectedObs.image}
              alt={selectedObs.name}
              className="w-full h-full object-cover sm:object-contain object-center opacity-90 transition-opacity duration-300"
            />

            {/* Astronomical Measurement Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </div>
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/10" />
              <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
            </div>

            {/* Scientific Callout Leader Line */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10 pointer-events-none max-w-sm">
              <div className="bg-black/85 border border-white/20 p-4 font-mono shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-medium mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Observation Resolved
                </div>
                <h2 className="text-2xl font-light text-white tracking-tight">
                  {selectedObs.catalogId} — {selectedObs.name}
                </h2>
                <div className="text-xs text-zinc-300 mt-1 font-sans">
                  {selectedObs.taxonomy}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] space-y-1 text-zinc-400 font-mono">
                  <div>RA: <span className="text-white">{selectedObs.ra}</span></div>
                  <div>DEC: <span className="text-white">{selectedObs.dec}</span></div>
                  <div>SIMBAD: <span className="text-zinc-300">{selectedObs.simbadType}</span></div>
                  <div>CONFIDENCE: <span className="text-emerald-400">{selectedObs.confidence}</span></div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-zinc-500 font-sans leading-relaxed">
                  {selectedObs.context}
                </div>
              </div>
            </div>

            {/* Observation Specimen Selector Switcher */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 bg-black/80 border border-white/15 p-1">
                <span className="text-[10px] text-zinc-500 px-2 uppercase tracking-wider">
                  Select Plate:
                </span>
                {HERO_OBSERVATIONS.map((obs) => (
                  <button
                    key={obs.id}
                    type="button"
                    onClick={() => setSelectedObs(obs)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider transition ${
                      selectedObs.id === obs.id
                        ? "bg-white text-black font-medium"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {obs.catalogId}
                  </button>
                ))}
              </div>

              <Link
                href="/analyze"
                className="hidden sm:inline-block px-3 py-1.5 bg-black/80 border border-white/20 text-zinc-300 hover:text-white text-[11px] uppercase tracking-wider"
              >
                Inspect in Canvas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: EDITORIAL SCIENTIFIC PIPELINE */}
      <section className="py-14 px-4 sm:px-6 border-b border-white/[0.08] bg-[#020306]">
        <div className="max-w-[1720px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] block mb-1">
                Astrometric Pipeline
              </span>
              <h2 className="text-2xl font-light text-white tracking-tight">
                From Raw Photons to Celestial Astrometry
              </h2>
            </div>
            <div className="text-xs font-mono text-zinc-500">
              5-PHASE INFERENCE SEQUENCE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 font-mono">
            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="text-[10px] text-cyan-400">01 / INTAKE</div>
              <h3 className="text-sm font-medium text-white uppercase">Optical Exposure</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Intake of celestial photograph, CCD sensor frame, or survey cutout across optical and infrared bands.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="text-[10px] text-cyan-400">02 / TAXONOMY</div>
              <h3 className="text-sm font-medium text-white uppercase">FastAI Classifier</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Deep neural classification of celestial morphology: Spiral, Elliptical, Nebula, or Solar System.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="text-[10px] text-cyan-400">03 / METRIC MATCH</div>
              <h3 className="text-sm font-medium text-white uppercase">Vision Transformer</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                768-D latent hypersphere embedding matched against indexed reference astronomical catalogs.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="text-[10px] text-cyan-400">04 / ASTROMETRY</div>
              <h3 className="text-sm font-medium text-white uppercase">CDS SIMBAD</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Official astronomical database cross-match resolving primary catalog ID, type, and coordinates.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/20 pt-4">
              <div className="text-[10px] text-cyan-400">05 / SKY PROJECTION</div>
              <h3 className="text-sm font-medium text-white uppercase">Equatorial Atlas</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Right Ascension and Declination projected onto the celestial sphere relative to equatorial coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORATION INVITATION */}
      <section className="py-14 px-4 sm:px-6 bg-[#010204]">
        <div className="max-w-[1720px] mx-auto border border-white/[0.1] bg-[#030408] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
              Interactive Instrument
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Begin Exploring Astronomical Observations
            </h3>
            <p className="text-sm text-zinc-400 font-sans leading-relaxed">
              Upload your own astrophotography or examine canonical reference plates from the SDSS and Messier archives.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase tracking-[0.15em] font-medium transition shadow-lg whitespace-nowrap"
          >
            Launch Observation Canvas →
          </Link>
        </div>
      </section>
    </main>
  );
}