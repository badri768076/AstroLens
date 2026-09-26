import os
from typing import List, Dict, Any
import numpy as np
import torch
import torch.nn.functional as F

class SimilaritySearchService:
    def __init__(self, models_dir: str = "models", class_names: List[str] = None, device: torch.device = None):
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = class_names or [
            "Smooth Round",
            "Smooth Cigar",
            "Edge-on Disk",
            "Unbarred Spiral"
        ]
        
        emb_path = os.path.join(models_dir, "train_embeddings.npy")
        lbl_path = os.path.join(models_dir, "train_embedding_labels.npy")

        if not os.path.exists(emb_path) or not os.path.exists(lbl_path):
            raise FileNotFoundError(f"Indexed database embeddings not found in {models_dir}")

        train_embeddings = np.load(emb_path)
        self.labels = np.load(lbl_path)

        # Precompute normalized database tensor on device
        db_tensor = torch.tensor(train_embeddings, dtype=torch.float32, device=self.device)
        self.db_tensor = F.normalize(db_tensor, p=2, dim=1)
        self.total_indexed = len(train_embeddings)

    def search(self, query_embedding: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Perform cosine similarity search across indexed catalog.
        query_embedding: numpy array of shape (512,)
        """
        top_k = min(max(1, top_k), self.total_indexed)

        query_t = torch.tensor(query_embedding, dtype=torch.float32, device=self.device)
        if query_t.dim() == 1:
            query_t = query_t.unsqueeze(0)
        
        norm_query = F.normalize(query_t, p=2, dim=1)

        with torch.no_grad():
            # Cosine similarity matrix multiplication
            similarities = torch.mm(norm_query, self.db_tensor.T).squeeze(0)
            scores, indices = torch.topk(similarities, k=top_k)

        results = []
        for rank, (score, idx) in enumerate(zip(scores, indices), start=1):
            index_val = int(idx.item())
            class_id = int(self.labels[index_val])
            class_name = self.class_names[class_id] if class_id < len(self.class_names) else f"Class {class_id}"
            
            results.append({
                "rank": rank,
                "index": index_val,
                "class_id": class_id,
                "class_name": class_name,
                "similarity": round(float(score.item()), 4),
                "dataset": "GalaxyMNIST"
            })

        return results
