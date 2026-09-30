"use client";

import Link from "next/link";

export default function MethodologyPage() {
  const pipelineNodes = [
    {
      stage: "01",
      title: "OPTICAL IMAGE INTAKE",
      instrument: "Telescope / CCD Sensor Frame",
      inputSignal: "RGB / Multi-band FITS or JPEG/PNG",
      outputSignal: "Normalized Tensor x ∈ ℝ^{3 × 224 × 224}",
      math: "x_{\\text{norm}} = \\frac{x - \\mu}{\\sigma}, \\quad \\mu=[0.485, 0.456, 0.406]",
      desc: "Ingestion of arbitrary astronomical imagery from ground-based or space-borne telescopes. Standard astronomical contrast normalization, centering, and bicubic interpolation to 224×224 input tensors.",
    },
    {
      stage: "02",
      title: "HIERARCHICAL CLASSIFICATION",
      instrument: "FastAI Deep Convolutional Network",
      inputSignal: "x_{\\text{norm}} ∈ ℝ^{3 × 224 × 224}",
      outputSignal: "Taxonomy Class C ∈ {Spiral, Elliptical, Nebula, Star, Planet}",
      math: "P(C_k | x) = \\frac{\\exp(z_k)}{\\sum_j \\exp(z_j)}, \\quad \\text{Confidence} = \\max_k P(C_k | x)",
      desc: "Deep convolutional architecture trained on extensive astronomical survey plates to categorize the observation into broad celestial morphology classes with calibrated posterior probabilities.",
    },
    {
      stage: "03",
      title: "METRIC EMBEDDING EXTRACTION",
      instrument: "Vision Transformer (ViT-Base-Patch16-224)",
      inputSignal: "196 Patch Tokens (16×16 px)",
      outputSignal: "768-D Unit Hypersphere Vector ẑ ∈ 𝕊^{767}",
      math: "z = \\text{ViT}(x) \\in \\mathbb{R}^{768}, \\quad \\hat{z} = \\frac{z}{\\|z\\|_2} \\in \\mathbb{S}^{767}",
      desc: "Extraction of global attention embeddings capturing fine morphological structures (spiral arms, dust filaments, ionization fronts, planetary disks) mapped onto a high-dimensional unit hypersphere.",
    },
    {
      stage: "04",
      title: "CATALOG REFERENCE RETRIEVAL",
      instrument: "Cosine Metric Indexing Engine",
      inputSignal: "Latent Vector ẑ ∈ 𝕊^{767}",
      outputSignal: "Nearest Neighbor Catalog Match & Similarity Score",
      math: "S(x, x_{\\text{ref}}) = \\hat{z} \\cdot \\hat{z}_{\\text{ref}} = \\cos(\\theta)",
      desc: "Sub-millisecond cosine vector similarity ranking against indexed canonical reference plates (Messier, NGC, solar system targets). Matches exceeding the calibrated threshold resolve specific target identity.",
    },
    {
      stage: "05",
      title: "CDS SIMBAD ASTROMETRY",
      instrument: "Centre de Données astronomiques de Strasbourg",
      inputSignal: "Resolved Catalog Designation (e.g. M31, M42)",
      outputSignal: "Primary Name, Catalog Cross-IDs, Type, RA (α), DEC (δ)",
      math: "(\\alpha, \\delta)_{J2000} = \\text{QuerySIMBAD}(\\text{Designation})",
      desc: "Automated query against the official CDS SIMBAD astronomical database retrieves standard catalog cross-identifications, morphological classifications, and ICRS equatorial coordinates.",
    },
    {
      stage: "06",
      title: "CELESTIAL ATLAS PROJECTION",
      instrument: "Equatorial J2000 Coordinate System",
      inputSignal: "Right Ascension α ∈ [0, 360°], Declination δ ∈ [−90°, +90°]",
      outputSignal: "Interactive Astrometric Sky Chart Projection",
      math: "X = \\cos(\\delta)\\cos(\\alpha), \\; Y = \\cos(\\delta)\\sin(\\alpha), \\; Z = \\sin(\\delta)",
      desc: "Astrometric projection plotting the resolved celestial target within its surrounding night-sky context, orienting researchers relative to the celestial equator and constellation asterisms.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#010204] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs select-none">
      <div className="max-w-[1720px] mx-auto space-y-10">
        {/* Document Header */}
        <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              Scientific Instrumentation Research Paper
            </span>
            <h1 className="text-3xl font-light text-white tracking-tight">
              AstroLens Inference Pipeline Architecture
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-3xl pt-1">
              Technical specification of the multi-stage machine learning and astrometric pipeline:
              from optical pixel ingestion to high-dimensional metric retrieval and CDS SIMBAD positioning.
            </p>
          </div>

          <div className="text-zinc-500 text-[11px] font-mono">
            PIPELINE: FASTAI + VIT + SIMBAD • EPOCH: J2000.0
          </div>
        </div>

        {/* SECTION 1: SEQUENTIAL PIPELINE NODES */}
        <section className="space-y-6">
          <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 border-b border-white/[0.08] pb-2">
            Figure 1. Sequential Transformation Pipeline
          </div>

          <div className="space-y-4">
            {pipelineNodes.map((node) => (
              <div
                key={node.stage}
                className="border border-white/[0.08] bg-[#020306] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:border-white/20 transition-colors"
              >
                {/* Stage Header (3 cols) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-semibold mb-1">
                    <span>STAGE {node.stage}</span>
                  </div>
                  <h2 className="text-base text-white font-medium">{node.title}</h2>
                  <div className="text-xs text-zinc-400 font-sans mt-0.5">{node.instrument}</div>
                </div>

                {/* Mathematical Formulation (4 cols) */}
                <div className="lg:col-span-4 bg-black/60 border border-white/[0.06] p-3 space-y-2">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Mathematical Formulation
                  </div>
                  <div className="text-[11px] text-zinc-200 font-mono overflow-x-auto py-1">
                    {node.math}
                  </div>
                  <div className="pt-2 border-t border-white/[0.04] text-[10px] text-zinc-400">
                    <div>IN: <span className="text-zinc-300">{node.inputSignal}</span></div>
                    <div>OUT: <span className="text-zinc-300">{node.outputSignal}</span></div>
                  </div>
                </div>

                {/* Description (5 cols) */}
                <div className="lg:col-span-5 text-xs font-sans text-zinc-300 leading-relaxed">
                  <div className="font-mono text-[9px] uppercase text-zinc-500 mb-1">
                    Signal Processing Detail
                  </div>
                  <p>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: COMPARATIVE METHODOLOGY SUMMARY */}
        <section className="border border-white/[0.08] bg-[#020306] p-6 lg:p-8 space-y-4">
          <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 border-b border-white/[0.08] pb-2">
            Design Rationale: Dual-Stage Classification & Metric Space
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans text-zinc-300 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-mono text-sm text-white font-medium">Why Not Pure Closed-Set Classification?</h3>
              <p>
                The observable universe contains billions of distinct astronomical objects. Training a standard
                softmax classifier on every known galaxy or nebula is computationally intractable and structurally
                brittle. AstroLens instead pairs a broad morphology classifier with an open-metric Vision Transformer
                embedding space, enabling arbitrary celestial observations to be indexed and matched against reference catalogs.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-mono text-sm text-white font-medium">The Role of CDS SIMBAD Astrometry</h3>
              <p>
                Once an astronomical object is identified by metric similarity, CDS SIMBAD provides authoritative,
                peer-reviewed astronomical cross-identifications, spectral classes, and precise J2000 equatorial
                astrometric coordinates. This anchors the machine learning inference directly in empirical astronomy.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}
        <div className="border-t border-white/[0.08] pt-6 flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-sans">
            Ready to explore observations through this pipeline?
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
