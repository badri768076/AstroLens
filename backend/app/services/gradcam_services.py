import torch
import torch.nn.functional as F
import numpy as np

from PIL import Image
from torchvision import transforms

from app.services.predictor import model, device


# --------------------------------
# Image preprocessing
# --------------------------------

transform = transforms.Compose([
    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# --------------------------------
# Grad-CAM
# --------------------------------

class GradCAM:

    def __init__(self, model, target_layer):

        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        target_layer.register_forward_hook(
            self.save_activation
        )

        target_layer.register_full_backward_hook(
            self.save_gradient
        )

    def save_activation(self, module, input, output):

        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):

        self.gradients = grad_output[0]

    def generate(self, image, class_index):

        self.model.zero_grad()

        output = self.model(image)

        score = output[:, class_index]

        score.backward()

        gradients = self.gradients
        activations = self.activations

        # Average gradients over spatial dimensions
        weights = gradients.mean(
            dim=(2, 3),
            keepdim=True
        )

        # Weighted feature maps
        cam = (
            weights * activations
        ).sum(dim=1)

        # Remove negative activations
        cam = F.relu(cam)

        # Normalize
        cam = cam - cam.min()

        cam = cam / (
            cam.max() + 1e-8
        )

        return cam


# --------------------------------
# Target layer
# --------------------------------

target_layer = model.model.layer4[-1].conv2

gradcam = GradCAM(
    model,
    target_layer
)


# --------------------------------
# Generate heatmap
# --------------------------------

def generate_gradcam(
    image: Image.Image,
    class_index: int
):

    image = image.convert("RGB")

    original_size = image.size

    tensor = transform(image)

    tensor = tensor.unsqueeze(0).to(device)

    cam = gradcam.generate(
        tensor,
        class_index
    )

    cam = (
        cam
        .squeeze()
        .detach()
        .cpu()
        .numpy()
    )

    # Convert CAM to image
    cam_image = Image.fromarray(
        np.uint8(cam * 255)
    )

    # Resize to original image dimensions
    cam_image = cam_image.resize(
        original_size
    )

    cam = np.array(
        cam_image
    ) / 255.0

    return cam