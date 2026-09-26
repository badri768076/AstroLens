import torch
import torch.nn.functional as F
import numpy as np
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

class EmbeddingService:
    def __init__(self, model, device):
        self.model = model
        self.device = device

    def extract_from_tensor(self, tensor: torch.Tensor, normalize: bool = True) -> np.ndarray:
        """
        Extract penultimate layer embedding from tensor shape (1, 3, H, W).
        """
        self.model.eval()
        with torch.no_grad():
            tensor = tensor.to(self.device)
            embedding = self.model.get_embedding(tensor)
            if normalize:
                embedding = F.normalize(embedding, p=2, dim=1)
            return embedding.cpu().squeeze(0).numpy()

    def extract_from_image(self, image: Image.Image, normalize: bool = True) -> np.ndarray:
        """
        Extract penultimate layer embedding from PIL Image.
        """
        image_rgb = image.convert("RGB")
        tensor = transform_eval(image_rgb).unsqueeze(0)
        return self.extract_from_tensor(tensor, normalize=normalize)
