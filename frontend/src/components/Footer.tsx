import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-[#05070b] py-8 text-zinc-500 text-xs">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-zinc-300">AstroLens</span> — Academic Deep Learning System for Astronomical Object & Morphology Analysis.
          <p className="mt-1 text-[11px] text-zinc-400">
            ResNet18 Transfer Learning • 512-D Latent Embeddings • Cosine Similarity • Centroid Anomaly Detection • Grad-CAM Explainability.
          </p>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <Link href="/models" className="hover:text-cyan-400 transition">Models</Link>
          <Link href="/datasets" className="hover:text-cyan-400 transition">Datasets</Link>
          <Link href="/methodology" className="hover:text-cyan-400 transition">Methodology</Link>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">FastAPI Docs</a>
        </div>
      </div>
    </footer>
  );
}
