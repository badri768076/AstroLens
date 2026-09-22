from galaxy_mnist import GalaxyMNIST

dataset = GalaxyMNIST(
    root="../data"
)

print("Dataset loaded successfully!")
print("Number of images:", len(dataset))

image, label = dataset[0]

print("Image shape:", image.shape)
print("Label:", label)