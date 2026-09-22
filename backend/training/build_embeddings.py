import torch
import numpy as np

from training.dataset import train_loader, test_loader
from training.transfer_model import GalaxyResNet


# --------------------------------------------------
# 1. Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)

if device.type == "cuda":
    print("GPU:", torch.cuda.get_device_name(0))


# --------------------------------------------------
# 2. Load trained ResNet18
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
# 3. Extract embeddings
# --------------------------------------------------

def extract_embeddings(loader):

    embeddings = []
    labels = []

    with torch.no_grad():

        for images, batch_labels in loader:

            images = images.to(device)

            features = model.get_embedding(images)

            embeddings.append(
                features.cpu().numpy()
            )

            labels.append(
                batch_labels.numpy()
            )

    embeddings = np.concatenate(embeddings)
    labels = np.concatenate(labels)

    return embeddings, labels


# --------------------------------------------------
# 4. Generate embeddings
# --------------------------------------------------

print("\nGenerating training embeddings...")

train_embeddings, train_labels = extract_embeddings(
    train_loader
)

print("Training embeddings:", train_embeddings.shape)


print("\nGenerating test embeddings...")

test_embeddings, test_labels = extract_embeddings(
    test_loader
)

print("Test embeddings:", test_embeddings.shape)


# --------------------------------------------------
# 5. Save embeddings
# --------------------------------------------------

np.save(
    "models/train_embeddings.npy",
    train_embeddings
)

np.save(
    "models/train_embedding_labels.npy",
    train_labels
)

np.save(
    "models/test_embeddings.npy",
    test_embeddings
)

np.save(
    "models/test_embedding_labels.npy",
    test_labels
)


print("\nEmbedding generation complete!")
print("Files saved in backend/models/")