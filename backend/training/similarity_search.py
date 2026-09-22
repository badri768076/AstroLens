import numpy as np
import torch
import torch.nn.functional as F

from training.dataset import test_loader, class_names
from training.transfer_model import GalaxyResNet


# --------------------------------------------------
# 1. Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# --------------------------------------------------
# 2. Load trained ResNet
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
# 3. Load stored embeddings
# --------------------------------------------------

train_embeddings = np.load(
    "models/train_embeddings.npy"
)

train_labels = np.load(
    "models/train_embedding_labels.npy"
)


# Convert to PyTorch tensor
database_embeddings = torch.tensor(
    train_embeddings,
    dtype=torch.float32,
    device=device
)

# Normalize embeddings
database_embeddings = F.normalize(
    database_embeddings,
    p=2,
    dim=1
)


# --------------------------------------------------
# 4. Similarity search function
# --------------------------------------------------

def find_similar_images(image, top_k=5):

    image = image.unsqueeze(0).to(device)

    with torch.no_grad():

        query_embedding = model.get_embedding(image)

        query_embedding = F.normalize(
            query_embedding,
            p=2,
            dim=1
        )

        # Cosine similarity
        similarities = torch.mm(
            query_embedding,
            database_embeddings.T
        )

        similarities = similarities.squeeze(0)

        scores, indices = torch.topk(
            similarities,
            k=top_k
        )


    results = []

    for score, index in zip(scores, indices):

        index = index.item()

        results.append({
            "index": index,
            "label": int(train_labels[index]),
            "class_name": class_names[
                int(train_labels[index])
            ],
            "similarity": float(score.item())
        })

    return results


# --------------------------------------------------
# 5. Test similarity search
# --------------------------------------------------

if __name__ == "__main__":

    images, labels = next(iter(test_loader))

    image = images[0]

    actual_label = labels[0].item()

    results = find_similar_images(
        image,
        top_k=5
    )

    print("\n==============================")
    print("SIMILARITY SEARCH")
    print("==============================")

    print(
        f"Query image class: "
        f"{class_names[actual_label]}"
    )

    print("\nTop 5 similar galaxies:")

    for i, result in enumerate(results, 1):

        print(
            f"{i}. "
            f"{result['class_name']} "
            f"| Similarity: "
            f"{result['similarity']:.4f}"
        )