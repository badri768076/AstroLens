from typing import Dict, Any
import numpy as np
from training.anomaly_detection import MorphologicalAnomalyDetector

class AnomalyDetectionService:
    def __init__(self, models_dir: str = "models"):
        self.detector = MorphologicalAnomalyDetector(models_dir=models_dir)

    def evaluate(self, query_embedding: np.ndarray, predicted_class: int) -> Dict[str, Any]:
        """
        Evaluate morphological anomaly for a given embedding and predicted class.
        """
        return self.detector.evaluate(query_embedding, predicted_class)
