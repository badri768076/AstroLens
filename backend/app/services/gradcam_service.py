import io
import base64
from typing import Dict, Any, Tuple
import numpy as np
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms
import matplotlib.cm as cm

transform_eval = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class GradCAMExplainer:
    def __init__(self, model, target_layer=None, device=None):
        self.model = model
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.target_layer = target_layer or model.model.layer4[-1].conv2
        self.target_layer_name = "model.layer4[-1].conv2"

        self.activations = None
        self.gradients = None

        self.target_layer.register_forward_hook(self._save_activation)
        self.target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self, image: Image.Image, class_index: int) -> Dict[str, str]:
        """
        Generate Grad-CAM heatmap and overlay base64 data URLs.
        """
        orig_img = image.convert("RGB")
        w, h = orig_img.size

        tensor = transform_eval(orig_img).unsqueeze(0).to(self.device)

        self.model.zero_grad()
        output = self.model(tensor)
        score = output[:, class_index]
        score.backward()

        gradients = self.gradients
        activations = self.activations

        # Global average pooling of gradients
        weights = gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * activations).sum(dim=1)
        cam = F.relu(cam)

        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)
        cam_np = cam.squeeze().detach().cpu().numpy()

        # Resize CAM to match original image dimensions
        cam_pil = Image.fromarray(np.uint8(cam_np * 255)).resize((w, h), Image.Resampling.BILINEAR)
        cam_resized = np.array(cam_pil) / 255.0

        # Apply Jet colormap
        import matplotlib
        colormap = matplotlib.colormaps["jet"]
        heatmap_rgba = colormap(cam_resized)  # float in [0, 1]
        heatmap_rgb = np.uint8(heatmap_rgba[:, :, :3] * 255)
        heatmap_img = Image.fromarray(heatmap_rgb)

        # Blend with original image (alpha 0.5)
        orig_np = np.array(orig_img)
        overlay_np = np.uint8(orig_np * 0.5 + heatmap_rgb * 0.5)
        overlay_img = Image.fromarray(overlay_np)

        # Convert to Base64 PNGs
        heatmap_b64 = self._pil_to_base64(heatmap_img)
        overlay_b64 = self._pil_to_base64(overlay_img)

        return {
            "heatmap_base64": f"data:image/png;base64,{heatmap_b64}",
            "overlay_base64": f"data:image/png;base64,{overlay_b64}",
            "target_layer": self.target_layer_name
        }

    def _pil_to_base64(self, pil_image: Image.Image) -> str:
        buffer = io.BytesIO()
        pil_image.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
