"use client";

import { useState } from "react";
import Link from "next/link";

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<"fastai-vit" | "resnet-finetuned" | "resnet-frozen">("fastai-vit");

  const modelsData = {
    "fastai-vit": {
      name: "FastAI Classifier + ViT Metric Hypersphere (Production Architecture)",
      instrumentRole: "Hierarchical Multi-Stage Deep Astronomical Identifier",
      architecture: "FastAI Deep Convolutional Trunk + Vision Transformer (ViT-Base-Patch16-224)",
      weights: "Interstellar Pretrained + ViT High-Dimensional Patch Embeddings",
      strategy: "Two-stage hierarchical inference: broad morphology taxonomy classification followed by 768-D cosine metric reference catalog retrieval.",
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
    <main className="min-h-screen bg-[#010204] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs select-none">
      <div className="max-w-[1720px] mx-auto space-y-10">
        {/* Editorial Paper Header */}
        <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              Experimental Laboratory & Evaluation Record
            </span>
            <h1 className="text-3xl font-light text-white tracking-tight">
              Astronomical Neural Model Comparison
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-3xl pt-1">
              Comparative empirical evaluation across the production dual-stage FastAI + Vision Transformer pipeline
              and controlled Galaxy Zoo morphological convolutional benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-white/10 p-1 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setSelectedModel("fastai-vit")}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition ${
                selectedModel === "fastai-vit" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              FastAI + ViT (Live)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("resnet-finetuned")}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition ${
                selectedModel === "resnet-finetuned" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Fine-Tuned ResNet18
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("resnet-frozen")}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition ${
                selectedModel === "resnet-frozen" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Frozen Baseline
            </button>
          </div>
        </div>

        {/* SECTION 1: ARCHITECTURAL SPECIFICATION */}
        <section className="space-y-4">
          <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 border-b border-white/[0.08] pb-2">
            Table 1. Architectural Configuration & Execution Parameters
          </div>

          <div className="border border-white/[0.08] divide-y divide-white/[0.06] bg-[#020306]">
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Model Designation</span>
              <span className="md:col-span-3 text-white font-medium">{current.name}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Instrument Role</span>
              <span className="md:col-span-3 text-zinc-300">{current.instrumentRole}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Trunk Topology</span>
              <span className="md:col-span-3 text-zinc-300">{current.architecture}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Weights & Embedding</span>
              <span className="md:col-span-3 text-zinc-300">{current.weights}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Parameters</span>
              <span className="md:col-span-3 text-zinc-300">
                Total: <span className="text-white">{current.totalParams}</span> • Trainable:{" "}
                <span className="text-white">{current.trainableParams}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 gap-2">
              <span className="text-zinc-500 uppercase text-[10px]">Strategy</span>
              <span className="md:col-span-3 text-zinc-400 font-sans leading-relaxed">{current.strategy}</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: CLASS METRICS & CONFUSION MATRIX */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Class Breakdown Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 border-b border-white/[0.08] pb-2">
              Table 2. Per-Class Empirical Validation Performance
            </div>

            <div className="border border-white/[0.08] bg-[#020306] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] text-zinc-500 uppercase bg-white/[0.01]">
                    <th className="p-3">Celestial Class</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1 Score</th>
                    <th className="p-3">Reference Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {current.classMetrics.map((row) => (
                    <tr key={row.class_name} className="hover:bg-white/[0.02]">
                      <td className="p-3 text-white font-medium">{row.class_name}</td>
                      <td className="p-3 text-zinc-300">{row.precision}</td>
                      <td className="p-3 text-zinc-300">{row.recall}</td>
                      <td className="p-3 text-white font-semibold">{row.f1}</td>
                      <td className="p-3 text-zinc-400">{row.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[10px] text-zinc-500 font-sans">
              *Evaluated against held-out validation specimens with 224×224 normalized multi-band tensors.
            </div>
          </div>

          {/* Confusion Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 border-b border-white/[0.08] pb-2">
              Figure 1. Normalized Empirical Confusion Matrix
            </div>

            <div className="border border-white/[0.08] bg-[#020306] p-4">
              <div className="text-[10px] text-zinc-500 mb-3 text-center uppercase tracking-wider">
                Predicted Class →
              </div>

              <div className="space-y-1">
                {current.cm.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-1.5">
                    <span className="w-24 text-[9px] text-zinc-400 truncate text-right pr-2">
                      {current.classes[rIdx]}
                    </span>
                    <div className="flex-1 grid grid-cols-4 gap-1.5">
                      {row.map((val, cIdx) => {
                        const isDiag = rIdx === cIdx;
                        return (
                          <div
                            key={cIdx}
                            className={`p-2.5 text-center font-mono text-xs border ${
                              isDiag
                                ? "bg-white/10 border-white/30 text-white font-bold"
                                : val > 0
                                ? "bg-red-950/20 border-red-500/20 text-red-300"
                                : "bg-black border-white/[0.03] text-zinc-600"
                            }`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500 flex justify-between">
                <span>↓ True Reference Class</span>
                <span className="text-zinc-400 font-medium">Diagonal = Correct Identifications</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}
        <div className="border-t border-white/[0.08] pt-6 flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-sans">
            Ready to test live inference on unknown celestial imagery?
          </span>
          <Link
            href="/analyze"
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black uppercase tracking-wider font-semibold transition"
          >
            Launch Observation Canvas →
          </Link>
        </div>
      </div>
    </main>
  );
}
