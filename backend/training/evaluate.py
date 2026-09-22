import torch
import torch.nn as nn

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from training.dataset import test_loader, class_names
from training.transfer_model import GalaxyResNet


# --------------------------------------------------
# 1. Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)


# --------------------------------------------------
# 2. Load model
# --------------------------------------------------

model = GalaxyResNet(num_classes=4)

model.load_state_dict(
    torch.load(
        "models/resnet18_galaxy.pth",
        map_location=device
    )
)

model = model.to(device)
model.eval()


# --------------------------------------------------
# 3. Test evaluation
# --------------------------------------------------

all_predictions = []
all_labels = []

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)

        outputs = model(images)

        _, predictions = torch.max(outputs, 1)

        all_predictions.extend(
            predictions.cpu().numpy()
        )

        all_labels.extend(
            labels.numpy()
        )


# --------------------------------------------------
# 4. Accuracy
# --------------------------------------------------

accuracy = accuracy_score(
    all_labels,
    all_predictions
)

print("\n==============================")
print("TEST RESULTS")
print("==============================")

print(
    f"Test Accuracy: {accuracy * 100:.2f}%"
)


# --------------------------------------------------
# 5. Classification report
# --------------------------------------------------

print("\nClassification Report:")

print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=class_names,
        digits=4
    )
)


# --------------------------------------------------
# 6. Confusion matrix
# --------------------------------------------------

print("Confusion Matrix:")

cm = confusion_matrix(
    all_labels,
    all_predictions
)

print(cm) 