from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image
from transformers import AutoImageProcessor, AutoModel


MODEL_NAME = "google/vit-base-patch16-224"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME).to(device)
model.eval()


def get_image_embedding(image_path: str):
    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = model(**inputs)

    embedding = outputs.last_hidden_state[:, 0, :]

    return F.normalize(embedding, p=2, dim=1)

REFERENCE_IMAGES = {
    "M31 — Andromeda Galaxy": "m31_gendler_2700.jpg",
    "M42 — Orion Nebula": "m42_test2.jpg",
    "Jupiter": "Jupiter_against_black_background_of_space.jpeg",
    "Omega Centauri — NGC 5139": "omega-centauri-infrared-sq-e1464861026459.jpg",
    "M87 — Elliptical Galaxy": "elliptical_galaxy.jpg",
    "Milky Way Galaxy": "night-sky-Milky-Way-Galaxy.jpg",
}


REFERENCE_DIR = Path(__file__).resolve().parents[2] / "references"


 


reference_embeddings = {}


def load_reference_embeddings():
    for object_name, relative_path in REFERENCE_IMAGES.items():
        image_path = REFERENCE_DIR / Path(relative_path).name

        if not image_path.exists():
            continue

        reference_embeddings[object_name] = get_image_embedding(
            str(image_path)
        )


load_reference_embeddings()


def identify_specific_object(image_path: str):
    query_embedding = get_image_embedding(image_path)

    if not reference_embeddings:
        return {
            "object": None,
            "similarity": None,
        }

    similarities = {}

    for object_name, reference_embedding in reference_embeddings.items():
        similarity = F.cosine_similarity(
            query_embedding,
            reference_embedding
        ).item()

        similarities[object_name] = similarity

    best_match = max(similarities, key=similarities.get)

    return {
        "object": best_match,
        "similarity": float(similarities[best_match]),
    }