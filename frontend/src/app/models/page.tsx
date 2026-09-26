"use client";

import { useState } from "react";

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<"resnet-finetuned" | "resnet-frozen" | "cnn-scratch">("resnet-finetuned");

  const modelsData = {
    "resnet-finetuned": {
      name: "Pretrained ResNet18 (Full Fine-Tuning)",
      type: "Transfer Learning (Production Model)",
      architecture: "ResNet18 (Residual Network)",
      weights: "ImageNet Pretrained Initialization",
      strategy: "End-to-End Fine-Tuning with AdamW (lr=1e-4, weight_decay=1e-4, 10 epochs)",
      totalParams: "11,178,564",
      trainableParams: "11,178,564",
      accuracy: "89.95%",
      macroPrecision: "90.11%",
      macroRecall: "90.00%",
      macroF1: "90.01%",
      weightedF1: "89.96%",
      valAccuracy: "90.63%",
      status: "Production Standard",
      cm: [
        [490, 0, 0, 17],
        [0, 420, 86, 0],
        [4, 54, 439, 10],
        [15, 2, 13, 450]
      ],
      classMetrics: [
        { class_name: "Smooth Round", precision: "96.27%", recall: "96.65%", f1: "96.46%", support: 507 },
        { class_name: "Smooth Cigar", precision: "88.24%", recall: "83.00%", f1: "85.54%", support: 506 },
        { class_name: "Edge-on Disk", precision: "81.60%", recall: "86.59%", f1: "84.02%", support: 507 },
        { class_name: "Unbarred Spiral", precision: "94.34%", recall: "93.75%", f1: "94.04%", support: 480 },
      ]
    },
    "resnet-frozen": {
      name: "Pretrained ResNet18 (Frozen Feature Extractor)",
      type: "Transfer Learning (Linear Probe Baseline)",
      architecture: "ResNet18 (Frozen Convolutional Trunk)",
      weights: "ImageNet Pretrained (Frozen conv1-layer4)",
      strategy: "Feature Extraction: Frozen backbone, only train linear head 512→4 with Adam (lr=1e-3, 5 epochs)",
      totalParams: "11,178,564",
      trainableParams: "2,052",
      accuracy: "72.80%",
      macroPrecision: "73.20%",
      macroRecall: "72.90%",
      macroF1: "72.71%",
      weightedF1: "72.65%",
      valAccuracy: "73.33%",
      status: "Controlled Benchmark",
      cm: [
        [406, 26, 6, 69],
        [27, 371, 81, 27],
        [13, 165, 294, 35],
        [53, 22, 20, 385]
      ],
      classMetrics: [
        { class_name: "Smooth Round", precision: "81.36%", recall: "80.08%", f1: "80.72%", support: 507 },
        { class_name: "Smooth Cigar", precision: "63.53%", recall: "73.32%", f1: "68.07%", support: 506 },
        { class_name: "Edge-on Disk", precision: "73.32%", recall: "57.99%", f1: "64.76%", support: 507 },
        { class_name: "Unbarred Spiral", precision: "74.61%", recall: "80.21%", f1: "77.31%", support: 480 },
      ]
    },
    "cnn-scratch": {
      name: "Custom GalaxyCNN (Trained from Scratch)",
      type: "Supervised Baseline (No Transfer Learning)",
      architecture: "Custom 3-Block CNN (Conv2D-ReLU-MaxPool × 3 + Dense Head)",
      weights: "Kaiming / Xavier Random Initialization",
      strategy: "Full scratch optimization using Adam (lr=1e-3, 10 epochs)",
      totalParams: "25,804,548",
      trainableParams: "25,804,548",
      accuracy: "78.95%",
      macroPrecision: "79.08%",
      macroRecall: "78.98%",
      macroF1: "79.01%",
      weightedF1: "78.96%",
      valAccuracy: "79.44%",
      status: "Baseline Benchmark",
      cm: [
        [452, 0, 3, 52],
        [1, 376, 127, 2],
        [9, 123, 360, 15],
        [55, 17, 17, 391]
      ],
      classMetrics: [
        { class_name: "Smooth Round", precision: "87.43%", recall: "89.15%", f1: "88.28%", support: 507 },
        { class_name: "Smooth Cigar", precision: "72.87%", recall: "74.31%", f1: "73.58%", support: 506 },
        { class_name: "Edge-on Disk", precision: "70.73%", recall: "71.01%", f1: "70.87%", support: 507 },
        { class_name: "Unbarred Spiral", precision: "85.00%", recall: "81.46%", f1: "83.19%", support: 480 },
      ]
    }
  };

  const current = modelsData[selectedModel];
  const classes = ["Smooth Round", "Smooth Cigar", "Edge-on Disk", "Unbarred Spiral"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>EMPIRICAL BENCHMARKS & EXPERIMENTAL EVALUATION</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Model Performance & Transfer Learning Evaluation
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
            Empirical evaluation across 2,000 held-out GalaxyMNIST test samples. 
            Demonstrates a controlled academic comparison between a CNN trained from scratch, 
            a frozen-backbone feature extractor, and full end-to-end transfer learning fine-tuning.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300">
          <span>TEST SAMPLES:</span>
          <span className="text-cyan-400 font-bold">2,000 Cutouts</span>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(Object.keys(modelsData) as Array<keyof typeof modelsData>).map((key) => {
          const m = modelsData[key];
          const isSelected = selectedModel === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedModel(key)}
              className={`rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isSelected ? "border-cyan-500/40 text-cyan-300 bg-cyan-900/40" : "border-zinc-800 text-zinc-400 bg-zinc-900"
                }`}>
                  {m.type}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {m.accuracy}
                </span>
              </div>
              <h3 className={`text-sm font-semibold mt-2 ${isSelected ? "text-cyan-200" : "text-zinc-200"}`}>
                {m.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Macro F1: {m.macroF1} • Params: {m.totalParams}
              </p>
            </button>
          );
        })}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Held-Out Test Acc</span>
          <span className="text-xl font-bold font-mono text-cyan-400">{current.accuracy}</span>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Validation Acc</span>
          <span className="text-xl font-bold font-mono text-zinc-200">{current.valAccuracy}</span>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Macro Precision</span>
          <span className="text-xl font-bold font-mono text-zinc-200">{current.macroPrecision}</span>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Macro Recall</span>
          <span className="text-xl font-bold font-mono text-zinc-200">{current.macroRecall}</span>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Macro F1 Score</span>
          <span className="text-xl font-bold font-mono text-cyan-300">{current.macroF1}</span>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#090b12] p-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Weighted F1</span>
          <span className="text-xl font-bold font-mono text-zinc-200">{current.weightedF1}</span>
        </div>
      </div>

      {/* Deep Learning Architectural Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Confusion Matrix Visualizer */}
        <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Confusion Matrix: {current.name}
              </h3>
              <p className="text-xs text-zinc-400">Actual (Rows) vs Predicted (Columns)</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">2,000 Evaluations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-2 text-left text-[11px]">True \ Pred</th>
                  {classes.map((c) => (
                    <th key={c} className="pb-2 text-[10px] px-2 truncate max-w-[80px]">
                      {c.replace("Smooth ", "S. ").replace("Edge-on ", "E. ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-200">
                {current.cm.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="py-3 text-left font-semibold text-zinc-400 text-[11px] truncate max-w-[120px]">
                      {classes[rIdx]}
                    </td>
                    {row.map((cell, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      const intensity = cell / 500;
                      return (
                        <td
                          key={cIdx}
                          className={`py-3 px-2 font-bold ${
                            isDiagonal
                              ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                              : cell > 50
                              ? "bg-amber-950/30 text-amber-300"
                              : "text-zinc-500"
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed font-sans">
            <span className="text-cyan-400 font-mono font-semibold">Diagonal Insight: </span>
            Values on the highlighted diagonal indicate correct morphological classifications. Notice that the highest off-diagonal confusion occurs between <strong>Smooth Cigar (Class 1)</strong> and <strong>Edge-on Disk (Class 2)</strong>.
          </div>
        </div>

        {/* Per-Class Metrics Table */}
        <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6">
          <div className="border-b border-zinc-800 pb-3 mb-6">
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Class-Wise Detailed Precision & Recall
            </h3>
            <p className="text-xs text-zinc-400">Morphological archetype breakdown on held-out test data.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3">Morphological Class</th>
                  <th className="pb-3 text-right">Precision</th>
                  <th className="pb-3 text-right">Recall</th>
                  <th className="pb-3 text-right">F1-Score</th>
                  <th className="pb-3 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {current.classMetrics.map((item) => (
                  <tr key={item.class_name}>
                    <td className="py-3 font-semibold text-zinc-200">{item.class_name}</td>
                    <td className="py-3 text-right text-zinc-300">{item.precision}</td>
                    <td className="py-3 text-right text-zinc-300">{item.recall}</td>
                    <td className="py-3 text-right font-bold text-cyan-300">{item.f1}</td>
                    <td className="py-3 text-right text-zinc-500">{item.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-400 leading-relaxed font-sans">
            <span className="text-cyan-400 font-mono font-semibold">Highest Performing Class: </span>
            <strong>Smooth Round (F1: {current.classMetrics[0].f1})</strong> achieves the highest precision and recall due to radial symmetry and distinctive concentrated core luminosity.
          </div>
        </div>
      </div>

      {/* Astrophysical Error Analysis & Scientific Discussion */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
        <h3 className="text-base font-semibold text-white mb-2">
          Astrophysical Error Analysis & Morphology Degeneracy
        </h3>
        <p className="text-xs text-zinc-400 mb-6 font-mono">
          Scientific interpretation of model errors and misclassification dynamics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300 leading-relaxed font-sans">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
            <h4 className="font-semibold text-cyan-300 font-mono mb-2">
              1. The Cigar vs Edge-on Disk Ambiguity (86 Confusions in ResNet18)
            </h4>
            <p>
              Both Smooth Cigar (elliptical galaxies with high eccentricity) and Edge-on Disk galaxies project as elongated, high-aspect-ratio light distributions. At 224×224 pixel resolution with standard seeing limitations, unresolved dust lanes or low-contrast disk flaring can render an edge-on lenticular/spiral disk visually indistinguishable from a prolate elliptical galaxy.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
            <h4 className="font-semibold text-cyan-300 font-mono mb-2">
              2. Why Fine-Tuning Outperformed Frozen Backbone by +17.15%
            </h4>
            <p>
              Natural ImageNet images feature sharp textures, distinct edges, and object boundaries (dogs, vehicles, chairs). In contrast, astronomical objects are diffuse continuous light fields governed by exponential disk profiles and Sérsic distributions. Freezing the convolutional trunk forces the model to rely on terrestrial high-level priors; end-to-end fine-tuning enables the receptive fields to specialize in stellar bulges and spiral arm pitch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
