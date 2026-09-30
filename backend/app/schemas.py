from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class AstronomicalClassification(BaseModel):
    class_: str = Field(
        ...,
        alias="class",
        description="Predicted astronomical object class"
    )
    confidence: float = Field(
        ...,
        description="Classification confidence score"
    )

    model_config = {
        "populate_by_name": True
    }


class ObjectIdentification(BaseModel):
    object: Optional[str] = None
    similarity: Optional[float] = None


class ScientificInformation(BaseModel):
    name: Optional[str] = None
    catalog_id: Optional[str] = None
    type: Optional[str] = None
    ra: Optional[float] = None
    dec: Optional[float] = None

class VisualizationData(BaseModel):
    object_name: Optional[str] = None
    ra: Optional[float] = None
    dec: Optional[float] = None
    catalog_id: Optional[str] = None


class AnalyzeResponse(BaseModel):
    classification: AstronomicalClassification
    identification: ObjectIdentification
    scientific_information: Optional[ScientificInformation] = None
    visualization: Optional[VisualizationData] = None

class PredictionResult(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    probabilities: Dict[str, float]
    task: str = "4-class galaxy morphology classification"


class SimilarObjectItem(BaseModel):
    rank: int
    index: int
    class_id: int
    class_name: str
    similarity: float
    dataset: str = "GalaxyMNIST"


class AnomalyResult(BaseModel):
    anomaly_score: float = Field(
        ...,
        description="Calibrated anomaly score in [0.0, 1.0]"
    )
    distance_to_centroid: float
    reference_mean_distance: float
    threshold_p95: float
    threshold_p99: float
    is_anomaly: bool
    status: str
    interpretation: str
    scientific_disclaimer: str


class GradCamResult(BaseModel):
    heatmap_base64: str
    overlay_base64: str
    target_layer: str


class ModelMetadata(BaseModel):
    model_id: str
    name: str
    architecture: str
    dataset: str
    task: str
    num_classes: int
    classes: List[str]
    parameters: int
    trainable_parameters: int
    training_strategy: str
    embedding_dimension: int
    accuracy: float
    macro_precision: float
    macro_recall: float
    macro_f1: float
    weighted_f1: float
    confusion_matrix: List[List[int]]


class FullAnalysisResponse(BaseModel):
    filename: Optional[str] = None
    prediction: PredictionResult
    similarity: List[SimilarObjectItem]
    anomaly: AnomalyResult
    gradcam: GradCamResult
    model_info: Dict[str, Any]
    dataset_info: Dict[str, Any]


class DatasetSummary(BaseModel):
    dataset_id: str
    name: str
    category: str
    total_samples: int
    train_samples: int
    val_samples: int
    test_samples: int
    image_shape: List[int]
    num_classes: int
    classes: List[str]
    class_distribution: Dict[str, int]
    description: str
    scientific_source: str