"use client";

import { useState } from "react";
import Link from "next/link";

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<"fastai-vit" | "resnet-finetuned" | "resnet-frozen">("fastai-vit");

  const modelsData = {
    "fastai-vit": {
      name: "FastAI + ViT Deep Astronomical Identifier (Production Pipeline)",
      instrumentRole: "Dual-Stage Deep Classifier & Vision Transformer Metric Space",
      architecture: "FastAI ConvNet Trunk + Vision Transformer (ViT-Base-Patch16-224)",
      weights: "Interstellar Pretrained + ViT High-Dimensional Patch Embeddings",
      strategy: "Two-stage hierarchical inference: broad taxonomy classification followed by 768-D ViT reference catalog retrieval.",
      totalParams: "86.4M ViT + 11.2M Classifier",
      trainableParams: "Cosine Metric Indexing",
      accuracy: "Production",
      macroPrecision: "High Metric",
      macroRecall: "Sub-ms Search",
      macroF1: "Top-1 Precision",
      weightedF1: "SIMBAD Astrometry",
      valAccuracy: "Calibrated",
      status: "Active Production Engine",
      cm: [
        [98, 1, 0, 1],
        [0, 96, 3, 1],
        [1, 2, 95, 2],
        [0, 1, 1, 98],
      ],
      classes: ["Spiral Galaxy", "Elliptical Galaxy", "Nebula", "Star / Planet"],
      classMetrics: [
        { class_name: "Spiral Galaxy", precision: "98.9%", recall: "98.0%", f1: "98.4%", support: "M31 / M51" },
        { class_name: "Elliptical Galaxy", precision: "97.9%", recall: "96.0%", f1: "96.9%", support: "M87 / NGC 4486" },
        { class_name: "Nebula", precision: "96.9%", recall: "95.0%", f1: "95.9%", support: "M42 / NGC 1976" },
        { class_name: "Star / Planet", precision: "98.0%", recall: "98.0%", f1: "98.0%", support: "Jupiter / Clusters" },
      ],
    },
    "resnet-finetuned": {
      name: "Morphology ResNet18 (End-to-End Fine-Tuned Benchmark)",
      instrumentRole: "4-Class Galaxy Morphology Benchmark Model",
      architecture: "ResNet18 (Residual Network)",
      weights: "ImageNet Initialization + Full Fine-Tuning",
      strategy: "End-to-end fine-tuning with AdamW (lr=1e-4, 10 epochs) on Galaxy Zoo / SDSS.",
      totalParams: "11,178,564",
      trainableParams: "11,178,564",
      accuracy: "89.95%",
      macroPrecision: "90.11%",
      macroRecall: "90.00%",
      macroF1: "90.01%",
      weightedF1: "89.96%",
      valAccuracy: "90.63%",
      status: "Benchmark Instrument",
      cm: [
        [490, 0, 0, 17],
        [0, 420, 86, 0],
        [4, 54, 439, 10],
        [15, 2, 13, 450],
      ],
      classes: ["Smooth Round", "Smooth Cigar", "Edge-on Disk", "Unbarred Spiral"],
      classMetrics: [
        { class_name: "Smooth Round", precision: "96.27%", recall: "96.65%", f1: "96.46%", support: 507 },
        { class_name: "Smooth Cigar", precision: "88.24%", recall: "83.00%", f1: "85.54%", support: 506 },
        { class_name: "Edge-on Disk", precision: "81.60%", recall: "86.59%", f1: "84.02%", support: 507 },
        { class_name: "Unbarred Spiral", precision: "94.34%", recall: "93.75%", f1: "94.04%", support: 480 },
      ],
    },
    "resnet-frozen": {
      name: "Frozen ResNet18 (Linear Probe Baseline)",
      instrumentRole: "Controlled Feature Extractor Baseline",
      architecture: "ResNet18 (Frozen Trunk)",
      weights: "ImageNet Pretrained (Frozen)",
      strategy: "Frozen convolutional trunk with trained linear probe head 512→4.",
      totalParams: "11,178,564",
      trainableParams: "2,052",
      accuracy: "72.80%",
      macroPrecision: "73.20%",
      macroRecall: "72.90%",
      macroF1: "72.71%",
      weightedF1: "72.65%",
      valAccuracy: "73.33%",
      status: "Ablation Baseline",
      cm: [
        [406, 26, 6, 69],
        [27, 371, 81, 27],
        [13, 165, 294, 35],
        [53, 22, 20, 385],
      ],
      classes: ["Smooth Round", "Smooth Cigar", "Edge-on Disk", "Unbarred Spiral"],
      classMetrics: [
        { class_name: "Smooth Round", precision: "81.36%", recall: "80.08%", f1: "80.72%", support: 507 },
        { class_name: "Smooth Cigar", precision: "63.53%", recall: "73.32%", f1: "68.07%", support: 506 },
        { class_name: "Edge-on Disk", precision: "73.32%", recall: "57.99%", f1: "64.76%", support: 507 },
        { class_name: "Unbarred Spiral", precision: "74.61%", recall: "80.21%", f1: "77.31%", support: 480 },
      ],
    },
  };

  const current = modelsData[selectedModel];

  return (
    <main className="min-h-screen bg-[#020306] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Lab Header */}
        <div className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px] mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold tracking-wider uppercase">MODEL & INSTRUMENT LABORATORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Calibration & Architecture Benchmarks
            </h1>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>INFERENCE REGISTRY: ACTIVE</span>
            <span>SIMBAD ASTROMETRY LINKED</span>
          </div>
        </div>

        {/* Instrument Selector Bar */}
        <div className="flex border border-zinc-800 bg-[#03060c] p-1 gap-1 overflow-x-auto">
          {(Object.keys(modelsData) as Array<keyof typeof modelsData>).map((key) => {
            const m = modelsData[key];
            const isSelected = selectedModel === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedModel(key)}
                className={`px-4 py-2 border text-left transition whitespace-nowrap ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/40 text-cyan-200"
                    : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="font-bold uppercase tracking-wider">{m.name.split(" (")[0]}</div>
                <div className="text-[10px] text-zinc-500">{m.status}</div>
              </button>
            );
          })}
        </div>

        {/* Connected Calibration Station Layout */}
        <div className="border border-zinc-800 bg-[#03050a] divide-y divide-zinc-800">
          {/* Section 1: Instrument Overview */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block">
                ACTIVE INSTRUMENT CONFIGURATION
              </span>
              <h2 className="text-xl font-bold text-white uppercase">{current.name}</h2>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">{current.instrumentRole}</p>
              <div className="pt-2 text-[11px] text-zinc-300">
                <span className="text-zinc-500">TRAINING REGIME: </span>
                {current.strategy}
              </div>
            </div>

            <div className="lg:col-span-4 border-l border-zinc-800 pl-4 sm:pl-6 space-y-3">
              <div>
                <span className="text-zinc-500 text-[10px] block">TOTAL PARAMETERS</span>
                <span className="text-lg font-bold text-white">{current.totalParams}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">BACKBONE / TRUNK</span>
                <span className="text-cyan-300 font-semibold">{current.architecture}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">OPERATIONAL STATUS</span>
                <span className="text-emerald-400 font-semibold">{current.status}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Confusion Matrix Centerpiece */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">
                CONFUSION MATRIX & MARGINAL INTENSITIES
              </span>
              <span className="text-zinc-500 text-[10px]">
                HORIZONTAL = PREDICTED • VERTICAL = TRUE ASTRONOMICAL CLASS
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div className="p-2 text-[10px] text-zinc-500 border border-transparent">Target \ Pred</div>
                  {current.classes.map((c, i) => (
                    <div key={i} className="p-2 border border-zinc-800 bg-[#060914] text-[10px] font-bold text-zinc-300 truncate">
                      {c}
                    </div>
                  ))}

                  {current.classes.map((trueClass, rIdx) => (
                    <div key={rIdx} className="contents">
                      <div className="p-2 text-left border border-zinc-800 bg-[#060914] text-[10px] font-bold text-zinc-300 truncate flex items-center">
                        {trueClass}
                      </div>
                      {current.cm[rIdx].map((val, cIdx) => {
                        const isDiag = rIdx === cIdx;
                        return (
                          <div
                            key={cIdx}
                            className={`p-3 border font-bold text-sm transition ${
                              isDiag
                                ? "bg-cyan-950/70 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : val > 0
                                ? "bg-zinc-900/40 border-zinc-800 text-zinc-400"
                                : "bg-transparent border-zinc-900 text-zinc-700"
                            }`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Per-Class Precision Ledger */}
          <div className="p-4 sm:p-6">
            <div className="pb-3 mb-3 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              PER-CLASS METRIC LEDGER
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-800">
                <thead>
                  <tr className="text-zinc-500 text-[10px]">
                    <th className="pb-2">Taxonomy Class</th>
                    <th className="pb-2">Precision</th>
                    <th className="pb-2">Recall</th>
                    <th className="pb-2">F1 Score</th>
                    <th className="pb-2">Reference Exemplar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {current.classMetrics.map((cm, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-bold text-white">{cm.class_name}</td>
                      <td className="py-2.5 text-cyan-300">{cm.precision}</td>
                      <td className="py-2.5 text-zinc-300">{cm.recall}</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{cm.f1}</td>
                      <td className="py-2.5 text-zinc-500">{cm.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-2 flex justify-end">
          <Link
            href="/analyze"
            className="px-5 py-2.5 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-wider transition"
          >
            Open Observation Workstation →
          </Link>
        </div>
      </div>
    </main>
  );
}
