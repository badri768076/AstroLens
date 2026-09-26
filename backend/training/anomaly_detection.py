import json
import os
import numpy as np
import torch
import torch.nn.functional as F

class MorphologicalAnomalyDetector:
    """
    Embedding-based morphological anomaly detector.
    
    Academic Methodology:
    Calculates class-conditional latent centroid representations and empirical
    cosine distance distributions from the reference training embeddings.
    
    Scientific Note:
    Identifies morphological outliers and structural anomalies relative to the
    learned training distribution. This indicates morphological divergence,
    measurement artifacts, or out-of-distribution morphology, NOT astronomical discovery.
    """

    def __init__(self, models_dir="models"):
        self.models_dir = models_dir
        self.stats_file = os.path.join(models_dir, "anomaly_reference.json")
        self.centroids_file = os.path.join(models_dir, "class_centroids.npy")
        self.centroids = None
        self.stats = None

        if os.path.exists(self.stats_file) and os.path.exists(self.centroids_file):
            self.load()
        else:
            self.fit_and_save()

    def fit_and_save(self):
        train_emb_path = os.path.join(self.models_dir, "train_embeddings.npy")
        train_lbl_path = os.path.join(self.models_dir, "train_embedding_labels.npy")

        if not os.path.exists(train_emb_path) or not os.path.exists(train_lbl_path):
            raise FileNotFoundError("Training embeddings not found in models directory.")

        embeddings = np.load(train_emb_path)
        labels = np.load(train_lbl_path)

        # Normalize embeddings
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True) + 1e-8
        normed_embeddings = embeddings / norms

        unique_classes = np.unique(labels)
        num_classes = int(np.max(unique_classes) + 1)
        dim = normed_embeddings.shape[1]

        centroids = np.zeros((num_classes, dim), dtype=np.float32)
        stats = {}

        for c in unique_classes:
            c = int(c)
            idx = np.where(labels == c)[0]
            class_embs = normed_embeddings[idx]

            # Compute centroid & re-normalize
            c_vec = np.mean(class_embs, axis=0)
            c_norm = np.linalg.norm(c_vec) + 1e-8
            c_normed = c_vec / c_norm
            centroids[c] = c_normed

            # Compute cosine distance to class centroid: 1 - cos(theta)
            sims = np.dot(class_embs, c_normed)
            distances = 1.0 - sims

            mean_d = float(np.mean(distances))
            std_d = float(np.std(distances))
            p90 = float(np.percentile(distances, 90))
            p95 = float(np.percentile(distances, 95))
            p99 = float(np.percentile(distances, 99))
            max_d = float(np.max(distances))

            stats[str(c)] = {
                "count": int(len(idx)),
                "mean_distance": mean_d,
                "std_distance": std_d,
                "percentile_90": p90,
                "percentile_95": p95,
                "percentile_99": p99,
                "max_distance": max_d
            }

        self.centroids = centroids
        self.stats = stats

        np.save(self.centroids_file, self.centroids)
        with open(self.stats_file, "w", encoding="utf-8") as f:
            json.dump(self.stats, f, indent=2)

        print(f"Anomaly detector calibrated across {len(unique_classes)} classes and saved.")

    def load(self):
        self.centroids = np.load(self.centroids_file)
        with open(self.stats_file, "r", encoding="utf-8") as f:
            self.stats = json.load(f)

    def evaluate(self, query_embedding: np.ndarray, predicted_class: int):
        """
        Evaluate anomaly score for a query embedding given its predicted class.
        query_embedding: shape (512,) or (1, 512)
        """
        query = np.array(query_embedding).flatten()
        norm = np.linalg.norm(query) + 1e-8
        norm_query = query / norm

        c_str = str(predicted_class)
        if c_str not in self.stats:
            # Fallback to closest centroid if predicted_class not indexed
            sims = np.dot(self.centroids, norm_query)
            predicted_class = int(np.argmax(sims))
            c_str = str(predicted_class)

        centroid = self.centroids[predicted_class]
        similarity = float(np.dot(norm_query, centroid))
        distance = float(max(0.0, 1.0 - similarity))

        c_stat = self.stats[c_str]
        p95 = c_stat["percentile_95"]
        p99 = c_stat["percentile_99"]
        mean_d = c_stat["mean_distance"]

        # Normalized anomaly score scaled so that p95 represents ~0.70 and p99 ~0.85
        if distance <= mean_d:
            anomaly_score = (distance / (mean_d + 1e-8)) * 0.4
        elif distance <= p95:
            anomaly_score = 0.4 + 0.3 * ((distance - mean_d) / (p95 - mean_d + 1e-8))
        else:
            anomaly_score = 0.7 + 0.3 * min(1.0, (distance - p95) / (max(0.01, p99 - p95)))

        anomaly_score = float(np.clip(anomaly_score, 0.0, 1.0))
        is_anomaly = bool(distance >= p95)

        if anomaly_score < 0.50:
            status = "Nominal Morphology"
            interpretation = "Structure aligns closely with core distribution of reference class."
        elif anomaly_score < 0.70:
            status = "Moderate Variation"
            interpretation = "Structural profile shows standard dispersion within expected morphological envelope."
        elif anomaly_score < 0.85:
            status = "Elevated Dispersion"
            interpretation = "Significant structural deviation from reference class centroid; potential asymmetry, tidal distortion, or imaging artifact."
        else:
            status = "Morphological Anomaly"
            interpretation = "Outlier relative to learned distribution (>95th percentile distance). Warrants expert inspection for structural disturbance or unusual morphology."

        return {
            "anomaly_score": round(anomaly_score, 4),
            "distance_to_centroid": round(distance, 4),
            "reference_mean_distance": round(mean_d, 4),
            "threshold_p95": round(p95, 4),
            "threshold_p99": round(p99, 4),
            "is_anomaly": is_anomaly,
            "status": status,
            "interpretation": interpretation,
            "scientific_disclaimer": "Embedding-based morphological dispersion relative to training baseline; does not constitute confirmation of a novel astronomical phenomenon."
        }


if __name__ == "__main__":
    detector = MorphologicalAnomalyDetector(models_dir="models")
    test_embs = np.load("models/test_embeddings.npy")
    test_lbls = np.load("models/test_embedding_labels.npy")

    # Evaluate first test sample
    sample_emb = test_embs[0]
    sample_lbl = int(test_lbls[0])
    res = detector.evaluate(sample_emb, sample_lbl)
    print("\nAnomaly Detection Test Result for Sample 0:")
    for k, v in res.items():
        print(f"  {k}: {v}")
