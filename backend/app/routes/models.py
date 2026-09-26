from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/api/models", tags=["Models"])

def get_registry():
    from app.main import registry
    if registry is None:
        raise HTTPException(status_code=503, detail="Model registry is initializing.")
    return registry

@router.get("", response_model=List[Dict[str, Any]])
async def list_models(registry = Depends(get_registry)):
    """
    List all evaluated deep learning architectures with empirical benchmark metrics,
    parameter counts, confusion matrices, and training methodologies.
    """
    return registry.get_models_metadata()
