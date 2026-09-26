import os
from typing import Dict, Any, List
import torch

from training.transfer_model import GalaxyResNet
from app.services.predictor import PredictorService
from app.services.embedding_service import EmbeddingService
from app.services.similarity_service import SimilaritySearchService
from app.services.anomaly_service import AnomalyDetectionService
from app.services.gradcam_service import GradCAMExplainer

class ModelRegistry:
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[ModelRegistry] Initializing on device: {self.device}")

        self.galaxy_classes = [
            "Smooth Round",
            "Smooth Cigar",
            "Edge-on Disk",
            "Unbarred Spiral"
        ]

        # 1. Load Primary Production Model: Fine-tuned ResNet18
        primary_weights = os.path.join(models_dir, "resnet18_galaxy.pth")
        self.primary_model = GalaxyResNet(num_classes=len(self.galaxy_classes))
        if os.path.exists(primary_weights):
            self.primary_model.load_state_dict(torch.load(primary_weights, map_location=self.device))
            print(f"[ModelRegistry] Loaded fine-tuned ResNet18 weights from {primary_weights}")
        else:
            print(f"[ModelRegistry] WARNING: {primary_weights} not found, using initialized weights")
        
        self.primary_model.to(self.device)
        self.primary_model.eval()

        # 2. Instantiate Services
        self.predictor = PredictorService(self.primary_model, self.galaxy_classes, device=self.device)
        self.embedding_service = EmbeddingService(self.primary_model, device=self.device)
        self.similarity_service = SimilaritySearchService(models_dir=models_dir, class_names=self.galaxy_classes, device=self.device)
        self.anomaly_service = AnomalyDetectionService(models_dir=models_dir)
        self.gradcam_service = GradCAMExplainer(self.primary_model, device=self.device)

        print("[ModelRegistry] All ML services initialized successfully.")

    def get_models_metadata(self) -> List[Dict[str, Any]]:
        """
        Return empirical benchmark metrics and architecture metadata for all evaluated models.
        """
        return [
            {
                "model_id": "resnet18-finetuned",
                "name": "ResNet18 (Fine-Tuned Transfer Learning)",
                "architecture": "ResNet18",
                "dataset": "GalaxyMNIST",
                "task": "4-class galaxy morphology classification",
                "num_classes": 4,
                "classes": self.galaxy_classes,
                "parameters": 11178564,
                "trainable_parameters": 11178564,
                "training_strategy": "ImageNet Pretrained Initialization + Full End-to-End Fine-Tuning (AdamW, lr=1e-4, weight_decay=1e-4)",
                "embedding_dimension": 512,
                "accuracy": 0.8995,
                "macro_precision": 0.9011,
                "macro_recall": 0.9000,
                "macro_f1": 0.9001,
                "weighted_f1": 0.8996,
                "confusion_matrix": [
                    [490, 0, 0, 17],
                    [0, 420, 86, 0],
                    [4, 54, 439, 10],
                    [15, 2, 13, 450]
                ],
                "status": "Production Active"
            },
            {
                "model_id": "resnet18-frozen",
                "name": "ResNet18 (Frozen Backbone Feature Extractor)",
                "architecture": "ResNet18",
                "dataset": "GalaxyMNIST",
                "task": "4-class galaxy morphology classification",
                "num_classes": 4,
                "classes": self.galaxy_classes,
                "parameters": 11178564,
                "trainable_parameters": 2052,
                "training_strategy": "ImageNet Pretrained Weights with Frozen Feature Backbone; Trained Linear Classifier Head (Adam, lr=1e-3)",
                "embedding_dimension": 512,
                "accuracy": 0.7280,
                "macro_precision": 0.7320,
                "macro_recall": 0.7290,
                "macro_f1": 0.7271,
                "weighted_f1": 0.7265,
                "confusion_matrix": [
                    [406, 26, 6, 69],
                    [27, 371, 81, 27],
                    [13, 165, 294, 35],
                    [53, 22, 20, 385]
                ],
                "status": "Experimental Baseline"
            },
            {
                "model_id": "cnn-scratch-baseline",
                "name": "GalaxyCNN (Trained from Scratch)",
                "architecture": "Custom 3-Block CNN",
                "dataset": "GalaxyMNIST",
                "task": "4-class galaxy morphology classification",
                "num_classes": 4,
                "classes": self.galaxy_classes,
                "parameters": 25804548,
                "trainable_parameters": 25804548,
                "training_strategy": "Random Weight Initialization + Supervised Training from Scratch (Adam, lr=1e-3)",
                "embedding_dimension": 256,
                "accuracy": 0.7895,
                "macro_precision": 0.7908,
                "macro_recall": 0.7898,
                "macro_f1": 0.7901,
                "weighted_f1": 0.7896,
                "confusion_matrix": [
                    [452, 0, 3, 52],
                    [1, 376, 127, 2],
                    [9, 123, 360, 15],
                    [55, 17, 17, 391]
                ],
                "status": "Benchmark Baseline"
            }
        ]

    def get_datasets_metadata(self) -> List[Dict[str, Any]]:
        """
        Return structured dataset summaries including GalaxyMNIST and candidate astronomical datasets.
        """
        return [
            {
                "dataset_id": "galaxymnist",
                "name": "GalaxyMNIST (Morphology Benchmark)",
                "category": "Galactic Morphology (Task A)",
                "total_samples": 10000,
                "train_samples": 6400,
                "val_samples": 1600,
                "test_samples": 2000,
                "image_shape": [224, 224, 3],
                "num_classes": 4,
                "classes": self.galaxy_classes,
                "class_distribution": {
                    "Smooth Round": 2500,
                    "Smooth Cigar": 2500,
                    "Edge-on Disk": 2500,
                    "Unbarred Spiral": 2500
                },
                "description": "Standardized astronomical morphology dataset derived from Galaxy Zoo and SDSS cutouts, balanced across 4 morphological archetypes.",
                "scientific_source": "Galaxy Zoo 2 / Sloan Digital Sky Survey (SDSS), curated by Matthieu Le Gall (GalaxyMNIST, 2022)."
            },
            {
                "dataset_id": "galaxy10_decals",
                "name": "Galaxy10 DECals (Extended Multiclass Morphology)",
                "category": "Extended Galactic Morphology (Task B Candidate)",
                "total_samples": 17736,
                "train_samples": 15962,
                "val_samples": 0,
                "test_samples": 1774,
                "image_shape": [256, 256, 3],
                "num_classes": 10,
                "classes": [
                    "Disturbed Galaxies",
                    "Merging Galaxies",
                    "Round Smooth Galaxies",
                    "In-between Round Smooth Galaxies",
                    "Cigar Shaped Smooth Galaxies",
                    "Barred Spiral Galaxies",
                    "Unbarred Tight Spiral Galaxies",
                    "Unbarred Loose Spiral Galaxies",
                    "Edge-on Galaxies without Bulge",
                    "Edge-on Galaxies with Bulge"
                ],
                "class_distribution": {
                    "Disturbed Galaxies": 1081,
                    "Merging Galaxies": 1853,
                    "Round Smooth Galaxies": 2645,
                    "In-between Round Smooth Galaxies": 2027,
                    "Cigar Shaped Smooth Galaxies": 334,
                    "Barred Spiral Galaxies": 2043,
                    "Unbarred Tight Spiral Galaxies": 1829,
                    "Unbarred Loose Spiral Galaxies": 2628,
                    "Edge-on Galaxies without Bulge": 1423,
                    "Edge-on Galaxies with Bulge": 1873
                },
                "description": "High-resolution colored galaxy images from DESI Legacy Imaging Surveys (BASS, DECaLS, MzLS) with expert classifications from Galaxy Zoo.",
                "scientific_source": "DESI Legacy Imaging Surveys / AstroNN / Henry Leung et al."
            },
            {
                "dataset_id": "sdss_photometric",
                "name": "SDSS Stellar/Galactic/Quasar Survey",
                "category": "Astrophysical Object Taxonomy (Task B Candidate)",
                "total_samples": 100000,
                "train_samples": 80000,
                "val_samples": 10000,
                "test_samples": 10000,
                "image_shape": [64, 64, 5],
                "num_classes": 3,
                "classes": ["Star", "Galaxy", "Quasar (QSO)"],
                "class_distribution": {
                    "Star": 35000,
                    "Galaxy": 50000,
                    "Quasar (QSO)": 15000
                },
                "description": "Broad astrophysical class discrimination based on spectroscopic truth labels from SDSS Data Release 16/17.",
                "scientific_source": "Sloan Digital Sky Survey (SDSS DR17), York et al."
            }
        ]
