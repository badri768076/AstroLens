import torch
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix

from training.dataset import test_loader, class_names
from training.transfer_model import GalaxyResNet


# --------------------------------
# Device
# --------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)


# --------------------------------
# Load model
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
# Evaluation
# --------------------------------

all_predictions = []
all_labels = []

correct = 0
total = 0


with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1
        )

        correct += (
            predictions == labels
        ).sum().item()

        total += labels.size(0)

        all_predictions.extend(
            predictions.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )


# --------------------------------
# Overall accuracy
# --------------------------------

accuracy = 100 * correct / total

print("\n==============================")
print("ASTROLENS TEST RESULTS")
print("==============================")

print(
    f"Correct: {correct}/{total}"
)

print(
    f"Test Accuracy: {accuracy:.2f}%"
)


# --------------------------------
# Classification report
# --------------------------------

print("\n==============================")
print("CLASSIFICATION REPORT")
print("==============================")

print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=class_names,
        digits=4
    )
)


# --------------------------------
# Confusion matrix
# --------------------------------

print("\n==============================")
print("CONFUSION MATRIX")
print("==============================")

cm = confusion_matrix(
    all_labels,
    all_predictions
)

print(cm)

print("\nRows = Actual")
print("Columns = Predicted")

print("\nClass order:")

for i, name in enumerate(class_names):
    print(f"{i} → {name}")