from collections import defaultdict
import random

from datasets import load_dataset
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms


# --------------------------------------------------
# 1. Load GalaxyMNIST
# --------------------------------------------------

dataset = load_dataset("matthieulel/galaxy_mnist")

train_data = dataset["train"]
test_data = dataset["test"]


# --------------------------------------------------
# 2. Image transformations
# --------------------------------------------------

train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomVerticalFlip(p=0.5),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


# --------------------------------------------------
# 3. PyTorch Dataset
# --------------------------------------------------

class GalaxyDataset(Dataset):
    def __init__(self, data, transform=None):
        self.data = data
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        image = self.data[index]["image"]
        label = self.data[index]["label"]

        if self.transform:
            image = self.transform(image)

        return image, label


# --------------------------------------------------
# 4. Create deterministic stratified split
# --------------------------------------------------

class_indices = defaultdict(list)

for index, label in enumerate(train_data["label"]):
    class_indices[label].append(index)

rng = random.Random(42)

train_indices = []
val_indices = []

for label, indices in class_indices.items():
    rng.shuffle(indices)

    split = int(0.8 * len(indices))

    train_indices.extend(indices[:split])
    val_indices.extend(indices[split:])


rng.shuffle(train_indices)
rng.shuffle(val_indices)


# --------------------------------------------------
# 5. Separate datasets with correct transforms
# --------------------------------------------------

train_base = GalaxyDataset(
    train_data,
    transform=train_transform
)

val_base = GalaxyDataset(
    train_data,
    transform=test_transform
)

test_dataset = GalaxyDataset(
    test_data,
    transform=test_transform
)


train_dataset = Subset(
    train_base,
    train_indices
)

val_dataset = Subset(
    val_base,
    val_indices
)


# --------------------------------------------------
# 6. DataLoaders
# --------------------------------------------------

train_loader = DataLoader(
    train_dataset,
    batch_size=32,
    shuffle=True,
    num_workers=0
)

val_loader = DataLoader(
    val_dataset,
    batch_size=32,
    shuffle=False,
    num_workers=0
)

test_loader = DataLoader(
    test_dataset,
    batch_size=32,
    shuffle=False,
    num_workers=0
)


# --------------------------------------------------
# 7. Class names
# --------------------------------------------------

class_names = [
    "Smooth Round",
    "Smooth Cigar",
    "Edge-on Disk",
    "Unbarred Spiral"
]