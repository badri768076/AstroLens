import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.services.model_service import ModelRegistry
from app.routes.analysis import router as analysis_router
from app.routes.models import router as models_router
from app.routes.dataset import router as dataset_router

# Global registry loaded once during startup
registry: ModelRegistry = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global registry
    print("\n=======================================================")
    print("      ASTROLENS DEEP LEARNING BACKEND STARTUP")
    print("=======================================================")
    registry = ModelRegistry(models_dir="models")
    print("=======================================================\n")
    yield
    print("[AstroLens] Shutting down.")

app = FastAPI(
    title="AstroLens API",
    description="Scientific Deep Learning System for Astronomical Object & Morphology Analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(analysis_router)
app.include_router(models_router)
app.include_router(dataset_router)

@app.get("/health", tags=["Health"])
async def health_check():
    """
    System health check returning device information, active model, and memory state.
    """
    global registry
    import torch

    device_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    vram_allocated = None
    if torch.cuda.is_available():
        vram_allocated = f"{torch.cuda.memory_allocated() / (1024 ** 2):.1f} MB"

    return {
        "status": "healthy",
        "system": "AstroLens Deep Learning Engine",
        "version": "1.0.0",
        "device": str(registry.device if registry else "uninitialized"),
        "gpu_name": device_name,
        "vram_allocated": vram_allocated,
        "active_model": "ResNet18 Fine-Tuned (4-class morphology)",
        "models_indexed": len(registry.get_models_metadata()) if registry else 0,
        "catalog_size": registry.similarity_service.total_indexed if registry else 0
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "AstroLens API",
        "docs_url": "/docs",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
