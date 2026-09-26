"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface AnalysisResult {
  filename?: string;
  prediction: {
    class_id: number;
    class_name: string;
    confidence: number;
    probabilities: Record<string, number>;
    task: string;
  };
  similarity: Array<{
    rank: number;
    index: number;
    class_id: number;
    class_name: string;
    similarity: number;
    dataset: string;
  }>;
  anomaly: {
    anomaly_score: number;
    distance_to_centroid: number;
    reference_mean_distance: number;
    threshold_p95: number;
    threshold_p99: number;
    is_anomaly: boolean;
    status: string;
    interpretation: string;
    scientific_disclaimer: string;
  };
  gradcam: {
    heatmap_base64: string;
    overlay_base64: string;
    target_layer: string;
  };
  model_info?: Record<string, any>;
  dataset_info?: Record<string, any>;
}

interface PresetSample {
  id: string;
  title: string;
  image_base64: string;
}

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [topK, setTopK] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeCamTab, setActiveCamTab] = useState<"overlay" | "heatmap" | "original">("overlay");
  const [presetSamples, setPresetSamples] = useState<PresetSample[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load preset sample images from API
  useEffect(() => {
    fetch("http://localhost:8000/api/datasets/samples")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: PresetSample[]) => {
        if (data && data.length > 0) {
          setPresetSamples(data);
        }
      })
      .catch(() => {
        // Fallback default sample metadata
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setErrorMsg(null);
    }
  };

  const handlePresetSelect = async (sample: PresetSample) => {
    try {
      setPreviewUrl(sample.image_base64);
      setAnalysis(null);
      setErrorMsg(null);

      // Convert base64 to file
      const res = await fetch(sample.image_base64);
      const blob = await res.blob();
      const file = new File([blob], sample.id, { type: "image/png" });
      setSelectedFile(file);
      
      // Auto-trigger analysis
      executeAnalysis(file, topK);
    } catch (err: any) {
      setErrorMsg("Failed to load preset sample.");
    }
  };

  const executeAnalysis = async (fileToUpload: File, kVal: number) => {
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch(`http://localhost:8000/api/analyze?top_k=${kVal}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error("API error during analysis:", err);
      // Try fallback to 127.0.0.1 if localhost failed
      try {
        const fallbackRes = await fetch(`http://127.0.0.1:8000/api/analyze?top_k=${kVal}`, {
          method: "POST",
          body: formData,
        });
        if (fallbackRes.ok) {
          const data: AnalysisResult = await fallbackRes.json();
          setAnalysis(data);
          setErrorMsg(null);
          return;
        }
      } catch (retryErr) {
        // Both failed
      }
      setAnalysis(null);
      setErrorMsg("Connection Error: Could not reach the FastAPI backend at http://127.0.0.1:8000. Ensure the backend is running (`uvicorn app.main:app --port 8000`).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please upload an astronomical image or select a preset sample.");
      return;
    }
    executeAnalysis(selectedFile, topK);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Page Title */}
      <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>INTERACTIVE DEEP LEARNING WORKSPACE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Astronomical Image Analysis
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Submit a 224×224 astronomical observation. AstroLens executes ResNet18 transfer inference, 
            extracts a 512-D latent feature vector, queries Top-K nearest neighbors, evaluates morphological anomaly dispersion, 
            and computes Grad-CAM saliency maps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300">
          <span className="text-zinc-500">TASK:</span>
          <span className="text-cyan-400 font-semibold">4-Class Galaxy Morphology</span>
        </div>
      </div>

      {/* Preset Test Samples Bar */}
      {presetSamples.length > 0 && (
        <div className="mb-8 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Quick Test: Select a Held-Out GalaxyMNIST Test Sample
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              1-Click Evaluation
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {presetSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handlePresetSelect(sample)}
                className="group flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 hover:border-cyan-500/60 hover:bg-zinc-850 transition text-left"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded bg-black border border-zinc-800">
                  <img
                    src={sample.image_base64}
                    alt={sample.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <span className="mt-1.5 text-[10px] font-mono text-zinc-300 truncate w-full text-center group-hover:text-cyan-300">
                  {sample.title.replace("Sample", "#")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload & Configuration Section */}
      <form onSubmit={handleSubmit} className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Box */}
        <div className="md:col-span-2 rounded-2xl border border-dashed border-zinc-700/80 bg-[#090b12] p-6 hover:border-cyan-500/50 transition flex flex-col items-center justify-center text-center relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/fits"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-44 w-44 rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] bg-black">
                <img
                  src={previewUrl}
                  alt="Observation Input"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-xs font-mono text-cyan-300">
                {selectedFile?.name || "Observation Loaded"}
              </p>
              <span className="text-[11px] text-zinc-500">
                Click or drop another image to replace
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Drop astronomical cutout or click to browse
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Supported formats: PNG, JPG, WebP • 224×224 RGB recommended
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Inference Controls */}
        <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-4">
              Inference Parameters
            </h3>

            <div className="mb-5">
              <div className="flex justify-between text-xs font-mono text-zinc-300 mb-2">
                <span>Top-K Catalog Retrieval:</span>
                <span className="text-cyan-400 font-bold">{topK} galaxies</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>3</span>
                <span>5 (Default)</span>
                <span>10</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-3 text-[11px] font-mono text-zinc-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Architecture:</span>
                <span className="text-zinc-200">ResNet18 Transfer</span>
              </div>
              <div className="flex justify-between">
                <span>Metric Space:</span>
                <span className="text-zinc-200">512-D L2 Norm</span>
              </div>
              <div className="flex justify-between">
                <span>Anomaly Method:</span>
                <span className="text-zinc-200">Centroid Distance</span>
              </div>
              <div className="flex justify-between">
                <span>Explainability:</span>
                <span className="text-zinc-200">Grad-CAM (layer4)</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className={`w-full rounded-xl py-3.5 text-xs font-mono uppercase tracking-wider font-semibold transition shadow-lg ${
                isLoading
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : selectedFile
                  ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Running Deep Pipeline..." : "Execute Full Analysis Pipeline"}
            </button>
          </div>
        </div>
      </form>

      {/* Error / Notice banner */}
      {errorMsg && (
        <div className="mb-8 rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 text-xs font-mono text-amber-300">
          {errorMsg}
        </div>
      )}

      {/* Analysis Results Dashboard */}
      {analysis && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner Result */}
          <div className="rounded-2xl border border-cyan-800/50 bg-[#0a0d18] p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  PREDICTED MORPHOLOGICAL CLASS
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {analysis.prediction.class_name}
                  </h2>
                  <span className="rounded-md border border-cyan-500/40 bg-cyan-950/60 px-2.5 py-1 text-xs font-mono text-cyan-300">
                    ID #{analysis.prediction.class_id}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-mono">
                  Task: {analysis.prediction.task}
                </p>
              </div>

              {/* Confidence Metric */}
              <div className="flex items-center gap-4 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 block">
                    Prediction Confidence
                  </span>
                  <span className="text-2xl font-bold font-mono text-cyan-300">
                    {(analysis.prediction.confidence * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-cyan-500 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                  ✓
                </div>
              </div>
            </div>

            {/* Probability Distribution Bar Chart */}
            <div className="mt-6 border-t border-zinc-800/80 pt-6">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-3">
                Class Probability Distribution (Softmax Output)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(analysis.prediction.probabilities).map(([name, prob]) => {
                  const isWinner = name === analysis.prediction.class_name;
                  const pct = (prob * 100).toFixed(1);
                  return (
                    <div
                      key={name}
                      className={`rounded-xl border p-3 ${
                        isWinner
                          ? "border-cyan-500/60 bg-cyan-950/30"
                          : "border-zinc-800 bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className={isWinner ? "font-semibold text-cyan-300" : "text-zinc-400"}>
                          {name}
                        </span>
                        <span className={isWinner ? "font-bold text-cyan-300" : "text-zinc-300"}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isWinner ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-zinc-600"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2-Column Section: Similarity Search & Anomaly Detection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top-K Similarity Search */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                      Metric Similarity Search (Top-{topK})
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    512-D Cosine Metric Space
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-4 font-sans leading-relaxed">
                  Queries 6,399 offline-indexed reference galaxies by computing normalized cosine similarity over the penultimate ResNet feature representation.
                </p>

                <div className="space-y-2.5">
                  {analysis.similarity.map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-400">
                          #{item.rank}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">
                            {item.class_name}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-500">
                            Index: {item.index} • Dataset: {item.dataset}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {(item.similarity * 100).toFixed(2)}%
                        </span>
                        <span className="block text-[10px] font-mono text-zinc-500">
                          cos θ = {item.similarity.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>Vector Dimension: 512-D</span>
                <span>Distance Metric: Cosine</span>
              </div>
            </div>

            {/* Morphological Anomaly Detection */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                      Morphological Anomaly Analysis
                    </h3>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    analysis.anomaly.is_anomaly
                      ? "border-amber-700/60 bg-amber-950/40 text-amber-300"
                      : "border-emerald-700/60 bg-emerald-950/40 text-emerald-300"
                  }`}>
                    {analysis.anomaly.status}
                  </span>
                </div>

                {/* Score Gauge */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-mono text-zinc-400">
                      Calibrated Anomaly Score
                    </span>
                    <span className="text-2xl font-bold font-mono text-zinc-100">
                      {(analysis.anomaly.anomaly_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        analysis.anomaly.anomaly_score < 0.50
                          ? "bg-emerald-400"
                          : analysis.anomaly.anomaly_score < 0.85
                          ? "bg-amber-400"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${analysis.anomaly.anomaly_score * 100}%` }}
                    />
                  </div>
                </div>

                {/* Quantitative Distance Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300 mb-4">
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5">
                    <span className="text-zinc-500 block text-[10px]">Centroid Distance:</span>
                    <span className="font-bold text-zinc-200">{analysis.anomaly.distance_to_centroid}</span>
                  </div>
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5">
                    <span className="text-zinc-500 block text-[10px]">Class Mean Distance:</span>
                    <span className="font-bold text-zinc-200">{analysis.anomaly.reference_mean_distance}</span>
                  </div>
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5">
                    <span className="text-zinc-500 block text-[10px]">95th Percentile Bound:</span>
                    <span className="font-bold text-zinc-200">{analysis.anomaly.threshold_p95}</span>
                  </div>
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5">
                    <span className="text-zinc-500 block text-[10px]">99th Percentile Bound:</span>
                    <span className="font-bold text-zinc-200">{analysis.anomaly.threshold_p99}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
                  <strong className="text-cyan-400 font-mono">Interpretation: </strong>
                  {analysis.anomaly.interpretation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                ⚠️ {analysis.anomaly.scientific_disclaimer}
              </div>
            </div>
          </div>

          {/* Explainable AI (Grad-CAM) Section */}
          <div className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                    Explainable AI: Grad-CAM Activation Saliency
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Gradient-weighted class activation mapping computed on <code className="text-cyan-400 font-mono">{analysis.gradcam.target_layer}</code>.
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCamTab("overlay")}
                  className={`rounded px-3 py-1 transition ${
                    activeCamTab === "overlay"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Saliency Overlay
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCamTab("heatmap")}
                  className={`rounded px-3 py-1 transition ${
                    activeCamTab === "heatmap"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Jet Heatmap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCamTab("original")}
                  className={`rounded px-3 py-1 transition ${
                    activeCamTab === "original"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Original Cutout
                </button>
              </div>
            </div>

            {/* Display Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center">
                <div className="h-56 w-56 rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                  <img
                    src={previewUrl || ""}
                    alt="Original observation"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-2 text-xs font-mono text-zinc-400">1. Original Cutout</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-56 w-56 rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                  <img
                    src={analysis.gradcam.heatmap_base64}
                    alt="Grad-CAM Heatmap"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-2 text-xs font-mono text-zinc-400">2. Normalized Jet Heatmap</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-56 w-56 rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-black shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <img
                    src={analysis.gradcam.overlay_base64}
                    alt="Grad-CAM Overlay"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-2 text-xs font-mono text-cyan-300 font-semibold">3. Fused Saliency Overlay</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono text-zinc-400 leading-relaxed">
              <span className="text-cyan-400 font-bold">Grad-CAM Scientific Analysis: </span>
              High activation zones (warm red/yellow colors) denote the spatial receptive fields in the final convolutional layer that exerted greatest positive gradients toward class <strong className="text-zinc-200 font-semibold">{analysis.prediction.class_name}</strong>. Centralized intensity corresponds to core galactic bulges, while peripheral arc activations trace resolved spiral pitch or high-inclination disk silhouettes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}