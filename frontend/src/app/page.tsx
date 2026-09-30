import Link from "next/link";

export default function Home() {
  const workflowStages = [
    {
      step: "STAGE 01",
      name: "ACQUIRE IMAGE",
      instrument: "Telescope / Sensor Cutout",
      detail: "Direct optical or CCD photographic plate intake across multi-band wavelengths.",
    },
    {
      step: "STAGE 02",
      name: "FASTAI CLASSIFICATION",
      instrument: "Convolutional Classifier",
      detail: "Deep model resolves broad celestial taxonomy (Spiral, Elliptical, Nebula, Star, Planet).",
    },
    {
      step: "STAGE 03",
      name: "VIT FEATURE EMBEDDING",
      instrument: "Vision Transformer Metric Space",
      detail: "High-dimensional visual representation matched against indexed reference astronomical catalogs.",
    },
    {
      step: "STAGE 04",
      name: "SIMBAD ASTROMETRY",
      instrument: "CDS Astronomical Database",
      detail: "Direct catalog cross-matching retrieves designated name, Messier/NGC IDs, and morphological type.",
    },
    {
      step: "STAGE 05",
      name: "CELESTIAL ATLAS PROJECTION",
      instrument: "Equatorial Coordinate System",
      detail: "Astrometric Right Ascension (RA) and Declination (DEC) plotted on the J2000 celestial sphere.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020306] text-zinc-100 flex flex-col font-sans">
      {/* OBSERVATORY CONSOLE HERO */}
      <section className="relative border-b border-zinc-800 bg-[#03050b] pt-8 pb-14 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Console Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 mb-8 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-zinc-200 font-bold uppercase tracking-wider">ASTRONOMICAL OBSERVATION CONSOLE</span>
              <span className="text-zinc-600">//</span>
              <span className="text-zinc-400">ASTROLENS CORE</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>SYSTEM: ICRS EQUATORIAL</span>
              <span>EPOCH: J2000.0</span>
              <span className="text-emerald-400 font-semibold">● INFERENCE ENGINE ONLINE</span>
            </div>
          </div>

          {/* Hero Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-2.5 py-0.5 border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-cyan-400 uppercase tracking-widest">
                Scientific Image Analysis System
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                ASTROLENS
              </h1>

              {/* The Core Question */}
              <div className="border-l-2 border-cyan-400/80 pl-4 py-1">
                <p className="text-2xl sm:text-3xl font-serif italic text-cyan-100">
                  “I have a space image. What am I looking at?”
                </p>
                <p className="mt-2 text-xs font-mono text-zinc-400 leading-relaxed max-w-xl">
                  AstroLens is a scientific instrumentation system that accepts arbitrary astronomical imagery, 
                  classifies celestial morphology via deep neural networks, identifies specific catalog targets through 
                  Vision Transformer embeddings, and resolves astrometric sky coordinates via CDS SIMBAD.
                </p>
              </div>

              {/* CTA Console Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
                <Link
                  href="/analyze"
                  className="px-6 py-3 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Enter Observation Workstation →
                </Link>
                <Link
                  href="/methodology"
                  className="px-5 py-3 border border-zinc-800 bg-[#050811] hover:border-zinc-600 text-zinc-300 font-semibold uppercase tracking-wider transition"
                >
                  Inspect Pipeline
                </Link>
                <Link
                  href="/models"
                  className="px-5 py-3 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white uppercase transition"
                >
                  Instruments
                </Link>
              </div>
            </div>

            {/* Right Telescope Focal Display */}
            <div className="lg:col-span-6">
              <div className="border border-zinc-800 bg-[#010204] p-3 text-xs font-mono">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[10px] text-zinc-500">
                  <span>TELESCOPE FOV: M31 ANDROMEDA REGION</span>
                  <span>SURVEY: SDSS / 2MASS OPTICAL</span>
                </div>

                {/* Telescope Image Well */}
                <div className="relative h-72 sm:h-96 w-full bg-black overflow-hidden flex items-center justify-center border border-zinc-800/80">
                  <img
                    src="/astronomy/m31_gendler_2700.jpg"
                    alt="Messier 31 Andromeda Galaxy"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* Subtle Celestial Measurement Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-24 h-24 border border-cyan-400/40 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="absolute top-0 bottom-0 w-[1px] bg-cyan-400/15" />
                    <div className="absolute left-0 right-0 h-[1px] bg-cyan-400/15" />
                  </div>

                  {/* Target Coordinates Overlay */}
                  <div className="absolute bottom-3 left-3 bg-[#03060c]/90 border border-zinc-800 p-2 text-[10px] space-y-0.5">
                    <div className="text-white font-bold">TARGET: M31 (NGC 224)</div>
                    <div className="text-cyan-300">RA 10.6847° • DEC +41.2688°</div>
                    <div className="text-zinc-500">TYPE: SPIRAL GALAXY (SA)</div>
                  </div>
                </div>

                {/* Telemetry Footer */}
                <div className="flex items-center justify-between pt-2 mt-1 text-[10px] text-zinc-500">
                  <span>MAGNITUDE: 3.44</span>
                  <span>SIMBAD PARALLAX RESOLVED</span>
                  <span>EPOCH: J2000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEQUENTIAL OBSERVATION PIPELINE STRIP */}
      <section className="py-12 px-4 sm:px-6 border-b border-zinc-800 bg-[#020408]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-2 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                ANALYSIS PIPELINE
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
                From Raw Astronomical Photons to Celestial Positioning
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              5-STAGE SEQUENTIAL INFERENCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {workflowStages.map((stage, idx) => (
              <div
                key={idx}
                className="border border-zinc-800/80 bg-[#04060c] p-4 flex flex-col justify-between hover:border-zinc-600 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
                    <span className="text-cyan-400 font-bold">{stage.step}</span>
                    <span>→</span>
                  </div>
                  <h3 className="font-mono text-xs font-bold text-white tracking-wider">
                    {stage.name}
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-400 mt-1">
                    {stage.instrument}
                  </p>
                  <p className="font-sans text-xs text-zinc-400 mt-2.5 leading-relaxed">
                    {stage.detail}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-zinc-900 text-[9px] font-mono text-zinc-600">
                  STEP {idx + 1} OF 5
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION WORKSTATION BANNER */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto border border-zinc-800 bg-[#03060c] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              LIVE OBSERVATION READY
            </span>
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">
              Ready to identify an unknown celestial image?
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1 max-w-xl">
              Load an astronomical photo or explore benchmark reference plates (M31, M42, Jupiter, M87) 
              in the optical workstation.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-6 py-3 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
          >
            Launch Observation Workstation →
          </Link>
        </div>
      </section>
    </main>
  );
}