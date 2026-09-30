import Link from "next/link";

export default function MethodologyPage() {
  const pipelineNodes = [
    {
      stage: "01",
      title: "IMAGE INTAKE",
      model: "Telescope Photographic Plate",
      input: "224×224 Multi-band Cutout",
      output: "Normalized Tensor Channels",
      desc: "Ingestion of raw astronomical imagery (JPEG, PNG, FITS/TIFF conversions) with standard astronomical channel centering and contrast scaling.",
    },
    {
      stage: "02",
      title: "INTERSTELLAR CLASSIFICATION",
      model: "FastAI Deep Convolutional Trunk",
      input: "Normalized Image Tensor",
      output: "Broad Taxonomy Class + Confidence Score",
      desc: "Hierarchical deep neural classification categorizing the observation into fundamental celestial classes: Spiral Galaxy, Elliptical Galaxy, Nebula, Star, or Solar System Body.",
    },
    {
      stage: "03",
      title: "METRIC EMBEDDING & REFERENCE MATCHING",
      model: "Vision Transformer (ViT-Base-Patch16)",
      input: "Global Context Patch Tokens",
      output: "768-D Latent Unit Hypersphere Vector S^767",
      desc: "Extraction of high-dimensional attention embeddings mapped to an astronomical metric space. Sub-millisecond cosine vector similarity ranking against indexed catalog references.",
    },
    {
      stage: "04",
      title: "SPECIFIC OBJECT RESOLUTION",
      model: "Nearest Neighbor Catalog Resolution",
      input: "Cosine Similarity Distribution",
      output: "Target Identification (e.g. M31, M42, Jupiter, M87)",
      desc: "Evaluation of cosine similarity against canonical reference plates. Matches exceeding the calibrated threshold resolve the specific celestial object designation.",
    },
    {
      stage: "05",
      title: "CDS SIMBAD ASTROMETRY",
      model: "Centre de Données astronomiques de Strasbourg",
      input: "Resolved Catalog Designation",
      output: "Primary Name, Catalog IDs, Object Type, RA, DEC",
      desc: "Automated query against the CDS SIMBAD astronomical database retrieves official catalog cross-identifications, morphological classifications, and ICRS equatorial coordinates.",
    },
    {
      stage: "06",
      title: "CELESTIAL ATLAS PROJECTION",
      model: "Equatorial J2000 Coordinate Mapping",
      input: "Right Ascension (α) & Declination (δ)",
      output: "Interactive Celestial Sky Chart",
      desc: "Astrometric projection plotting the resolved object on an equatorial sky chart, orienting researchers to its location relative to the celestial equator and poles.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020306] text-zinc-100 py-8 px-4 sm:px-6 font-mono text-xs">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px] mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold tracking-wider uppercase">SCIENTIFIC INSTRUMENTATION DOCUMENTATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              End-to-End Inference Pipeline Architecture
            </h1>
          </div>

          <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
            <span>PIPELINE: FASTAI + VIT + SIMBAD</span>
            <span>SYSTEM: ASTROLENS CORE</span>
          </div>
        </div>

        {/* CONNECTED SCIENTIFIC PIPELINE DIAGRAM */}
        <div className="border border-zinc-800 bg-[#020409]">
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-[#03060c] flex items-center justify-between text-[10px] text-zinc-400">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              SEQUENTIAL ARCHITECTURAL FLOW
            </span>
            <span>DATA TRANSFORMATION DIAGRAM</span>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {pipelineNodes.map((node, idx) => (
              <div key={node.stage} className="relative">
                <div className="border border-zinc-800 bg-[#04060c] p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:border-zinc-600 transition">
                  {/* Stage Number & Title */}
                  <div className="lg:col-span-4 flex items-center gap-3">
                    <span className="w-8 h-8 border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center font-bold text-cyan-300">
                      {node.stage}
                    </span>
                    <div>
                      <h3 className="font-bold text-white uppercase tracking-wider">{node.title}</h3>
                      <span className="text-cyan-400 text-[10px] block">{node.model}</span>
                    </div>
                  </div>

                  {/* Input / Output Signals */}
                  <div className="lg:col-span-4 border-l border-zinc-800/80 pl-3 space-y-1 text-[11px]">
                    <div>
                      <span className="text-zinc-500">IN: </span>
                      <span className="text-zinc-300">{node.input}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">OUT: </span>
                      <span className="text-emerald-400">{node.output}</span>
                    </div>
                  </div>

                  {/* Scientific Description */}
                  <div className="lg:col-span-4 border-l border-zinc-800/80 pl-3 font-sans text-xs text-zinc-400 leading-relaxed">
                    {node.desc}
                  </div>
                </div>

                {/* Connecting arrow line */}
                {idx < pipelineNodes.length - 1 && (
                  <div className="flex justify-center my-1 text-zinc-600 font-mono text-[10px]">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MATHEMATICAL FORMULATIONS LEDGER */}
        <div className="border border-zinc-800 bg-[#020409] p-4 sm:p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">
              MATHEMATICAL FORMULATIONS & VECTOR METRICS
            </span>
            <span className="text-zinc-500 text-[10px]">EQUATORIAL & LATENT EMBEDDINGS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800/80 bg-[#04060c] p-4 space-y-2">
              <span className="text-cyan-400 font-bold uppercase block text-[11px]">
                1. Vision Transformer Hypersphere Projection
              </span>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                Penultimate patch embeddings $f_\theta(x)$ are $L_2$-normalized onto a unit hypersphere $S^{767}$ to ensure scale-invariant angle matching across optical sensors:
              </p>
              <div className="border border-zinc-800 bg-black p-3 text-cyan-300 text-xs">
                e = f_θ(x) / ||f_θ(x)||_2
                <br />
                cos_sim(e_query, e_catalog) = e_query · e_catalog^T
              </div>
            </div>

            <div className="border border-zinc-800/80 bg-[#04060c] p-4 space-y-2">
              <span className="text-cyan-400 font-bold uppercase block text-[11px]">
                2. Equatorial Astrometric J2000 Transformation
              </span>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                Right Ascension ($\alpha$) and Declination ($\delta$) retrieved from CDS SIMBAD map to celestial Cartesian direction cosines on the unit sphere:
              </p>
              <div className="border border-zinc-800 bg-black p-3 text-cyan-300 text-xs">
                X = cos(δ) · cos(α)
                <br />
                Y = cos(δ) · sin(α)
                <br />
                Z = sin(δ)
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-end pt-2">
          <Link
            href="/analyze"
            className="px-5 py-2.5 border border-cyan-400 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase tracking-wider transition"
          >
            Run Live Pipeline in Workstation →
          </Link>
        </div>
      </div>
    </main>
  );
}
