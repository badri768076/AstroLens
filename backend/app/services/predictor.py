from typing import Dict, Any, List
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

transform_eval = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class PredictorService:
    def __init__(self, model, class_names: List[str], device: torch.device = None):
        self.model = model
        self.class_names = class_names
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.model.eval()

    def predict(self, image: Image.Image) -> Dict[str, Any]:
        """
        Run forward pass and return class predictions and probability distribution.
        """
        image_rgb = image.convert("RGB")
        tensor = transform_eval(image_rgb).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)
            probs = F.softmax(outputs, dim=1).squeeze(0)
            pred_idx = int(torch.argmax(probs).item())
            confidence = float(probs[pred_idx].item())

        probabilities = {}
        for idx, name in enumerate(self.class_names):
            p_val = float(probs[idx].item()) if idx < len(probs) else 0.0
            probabilities[name] = round(p_val, 4)

        return {
            "class_id": pred_idx,
            "class_name": self.class_names[pred_idx] if pred_idx < len(self.class_names) else f"Class {pred_idx}",
            "confidence": round(confidence, 4),
            "probabilities": probabilities,
            "task": "4-class galaxy morphology classification"
        }