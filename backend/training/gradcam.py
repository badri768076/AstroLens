import torch
import torch.nn.functional as F
import numpy as np
from PIL import Image
from torchvision import transforms
import matplotlib.pyplot as plt

from training.transfer_model import GalaxyResNet
from training.dataset import class_names


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# -----------------------------
# Load model
# -----------------------------

model = GalaxyResNet(num_classes=4)

model.load_state_dict(
    torch.load(
        "models/resnet18_galaxy.pth",
        map_location=device
    )
)

model = model.to(device)
model.eval()


# -----------------------------
# Grad-CAM class
# -----------------------------

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
        cam = (weights * activations).sum(dim=1)

        cam = F.relu(cam)

        # Normalize
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)

        return cam


# -----------------------------
# Image preprocessing
# -----------------------------

transform = transforms.Compose([
    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# -----------------------------
# Get one test image
# -----------------------------

from training.dataset import test_data

sample = test_data[0]

original_image = sample["image"].convert("RGB")

image = transform(original_image)

image = image.unsqueeze(0).to(device)


# -----------------------------
# Prediction
# -----------------------------

with torch.no_grad():

    output = model(image)

    probabilities = torch.softmax(
        output,
        dim=1
    )

    predicted_class = output.argmax(
        dim=1
    ).item()

    confidence = probabilities[
        0,
        predicted_class
    ].item()


print("\n==============================")
print("GRAD-CAM ANALYSIS")
print("==============================")

print(
    "Prediction:",
    class_names[predicted_class]
)

print(
    f"Confidence: {confidence * 100:.2f}%"
)


# -----------------------------
# Generate Grad-CAM
# -----------------------------

# Last convolutional layer
target_layer = model.model.layer4[-1].conv2

gradcam = GradCAM(
    model,
    target_layer
)

cam = gradcam.generate(
    image,
    predicted_class
)

cam = cam.squeeze().detach().cpu().numpy()


# -----------------------------
# Resize heatmap
# -----------------------------

cam_image = Image.fromarray(
    np.uint8(cam * 255)
)

cam_image = cam_image.resize(
    original_image.size
)

cam = np.array(cam_image) / 255.0


# -----------------------------
# Display
# -----------------------------

plt.figure(figsize=(12, 4))

plt.subplot(1, 3, 1)

plt.imshow(original_image)

plt.title("Original")

plt.axis("off")


plt.subplot(1, 3, 2)

plt.imshow(cam, cmap="jet")

plt.title("Grad-CAM")

plt.axis("off")


plt.subplot(1, 3, 3)

plt.imshow(original_image)

plt.imshow(
    cam,
    cmap="jet",
    alpha=0.45
)

plt.title(
    f"Prediction: {class_names[predicted_class]}"
)

plt.axis("off")


plt.tight_layout()

plt.savefig(
    "models/gradcam_result.png",
    dpi=150
)

plt.show()

print("\nGrad-CAM saved to:")
print("models/gradcam_result.png")