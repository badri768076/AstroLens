from datasets import load_dataset
import matplotlib.pyplot as plt


# Load dataset
dataset = load_dataset("matthieulel/galaxy_mnist")

train = dataset["train"]


# Class names
class_names = [
    "Smooth Round",
    "Smooth Cigar",
    "Edge-on Disk",
    "Unbarred Spiral",
]


# Find one example from each class
examples = {}

for item in train:
    label = item["label"]

    if label not in examples:
        examples[label] = item["image"]

    if len(examples) == 4:
        break


# Create visualization
fig, axes = plt.subplots(1, 4, figsize=(16, 4))

for label in range(4):
    axes[label].imshow(examples[label])
    axes[label].set_title(class_names[label])
    axes[label].axis("off")


plt.tight_layout()
plt.show()