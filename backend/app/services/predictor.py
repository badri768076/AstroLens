import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

from training.transfer_model import GalaxyResNet
from training.dataset import class_names


# --------------------------------
# Device
# --------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# --------------------------------
# Load trained model ONCE
# --------------------------------

model = GalaxyResNet(num_classes=4)

model.load_state_dict(
    torch.load(
        "models/resnet18_galaxy.pth",
        map_location=device
    )
)

model = model.to(device)
model.eval()


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
# Prediction function
# --------------------------------

def predict_image(image: Image.Image):

    image = image.convert("RGB")

    tensor = transform(image)

    tensor = tensor.unsqueeze(0).to(device)

    with torch.no_grad():

        output = model(tensor)

        probabilities = F.softmax(
            output,
            dim=1
        )

        predicted_index = torch.argmax(
            probabilities,
            dim=1
        ).item()

        confidence = probabilities[
            0,
            predicted_index
        ].item()

    return {
        "class_id": predicted_index,
        "class_name": class_names[predicted_index],
        "confidence": float(confidence)
    }