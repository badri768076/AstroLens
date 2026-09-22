from datasets import load_dataset
from collections import Counter


# Load GalaxyMNIST
dataset = load_dataset("matthieulel/galaxy_mnist")

train = dataset["train"]
test = dataset["test"]


print("===== DATASET INFO =====")
print("Training images:", len(train))
print("Testing images:", len(test))

print("\n===== FEATURES =====")
print(train.features)

print("\n===== FIRST IMAGE =====")
image = train[0]["image"]
label = train[0]["label"]

print("Image type:", type(image))
print("Image size:", image.size)
print("Image mode:", image.mode)
print("Label:", label)

print("\n===== LABEL DISTRIBUTION =====")
print("Training:", Counter(train["label"]))
print("Testing :", Counter(test["label"]))