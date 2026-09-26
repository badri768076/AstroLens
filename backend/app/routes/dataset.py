import os
import io
import base64
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Response
from PIL import Image

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

def get_registry():
    from app.main import registry
    if registry is None:
        raise HTTPException(status_code=503, detail="Model registry is initializing.")
    return registry

@router.get("", response_model=List[Dict[str, Any]])
async def list_datasets(registry = Depends(get_registry)):
    """
    List evaluated astronomical datasets, split counts, and class distributions.
    """
    return registry.get_datasets_metadata()

@router.get("/samples")
async def get_preset_samples():
    """
    Return preset sample images for interactive demo testing.
    """
    samples_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data", "samples")
    if not os.path.exists(samples_dir):
        return []

    samples = []
    for f in sorted(os.listdir(samples_dir)):
        if f.endswith((".png", ".jpg", ".jpeg")):
            path = os.path.join(samples_dir, f)
            with open(path, "rb") as img_file:
                b64 = base64.b64encode(img_file.read()).decode("utf-8")
                # Filename format: classname_idx.png
                name_part = f.rsplit(".", 1)[0].replace("_", " ").title()
                samples.append({
                    "id": f,
                    "title": name_part,
                    "image_base64": f"data:image/png;base64,{b64}"
                })
    return samples
