import io
from fastapi import APIRouter, File, UploadFile, Query, HTTPException, Depends
from PIL import Image

from app.schemas import FullAnalysisResponse, PredictionResult, AnomalyResult, GradCamResult, SimilarObjectItem

router = APIRouter(prefix="/api", tags=["Analysis"])

def get_registry():
    from app.main import registry
    if registry is None:
        raise HTTPException(status_code=503, detail="Model registry is initializing.")
    return registry

def load_image_from_upload(file_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.load()
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

@router.post("/analyze", response_model=FullAnalysisResponse)
async def analyze_astronomical_image(
    file: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=20),
    registry = Depends(get_registry)
):
    """
    Unified end-to-end Deep Learning analysis pipeline:
    1. Preprocessing & Tensor normalization
    2. Deep multiclass classification with probability distribution
    3. 512-dimensional latent feature embedding extraction
    4. Cosine similarity search against indexed catalog
    5. Latent centroid distance morphological anomaly detection
    6. Explainable AI via Grad-CAM gradient backpropagation
    """
    content = await file.read()
    image = load_image_from_upload(content)

    # 1. Classification
    pred = registry.predictor.predict(image)
    class_id = pred["class_id"]

    # 2. Embedding extraction
    embedding = registry.embedding_service.extract_from_image(image)

    # 3. Similarity search
    similar_items = registry.similarity_service.search(embedding, top_k=top_k)

    # 4. Anomaly detection
    anomaly = registry.anomaly_service.evaluate(embedding, class_id)

    # 5. Grad-CAM explanation
    gradcam = registry.gradcam_service.generate(image, class_id)

    return {
        "filename": file.filename,
        "prediction": pred,
        "similarity": similar_items,
        "anomaly": anomaly,
        "gradcam": gradcam,
        "model_info": {
            "name": "ResNet18 Fine-Tuned",
            "architecture": "ResNet18",
            "weights": "ImageNet Pretrained + GalaxyMNIST Fine-Tuned",
            "embedding_dimension": 512,
            "held_out_accuracy": "89.95%",
            "held_out_macro_f1": "90.01%"
        },
        "dataset_info": {
            "name": "GalaxyMNIST",
            "task": "4-class galaxy morphology classification",
            "num_classes": 4,
            "resolution": "224x224 RGB"
        }
    }

@router.post("/predict", response_model=PredictionResult)
async def predict_image(
    file: UploadFile = File(...),
    registry = Depends(get_registry)
):
    content = await file.read()
    image = load_image_from_upload(content)
    return registry.predictor.predict(image)

@router.post("/similar")
async def find_similar(
    file: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=20),
    registry = Depends(get_registry)
):
    content = await file.read()
    image = load_image_from_upload(content)
    embedding = registry.embedding_service.extract_from_image(image)
    return registry.similarity_service.search(embedding, top_k=top_k)

@router.post("/anomaly")
async def detect_anomaly(
    file: UploadFile = File(...),
    registry = Depends(get_registry)
):
    content = await file.read()
    image = load_image_from_upload(content)
    pred = registry.predictor.predict(image)
    embedding = registry.embedding_service.extract_from_image(image)
    return registry.anomaly_service.evaluate(embedding, pred["class_id"])

@router.post("/explain")
async def explain_prediction(
    file: UploadFile = File(...),
    target_class: int = Query(None),
    registry = Depends(get_registry)
):
    content = await file.read()
    image = load_image_from_upload(content)
    if target_class is None:
        pred = registry.predictor.predict(image)
        target_class = pred["class_id"]
    return registry.gradcam_service.generate(image, target_class)
