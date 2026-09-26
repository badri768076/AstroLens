"use client";

import { useState } from "react";

export default function DatasetsPage() {
  const [selectedTask, setSelectedTask] = useState<"taskA" | "taskB">("taskA");

  const candidates = [
    {
      id: "galaxymnist",
      name: "GalaxyMNIST",
      role: "Task A Benchmark (Active Production)",
      category: "Galaxy Morphology Classification",
      classesCount: 4,
      totalImages: "10,000",
      resolution: "224 × 224 RGB",
      balance: "Perfect (2,500 / class)",
      licensing: "CC BY 4.0 / Open Academic",
      vramFootprint: "0.8 GB (Ideal for RTX 5050)",
      suitability: "High — Standardized benchmark with verified SDSS/Galaxy Zoo labels.",
      verdict: "Active Primary Benchmark"
    },
    {
      id: "galaxy10",
      name: "Galaxy10 DECals",
      role: "Task B Candidate (Morphological Expansion)",
      category: "Extended Galactic Morphology",
      classesCount: 10,
      totalImages: "17,736",
      resolution: "256 × 256 RGB",
      balance: "Imbalanced (334 Cigar to 2,645 Round)",
      licensing: "Open Academic (DESI Surveys)",
      vramFootprint: "2.5 GB dataset / 1.8 GB VRAM",
      suitability: "High — Direct extension of Galaxy Zoo into 10 detailed morphological bins.",
      verdict: "Recommended for Task B Extension"
    },
    {
      id: "sdss_photometric",
      name: "SDSS DR17 Multi-Object Survey",
      role: "Task B Candidate (Astrophysical Taxonomy)",
      category: "Star vs Galaxy vs Quasar (QSO)",
      classesCount: 3,
      totalImages: "100,000+",
      resolution: "64 × 64 5-band (u,g,r,i,z)",
      balance: "Moderate (50k Galaxy, 35k Star, 15k QSO)",
      licensing: "Open Data (SDSS Consortium)",
      vramFootprint: "1.2 GB VRAM",
      suitability: "Extremely High scientific value — spectroscopic ground truth across distinct astrophysical phenomena.",
      verdict: "Recommended for Multi-Object Taxonomy"
    },
    {
      id: "esa_hubble",
      name: "ESA / Hubble Deep Sky Catalog",
      role: "Task B Candidate (Multi-Domain Deep Sky)",
      category: "Nebulae, Star Clusters, Supernovae, Galaxies",
      classesCount: 6,
      totalImages: "12,000+",
      resolution: "Variable (High Resolution Multi-filter)",
      balance: "Uncurated / Heavily Imbalanced",
      licensing: "ESA/NASA Public Domain",
      vramFootprint: "8+ GB (High storage overhead)",
      suitability: "Challenging — Variable crops and observational artifacts require intensive preprocessing.",
      verdict: "Archival Reference"
    }
  ];

  const galaxyMorphologyArchetypes = [
    {
      title: "Class 0: Smooth Round",
      scientificName: "Elliptical Galaxy (E0-E1)",
      features: "Radially symmetric, high central concentration, absence of resolved spiral arms or dust lanes, older stellar population.",
      support: "2,500 train/test samples",
      exampleUrl: "/samples/smooth_round_sample_1.png"
    },
    {
      title: "Class 1: Smooth Cigar",
      scientificName: "Prolate Elliptical (E5-E7)",
      features: "Strongly elongated elliptical profile, high eccentricity, smooth surface brightness gradient, no prominent disk.",
      support: "2,500 train/test samples",
      exampleUrl: "/samples/smooth_cigar_sample_1.png"
    },
    {
      title: "Class 2: Edge-on Disk",
      scientificName: "Lenticular / Disk Galaxy (S0 / Edge-on Spiral)",
      features: "High aspect ratio, prominent linear dust absorption along the midplane, central bulge component.",
      support: "2,500 train/test samples",
      exampleUrl: "/samples/edge_on_disk_sample_1.png"
    },
    {
      title: "Class 3: Unbarred Spiral",
      scientificName: "Spiral Galaxy (SA / Sb / Sc)",
      features: "Prominent rotating spiral arms originating directly from the central nucleus, ongoing star-forming H II regions.",
      support: "2,500 train/test samples",
      exampleUrl: "/samples/unbarred_spiral_sample_1.png"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>DATASET ARCHITECTURE & ACADEMIC EVALUATION</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dataset Explorer & Astronomical Benchmarks
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
            AstroLens maintains a strict scientific distinction between 
            <strong> Task A: Galaxy Morphology Classification</strong> (GalaxyMNIST) and 
            <strong> Task B: Broader Astronomical Object Taxonomy</strong> (Star, Galaxy, Quasar, Nebula).
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedTask("taskA")}
            className={`rounded px-3 py-1.5 transition ${
              selectedTask === "taskA" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Task A: Morphology
          </button>
          <button
            type="button"
            onClick={() => setSelectedTask("taskB")}
            className={`rounded px-3 py-1.5 transition ${
              selectedTask === "taskB" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Task B: Multi-Object
          </button>
        </div>
      </div>

      {/* Task A Galaxy Morphology Archetypes */}
      {selectedTask === "taskA" ? (
        <div className="space-y-8">
          <div className="rounded-2xl border border-cyan-900/50 bg-[#090c16] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  CURRENT PRODUCTION DATASET
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  GalaxyMNIST: Standardized Galaxy Morphology Benchmark
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  10,000 images • 4 balanced classes • 224×224 RGB • Derived from Galaxy Zoo 2 / SDSS
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="rounded bg-zinc-900 border border-zinc-800 px-3 py-1 text-zinc-300">
                  Train: 6,400
                </span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-3 py-1 text-zinc-300">
                  Val: 1,600
                </span>
                <span className="rounded bg-cyan-950 border border-cyan-800 px-3 py-1 text-cyan-300">
                  Test: 2,000
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {galaxyMorphologyArchetypes.map((arch, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-zinc-800">
                      Class #{idx}
                    </span>
                    <h3 className="font-semibold text-sm text-zinc-100 mt-2">
                      {arch.title.split(": ")[1]}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">
                      {arch.scientificName}
                    </p>
                    <p className="text-xs text-zinc-400 mt-3 font-sans leading-relaxed">
                      {arch.features}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                    {arch.support}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Task B Candidates Evaluation */
        <div className="space-y-8">
          <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              Task B: Public Astronomical Datasets Comparative Evaluation
            </h2>
            <p className="text-xs text-zinc-400 max-w-3xl mb-6">
              Rigorous academic evaluation of candidate datasets for extending AstroLens into broader multi-class astronomical object analysis (stars, quasars, nebulae, extended morphology). Evaluated on class balance, licensing, VRAM feasibility on RTX 5050 (8GB), and astrophysical integrity.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3">Candidate Dataset</th>
                    <th className="pb-3">Target Scope</th>
                    <th className="pb-3">Classes</th>
                    <th className="pb-3">Image Count</th>
                    <th className="pb-3">VRAM Footprint</th>
                    <th className="pb-3">Class Balance</th>
                    <th className="pb-3">Academic Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {candidates.map((c) => (
                    <tr key={c.id} className={c.id === "galaxymnist" ? "bg-cyan-950/20" : ""}>
                      <td className="py-3 font-semibold text-zinc-100">
                        {c.name}
                        <span className="block text-[10px] text-zinc-500">{c.role}</span>
                      </td>
                      <td className="py-3 text-zinc-400 font-sans">{c.category}</td>
                      <td className="py-3 text-cyan-400 font-bold">{c.classesCount}</td>
                      <td className="py-3">{c.totalImages}</td>
                      <td className="py-3">{c.vramFootprint}</td>
                      <td className="py-3 text-zinc-400 font-sans">{c.balance}</td>
                      <td className="py-3 font-semibold text-cyan-300 font-sans">{c.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Scientific Integrity Note */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-xs text-zinc-400 leading-relaxed font-sans">
        <h4 className="font-semibold text-zinc-200 font-mono mb-2">
          Academic Integrity & Multi-Task Design Principle:
        </h4>
        <p>
          In accordance with scientific rigor, AstroLens strictly avoids hardcoding class counts (`num_classes=4`). The model registry and API dynamically load class mappings and classification heads according to the selected dataset. Furthermore, AstroLens makes NO false claims of detecting object classes (such as nebulae or supernovae) on which the active ResNet18 model has not been trained.
        </p>
      </div>
    </div>
  );
}
