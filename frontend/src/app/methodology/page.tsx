export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>SCIENTIFIC DOCUMENTATION & METHODOLOGY</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Deep Learning Methodology & Mathematical Foundations
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Formal academic documentation for AstroLens: An AI-Powered Deep Learning System for Interactive Astronomical Object Analysis.
        </p>
      </div>

      <div className="space-y-10 text-sm text-zinc-300 leading-relaxed font-sans">
        {/* Section 1: Problem Statement */}
        <section className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-3">
            <span className="text-cyan-400">1.</span> Problem Statement & Astrophysical Motivation
          </h2>
          <p className="mb-3">
            Next-generation sky surveys (Vera C. Rubin Observatory / LSST, Nancy Grace Roman Space Telescope, Euclid) are currently cataloging billions of celestial objects, producing petabytes of astronomical imagery daily. Manual morphological classification via crowdsourced initiatives (e.g., Galaxy Zoo) cannot scale to the incoming observation volume.
          </p>
          <p>
            Galaxy morphology is inextricably linked to galactic formation history, stellar populations, dark matter halo dynamics, and supermassive black hole co-evolution. Automated, robust, and interpretable deep learning pipelines are essential for accelerating physical taxonomy and spotting atypical morphological anomalies.
          </p>
        </section>

        {/* Section 2: Architecture Selection */}
        <section className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-3">
            <span className="text-cyan-400">2.</span> Architecture Selection & GPU Feasibility
          </h2>
          <p className="mb-4">
            Candidate architectures were evaluated under memory and latency constraints for local deployment on an <strong>NVIDIA GeForce RTX 5050 Laptop GPU (~8GB VRAM)</strong>:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono mb-4">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-2">Architecture</th>
                  <th className="pb-2">Parameters</th>
                  <th className="pb-2">Latent Dim</th>
                  <th className="pb-2">VRAM (BS=32)</th>
                  <th className="pb-2">Inference Latency</th>
                  <th className="pb-2">Suitability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                <tr className="bg-cyan-950/20 text-cyan-200">
                  <td className="py-2.5 font-bold">ResNet18 (Selected)</td>
                  <td className="py-2.5">11.2M</td>
                  <td className="py-2.5">512-D</td>
                  <td className="py-2.5">&lt; 1.0 GB</td>
                  <td className="py-2.5">~18 ms / image</td>
                  <td className="py-2.5 text-emerald-400 font-semibold">Optimal balance</td>
                </tr>
                <tr>
                  <td className="py-2.5">ResNet50</td>
                  <td className="py-2.5">25.6M</td>
                  <td className="py-2.5">2048-D</td>
                  <td className="py-2.5">~2.2 GB</td>
                  <td className="py-2.5">~35 ms / image</td>
                  <td className="py-2.5 text-zinc-400">Higher memory, diminishing return</td>
                </tr>
                <tr>
                  <td className="py-2.5">ConvNeXt-Tiny</td>
                  <td className="py-2.5">28.6M</td>
                  <td className="py-2.5">768-D</td>
                  <td className="py-2.5">~2.4 GB</td>
                  <td className="py-2.5">~42 ms / image</td>
                  <td className="py-2.5 text-zinc-400">High computational overhead</td>
                </tr>
                <tr>
                  <td className="py-2.5">ViT-B/16</td>
                  <td className="py-2.5">86.0M</td>
                  <td className="py-2.5">768-D</td>
                  <td className="py-2.5">~4.8 GB</td>
                  <td className="py-2.5">~65 ms / image</td>
                  <td className="py-2.5 text-zinc-400">Prone to severe overfitting without 1M+ images</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400">
            <strong>Justification:</strong> ResNet18 provides an optimal capacity-to-sample ratio for GalaxyMNIST (10,000 images). Its 512-dimensional penultimate representation forms a compact, highly discriminative vector space for fast metric similarity retrieval and centroid anomaly detection.
          </p>
        </section>

        {/* Section 3: Transfer Learning Comparison */}
        <section className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-3">
            <span className="text-cyan-400">3.</span> Controlled Transfer Learning Experiments
          </h2>
          <p className="mb-4">
            To evaluate the efficacy of transfer learning, three controlled configurations were trained and evaluated on 2,000 held-out test cutouts:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs font-mono">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-zinc-500 block mb-1">MODEL A</span>
              <p className="font-bold text-zinc-200">Scratch CNN Baseline</p>
              <p className="text-zinc-400 mt-1 font-sans">
                3 convolutional blocks trained from random weights. Achieved <strong>78.95%</strong> test accuracy.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-zinc-500 block mb-1">MODEL B</span>
              <p className="font-bold text-zinc-200">Frozen Feature Extractor</p>
              <p className="text-zinc-400 mt-1 font-sans">
                ImageNet conv trunk frozen; trained linear head. Achieved <strong>72.80%</strong> accuracy (terrestrial priors sub-optimal for diffuse astronomy).
              </p>
            </div>
            <div className="rounded-xl border border-cyan-800 bg-cyan-950/30 p-4">
              <span className="text-cyan-400 block mb-1">MODEL C (WINNER)</span>
              <p className="font-bold text-cyan-200">Fine-Tuned ResNet18</p>
              <p className="text-zinc-300 mt-1 font-sans">
                End-to-end fine-tuning with AdamW (lr=1e-4). Achieved <strong>89.95%</strong> accuracy (+11.00% over scratch baseline).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Mathematical Formulations */}
        <section className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-3">
            <span className="text-cyan-400">4.</span> Mathematical Formulations
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-cyan-300 font-mono text-xs uppercase tracking-wider mb-1">
                4.1 Latent Vector Normalization & Cosine Similarity
              </h3>
              <p className="text-xs mb-2 text-zinc-400">
                {"Embeddings are mapped onto the 512-dimensional unit hypersphere S^511:"}
              </p>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-cyan-300">
                {"e = f_θ(x) / ||f_θ(x)||_2"}
                <br />
                {"cos_sim(e_query, e_catalog) = e_query · e_catalog^T"}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-300 font-mono text-xs uppercase tracking-wider mb-1">
                4.2 Centroid-Based Morphological Anomaly Detection
              </h3>
              <p className="text-xs mb-2 text-zinc-400">
                {"For class c, the normalized centroid μ_c is computed over the reference catalog D_c:"}
              </p>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-cyan-300">
                {"μ_c = (1 / N_c) ∑_{i ∈ D_c} e_i,  μ̂_c = μ_c / ||μ_c||_2"}
                <br />
                {"distance(e_q, μ̂_c) = 1 - e_q · μ̂_c"}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-300 font-mono text-xs uppercase tracking-wider mb-1">
                4.3 Gradient-Weighted Class Activation Mapping (Grad-CAM)
              </h3>
              <p className="text-xs mb-2 text-zinc-400">
                {"Importance weights α_k^c for convolutional feature map A^k of layer4:"}
              </p>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-cyan-300">
                {"α_k^c = (1 / Z) ∑_i ∑_j (∂y^c / ∂A_{ij}^k)"}
                <br />
                {"L_{Grad-CAM}^c = ReLU( ∑_k α_k^c A^k )"}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Scientific Integrity & Disclaimers */}
        <section className="rounded-2xl border border-zinc-800 bg-[#090b12] p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-3">
            <span className="text-cyan-400">5.</span> Scientific Disclaimers & Limitations
          </h2>
          <div className="space-y-3 text-xs text-zinc-400 leading-relaxed font-sans">
            <p>
              • <strong>Prediction Confidence vs Scientific Truth:</strong> Softmax output scores represent conditional model confidence over the 4 morphology classes of GalaxyMNIST. They should not be conflated with physical certainty or ground-truth spectroscopy.
            </p>
            <p>
              • <strong>Morphological Anomaly vs Astronomical Discovery:</strong> The anomaly score measures statistical divergence from the learned training distribution. A high anomaly score frequently reflects asymmetric tidal interactions, foreground stars, low signal-to-noise ratios, or cosmic ray artifacts, rather than new astrophysical objects.
            </p>
            <p>
              • <strong>Task Scope:</strong> AstroLens explicitly defines GalaxyMNIST as a 4-class galaxy morphology classifier. It does not claim to detect nebulae, stars, or supernovae until trained on the broader Task B dataset.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
