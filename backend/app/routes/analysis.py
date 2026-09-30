import io
import tempfile
from pathlib import Path

from fastapi import (
    APIRouter,
    File,
    UploadFile,
    Query,
    HTTPException,
    Depends,
)
from PIL import Image

from app.schemas import (
    AnalyzeResponse,
    AstronomicalClassification,
    FullAnalysisResponse,
    PredictionResult,
    AnomalyResult,
    GradCamResult,
    SimilarObjectItem,
)

from app.services.predictor import classify_astronomical_object
from app.services.object_identifier import identify_specific_object
from app.services.object_information import get_object_information


router = APIRouter(prefix="/api", tags=["Analysis"])


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
}


def get_registry():
    from app.main import registry

    if registry is None:
        raise HTTPException(
            status_code=503,
            detail="Model registry is initializing."
        )

    return registry


def load_image_from_upload(file_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.load()
        return image

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image format: {str(e)}"
        )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_astronomical_image(
    file: UploadFile = File(...)
):
    """
    AstroLens astronomical image analysis:

    1. Accept uploaded astronomical image.
    2. Validate image integrity.
    3. Save image temporarily.
    4. Perform broad astronomical classification.
    5. Identify a specific astronomical object using ViT embeddings.
    6. Retrieve scientific information from SIMBAD.
    7. Prepare visualization data.
    8. Clean up temporary file.
    """

    try:
        content = await file.read()

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded file."
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # ---------------------------------------------------------
    # VALIDATE IMAGE
    # ---------------------------------------------------------

    try:
        with Image.open(io.BytesIO(content)) as img:
            img.verify()

    except Exception:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is not a valid image format. "
                "Supported formats: JPEG, PNG, WEBP, TIFF, BMP."
            )
        )

    # ---------------------------------------------------------
    # DETERMINE TEMPORARY FILE EXTENSION
    # ---------------------------------------------------------

    ext = (
        Path(file.filename).suffix.lower()
        if file.filename
        else ".jpg"
    )

    suffix = (
        ext
        if ext in ALLOWED_EXTENSIONS
        else ".jpg"
    )

    tmp_path = None

    # ---------------------------------------------------------
    # SAVE UPLOADED IMAGE TEMPORARILY
    # ---------------------------------------------------------

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as tmp_file:

            tmp_file.write(content)
            tmp_path = Path(tmp_file.name)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to stage uploaded image for inference."
        )

    try:

        # =====================================================
        # STAGE 1 — BROAD ASTRONOMICAL CLASSIFICATION
        # =====================================================

        result = classify_astronomical_object(
            str(tmp_path)
        )

        # =====================================================
        # STAGE 2 — SPECIFIC OBJECT IDENTIFICATION
        # =====================================================

        identification = identify_specific_object(
            str(tmp_path)
        )

        # =====================================================
        # STAGE 3 — SCIENTIFIC INFORMATION
        # =====================================================

        information = None

        if identification["object"]:

            information = get_object_information(
                identification["object"]
            )

        # =====================================================
        # STAGE 4 — VISUALIZATION DATA
        # =====================================================

        visualization = None

        if information:

            visualization = {
                "object_name": information["name"],
                "ra": information["ra"],
                "dec": information["dec"],
                "catalog_id": information["catalog_id"],
            }

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return {

            "classification": {
                "class": str(result["class"]),
                "confidence": round(
                    float(result["confidence"]),
                    4
                ),
            },

            "identification": {
                "object": identification["object"],
                "similarity": (
                    round(
                        float(
                            identification["similarity"]
                        ),
                        4
                    )
                    if identification["similarity"] is not None
                    else None
                ),
            },

            "scientific_information": information,

            "visualization": visualization,
        }

    except Exception:

        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred during astronomical "
                "object inference."
            )
        )

    finally:

        # Always delete temporary uploaded image
        if tmp_path and tmp_path.exists():

            try:
                tmp_path.unlink()

            except Exception:
                pass


# =============================================================
# EXISTING GALAXY MORPHOLOGY PIPELINE
# =============================================================

@router.post(
    "/analyze/full",
    response_model=FullAnalysisResponse
)
async def analyze_galaxy_morphology_full(
    file: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=20),
    registry=Depends(get_registry)
):
    """
    Unified Galaxy Morphology Deep Learning Pipeline.

    1. Preprocessing & tensor normalization
    2. Deep multiclass classification
    3. 512-dimensional latent feature embedding
    4. Cosine similarity search
    5. Morphological anomaly detection
    6. Grad-CAM explanation
    """

    content = await file.read()

    image = load_image_from_upload(content)

    pred = registry.predictor.predict(image)

    class_id = pred["class_id"]

    embedding = registry.embedding_service.extract_from_image(
        image
    )

    similar_items = registry.similarity_service.search(
        embedding,
        top_k=top_k
    )

    anomaly = registry.anomaly_service.evaluate(
        embedding,
        class_id
    )

    gradcam = registry.gradcam_service.generate(
        image,
        class_id
    )

    return {
        "filename": file.filename,

        "prediction": pred,

        "similarity": similar_items,

        "anomaly": anomaly,

        "gradcam": gradcam,

        "model_info": {
            "name": "ResNet18 Fine-Tuned",
            "architecture": "ResNet18",
            "weights": (
                "ImageNet Pretrained + "
                "GalaxyMNIST Fine-Tuned"
            ),
            "embedding_dimension": 512,
            "held_out_accuracy": "89.95%",
            "held_out_macro_f1": "90.01%",
        },

        "dataset_info": {
            "name": "GalaxyMNIST",
            "task": (
                "4-class galaxy morphology "
                "classification"
            ),
            "num_classes": 4,
            "resolution": "224x224 RGB",
        },
    }


# =============================================================
# EXISTING PREDICTION ROUTE
# =============================================================

@router.post(
    "/predict",
    response_model=PredictionResult
)
async def predict_image(
    file: UploadFile = File(...),
    registry=Depends(get_registry)
):

    content = await file.read()

    image = load_image_from_upload(content)

    return registry.predictor.predict(image)


# =============================================================
# EXISTING SIMILARITY ROUTE
# =============================================================

@router.post("/similar")
async def find_similar(
    file: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=20),
    registry=Depends(get_registry)
):

    content = await file.read()

    image = load_image_from_upload(content)

    embedding = registry.embedding_service.extract_from_image(
        image
    )

    return registry.similarity_service.search(
        embedding,
        top_k=top_k
    )


# =============================================================
# EXISTING ANOMALY ROUTE
# =============================================================

@router.post("/anomaly")
async def detect_anomaly(
    file: UploadFile = File(...),
    registry=Depends(get_registry)
):

    content = await file.read()

    image = load_image_from_upload(content)

    pred = registry.predictor.predict(image)

    embedding = registry.embedding_service.extract_from_image(
        image
    )

    return registry.anomaly_service.evaluate(
        embedding,
        pred["class_id"]
    )


# =============================================================
# EXISTING GRAD-CAM ROUTE
# =============================================================

@router.post("/explain")
async def explain_prediction(
    file: UploadFile = File(...),
    target_class: int = Query(None),
    registry=Depends(get_registry)
):

    content = await file.read()

    image = load_image_from_upload(content)

    if target_class is None:

        pred = registry.predictor.predict(image)

        target_class = pred["class_id"]

    return registry.gradcam_service.generate(
        image,
        target_class
    )