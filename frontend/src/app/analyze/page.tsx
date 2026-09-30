"use client";

import { useEffect, useState } from "react";
import AstronomicalImageViewer from "@/components/AstronomicalImageViewer";
import CelestialSkyChart from "@/components/CelestialSkyChart";
import ObservationArchive, { ArchivePlate } from "@/components/ObservationArchive";
import ObservationReadout, { AnalysisResult } from "@/components/ObservationReadout";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activePlateId, setActivePlateId] = useState<string | null>(null);
  const [backendState, setBackendState] = useState<string>("DETECTING");

  // Health check on mount
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setBackendState(data.gpu_name || data.device || "ONLINE");
        } else {
          setBackendState("STANDBY");
        }
      })
      .catch(() => setBackendState("STANDBY"));
  }, []);

  // Progressive loading stages
  useEffect(() => {
    if (isLoading) {
      setActiveStage(1);
      const interval = setInterval(() => {
        setActiveStage((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(interval);
    } else {
      setActiveStage(0);
    }
  }, [isLoading]);

  // Handle file selection from drop/browse
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewName(file.name);
    setActivePlateId(null);
    setAnalysis(null);
    setErrorMsg(null);
  };

  // Handle selecting an archival plate
  const handleSelectPlate = async (plate: ArchivePlate) => {
    try {
      setActivePlateId(plate.id);
      setPreviewUrl(plate.imageUrl);
      setPreviewName(`${plate.catalogId} — ${plate.designation}`);
      setErrorMsg(null);
      setAnalysis(null);

      // Fetch blob to create real File object for backend analysis
      const res = await fetch(plate.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${plate.catalogId.toLowerCase()}_sample.jpg`, {
        type: blob.type || "image/jpeg",
      });
      setSelectedFile(file);
      await executeAnalysis(file);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load archival plate");
    }
  };

  // Execute inference against FastAPI backend
  const executeAnalysis = async (fileToAnalyze?: File) => {
    const targetFile = fileToAnalyze || selectedFile;
    if (!targetFile) return;

    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", targetFile);

    try {
      let response: Response;
      try {
        response = await fetch("http://localhost:8000/api/analyze", {
          method: "POST",
          body: formData,
        });
      } catch {
        response = await fetch("http://127.0.0.1:8000/api/analyze", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`Inference returned HTTP status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);
    } catch (err: unknown) {
      console.error("AstroLens inference error:", err);
      setErrorMsg("Connection Error: Could not reach the AstroLens inference backend at http://localhost:8000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020306] text-zinc-100 flex flex-col">
      {/* COMPACT SCIENTIFIC HEADER */}
      <header className="border-b border-zinc-800 bg-[#03060c] px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold tracking-wider uppercase">OBSERVATION WORKSTATION</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline truncate max-w-sm">
            {previewName ? `TARGET: ${previewName}` : "STAGE: READY"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span>
            STATUS:{" "}
            <span className={isLoading ? "text-cyan-400" : analysis ? "text-emerald-400" : "text-zinc-400"}>
              {isLoading ? "INFERRING..." : analysis ? "RESOLVED" : "STANDBY"}
            </span>
          </span>
          <span className="hidden md:inline">
            BACKEND: <span className="text-zinc-300">{backendState}</span>
          </span>
          <span className="hidden lg:inline text-zinc-600">FASTAI + VIT + SIMBAD</span>
        </div>
      </header>

      {/* ARCHIVAL STRIP */}
      <ObservationArchive
        onSelectPlate={handleSelectPlate}
        activeId={activePlateId}
        isLoading={isLoading}
      />

      {/* MAIN TWO-PART WORKSPACE */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto p-3 sm:p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* PRIMARY: Astronomical Image Viewer (7 cols) */}
          <section className="lg:col-span-7 flex flex-col">
            <AstronomicalImageViewer
              imageUrl={previewUrl}
              imageName={previewName}
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
            />
          </section>

          {/* SECONDARY: Observation Readout (5 cols) */}
          <section className="lg:col-span-5 flex flex-col">
            <ObservationReadout
              analysis={analysis}
              isLoading={isLoading}
              activeStage={activeStage}
              onExecute={() => executeAnalysis()}
              canExecute={Boolean(selectedFile)}
              errorMsg={errorMsg}
            />
          </section>
        </div>

        {/* CELESTIAL SKY ATLAS SECTION */}
        <section className="pt-2">
          <CelestialSkyChart
            objectName={analysis?.identification.object || analysis?.scientific_information?.name}
            catalogId={analysis?.scientific_information?.catalog_id}
            objectType={analysis?.scientific_information?.type}
            ra={analysis?.scientific_information?.ra ?? analysis?.visualization?.ra}
            dec={analysis?.scientific_information?.dec ?? analysis?.visualization?.dec}
          />
        </section>
      </main>
    </div>
  );
}