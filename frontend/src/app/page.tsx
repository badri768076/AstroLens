import Link from "next/link";

export default function Home() {
  const pillars = [
    {
      title: "Transfer Learning & Fine-Tuning",
      tag: "ResNet18 vs CNN Scratch",
      desc: "Pretrained ImageNet convolutional priors adapted with AdamW (lr=1e-4) to learn delicate galactic disk/spiral morphology, achieving 89.95% held-out test accuracy (+11.00% over scratch CNN).",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: "512-D Latent Embeddings & Search",
      tag: "Cosine Vector Space",
      desc: "Penultimate average-pooled feature vectors extracted to form a metric space. Computes normalized cosine similarity against 6,399 indexed catalog objects in real-time.",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      )
    },
    {
      title: "Morphological Anomaly Detection",
      tag: "Centroid Latent Distance",
      desc: "Statistical outlier scoring based on class-conditional latent centroids and empirical distance distributions (95th percentile bounds). Accurately flags atypical morphological configurations without false discovery claims.",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: "Explainable AI (Grad-CAM)",
      tag: "Gradient Backpropagation",
      desc: "Class activation mapping on model.layer4[-1].conv2 computes spatial gradients showing which pixel regions, spiral arms, or central bulges governed the model's prediction.",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Background Starfield Grid */}
      <div className="relative isolate overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.25),rgba(255,255,255,0))]" />
        
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero Header */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ACADEMIC DEEP LEARNING RESEARCH PROJECT</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              ASTROLENS
              <span className="block text-xl sm:text-2xl font-medium tracking-normal text-cyan-400 mt-3 font-mono">
                An AI-Powered Deep Learning System for Interactive Astronomical Object Analysis
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-300 max-w-3xl mx-auto">
              The website is only the interface — the Deep Learning pipeline is the contribution. 
              AstroLens integrates transfer learning on pretrained convolutional backbones, 
              512-dimensional metric embeddings, similarity retrieval over 6,399 reference objects, 
              morphological anomaly detection, and Grad-CAM interpretability.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/analyze"
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition"
              >
                Launch Live Analysis Pipeline →
              </Link>
              <Link
                href="/models"
                className="rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition"
              >
                View Empirical Benchmarks (89.95% Acc)
              </Link>
              <Link
                href="/datasets"
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 px-5 py-3.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
              >
                Dataset Architecture & Task B
              </Link>
            </div>
          </div>

          {/* Pipeline Flowchart / Visual Diagram */}
          <div className="mt-16 rounded-2xl border border-zinc-800/80 bg-[#090c14]/90 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  AstroLens End-to-End Deep Learning Architecture
                </h3>
                <p className="text-xs text-zinc-400">
                  Dual-stream inference executing multiclass classification, metric space vector search, anomaly ranking, and gradient backpropagation.
                </p>
              </div>
              <span className="hidden sm:inline-block rounded border border-cyan-800/50 bg-cyan-950/30 px-2.5 py-1 text-[11px] font-mono text-cyan-300">
                ResNet18 • 11.2M Params • RTX 5050 GPU
              </span>
            </div>

            {/* Architecture Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <span className="text-[10px] text-zinc-400 block mb-1">STAGE 1</span>
                <p className="font-semibold text-zinc-100">Astronomical Image</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                  224×224 RGB astronomical cutout normalized to ImageNet distribution (mean/std).
                </p>
              </div>

              <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/20 p-4">
                <span className="text-[10px] text-cyan-400 block mb-1">STAGE 2</span>
                <p className="font-semibold text-cyan-200">Pretrained Backbone</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                  ResNet18 conv1 through layer4, fine-tuned with AdamW for galactic morphological features.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <span className="text-[10px] text-zinc-400 block mb-1">STREAM A</span>
                <p className="font-semibold text-zinc-100">Multiclass Head</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                  Linear head (512→4) with Softmax probability distribution over morphology classes.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <span className="text-[10px] text-zinc-400 block mb-1">STREAM B</span>
                <p className="font-semibold text-zinc-100">512-D Latent Metric</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                  L2-normalized penultimate embedding for Cosine Top-K similarity & Centroid anomaly score.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <span className="text-[10px] text-zinc-400 block mb-1">EXPLAINABILITY</span>
                <p className="font-semibold text-zinc-100">Grad-CAM Overlay</p>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                  Activation gradients on layer4 conv2 highlighting galactic bulges and disk structures.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Learning Core Pillars */}
          <div className="mt-16">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">
              Core Deep Learning Contributions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 hover:border-cyan-500/40 transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5">
                        {pillar.icon}
                      </div>
                      <h3 className="font-semibold text-base text-zinc-100 group-hover:text-cyan-300 transition">
                        {pillar.title}
                      </h3>
                    </div>
                    <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                      {pillar.tag}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans mt-2">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Controlled Transfer Learning Experiment Summary */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Controlled Transfer Learning Empirical Evaluation
                </h3>
                <p className="text-xs text-zinc-400">
                  Measured on 2,000 held-out GalaxyMNIST test samples (Galaxy Zoo / SDSS).
                </p>
              </div>
              <Link
                href="/models"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
              >
                Inspect Full Confusion Matrices →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3 font-medium">Model Architecture</th>
                    <th className="pb-3 font-medium">Strategy</th>
                    <th className="pb-3 font-medium">Parameters</th>
                    <th className="pb-3 font-medium">Test Acc</th>
                    <th className="pb-3 font-medium">Macro F1</th>
                    <th className="pb-3 font-medium">Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  <tr>
                    <td className="py-3 font-semibold text-zinc-200">Custom CNN Baseline</td>
                    <td className="py-3 text-zinc-400 font-sans">Trained from scratch (Adam, lr=1e-3)</td>
                    <td className="py-3">25.8M</td>
                    <td className="py-3 text-amber-400 font-bold">78.95%</td>
                    <td className="py-3 text-zinc-300">79.01%</td>
                    <td className="py-3 text-zinc-400">Baseline</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-zinc-200">Pretrained ResNet18 (Frozen)</td>
                    <td className="py-3 text-zinc-400 font-sans">Frozen backbone + trained linear head</td>
                    <td className="py-3">11.2M (2k head)</td>
                    <td className="py-3 text-zinc-400">72.80%</td>
                    <td className="py-3 text-zinc-400">72.71%</td>
                    <td className="py-3 text-rose-400">-6.15%</td>
                  </tr>
                  <tr className="bg-cyan-950/20">
                    <td className="py-3 font-semibold text-cyan-300">Pretrained ResNet18 (Fine-Tuned)</td>
                    <td className="py-3 text-cyan-200 font-sans">Full End-to-End Fine-Tuning (AdamW, lr=1e-4)</td>
                    <td className="py-3">11.2M</td>
                    <td className="py-3 text-emerald-400 font-bold text-sm">89.95%</td>
                    <td className="py-3 text-emerald-300 font-bold">90.01%</td>
                    <td className="py-3 text-emerald-400 font-bold">+11.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}