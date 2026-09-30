"use client";

import { useEffect, useState } from "react";
import ObservationViewer from "@/components/ObservationViewer";
import ScientificProfile from "@/components/ScientificProfile";
import SkyExplorer from "@/components/SkyExplorer";
import ObservationArchive, { ArchivePlate } from "@/components/ObservationArchive";
import { AnalysisResult } from "@/components/ObservationReadout";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activePlateId, setActivePlateId] = useState<string | null>(null);
  const [backendState, setBackendState] = useState<string>("CONNECTING");

  // Health check on mount
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setBackendState(data.gpu_name || data.device || "ACTIVE");
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

  const resolvedName = analysis?.identification.object || analysis?.scientific_information?.name;
  const resolvedCatalog = analysis?.scientific_information?.catalog_id;
  const resolvedClass = analysis?.classification.class;
  const resolvedRa = analysis?.scientific_information?.ra ?? analysis?.visualization?.ra;
  const resolvedDec = analysis?.scientific_information?.dec ?? analysis?.visualization?.dec;

  return (
    <div className="min-h-screen bg-[#010204] text-zinc-100 flex flex-col">
      {/* Minimal Instrument Subheader */}
      <div className="border-b border-white/[0.08] bg-[#020306] px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
            Observation Canvas
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-white font-medium">
            {previewName || "Awaiting Astronomical Plate"}
          </span>
        </div>

        <div className="flex items-center gap-5 text-[11px] text-zinc-500">
          <span>
            STATE:{" "}
            <span
              className={
                isLoading
                  ? "text-cyan-400 font-semibold"
                  : analysis
                  ? "text-emerald-400 font-semibold"
                  : "text-zinc-400"
              }
            >
              {isLoading ? "ANALYZING..." : analysis ? "RESOLVED" : "STANDBY"}
            </span>
          </span>
          <span className="hidden sm:inline">
            ENGINE: <span className="text-zinc-300">{backendState}</span>
          </span>
        </div>
      </div>

      {/* Archival Specimen Contact Strip */}
      <ObservationArchive
        onSelectPlate={handleSelectPlate}
        activeId={activePlateId}
        isLoading={isLoading}
      />

      {/* Main Scientific Observation Stage */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* HERO SECTION: Photographic Observation & Scientific Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Photographic Observation Hero Canvas (7 cols on large desktop, dominates viewport) */}
          <div className="lg:col-span-8 flex flex-col">
            <ObservationViewer
              imageUrl={previewUrl}
              objectName={resolvedName}
              catalogId={resolvedCatalog}
              classification={resolvedClass}
              ra={resolvedRa}
              dec={resolvedDec}
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
            />
          </div>

          {/* Scientific Profile Rail (4 cols beside image, direct image->object->data communication) */}
          <div className="lg:col-span-4 flex flex-col">
            <ScientificProfile
              analysis={analysis}
              isLoading={isLoading}
              activeStage={activeStage}
              onExecute={() => executeAnalysis()}
              canExecute={Boolean(selectedFile)}
              errorMsg={errorMsg}
            />
          </div>
        </section>

        {/* CELESTIAL POSITION EXPLORATION SECTION */}
        <section className="pt-2">
          <SkyExplorer
            objectName={resolvedName}
            catalogId={resolvedCatalog}
            objectType={analysis?.scientific_information?.type}
            ra={resolvedRa}
            dec={resolvedDec}
          />
        </section>
      </main>
    </div>
  );
}