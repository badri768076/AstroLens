# ASTROLENS
### An AI-Powered Deep Learning System for Interactive Astronomical Object Analysis

[![PyTorch](https://img.shields.io/badge/PyTorch-2.14-EE4C2C.svg?logo=pytorch)](https://pytorch.org/)
[![CUDA](https://img.shields.io/badge/CUDA-13.0-76B900.svg?logo=nvidia)](https://developer.nvidia.com/cuda-toolkit)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Overview

**AstroLens** is an academic Deep Learning research and engineering system designed for automated morphological analysis of astronomical observations. While the user-facing web interface provides an interactive laboratory, **the Deep Learning system is the primary scientific contribution**.

The system addresses the observation throughput challenge posed by modern sky surveys (LSST/Rubin, Euclid, Roman, JWST) by delivering a unified, dual-stream inference pipeline:
1. **Multiclass Morphological Classification**: Pretrained ResNet18 fine-tuned on galactic cutouts.
2. **512-Dimensional Metric Embeddings**: Penultimate average-pooled feature representation.
3. **Deep Vector Similarity Search**: Real-time cosine similarity search over 6,399 indexed reference galaxies.
4. **Morphological Anomaly Detection**: Centroid distance scoring with empirical distribution calibration.
5. **Explainable AI (Grad-CAM)**: Backpropagated spatial gradient heatmaps highlighting galactic features.

---

## 2. End-to-End System Architecture

```text
                           ASTRONOMICAL IMAGE
                          (224×224 RGB Cutout)
                                    │
                                    ▼
                          TENSOR PREPROCESSING
                         (ImageNet Normalization)
                                    │
                                    ▼
                     PRETRAINED RESNET18 BACKBONE
                     (Fine-Tuned on Galactic Data)
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          MULTICLASS HEAD    512-D EMBEDDING     EXPLAINABILITY
          (Linear 512→4)     (Penultimate Pool)     (Grad-CAM)
                 │                  │                  │
                 │           ┌──────┴──────┐           ▼
                 │           ▼             ▼     layer4[-1].conv2
                 │      Similarity      Anomaly   Saliency Maps
                 │      (Cosine Top-K)  (Centroid)     │
                 │           │             │           │
                 └───────────┼─────────────┴───────────┘
                             │
                             ▼
                    FASTAPI REST BACKEND
                       (Python 3.11)
                             │
                             ▼
                    NEXT.JS 16 FRONTEND
                  (Observatory Dashboard)
```

---

## 3. Controlled Transfer Learning Experiments

A controlled transfer learning comparison was conducted on **2,000 held-out test cutouts** of GalaxyMNIST (Galaxy Zoo 2 / SDSS). 

### Empirical Benchmark Results:

| Model Architecture | Training Strategy | Parameters | Test Accuracy | Macro Precision | Macro Recall | Macro F1 | Weighted F1 |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **GalaxyCNN Baseline** | Trained from Scratch (Adam, lr=1e-3) | 25.8M | 78.95% | 79.08% | 78.98% | 79.01% | 78.96% |
| **ResNet18 (Frozen)** | Frozen Backbone + Linear Head | 11.2M (2k head) | 72.80% | 73.20% | 72.90% | 72.71% | 72.65% |
| **ResNet18 (Fine-Tuned)** | **Full End-to-End (AdamW, lr=1e-4)** | **11.2M** | **89.95%** | **90.11%** | **90.00%** | **90.01%** | **89.96%** |

### Key Scientific Findings:
- **Transfer Learning Advantage**: End-to-end fine-tuning improves accuracy by **+11.00%** over the scratch baseline and **+17.15%** over the frozen backbone.
- **Terrestrial vs Astronomical Priors**: The frozen backbone underperformed the scratch baseline because high-level ImageNet priors (rigid terrestrial objects) diverge from diffuse, continuous galactic light profiles (Sérsic and exponential disks). Unfreezing the convolutional trunk allows the receptive fields to specialize in stellar bulges, bar structures, and spiral arm pitch.

---

## 4. Confusion Matrix & Astrophysical Error Analysis

### Production Model (ResNet18 Fine-Tuned) Confusion Matrix:

```text
Actual \ Predicted     Smooth Round   Smooth Cigar   Edge-on Disk   Unbarred Spiral
Smooth Round               490              0              0              17
Smooth Cigar                 0            420             86               0
Edge-on Disk                 4             54            439              10
Unbarred Spiral             15              2             13             450
```

### Astrophysical Insight:
- **Cigar vs Edge-on Disk Confusion**: The primary off-diagonal confusion occurs between **Smooth Cigar (Class 1)** and **Edge-on Disk (Class 2)** (86 cigars misclassified as edge-on disks; 54 edge-on disks misclassified as cigars).
- **Physical Explanation**: Both classes present as high-aspect-ratio, elongated profiles. At 224×224 resolution under atmospheric seeing limits, unresolved midplane dust absorption in edge-on disks mimics prolate elliptical galaxies of high eccentricity (E5-E7).

---

## 5. Core Deep Learning Components

### A. 512-Dimensional Latent Metric Embeddings
- The penultimate average pooling layer of the fine-tuned ResNet18 extracts a 512-dimensional continuous feature representation:
  $$\mathbf{e} = \frac{f_\theta(\mathbf{x})}{\|f_\theta(\mathbf{x})\|_2} \in \mathcal{S}^{511}$$
- Offline indexed embeddings of 6,399 training galaxies are stored in `models/train_embeddings.npy`.

### B. Metric Similarity Search
- Evaluates Top-K nearest morphological neighbors via cosine similarity:
  $$\text{sim}(\mathbf{e}_q, \mathbf{e}_{db}) = \mathbf{e}_q \cdot \mathbf{e}_{db}^\top$$
- Executed via GPU-accelerated matrix multiplication returning similarity score, catalog index, and class taxonomy.

### C. Morphological Anomaly Detection
- Computes class-conditional centroids $\hat{\boldsymbol{\mu}}_c$ and empirical cosine distance distributions ($1 - \mathbf{e} \cdot \hat{\boldsymbol{\mu}}_c$) over the training distribution.
- Calibrates an anomaly score against the 95th and 99th empirical percentiles.
- **Scientific Limitation**: This metric quantifies statistical dispersion from nominal morphology; it does **not** claim novel astronomical discovery.

### D. Explainable AI (Grad-CAM)
- Computes spatial gradients on `model.layer4[-1].conv2`:
  $$\alpha_k^c = \frac{1}{Z} \sum_{i} \sum_{j} \frac{\partial y^c}{\partial A_{ij}^k}, \quad L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$
- Visualizes salient regions governing the prediction (central galactic bulges, spiral arms, inclination disks).

---

## 6. Dataset Framework: Task A vs Task B

To uphold academic integrity, AstroLens maintains a strict distinction between:
- **Task A (Current Active Benchmark)**: Galaxy morphology classification on GalaxyMNIST (4 balanced classes: Smooth Round, Smooth Cigar, Edge-on Disk, Unbarred Spiral).
- **Task B (Multiclass Taxonomy Extension)**: Broader astronomical object classification evaluated across candidate datasets:
  - **Galaxy10 DECals**: 17,736 images across 10 morphology bins from DESI Legacy Surveys.
  - **SDSS DR17**: 100,000+ spectroscopic truth samples across Stars, Galaxies, and Quasars (QSOs).
  - **ESA/Hubble**: Multi-band imagery across Nebulae, Star Clusters, and Supernovae.

---

## 7. How to Run AstroLens Locally

### Prerequisites
- Python 3.11 with Virtual Environment (`backend/.venv`)
- Node.js 18+ & npm
- NVIDIA GPU with CUDA support (tested on RTX 5050 Laptop GPU, 8GB VRAM)

---

### Step 1: Start the FastAPI Backend

Open a terminal and run:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

*The backend will initialize the Model Registry, load the fine-tuned ResNet18 onto CUDA, and start listening at `http://localhost:8000`.*
*Interactive API documentation is available at `http://localhost:8000/docs`.*

---

### Step 2: Start the Next.js Frontend

Open a second terminal and run:

```powershell
cd frontend
npm run dev
```

*The Next.js frontend will start on port **`3001`** (configured to avoid port conflicts with localhost:3000).*

Open your browser at:
👉 **`http://localhost:3001`**

---

## 8. Repository Structure

```text
AstroLens/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application & startup lifespan
│   │   ├── schemas.py                  # Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── analysis.py             # /api/analyze, /predict, /similar, /anomaly, /explain
│   │   │   ├── models.py               # /api/models (Empirical benchmarks & metrics)
│   │   │   └── dataset.py              # /api/datasets & /api/datasets/samples
│   │   └── services/
│   │       ├── model_service.py        # Central model registry
│   │       ├── predictor.py            # Multiclass inference with probabilities
│   │       ├── embedding_service.py    # 512-D latent feature extraction
│   │       ├── similarity_service.py   # GPU cosine vector search
│   │       ├── anomaly_service.py      # Centroid anomaly detector
│   │       └── gradcam_service.py      # Base64 Grad-CAM saliency generator
│   ├── models/
│   │   ├── resnet18_galaxy.pth         # Fine-tuned ResNet18 weights (89.95% acc)
│   │   ├── resnet18_frozen.pth         # Frozen backbone weights (72.80% acc)
│   │   ├── cnn_baseline.pth            # Scratch CNN baseline weights (78.95% acc)
│   │   ├── train_embeddings.npy        # 6,399 × 512 L2-normalized feature vectors
│   │   ├── train_embedding_labels.npy  # Reference catalog ground truth labels
│   │   ├── anomaly_reference.json      # Calibrated 95th/99th percentile stats
│   │   └── class_centroids.npy         # Class latent centroid vectors
│   ├── training/
│   │   ├── dataset.py                  # GalaxyMNIST loader with offline caching
│   │   ├── model.py                    # GalaxyCNN baseline architecture
│   │   ├── transfer_model.py           # GalaxyResNet architecture with embedding hook
│   │   ├── train.py                    # Scratch CNN training script
│   │   ├── train_transfer.py           # End-to-end fine-tuning script
│   │   ├── train_frozen.py             # Frozen backbone feature extractor script
│   │   ├── evaluate.py                 # Comprehensive evaluation pipeline
│   │   ├── build_embeddings.py         # Embedding database generator
│   │   ├── similarity_search.py        # Cosine similarity standalone script
│   │   ├── anomaly_detection.py        # Calibrated anomaly detector module
│   │   └── gradcam.py                  # Standalone Grad-CAM script
│   └── data/
│       └── samples/                    # Preset test cutouts for 1-click evaluation
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Overview & architecture visualization
│   │   │   ├── analyze/page.tsx        # Interactive deep learning workspace
│   │   │   ├── models/page.tsx         # Controlled model comparison & confusion matrix
│   │   │   ├── datasets/page.tsx       # Dataset explorer & Task B candidate evaluation
│   │   │   ├── methodology/page.tsx    # Academic documentation & math formulations
│   │   │   ├── layout.tsx              # Observatory dark theme layout
│   │   │   └── globals.css             # TailwindCSS design tokens
│   │   └── components/
│   │       ├── Navbar.tsx              # Observatory navigation bar & live API status pill
│   │       └── Footer.tsx              # Scientific documentation footer
│   ├── next.config.ts                  # Next.js configuration with Turbopack root
│   └── package.json                    # Scripts configured for port 3001
└── README.md                           # Academic documentation
```

---

## 9. Academic Citation & Reproducibility

```bibtex
@misc{astrolens2026,
  title={AstroLens: An AI-Powered Deep Learning System for Interactive Astronomical Object Analysis},
  author={AstroLens Research Team},
  year={2026},
  howpublished={\url{https://github.com/badri768076/AstroLens}}
}
```